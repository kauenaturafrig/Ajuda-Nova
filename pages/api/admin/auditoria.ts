//pages/api/admin/auditoria.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { withAuth } from "@/lib/auth/requireAuth";
import db from "@/db/connection";

type DiffCampo = {
  antes: any;
  depois: any;
  bloqueado: boolean;
};

type DiffComEstado = Record<string, DiffCampo>;

export default withAuth(async (req: NextApiRequest, res: NextApiResponse) => {
  const { acao, entidade } = req.query;

  let sql = `
    SELECT a.*, u.username
    FROM auditoria a
    JOIN users u ON u.id = a.user_id
    WHERE 1 = 1
  `;

  const params: any[] = [];

  if (acao) {
    sql += " AND a.acao = ?";
    params.push(acao);
  }

  if (entidade) {
    sql += " AND a.entidade = ?";
    params.push(entidade);
  }

  sql += " ORDER BY a.id DESC";

  const registros = db.prepare(sql).all(...params);

  const dados = registros.map((a: any) => {
    let rollbackPermitido = false;

    if (a.acao === "UPDATE") {
      const posterior = db.prepare(`
        SELECT 1
        FROM auditoria
        WHERE entidade = ?
          AND entidade_id = ?
          AND id > ?
          AND acao IN ('UPDATE', 'ROLLBACK')
        LIMIT 1
      `).get(a.entidade, a.entidade_id, a.id);

      rollbackPermitido = !posterior;
    }

    const diffOriginal = a.payload ? JSON.parse(a.payload) : null;

    let diffComEstado: DiffComEstado | null = null;

    if (diffOriginal && a.acao === "UPDATE") {
      diffComEstado = {};

      for (const campo of Object.keys(diffOriginal)) {
        const alteracaoPosterior = db.prepare(`
          SELECT 1
          FROM auditoria
          WHERE entidade = ?
            AND entidade_id = ?
            AND id > ?
            AND payload LIKE ?
          LIMIT 1
        `).get(
          a.entidade,
          a.entidade_id,
          a.id,
          `%${campo}%`
        );

        diffComEstado[campo] = {
          ...diffOriginal[campo],
          bloqueado: !!alteracaoPosterior,
        };
      }
    }

    return {
      ...a,
      rollback_permitido: rollbackPermitido,
      diff: diffComEstado,
    };
  });

  res.json(dados);
}, { roles: ["owner", "admin"] });
