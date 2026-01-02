// pages/api/admin/ramais/import/history/[importId].ts
import type { NextApiRequest, NextApiResponse } from "next";
import { withAuth } from "@/lib/auth/requireAuth";
import db from "@/db/connection";

export default withAuth(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { importId } = req.query;

    const rows = db.prepare(`
      SELECT
        r.numero,
        a.payload,
        a.created_at
      FROM auditoria a
      JOIN ramais r ON r.id = a.entidade_id
      WHERE a.import_id = ?
      ORDER BY a.created_at ASC
    `).all(importId);

    res.json(rows);
  },
  { roles: ["owner", "admin"] }
);
