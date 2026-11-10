import { prisma } from "@/src/lib/prisma";
import { requirePageRoles } from "@/src/lib/permissions";
import { PAGE_ROLES } from "@/src/lib/role-permissions";
import NoticiasSolicitacoesClient from "./solicitacoes-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function NoticiasSolicitacoesPage() {
  const user = await requirePageRoles(
    PAGE_ROLES.noticias,
  );

  const canSeeAll =
    user.roles.includes("OWNER") ||
    user.roles.includes("MESSAGENEWS");

  const where: {
    recurso: "NOTICIA";
    unidadeId?: number;
    solicitanteId?: string;
  } = {
    recurso: "NOTICIA",
  };

  if (!canSeeAll) {
    if (user.roles.includes("ADMIN")) {
      if (user.unidadeId === null) {
        return null;
      }

      where.unidadeId = user.unidadeId;
    } else if (
      user.roles.includes("NEWSONLY")
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
    });

  const categoriaIds = [
    ...new Set(
      solicitacoes.flatMap((solicitacao) =>
        parseCategoriaIds(solicitacao.categoriaIds),
      ),
    ),
  ];
  const categorias = categoriaIds.length
    ? await prisma.categoria.findMany({
        where: { id: { in: categoriaIds } },
        select: { id: true, nome: true, cor: true },
      })
    : [];
  const categoriasPorId = new Map(
    categorias.map((categoria) => [categoria.id, categoria]),
  );

  const formatted = solicitacoes.map(
    (solicitacao) => ({
      id: solicitacao.id,
      recurso: "NOTICIA" as const,
      tipo: solicitacao.tipo,
      status: solicitacao.status,
      noticiaId: solicitacao.noticiaId,
      unidadeId: solicitacao.unidadeId,
      unidadeIds: parseUnidadeIds(
        solicitacao.unidadeIds,
      ),
      titulo: solicitacao.titulo,
      conteudo: solicitacao.conteudo,
      categorias: parseCategoriaIds(solicitacao.categoriaIds)
        .map((id) => categoriasPorId.get(id))
        .filter((categoria) => categoria !== undefined),
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
    <NoticiasSolicitacoesClient
      initialSolicitacoes={formatted}
      userRoles={user.roles}
      userId={user.id}
      userUnidadeId={user.unidadeId}
    />
  );
}

function parseCategoriaIds(value: string | null): number[] {
  if (!value) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return [...new Set(
      parsed
        .map(Number)
        .filter((id) => Number.isInteger(id) && id > 0),
    )];
  } catch {
    return [];
  }
}

function parseUnidadeIds(
  value: string | null,
): number[] {
  if (!value) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map(Number)
      .filter(
        (id) =>
          Number.isInteger(id) && id > 0,
      );
  } catch {
    return [];
  }
}