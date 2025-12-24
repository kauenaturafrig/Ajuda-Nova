//domain/ramais/ramais.service.ts
import db from "@/db/connection";
import { gerarDiff } from "@/lib/audit/diff";
import { 
  findRamaisByUnidade,
  createRamal,
  updateRamal,
  softDeleteRamal,
  findRamalById
 } from "./ramais.repository";
import { registrarAuditoria } from "@/domain/auditoria/auditoria.repository";

type User = {
  id: number;
  role: "owner" | "admin";
  unidade_id: number | null;
};

export function listarRamais(
  user: User,
  unidade: string,
  busca?: string
) {
  if (!unidade || unidade.length < 3) {
    throw new Error("Unidade inválida");
  }

  // Owner vê tudo
  if (user.role === "owner") {
    return findRamaisByUnidade(unidade, busca);
  }

  // Admin só da própria unidade
  if (user.role === "admin") {
    if (!user.unidade_id) {
      throw new Error("Admin sem unidade vinculada");
    }

    return findRamaisByUnidade(unidade, busca);
  }

  throw new Error("Acesso negado");
}

export function criarRamal(data: {
  numero: string;
  setor: string;
  responsavel?: string | null;
  unidade_id: number;
  user_id: number;
}) {
  const id = createRamal(data);

  registrarAuditoria({
    user_id: data.user_id,
    acao: "CREATE",
    entidade: "ramal",
    entidade_id: Number(id),
    payload: data,
  });

  return id;
}

export function deletarRamal(id: number, user_id: number) {
  softDeleteRamal(id, user_id);

  registrarAuditoria({
    user_id,
    acao: "DELETE",
    entidade: "ramal",
    entidade_id: id,
  });
}

type UpdateRamalInput = {
  numero: string;
  setor: string;
  responsavel: string | null;
};

export function atualizarRamal(
  ramalId: number,
  dados: UpdateRamalInput,
  userId: number,
  motivo: string
) {
  if (!motivo || motivo.trim().length < 5) {
    throw new Error("Motivo da alteração é obrigatório");
  }

  const antes = findRamalById(ramalId);

  if (!antes) {
    throw new Error("Ramal não encontrado");
  }

  const diff = gerarDiff(antes, dados);

  if (Object.keys(diff).length === 0) {
    return { updated: false };
  }

  const tx = db.transaction(() => {
    updateRamal(ramalId, dados, userId);

    registrarAuditoria({
      user_id: userId,
      acao: "UPDATE",
      entidade: "ramal",
      entidade_id: ramalId,
      payload: diff,
    });
  });

  tx();

  return { updated: true };
}
