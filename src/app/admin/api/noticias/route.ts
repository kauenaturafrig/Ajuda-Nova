//src/app/admin/api/noticias/route.ts
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { mkdir, rm, writeFile } from "fs/promises";
import fs from "fs/promises";
import crypto from "crypto";

import { prisma } from "@/src/lib/prisma";
import {
  getApiUser,
  hasAnyApiRole,
  hasApiRole,
} from "@/src/lib/api-permissions";
import { PAGE_ROLES } from "@/src/lib/role-permissions";

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
      "noticia",
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

export async function GET(req: NextRequest) {
  try {
    const user = await getApiUser(req);

    if (
      user &&
      !hasAnyApiRole(
        user,
        PAGE_ROLES.noticias,
      )
    ) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 },
      );
    }

    const noticias =
      await prisma.noticia.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json(
      noticias,
      {
        headers: noCacheHeaders,
      },
    );
  } catch (error) {
    console.error(
      "GET /admin/api/noticias error:",
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

    const canCreate =
      hasApiRole(user, "OWNER") ||
      hasApiRole(user, "MESSAGENEWS");

    if (!canCreate) {
      return NextResponse.json(
        {
          error:
            "Apenas OWNER ou MESSAGENEWS podem criar notícias diretamente.",
        },
        { status: 403 },
      );
    }

    const formData = await req.formData();

    const titulo = String(
      formData.get("titulo") ?? "",
    ).trim();

    const conteudo = String(
      formData.get("conteudo") ?? "",
    ).trim();

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

    if (imageValue instanceof File) {
      uploadedImage =
        await salvarImagem(imageValue);
    }

    const noticia =
      await prisma.noticia.create({
        data: {
          titulo,
          conteudo,
          imagem: uploadedImage,
        },
      });

    await logAudit(
      noticia.id,
      user.id,
      user.name || "Usuário",
      "CREATE",
      null,
      {
        id: noticia.id,
        titulo: noticia.titulo,
        conteudo: noticia.conteudo,
        imagem: noticia.imagem,
      },
    );

    return NextResponse.json(
      noticia,
      {
        headers: noCacheHeaders,
      },
    );
  } catch (error) {
    if (uploadedImage) {
      await apagarArquivo(uploadedImage);
    }

    console.error(
      "POST /admin/api/noticias error:",
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

export async function PUT(req: NextRequest) {
  let uploadedImage: string | null = null;

  try {
    const user = await getApiUser(req);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const canUpdate =
      hasApiRole(user, "OWNER") ||
      hasApiRole(user, "MESSAGENEWS");

    if (!canUpdate) {
      return NextResponse.json(
        {
          error:
            "Apenas OWNER ou MESSAGENEWS podem editar notícias diretamente.",
        },
        { status: 403 },
      );
    }

    const formData = await req.formData();

    const id = Number(formData.get("id"));

    const titulo = String(
      formData.get("titulo") ?? "",
    ).trim();

    const conteudo = String(
      formData.get("conteudo") ?? "",
    ).trim();

    const imagemAntiga =
      String(
        formData.get("imagemAntiga") ?? "",
      ).trim() || null;

    if (
      !Number.isInteger(id) ||
      id <= 0 ||
      !titulo ||
      !conteudo
    ) {
      return NextResponse.json(
        {
          error:
            "ID, título e conteúdo são obrigatórios.",
        },
        { status: 400 },
      );
    }

    const noticiaAntes =
      await prisma.noticia.findUnique({
        where: {
          id,
        },
      });

    if (!noticiaAntes) {
      return NextResponse.json(
        {
          error:
            "Notícia não encontrada.",
        },
        { status: 404 },
      );
    }

    let imagem =
      imagemAntiga || noticiaAntes.imagem;

    const imageValue =
      formData.get("imagem");

    if (
      imageValue instanceof File &&
      imageValue.size > 0
    ) {
      uploadedImage =
        await salvarImagem(imageValue);

      imagem = uploadedImage;

      await apagarArquivo(
        imagemAntiga || noticiaAntes.imagem,
      );
    }

    const noticiaDepois =
      await prisma.noticia.update({
        where: {
          id,
        },
        data: {
          titulo,
          conteudo,
          imagem,
        },
      });

    await logAudit(
      noticiaDepois.id,
      user.id,
      user.name || "Usuário",
      "UPDATE",
      {
        titulo: noticiaAntes.titulo,
        conteudo: noticiaAntes.conteudo,
        imagem: noticiaAntes.imagem,
      },
      {
        titulo: noticiaDepois.titulo,
        conteudo: noticiaDepois.conteudo,
        imagem: noticiaDepois.imagem,
      },
    );

    return NextResponse.json(
      noticiaDepois,
      {
        headers: noCacheHeaders,
      },
    );
  } catch (error) {
    if (uploadedImage) {
      await apagarArquivo(uploadedImage);
    }

    console.error(
      "PUT /admin/api/noticias error:",
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