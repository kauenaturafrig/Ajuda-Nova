import db from "@/db/connection";

type AuditoriaInput = {
  usuario_id: number;
  acao: "CREATE" | "UPDATE" | "DELETE";
  entidade: string;
  entidade_id: number;
  diff: any;
  motivo: string;
};

export function registrarAuditoria(data: AuditoriaInput) {
  if (!data.motivo || !data.motivo.trim()) {
    throw new Error("Motivo da auditoria é obrigatório");
  }

  db.prepare(`
    INSERT INTO auditoria (
      usuario_id,
      acao,
      entidade,
      entidade_id,
      diff,
      motivo
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    data.usuario_id,
    data.acao,
    data.entidade,
    data.entidade_id,
    JSON.stringify(data.diff),
    data.motivo
  );
}
