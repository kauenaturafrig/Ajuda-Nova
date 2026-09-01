// src/app/admin/api/recados/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { rm } from "fs/promises";
import fs from "fs/promises";

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
    "recados",
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

    const { id } = await params;
    const recadoId = Number(id);

    if (
      !Number.isInteger(recadoId) ||
      recadoId <= 0
    ) {
      return NextResponse.json(
        { error: "ID de recado inválido." },
        { status: 400 },
      );
    }

    const recado = await prisma.recado.findUnique({
      where: {
        id: recadoId,
      },
      include: {
        unidades: true,
      },
    });

    if (!recado) {
      return NextResponse.json(
        {
          error:
            "Recado não encontrado.",
        },
        { status: 404 },
      );
    }

    const recadoUnitIds = recado.unidades.map(
      (item) => item.unidadeId,
    );

    const isMultiUnit =
      recadoUnitIds.length > 1;

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
            "Apenas OWNER ou MESSAGENEWS podem excluir recados multi-unidade.",
        },
        { status: 403 },
      );
    }

    const belongsToUserUnit =
      user.unidadeId !== null &&
      recadoUnitIds.includes(user.unidadeId);

    if (
      !canManageAllUnits &&
      !belongsToUserUnit
    ) {
      return NextResponse.json(
        {
          error:
            "Você só pode excluir recados da sua própria unidade.",
        },
        { status: 403 },
      );
    }

    await prisma.recadoAudit.create({
      data: {
        recadoId,
        userId: user.id,
        userNome: user.name || "Desconhecido",
        acao: "DELETE",
        dadosAntigos: {
          titulo: recado.titulo,
          conteudo: recado.conteudo,
          unidadeId: recado.unidadeId,
          unidadeIds: recadoUnitIds,
          imagem: recado.imagem,
        },
      },
    });

    await apagarArquivo(recado.imagem);

    await prisma.recado.delete({
      where: {
        id: recadoId,
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
      "DELETE /admin/api/recados/[id] error:",
      error,
    );

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}