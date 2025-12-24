//domain/auditoria/auditoria.repository.ts
import db from "@/db/connection";

export type AuditoriaDB = {
  id: number;
  user_id: number;
  acao: string;
  entidade: string;
  entidade_id: number;
  payload: string | null;
  created_at: string;
};

export function registrarAuditoria(params: {
  user_id: number;
  acao: string;
  entidade: string;
  entidade_id: number;
  payload?: any;
}) {
  db.prepare(`
    INSERT INTO auditoria (
      user_id,
      acao,
      entidade,
      entidade_id,
      payload,
      created_at
    ) VALUES (?, ?, ?, ?, ?, datetime('now'))
  `).run(
    params.user_id,
    params.acao,
    params.entidade,
    params.entidade_id,
    params.payload ? JSON.stringify(params.payload) : null
  );
}

export function findAuditoriaById(id: number): AuditoriaDB | null {
  return db
    .prepare(`SELECT * FROM auditoria WHERE id = ?`)
    .get(id) as AuditoriaDB | null;
}
