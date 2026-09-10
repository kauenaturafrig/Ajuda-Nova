//src/app/admin/api/noticias/[id]/route.ts
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
    // Arquivo já inexistente.
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

    const canDelete =
      hasApiRole(user, "OWNER") ||
      hasApiRole(user, "MESSAGENEWS");

    if (!canDelete) {
      return NextResponse.json(
        {
          error:
            "Apenas OWNER ou MESSAGENEWS podem excluir notícias diretamente.",
        },
        { status: 403 },
      );
    }

    const { id } = await params;
    const noticiaId = Number(id);

    if (
      !Number.isInteger(noticiaId) ||
      noticiaId <= 0
    ) {
      return NextResponse.json(
        { error: "ID inválido." },
        { status: 400 },
      );
    }

    const noticia =
      await prisma.noticia.findUnique({
        where: {
          id: noticiaId,
        },
      });

    if (!noticia) {
      return NextResponse.json(
        {
          error:
            "Notícia não encontrada.",
        },
        { status: 404 },
      );
    }

    await prisma.noticiaAudit.create({
      data: {
        noticiaId,
        userId: user.id,
        userNome: user.name || "Usuário",
        acao: "DELETE",
        dadosAntigos: {
          titulo: noticia.titulo,
          conteudo: noticia.conteudo,
          imagem: noticia.imagem,
        },
      },
    });

    await apagarArquivo(noticia.imagem);

    await prisma.noticia.delete({
      where: {
        id: noticiaId,
      },
    });

    return NextResponse.json(
      { success: true },
      {
        headers: noCacheHeaders,
      },
    );
  } catch (error) {
    console.error(
      "DELETE /admin/api/noticias/[id] error:",
      error,
    );

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}