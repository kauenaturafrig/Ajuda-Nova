//src/app/admin/api/noticias/solicitacoes/route.ts
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { mkdir, writeFile } from "fs/promises";
import crypto from "crypto";

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

const STATUS_VALIDOS = [
  "PENDENTE",
  "APROVADO",
  "RECUSADO",
  "CANCELADO",
] as const;

const TIPOS_VALIDOS = [
  "CREATE",
  "UPDATE",
  "DELETE",
] as const;

type StatusValido = (typeof STATUS_VALIDOS)[number];
type TipoValido = (typeof TIPOS_VALIDOS)[number];

function formatSolicitacao(solicitacao: any) {
  return {
    ...solicitacao,
    unidadeIds: parseUnidadeIds(
      solicitacao.unidadeIds,
    ),
  };
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

function getUploadDirectory() {
  return path.join(
    process.cwd(),
    "storage",
    "uploads",
    "noticias",
  );
}

async function salvarImagem(
  file: File | null,
) {
  if (!file || file.size === 0) {
    return null;
  }

  if (!file.type.startsWith("image/")) {
    throw new Error(
      "O arquivo precisa ser uma imagem.",
    );
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error(
      "A imagem não pode ultrapassar 5 MB.",
    );
  }

  const uploadDirectory =
    getUploadDirectory();

  await mkdir(uploadDirectory, {
    recursive: true,
  });

  const extension =
    file.name.split(".").pop()?.toLowerCase() ||
    "jpg";

  const safeExtension =
    extension.replace(/[^a-z0-9]/gi, "") ||
    "jpg";

  const filename =
    [
      "noticia-solicitacao",
      Date.now(),
      crypto.randomUUID().slice(0, 8),
    ].join("-") + `.${safeExtension}`;

  const filePath = path.join(
    uploadDirectory,
    filename,
  );

  const buffer = Buffer.from(
    await file.arrayBuffer(),
  );

  await writeFile(filePath, buffer);

  return filename;
}

export async function GET(req: NextRequest) {
  try {
    const user = await getApiUser(req);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const statusParam = new URL(req.url)
      .searchParams.get("status");

    const where: {
      recurso: "NOTICIA";
      status?: StatusValido;
      unidadeId?: number;
      solicitanteId?: string;
    } = {
      recurso: "NOTICIA",
    };

    if (
      statusParam &&
      STATUS_VALIDOS.includes(
        statusParam as StatusValido,
      )
    ) {
      where.status =
        statusParam as StatusValido;
    }

    const canSeeAll =
      hasApiRole(user, "OWNER") ||
      hasApiRole(user, "MESSAGENEWS");

    if (canSeeAll) {
      // Pode visualizar solicitações de todas as unidades.
    } else if (hasApiRole(user, "ADMIN")) {
      if (user.unidadeId === null) {
        return NextResponse.json(
          {
            error:
              "Usuário sem unidade vinculada.",
          },
          { status: 400 },
        );
      }

      where.unidadeId = user.unidadeId;
    } else if (hasApiRole(user, "NEWSONLY")) {
      where.solicitanteId = user.id;
    } else {
      return NextResponse.json(
        { error: "Sem permissão." },
        { status: 403 },
      );
    }

    const solicitacoes =
      await prisma.solicitacaoGerenciamento.findMany(
        {
          where,
          orderBy: {
            createdAt: "desc",
          },
        },
      );

    return NextResponse.json(
      solicitacoes.map(formatSolicitacao),
      {
        headers: noCacheHeaders,
      },
    );
  } catch (error) {
    console.error(
      "GET notícias/solicitações error:",
      error,
    );

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  let uploadedImage: string | null = null;

  try {
    const user = await getApiUser(req);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const isOnlyNewsRole =
      hasApiRole(user, "NEWSONLY") &&
      !hasApiRole(user, "OWNER") &&
      !hasApiRole(user, "ADMIN") &&
      !hasApiRole(user, "MESSAGENEWS");

    if (!isOnlyNewsRole) {
      return NextResponse.json(
        {
          error:
            "Apenas usuários NEWSONLY precisam enviar solicitações.",
        },
        { status: 403 },
      );
    }

    if (user.unidadeId === null) {
      return NextResponse.json(
        {
          error:
            "Usuário sem unidade vinculada.",
        },
        { status: 400 },
      );
    }

    const formData = await req.formData();

    const tipo = String(
      formData.get("tipo") ?? "",
    ).toUpperCase();

    if (
      !TIPOS_VALIDOS.includes(
        tipo as TipoValido,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Tipo de solicitação inválido.",
        },
        { status: 400 },
      );
    }

    const noticiaIdRaw =
      formData.get("noticiaId");

    const noticiaId =
      noticiaIdRaw !== null &&
      String(noticiaIdRaw).trim() !== ""
        ? Number(noticiaIdRaw)
        : null;

    if (
      tipo !== "CREATE" &&
      (!noticiaId ||
        !Number.isInteger(noticiaId) ||
        noticiaId <= 0)
    ) {
      return NextResponse.json(
        {
          error:
            "noticiaId é obrigatório para UPDATE/DELETE.",
        },
        { status: 400 },
      );
    }

    let noticiaExistente: {
      id: number;
      titulo: string | null;
      conteudo: string | null;
      imagem: string | null;
    } | null = null;

    if (tipo !== "CREATE" && noticiaId) {
      const noticia =
        await prisma.noticia.findUnique({
          where: {
            id: noticiaId,
          },
          select: {
            id: true,
            titulo: true,
            conteudo: true,
            imagem: true,
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

      noticiaExistente = noticia;

      const pending =
        await prisma.solicitacaoGerenciamento.findFirst(
          {
            where: {
              noticiaId,
              recurso: "NOTICIA",
              status: "PENDENTE",
            },
            select: {
              id: true,
            },
          },
        );

      if (pending) {
        return NextResponse.json(
          {
            error:
              "Já existe uma solicitação pendente para esta notícia.",
          },
          { status: 409 },
        );
      }
    }

    let titulo: string | null = null;
    let conteudo: string | null = null;
    let imagem: string | null = null;
    let imagemAntiga: string | null = null;

    if (tipo === "DELETE" && noticiaExistente) {
      titulo = noticiaExistente.titulo;
      conteudo = noticiaExistente.conteudo;
      imagemAntiga = noticiaExistente.imagem;
    }

    if (
      tipo === "CREATE" ||
      tipo === "UPDATE"
    ) {
      titulo = String(
        formData.get("titulo") ?? "",
      ).trim();

      conteudo = String(
        formData.get("conteudo") ?? "",
      ).trim();

      imagemAntiga =
        String(
          formData.get("imagemAntiga") ?? "",
        ).trim() || null;

      if (!titulo || !conteudo) {
        return NextResponse.json(
          {
            error:
              "Título e conteúdo são obrigatórios.",
          },
          { status: 400 },
        );
      }

      const imageValue =
        formData.get("imagem");

      if (
        imageValue instanceof File &&
        imageValue.size > 0
      ) {
        uploadedImage =
          await salvarImagem(imageValue);

        imagem = uploadedImage;
      }
    }

    const solicitacao =
      await prisma.solicitacaoGerenciamento.create(
        {
          data: {
            recurso: "NOTICIA",
            tipo: tipo as TipoValido,
            status: "PENDENTE",
            noticiaId,
            unidadeId: user.unidadeId,
            titulo,
            conteudo,
            unidadeIds: JSON.stringify([
              user.unidadeId,
            ]),
            imagem,
            imagemAntiga,
            solicitanteId: user.id,
            solicitanteNome:
              user.name || "Desconhecido",
          },
        },
      );

    return NextResponse.json(
      formatSolicitacao(solicitacao),
      {
        headers: noCacheHeaders,
      },
    );
  } catch (error) {
    console.error(
      "POST notícias/solicitações error:",
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