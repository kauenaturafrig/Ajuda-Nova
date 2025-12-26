// pages/api/admin/ramais/import/apply.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { withAuth } from "@/lib/auth/requireAuth";
import db from "@/db/connection";
import { registrarAuditoria } from "@/domain/auditoria/auditoria.repository";

type RamalImportado = {
  numero: string;
  setor: string;
  responsavel?: string | null;
};

type CamposBloqueados = {
  setor: boolean;
  responsavel: boolean;
};

export default withAuth(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método inválido" });
    }

    const user = (req as any).user;
    const userId = user.id;

    const { meta, ramais } = req.body;

    if (!meta?.unidade?.id || !Array.isArray(ramais)) {
      return res.status(400).json({ error: "Payload inválido" });
    }

    const unidadeId = meta.unidade.id;

    if (user.role === "admin" && user.unidade_id !== unidadeId) {
      return res.status(403).json({ error: "Acesso negado" });
    }

    const tx = db.transaction(() => {
      for (const r of ramais as RamalImportado[]) {
        const atual = db
          .prepare(
            `
            SELECT id, setor, responsavel
            FROM ramais
            WHERE numero = ? AND unidade_id = ? AND deleted_at IS NULL
          `
          )
          .get(r.numero, unidadeId) as
          | { id: number; setor: string; responsavel: string | null }
          | undefined;

        if (!atual) continue;

        // 🔒 buscar bloqueios via auditoria
        const audit = db
          .prepare(
            `
            SELECT payload
            FROM auditoria
            WHERE entidade = 'ramal'
              AND entidade_id = ?
              AND acao = 'UPDATE'
            ORDER BY created_at DESC
            LIMIT 1
          `
          )
          .get(atual.id) as { payload: string } | undefined;

        const bloqueios: CamposBloqueados = {
          setor: false,
          responsavel: false,
        };

        if (audit?.payload) {
          const p = JSON.parse(audit.payload);
          if (p.setor) bloqueios.setor = true;
          if (p.responsavel) bloqueios.responsavel = true;
        }

        const diff: any = {};
        const novoSetor = r.setor;
        const novoResp = r.responsavel ?? null;

        let setorFinal = atual.setor;
        let respFinal = atual.responsavel;

        if (!bloqueios.setor && atual.setor !== novoSetor) {
          diff.setor = { antes: atual.setor, depois: novoSetor };
          setorFinal = novoSetor;
        }

        if (
          !bloqueios.responsavel &&
          atual.responsavel !== novoResp
        ) {
          diff.responsavel = {
            antes: atual.responsavel,
            depois: novoResp,
          };
          respFinal = novoResp;
        }

        if (Object.keys(diff).length === 0) continue;

        db.prepare(
          `
          UPDATE ramais
          SET setor = ?, responsavel = ?, updated_at = datetime('now')
          WHERE id = ?
        `
        ).run(setorFinal, respFinal, atual.id);

        registrarAuditoria({
          user_id: userId,
          acao: "UPDATE",
          entidade: "ramal",
          entidade_id: atual.id,
          payload: diff,
        });
      }
    });

    tx();

    res.json({ success: true });
  },
  { roles: ["admin", "owner"] }
);
