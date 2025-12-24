//domain/ramais/ramais.rollback.ts
import db from "@/db/connection";
import {
  registrarAuditoria,
  findAuditoriaById,
} from "@/domain/auditoria/auditoria.repository";

type DiffCampo = {
  antes: any;
  depois: any;
};

type Diff = Record<string, DiffCampo>;

export function rollbackRamal(
  auditoriaId: number,
  userId: number
) {
  const audit = findAuditoriaById(auditoriaId);

  if (!audit) {
    throw new Error("Auditoria não encontrada");
  }

  if (audit.entidade !== "ramal") {
    throw new Error("Rollback inválido para esta entidade");
  }

  if (audit.acao !== "UPDATE") {
    throw new Error("Apenas UPDATE pode ser revertido");
  }

  if (!audit.payload) {
    throw new Error("Auditoria sem payload");
  }

  const diff = JSON.parse(audit.payload) as Diff;

  if (Object.keys(diff).length === 0) {
    throw new Error("Diff vazio");
  }

  const campos = Object.keys(diff);
  const sets = campos.map(c => `${c} = ?`).join(", ");
  const valores = campos.map(c => diff[c].antes);

  const tx = db.transaction(() => {
    db.prepare(`
      UPDATE ramais
      SET ${sets},
          updated_at = datetime('now'),
          updated_by = ?
      WHERE id = ?
    `).run(...valores, userId, audit.entidade_id);

    registrarAuditoria({
      user_id: userId,
      acao: "ROLLBACK",
      entidade: "ramal",
      entidade_id: audit.entidade_id,
      payload: {
        revertendo_auditoria: audit.id,
        diff_aplicado: diff,
      },
    });
  });

  tx();

  return { success: true };
}
