// src/app/admin/authenticated/recados/solicitacoes/page.tsx

import { prisma } from "@/src/lib/prisma";
import { requirePageRoles } from "@/src/lib/permissions";
import { PAGE_ROLES } from "@/src/lib/role-permissions";
import SolicitacoesClient from "./solicitacoes-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SolicitacoesPage() {
  const user = await requirePageRoles(
    PAGE_ROLES.recados,
  );

  const canSeeAll =
    user.roles.includes("OWNER") ||
    user.roles.includes("MESSAGENEWS");

  const where: {
    recurso: "RECADO";
    unidadeId?: number;
    solicitanteId?: string;
  } = {
    recurso: "RECADO",
  };

  if (!canSeeAll) {
    if (user.roles.includes("ADMIN")) {
      if (user.unidadeId === null) {
        return null;
      }

      where.unidadeId = user.unidadeId;
    } else if (
      user.roles.includes("MESSAGEONLY")
    ) {
      where.solicitanteId = user.id;
    }
  }

  const solicitacoes =
    await prisma.solicitacaoGerenciamento.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        unidade: {
          select: {
            id: true,
            nome: true,
          },
        },
        recado: {
          select: {
            id: true,
            titulo: true,
          },
        },
      },
    });

  const formatted = solicitacoes.map(
    (solicitacao) => ({
      id: solicitacao.id,
      tipo: solicitacao.tipo,
      status: solicitacao.status,
      recurso: solicitacao.recurso,
      recadoId: solicitacao.recadoId,
      recado: solicitacao.recado,
      unidadeId: solicitacao.unidadeId,
      unidade: solicitacao.unidade,
      titulo: solicitacao.titulo,
      conteudo: solicitacao.conteudo,
      unidadeIds: solicitacao.unidadeIds
        ? parseUnidadeIds(
            solicitacao.unidadeIds,
          )
        : [],
      imagem: solicitacao.imagem,
      imagemAntiga:
        solicitacao.imagemAntiga,
      solicitanteId:
        solicitacao.solicitanteId,
      solicitanteNome:
        solicitacao.solicitanteNome,
      revisorId: solicitacao.revisorId,
      revisorNome:
        solicitacao.revisorNome,
      motivoRecusa:
        solicitacao.motivoRecusa,
      createdAt:
        solicitacao.createdAt.toISOString(),
      updatedAt:
        solicitacao.updatedAt.toISOString(),
    }),
  );

  return (
    <SolicitacoesClient
      initialSolicitacoes={formatted}
      userRoles={user.roles}
      userId={user.id}
      userUnidadeId={user.unidadeId}
    />
  );
}

function parseUnidadeIds(value: string): number[] {
  try {
    const parsed: unknown = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((item) => Number(item))
      .filter(
        (id) =>
          Number.isInteger(id) && id > 0,
      );
  } catch {
    return [];
  }
}