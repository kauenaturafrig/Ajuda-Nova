// pages/api/admin/ramais/import/history.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { withAuth } from "@/lib/auth/requireAuth";
import db from "@/db/connection";

export default withAuth(
  async (_req: NextApiRequest, res: NextApiResponse) => {
    const rows = db.prepare(`
      SELECT
        a.import_id,
        a.created_at as data,
        u.nome as usuario,
        COUNT(*) as total_alteracoes
      FROM auditoria a
      JOIN usuarios u ON u.id = a.usuario_id
      WHERE a.entidade = 'ramal'
        AND a.acao = 'UPDATE'
        AND a.import_id IS NOT NULL
      GROUP BY a.import_id
      ORDER BY a.created_at DESC
    `).all();

    res.json(rows);
  },
  { roles: ["owner", "admin"] }
);
