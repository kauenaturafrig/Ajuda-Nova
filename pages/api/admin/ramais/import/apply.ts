// pages/api/admin/ramais/import/apply.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { withAuth } from "@/lib/auth/requireAuth";
import db from "@/db/connection";
const importId = crypto.randomUUID();

type DiffCampo = {
  antes: string | null;
  depois: string | null;
  bloqueado: boolean;
};

type DiffItem = {
  tipo: "ALTERADO";
  numero: string;
  diff: Record<string, DiffCampo>;
};

export default withAuth(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método não permitido" });
    }

    const user = (req as any).user;
    const { diffs } = req.body as { diffs: DiffItem[] };

    if (!Array.isArray(diffs)) {
      return res.status(400).json({ error: "Diffs inválidos" });
    }

    const aplicados: {
      numero: string;
      campos: string[];
    }[] = [];

    const ignorados: {
      numero: string;
      motivo: string;
    }[] = [];

    const tx = db.transaction(() => {
      for (const item of diffs) {
        if (item.tipo !== "ALTERADO") continue;

        const camposAplicaveis = Object.entries(item.diff)
          .filter(([, v]) => v.bloqueado === false);

        if (camposAplicaveis.length === 0) {
          ignorados.push({
            numero: item.numero,
            motivo: "Todos os campos bloqueados",
          });
          continue;
        }

        const ramal = db
          .prepare(
            `
          SELECT id
          FROM ramais
          WHERE numero = ? AND deleted_at IS NULL
        `
          )
          .get(item.numero) as { id: number } | undefined;

        if (!ramal) {
          ignorados.push({
            numero: item.numero,
            motivo: "Ramal não encontrado",
          });
          continue;
        }

        const updatePayload: Record<string, any> = {};
        const camposAtualizados: string[] = [];

        for (const [campo, diff] of camposAplicaveis) {
          updatePayload[campo] = diff.depois;
          camposAtualizados.push(campo);
        }

        const setSQL = camposAtualizados
          .map((c) => `${c} = @${c}`)
          .join(", ");

        db.prepare(
          `
        UPDATE ramais
        SET ${setSQL}, updated_at = CURRENT_TIMESTAMP
        WHERE id = @id
      `
        ).run({
          id: ramal.id,
          ...updatePayload,
        });

        db.prepare(
          `
        INSERT INTO auditoria
          (entidade, entidade_id, acao, payload, usuario_id, import_id, created_at)
        VALUES
          ('ramal', ?, 'UPDATE', ?, ?, CURRENT_TIMESTAMP)
      `
        ).run(
          ramal.id,
          JSON.stringify(updatePayload),
          user.id
        );

        aplicados.push({
          numero: item.numero,
          campos: camposAtualizados,
        });
      }
    });

    tx();

    res.json({
      aplicados,
      ignorados,
      totalAplicados: aplicados.length,
      totalIgnorados: ignorados.length,
    });
  },
  { roles: ["owner", "admin"] }
);
