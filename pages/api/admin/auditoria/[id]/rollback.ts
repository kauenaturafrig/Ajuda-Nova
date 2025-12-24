
//pages/api/admin/auditoria/[id]/rollback.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { withAuth } from "@/lib/auth/requireAuth";
import db from "@/db/connection";

export default withAuth(async (req: NextApiRequest, res: NextApiResponse) => {
  const auditoriaId = Number(req.query.id);
  const user = (req as any).user;

  if (!auditoriaId) {
    return res.status(400).json({ error: "ID inválido" });
  }

  const auditoria = db
    .prepare(`SELECT * FROM auditoria WHERE id = ?`)
    .get(auditoriaId);

  if (!auditoria || !auditoria.payload) {
    return res.status(400).json({
      error: "Auditoria inválida ou sem diff",
    });
  }

  // 🚫 BLOQUEIO DE ROLLBACK SE EXISTIR ALTERAÇÃO POSTERIOR
  const posterior = db.prepare(`
    SELECT id
    FROM auditoria
    WHERE entidade = ?
      AND entidade_id = ?
      AND id > ?
      AND acao IN ('UPDATE', 'ROLLBACK')
    LIMIT 1
  `).get(
    auditoria.entidade,
    auditoria.entidade_id,
    auditoria.id
  );

  if (posterior) {
    return res.status(409).json({
      error:
        "Rollback bloqueado: existem alterações posteriores neste registro",
    });
  }

  const diff = JSON.parse(auditoria.payload);

  const dadosRollback: Record<string, any> = {};
  Object.entries(diff).forEach(([campo, valores]: any) => {
    dadosRollback[campo] = valores.antes;
  });

  const sets = Object.keys(dadosRollback)
    .map(c => `${c} = ?`)
    .join(", ");

  const values = Object.values(dadosRollback);

  const tx = db.transaction(() => {
    db.prepare(`
      UPDATE ${auditoria.entidade}s
      SET ${sets},
          updated_at = datetime('now'),
          updated_by = ?
      WHERE id = ?
    `).run(...values, user.id, auditoria.entidade_id);

    db.prepare(`
      INSERT INTO auditoria
      (user_id, acao, entidade, entidade_id, payload)
      VALUES (?, 'ROLLBACK', ?, ?, ?)
    `).run(
      user.id,
      auditoria.entidade,
      auditoria.entidade_id,
      auditoria.payload
    );
  });

  tx();

  res.json({ success: true });
}, { roles: ["owner", "admin"] });
