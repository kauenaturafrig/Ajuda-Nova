//pages/api/admin/ramais/import/apply.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { withAuth } from "@/lib/auth/requireAuth";
import db from "@/db/connection";
import { registrarAuditoria } from "@/domain/auditoria/auditoria.repository";

type RamalImportado = {
  numero: string;
  setor: string;
  responsavel?: string | null;
};

export default withAuth(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método inválido" });
    }

    const { unidade, ramais } = req.body;
    const user = (req as any).user;
    const userId = user.id;

    if (!Array.isArray(ramais)) {
      return res.status(400).json({ error: "Formato inválido" });
    }

    const tx = db.transaction(() => {
      for (const r of ramais as RamalImportado[]) {
        const existente = db
          .prepare(
            `SELECT * FROM ramais WHERE numero = ? AND unidade = ?`
          )
          .get(r.numero, unidade);

        if (!existente) {
          // CREATE
          const result = db
            .prepare(
              `
              INSERT INTO ramais (numero, setor, responsavel, unidade)
              VALUES (?, ?, ?, ?)
            `
            )
            .run(
              r.numero,
              r.setor,
              r.responsavel ?? null,
              unidade
            );

          registrarAuditoria({
            user_id: userId,
            acao: "CREATE",
            entidade: "ramal",
            entidade_id: result.lastInsertRowid as number,
            payload: {
              depois: r,
            },
          });
        } else {
          // UPDATE
          const diff: any = {};

          if (existente.setor !== r.setor) {
            diff.setor = {
              antes: existente.setor,
              depois: r.setor,
            };
          }

          if (existente.responsavel !== (r.responsavel ?? null)) {
            diff.responsavel = {
              antes: existente.responsavel,
              depois: r.responsavel ?? null,
            };
          }

          if (Object.keys(diff).length === 0) continue;

          db.prepare(
            `
            UPDATE ramais
            SET setor = ?, responsavel = ?, updated_at = datetime('now')
            WHERE id = ?
          `
          ).run(r.setor, r.responsavel ?? null, existente.id);

          registrarAuditoria({
            user_id: userId,
            acao: "UPDATE",
            entidade: "ramal",
            entidade_id: existente.id,
            payload: diff,
          });
        }
      }
    });

    tx();

    res.json({ success: true });
  },
  { roles: ["admin", "owner"] }
);
