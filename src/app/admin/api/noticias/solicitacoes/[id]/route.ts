//src/app/admin/api/noticias/solicitacoes/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { rm } from "fs/promises";
import fs from "fs/promises";

import { prisma } from "@/src/lib/prisma";
import {
  getApiUser,
  hasApiRole,
} from "@/src/lib/api-permissions";

export const dynamic = "force-dynamic";

const noCacheHeaders = {
  "Cache-Control":
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

function getUploadDirectory() {
  return path.join(
    process.cwd(),
    "storage",
    "uploads",
    "noticias",
  );
}

async function apagarArquivo(
  nome?: string | null,
) {
  if (!nome) {
    return;
  }

  const filePath = path.join(
    getUploadDirectory(),
    nome,
  );

  try {
    await fs.access(filePath);
    await rm(filePath);
  } catch {
    // Arquivo inexistente.
  }
}

async function logAudit(
  noticiaId: number,
  userId: string,
  userName: string,
  action: string,
  oldData: unknown = null,
  newData: unknown = null,
) {
  await prisma.noticiaAudit.create({
    data: {
      noticiaId,
      userId,
      userNome: userName,
      acao: action,
      dadosAntigos: oldData
        ? JSON.parse(JSON.stringify(oldData))
        : null,
      dadosNovos: newData
        ? JSON.parse(JSON.stringify(newData))
        : null,
    },
  });
}

export async function PUT(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    const user = await getApiUser(req);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const canReview =
      hasApiRole(user, "OWNER") ||
      hasApiRole(user, "ADMIN") ||
      hasApiRole(user, "MESSAGENEWS");

    if (!canReview) {
      return NextResponse.json(
        {
          error:
            "Sem permissão para revisar solicitações.",
        },
        { status: 403 },
      );
    }

    const { id } = await params;
    const solicitacaoId = Number(id);

    if (
      !Number.isInteger(solicitacaoId) ||
      solicitacaoId <= 0
    ) {
      return NextResponse.json(
        { error: "ID inválido." },
        { status: 400 },
      );
    }

    const solicitacao =
      await prisma.solicitacaoGerenciamento.findUnique(
        {
          where: {
            id: solicitacaoId,
          },
        },
      );

    if (
      !solicitacao ||
      solicitacao.recurso !== "NOTICIA"
    ) {
      return NextResponse.json(
        {
          error:
            "Solicitação não encontrada.",
        },
        { status: 404 },
      );
    }

    if (solicitacao.status !== "PENDENTE") {
      return NextResponse.json(
        {
          error:
            "Esta solicitação já foi revisada.",
        },
        { status: 400 },
      );
    }

    const adminOnlyUnit =
      hasApiRole(user, "ADMIN") &&
      !hasApiRole(user, "OWNER") &&
      !hasApiRole(user, "MESSAGENEWS");

    if (
      adminOnlyUnit &&
      solicitacao.unidadeId !== user.unidadeId
    ) {
      return NextResponse.json(
        {
          error:
            "Você só pode revisar solicitações da sua própria unidade.",
        },
        { status: 403 },
      );
    }

    const body = await req.json();

    const acao = String(
      body.acao ?? "",
    ).toLowerCase();

    if (
      acao !== "aprovar" &&
      acao !== "recusar"
    ) {
      return NextResponse.json(
        { error: "Ação inválida." },
        { status: 400 },
      );
    }

    const motivo =
      typeof body.motivo === "string"
        ? body.motivo.trim()
        : null;

    if (acao === "recusar") {
      if (solicitacao.imagem) {
        await apagarArquivo(
          solicitacao.imagem,
        );
      }

      const atualizada =
        await prisma.solicitacaoGerenciamento.update(
          {
            where: {
              id: solicitacaoId,
            },
            data: {
              status: "RECUSADO",
              revisorId: user.id,
              revisorNome:
                user.name || "Desconhecido",
              motivoRecusa: motivo,
            },
          },
        );

      return NextResponse.json(
        atualizada,
        {
          headers: noCacheHeaders,
        },
      );
    }

    if (
      !solicitacao.titulo &&
      solicitacao.tipo !== "DELETE"
    ) {
      return NextResponse.json(
        {
          error:
            "Solicitação sem título.",
        },
        { status: 400 },
      );
    }

    if (
      !solicitacao.conteudo &&
      solicitacao.tipo !== "DELETE"
    ) {
      return NextResponse.json(
        {
          error:
            "Solicitação sem conteúdo.",
        },
        { status: 400 },
      );
    }

    if (solicitacao.tipo === "CREATE") {
      const noticia =
        await prisma.noticia.create({
          data: {
            titulo: solicitacao.titulo!,
            conteudo: solicitacao.conteudo!,
            imagem: solicitacao.imagem,
          },
        });

      await logAudit(
        noticia.id,
        user.id,
        user.name || "Desconhecido",
        "CREATE",
        null,
        {
          titulo: solicitacao.titulo,
          conteudo: solicitacao.conteudo,
          imagem: solicitacao.imagem,
          origemSolicitacaoId:
            solicitacao.id,
          solicitadoPor:
            solicitacao.solicitanteNome,
        },
      );
    }

    if (
      solicitacao.tipo === "UPDATE" &&
      solicitacao.noticiaId
    ) {
      const noticiaAntes =
        await prisma.noticia.findUnique({
          where: {
            id: solicitacao.noticiaId,
          },
        });

      if (!noticiaAntes) {
        return NextResponse.json(
          {
            error:
              "Notícia original não existe mais.",
          },
          { status: 404 },
        );
      }

      let imagemFinal =
        noticiaAntes.imagem;

      if (solicitacao.imagem) {
        await apagarArquivo(
          noticiaAntes.imagem,
        );

        imagemFinal = solicitacao.imagem;
      }

      await prisma.noticia.update({
        where: {
          id: noticiaAntes.id,
        },
        data: {
          titulo: solicitacao.titulo!,
          conteudo: solicitacao.conteudo!,
          imagem: imagemFinal,
        },
      });

      await logAudit(
        noticiaAntes.id,
        user.id,
        user.name || "Desconhecido",
        "UPDATE",
        {
          titulo: noticiaAntes.titulo,
          conteudo: noticiaAntes.conteudo,
          imagem: noticiaAntes.imagem,
        },
        {
          titulo: solicitacao.titulo,
          conteudo: solicitacao.conteudo,
          imagem: imagemFinal,
          origemSolicitacaoId:
            solicitacao.id,
          solicitadoPor:
            solicitacao.solicitanteNome,
        },
      );
    }

    if (
      solicitacao.tipo === "DELETE" &&
      solicitacao.noticiaId
    ) {
      const noticiaAntes =
        await prisma.noticia.findUnique({
          where: {
            id: solicitacao.noticiaId,
          },
        });

      if (noticiaAntes) {
        await apagarArquivo(
          noticiaAntes.imagem,
        );

        await logAudit(
          noticiaAntes.id,
          user.id,
          user.name || "Desconhecido",
          "DELETE",
          {
            titulo: noticiaAntes.titulo,
            conteudo: noticiaAntes.conteudo,
            imagem: noticiaAntes.imagem,
          },
          {
            origemSolicitacaoId:
              solicitacao.id,
            solicitadoPor:
              solicitacao.solicitanteNome,
          },
        );

        await prisma.noticia.delete({
          where: {
            id: noticiaAntes.id,
          },
        });
      }
    }

    const atualizada =
      await prisma.solicitacaoGerenciamento.update(
        {
          where: {
            id: solicitacaoId,
          },
          data: {
            status: "APROVADO",
            revisorId: user.id,
            revisorNome:
              user.name || "Desconhecido",
          },
        },
      );

    return NextResponse.json(
      atualizada,
      {
        headers: noCacheHeaders,
      },
    );
  } catch (error) {
    console.error(
      "PUT notícias/solicitações/[id] error:",
      error,
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Internal server error",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    const user = await getApiUser(req);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { id } = await params;
    const solicitacaoId = Number(id);

    if (
      !Number.isInteger(solicitacaoId) ||
      solicitacaoId <= 0
    ) {
      return NextResponse.json(
        { error: "ID inválido." },
        { status: 400 },
      );
    }

    const solicitacao =
      await prisma.solicitacaoGerenciamento.findUnique(
        {
          where: {
            id: solicitacaoId,
          },
        },
      );

    if (
      !solicitacao ||
      solicitacao.recurso !== "NOTICIA"
    ) {
      return NextResponse.json(
        {
          error:
            "Solicitação não encontrada.",
        },
        { status: 404 },
      );
    }

    const podeCancelar =
      solicitacao.solicitanteId === user.id &&
      solicitacao.status === "PENDENTE";

    if (!podeCancelar) {
      return NextResponse.json(
        {
          error:
            "Você só pode cancelar suas próprias solicitações pendentes.",
        },
        { status: 403 },
      );
    }

    if (solicitacao.imagem) {
      await apagarArquivo(
        solicitacao.imagem,
      );
    }

    await prisma.solicitacaoGerenciamento.update({
      where: {
        id: solicitacaoId,
      },
      data: {
        status: "CANCELADO",
      },
    });

    return NextResponse.json(
      { ok: true },
      {
        headers: noCacheHeaders,
      },
    );
  } catch (error) {
    console.error(
      "DELETE notícias/solicitações/[id] error:",
      error,
    );

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}