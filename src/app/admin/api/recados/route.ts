// src/app/admin/api/recados/route.ts

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
import {
  GLOBAL_ROLES,
  PAGE_ROLES,
} from "@/src/lib/role-permissions";
import { getUnidadeByIp } from "@/src/lib/getUnidadeByIp";

export const dynamic = "force-dynamic";

const noCacheHeaders = {
  "Cache-Control":
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

type RecadosWhere = {
  unidadeId?: number;
};

function getClientIp(req: NextRequest) {
  const forwardedFor = req.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return req.headers.get("x-real-ip");
}

function parseUnitIds(formData: FormData) {
  const rawIds = formData.getAll("unidadeIds[]");

  return [
    ...new Set(
      rawIds
        .map((value) => Number(value))
        .filter(
          (value) =>
            Number.isInteger(value) && value > 0,
        ),
    ),
  ];
}

function getUploadDirectory() {
  return path.join(
    process.cwd(),
    "storage",
    "uploads",
    "recados",
  );
}

async function logAudit(
  recadoId: number,
  userId: string,
  userName: string,
  action: string,
  oldData: unknown = null,
  newData: unknown = null,
) {
  await prisma.recadoAudit.create({
    data: {
      recadoId,
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

async function saveUploadedImage(
  file: File | null,
) {
  if (!file || file.size === 0) {
    return null;
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("O arquivo enviado precisa ser uma imagem.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error(
      "A imagem não pode ultrapassar 5 MB.",
    );
  }

  const uploadDirectory = getUploadDirectory();

  await mkdir(uploadDirectory, {
    recursive: true,
  });

  const extension =
    file.name.split(".").pop()?.toLowerCase() || "jpg";

  const safeExtension = extension.replace(
    /[^a-z0-9]/gi,
    "",
  ) || "jpg";

  const filename = [
    "recado",
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

async function removeUploadedImage(
  filename?: string | null,
) {
  if (!filename) {
    return;
  }

  const filePath = path.join(
    getUploadDirectory(),
    filename,
  );

  try {
    await fs.access(filePath);
    await rm(filePath);
  } catch {
    // Arquivo inexistente: não há nada para remover.
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getApiUser(req);

    let where: RecadosWhere = {};

    if (user) {
      const canAccess = hasAnyApiRole(
        user,
        PAGE_ROLES.recados,
      );

      if (!canAccess) {
        return NextResponse.json(
          { error: "Forbidden" },
          { status: 403 },
        );
      }

      const canSeeAllUnits = hasAnyApiRole(
        user,
        GLOBAL_ROLES.recados,
      );

      if (!canSeeAllUnits) {
        where =
          user.unidadeId !== null
            ? { unidadeId: user.unidadeId }
            : { unidadeId: -1 };
      }
    } else {
      const ip = getClientIp(req);
      const unidadeId = getUnidadeByIp(ip);

      if (!unidadeId) {
        return NextResponse.json(
          [],
          { headers: noCacheHeaders },
        );
      }

      where = {
        unidadeId,
      };
    }

    const recados = await prisma.recado.findMany({
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
        unidades: {
          include: {
            unidade: {
              select: {
                id: true,
                nome: true,
              },
            },
          },
        },
      },
    });

    const formatted = recados.map((recado) => ({
      ...recado,
      unidadeIds: recado.unidades.map(
        (item) => item.unidadeId,
      ),
    }));

    return NextResponse.json(
      formatted,
      {
        headers: noCacheHeaders,
      },
    );
  } catch (error) {
    console.error(
      "GET /admin/api/recados error:",
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

    if (
      !hasAnyApiRole(
        user,
        PAGE_ROLES.recados,
      )
    ) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 },
      );
    }

    const isOnlyMessageRole =
      hasApiRole(user, "MESSAGEONLY") &&
      !hasApiRole(user, "OWNER") &&
      !hasApiRole(user, "ADMIN") &&
      !hasApiRole(user, "MESSAGENEWS");

    if (isOnlyMessageRole) {
      return NextResponse.json(
        {
          error:
            "Seu perfil precisa enviar uma solicitação de aprovação.",
        },
        { status: 403 },
      );
    }

    const formData = await req.formData();

    const unitIds = parseUnitIds(formData);

    if (unitIds.length === 0) {
      return NextResponse.json(
        {
          error:
            "Selecione pelo menos uma unidade.",
        },
        { status: 400 },
      );
    }

    const canCreateMultiUnit =
      hasApiRole(user, "OWNER") ||
      hasApiRole(user, "MESSAGENEWS");

    if (
      unitIds.length > 1 &&
      !canCreateMultiUnit
    ) {
      return NextResponse.json(
        {
          error:
            "Apenas OWNER ou MESSAGENEWS podem criar recados para múltiplas unidades.",
        },
        { status: 403 },
      );
    }

    if (
      !canCreateMultiUnit &&
      user.unidadeId === null
    ) {
      return NextResponse.json(
        {
          error:
            "Usuário sem unidade vinculada.",
        },
        { status: 400 },
      );
    }

    if (
      !canCreateMultiUnit &&
      unitIds.some(
        (unitId) => unitId !== user.unidadeId,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Você só pode criar recados para sua própria unidade.",
        },
        { status: 403 },
      );
    }

    const title = String(
      formData.get("titulo") ?? "",
    ).trim();

    const content = String(
      formData.get("conteudo") ?? "",
    ).trim();

    if (!title || !content) {
      return NextResponse.json(
        {
          error:
            "Título e conteúdo são obrigatórios.",
        },
        { status: 400 },
      );
    }

    const imageFile = formData.get("imagem");

    uploadedImage = await saveUploadedImage(
      imageFile instanceof File
        ? imageFile
        : null,
    );

    const principalUnitId = unitIds[0];

    const recado = await prisma.recado.create({
      data: {
        titulo: title,
        conteudo: content,
        unidadeId: principalUnitId,
        imagem: uploadedImage,
        unidades: {
          create: unitIds.map((unitId) => ({
            unidadeId: unitId,
          })),
        },
      },
      include: {
        unidade: {
          select: {
            id: true,
            nome: true,
          },
        },
        unidades: {
          include: {
            unidade: {
              select: {
                id: true,
                nome: true,
              },
            },
          },
        },
      },
    });

    await logAudit(
      recado.id,
      user.id,
      user.name || "Desconhecido",
      "CREATE",
      null,
      {
        titulo: title,
        conteudo: content,
        unidadeIds: unitIds,
        imagem: uploadedImage,
      },
    );

    return NextResponse.json(
      {
        ...recado,
        unidadeIds: recado.unidades.map(
          (item) => item.unidadeId,
        ),
      },
      {
        headers: noCacheHeaders,
      },
    );
  } catch (error) {
    if (uploadedImage) {
      await removeUploadedImage(uploadedImage);
    }

    console.error(
      "POST /admin/api/recados error:",
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
  let newUploadedImage: string | null = null;

  try {
    const user = await getApiUser(req);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    if (
      !hasAnyApiRole(
        user,
        PAGE_ROLES.recados,
      )
    ) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 },
      );
    }

    const isOnlyMessageRole =
      hasApiRole(user, "MESSAGEONLY") &&
      !hasApiRole(user, "OWNER") &&
      !hasApiRole(user, "ADMIN") &&
      !hasApiRole(user, "MESSAGENEWS");

    if (isOnlyMessageRole) {
      return NextResponse.json(
        {
          error:
            "Seu perfil precisa enviar uma solicitação de aprovação.",
        },
        { status: 403 },
      );
    }

    const formData = await req.formData();

    const id = Number(formData.get("id"));

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        { error: "ID de recado inválido." },
        { status: 400 },
      );
    }

    const unitIds = parseUnitIds(formData);

    if (unitIds.length === 0) {
      return NextResponse.json(
        {
          error:
            "Selecione pelo menos uma unidade.",
        },
        { status: 400 },
      );
    }

    const recadoAntigo =
      await prisma.recado.findUnique({
        where: {
          id,
        },
        include: {
          unidades: true,
        },
      });

    if (!recadoAntigo) {
      return NextResponse.json(
        {
          error:
            "Recado não encontrado.",
        },
        { status: 404 },
      );
    }

    const antigosUnitIds =
      recadoAntigo.unidades.map(
        (item) => item.unidadeId,
      );

    const isMultiUnit =
      antigosUnitIds.length > 1 ||
      unitIds.length > 1;

    const canManageAllUnits =
      hasApiRole(user, "OWNER") ||
      hasApiRole(user, "MESSAGENEWS");

    if (
      isMultiUnit &&
      !canManageAllUnits
    ) {
      return NextResponse.json(
        {
          error:
            "Apenas OWNER ou MESSAGENEWS podem editar recados multi-unidade.",
        },
        { status: 403 },
      );
    }

    const belongsToUserUnit =
      user.unidadeId !== null &&
      antigosUnitIds.includes(user.unidadeId);

    if (
      !canManageAllUnits &&
      !belongsToUserUnit
    ) {
      return NextResponse.json(
        {
          error:
            "Você só pode editar recados da sua própria unidade.",
        },
        { status: 403 },
      );
    }

    if (
      !canManageAllUnits &&
      user.unidadeId !== null &&
      unitIds.some(
        (unitId) => unitId !== user.unidadeId,
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Você só pode manter o recado na sua própria unidade.",
        },
        { status: 403 },
      );
    }

    const title = String(
      formData.get("titulo") ?? "",
    ).trim();

    const content = String(
      formData.get("conteudo") ?? "",
    ).trim();

    if (!title || !content) {
      return NextResponse.json(
        {
          error:
            "Título e conteúdo são obrigatórios.",
        },
        { status: 400 },
      );
    }

    const oldImage = String(
      formData.get("imagemAntiga") ?? "",
    ).trim();

    let image = oldImage || null;

    const imageFile = formData.get("imagem");

    if (imageFile instanceof File &&
        imageFile.size > 0) {
      newUploadedImage = await saveUploadedImage(
        imageFile,
      );

      image = newUploadedImage;

      await removeUploadedImage(oldImage);
    }

    const oldData = {
      titulo: recadoAntigo.titulo,
      conteudo: recadoAntigo.conteudo,
      unidadeId: recadoAntigo.unidadeId,
      unidadeIds: antigosUnitIds,
      imagem: recadoAntigo.imagem,
    };

    const principalUnitId = unitIds[0];

    const recado = await prisma.recado.update({
      where: {
        id,
      },
      data: {
        titulo: title,
        conteudo: content,
        unidadeId: principalUnitId,
        imagem: image,
        unidades: {
          deleteMany: {},
          create: unitIds.map((unitId) => ({
            unidadeId: unitId,
          })),
        },
      },
      include: {
        unidade: {
          select: {
            id: true,
            nome: true,
          },
        },
        unidades: {
          include: {
            unidade: {
              select: {
                id: true,
                nome: true,
              },
            },
          },
        },
      },
    });

    await logAudit(
      recado.id,
      user.id,
      user.name || "Desconhecido",
      "UPDATE",
      oldData,
      {
        titulo: title,
        conteudo: content,
        unidadeIds: unitIds,
        imagem: image,
      },
    );

    return NextResponse.json(
      {
        ...recado,
        unidadeIds: recado.unidades.map(
          (item) => item.unidadeId,
        ),
      },
      {
        headers: noCacheHeaders,
      },
    );
  } catch (error) {
    if (newUploadedImage) {
      await removeUploadedImage(newUploadedImage);
    }

    console.error(
      "PUT /admin/api/recados error:",
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