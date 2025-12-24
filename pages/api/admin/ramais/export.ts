//pages/api/admin/ramais/export.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { withAuth } from "@/lib/auth/requireAuth";
import db from "@/db/connection";

export default withAuth(async (req: NextApiRequest, res: NextApiResponse) => {
  const unidadeId = Number(req.query.unidade_id);
  const user = (req as any).user;

  if (!unidadeId) {
    return res.status(400).json({ error: "unidade_id inválido" });
  }

  // Segurança: admin só exporta da própria unidade
  if (user.role === "admin" && user.unidade_id !== unidadeId) {
    return res.status(403).json({ error: "Acesso negado" });
  }

  const unidade = db
    .prepare(`SELECT id FROM unidades WHERE id = ?`)
    .get(unidadeId);

  if (!unidade) {
    return res.status(404).json({ error: "Unidade não encontrada" });
  }

  const ramais = db.prepare(`
    SELECT numero, setor, responsavel
    FROM ramais
    WHERE unidade_id = ?
      AND deleted_at IS NULL
    ORDER BY numero
  `).all(unidadeId);

  const payload = {
    meta: {
      schema_version: "1.1",
      exported_at: new Date().toISOString(),
      exported_by: {
        id: user.id,
        username: user.username,
      },
      unidade: {
        id: unidadeId,
      },
      total: ramais.length,
    },
    ramais,
  };

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=ramais-unidade-${unidadeId}.json`
  );
  res.setHeader("Content-Type", "application/json");

  res.status(200).json(payload);
}, { roles: ["owner", "admin"] });
