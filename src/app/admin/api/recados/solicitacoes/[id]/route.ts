// src/app/admin/api/recados/solicitacoes/[id]/route.ts

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

function parseUnitIds(
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
    const requestId = Number(id);

    if (
      !Number.isInteger(requestId) ||
      requestId <= 0
    ) {
      return NextResponse.json(
        { error: "ID inválido." },
        { status: 400 },
      );
    }

    const request =
      await prisma.solicitacaoGerenciamento.findUnique(
        {
          where: {
            id: requestId,
          },
        },
      );

    if (
      !request ||
      request.recurso !== "RECADO"
    ) {
      return NextResponse.json(
        {
          error:
            "Solicitação não encontrada.",
        },
        { status: 404 },
      );
    }

    if (request.status !== "PENDENTE") {
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
      request.unidadeId !== user.unidadeId
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

    const action = String(
      body.acao ?? "",
    ).toLowerCase();

    if (
      action !== "aprovar" &&
      action !== "recusar"
    ) {
      return NextResponse.json(
        { error: "Ação inválida." },
        { status: 400 },
      );
    }

    const reason =
      typeof body.motivo === "string"
        ? body.motivo.trim()
        : null;

    if (action === "recusar") {
      if (request.imagem) {
        await apagarArquivo(
          request.imagem,
        );
      }

      const updated =
        await prisma.solicitacaoGerenciamento.update(
          {
            where: {
              id: requestId,
            },
            data: {
              status: "RECUSADO",
              revisorId: user.id,
              revisorNome:
                user.name || "Desconhecido",
              motivoRecusa: reason,
            },
          },
        );

      return NextResponse.json(
        updated,
        {
          headers: noCacheHeaders,
        },
      );
    }

    const unitIds = parseUnitIds(
      request.unidadeIds,
    );

    if (request.tipo === "CREATE") {
      if (
        !request.titulo ||
        !request.conteudo ||
        unitIds.length === 0
      ) {
        return NextResponse.json(
          {
            error:
              "Solicitação sem dados obrigatórios.",
          },
          { status: 400 },
        );
      }

      const recado =
        await prisma.recado.create({
          data: {
            titulo: request.titulo,
            conteudo: request.conteudo,
            unidadeId: unitIds[0],
            imagem: request.imagem,
            unidades: {
              create: unitIds.map(
                (unidadeId) => ({
                  unidadeId,
                }),
              ),
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
          titulo: request.titulo,
          conteudo: request.conteudo,
          unidadeIds: unitIds,
          imagem: request.imagem,
          origemSolicitacaoId:
            request.id,
          solicitadoPor:
            request.solicitanteNome,
        },
      );
    }

    if (
      request.tipo === "UPDATE" &&
      request.recadoId
    ) {
      const recadoBefore =
        await prisma.recado.findUnique({
          where: {
            id: request.recadoId,
          },
          include: {
            unidades: true,
          },
        });

      if (!recadoBefore) {
        return NextResponse.json(
          {
            error:
              "Recado original não existe mais.",
          },
          { status: 404 },
        );
      }

      if (
        !request.titulo ||
        !request.conteudo ||
        unitIds.length === 0
      ) {
        return NextResponse.json(
          {
            error:
              "Solicitação sem dados obrigatórios.",
          },
          { status: 400 },
        );
      }

      let finalImage =
        recadoBefore.imagem;

      if (request.imagem) {
        await apagarArquivo(
          recadoBefore.imagem,
        );

        finalImage = request.imagem;
      }

      const oldData = {
        titulo: recadoBefore.titulo,
        conteudo: recadoBefore.conteudo,
        unidadeId: recadoBefore.unidadeId,
        unidadeIds: recadoBefore.unidades.map(
          (item) => item.unidadeId,
        ),
        imagem: recadoBefore.imagem,
      };

      await prisma.recado.update({
        where: {
          id: recadoBefore.id,
        },
        data: {
          titulo: request.titulo,
          conteudo: request.conteudo,
          unidadeId: unitIds[0],
          imagem: finalImage,
          unidades: {
            deleteMany: {},
            create: unitIds.map(
              (unidadeId) => ({
                unidadeId,
              }),
            ),
          },
        },
      });

      await logAudit(
        recadoBefore.id,
        user.id,
        user.name || "Desconhecido",
        "UPDATE",
        oldData,
        {
          titulo: request.titulo,
          conteudo: request.conteudo,
          unidadeIds: unitIds,
          imagem: finalImage,
          origemSolicitacaoId:
            request.id,
          solicitadoPor:
            request.solicitanteNome,
        },
      );
    }

    if (
      request.tipo === "DELETE" &&
      request.recadoId
    ) {
      const recadoBefore =
        await prisma.recado.findUnique({
          where: {
            id: request.recadoId,
          },
          include: {
            unidades: true,
          },
        });

      if (recadoBefore) {
        await apagarArquivo(
          recadoBefore.imagem,
        );

        await logAudit(
          recadoBefore.id,
          user.id,
          user.name || "Desconhecido",
          "DELETE",
          {
            titulo: recadoBefore.titulo,
            conteudo: recadoBefore.conteudo,
            unidadeId: recadoBefore.unidadeId,
            unidadeIds: recadoBefore.unidades.map(
              (item) => item.unidadeId,
            ),
            imagem: recadoBefore.imagem,
          },
          {
            origemSolicitacaoId:
              request.id,
            solicitadoPor:
              request.solicitanteNome,
          },
        );

        await prisma.recado.delete({
          where: {
            id: recadoBefore.id,
          },
        });
      }
    }

    const updated =
      await prisma.solicitacaoGerenciamento.update(
        {
          where: {
            id: requestId,
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
      updated,
      {
        headers: noCacheHeaders,
      },
    );
  } catch (error) {
    console.error(
      "PUT recados/solicitacoes/[id] error:",
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
    const requestId = Number(id);

    if (
      !Number.isInteger(requestId) ||
      requestId <= 0
    ) {
      return NextResponse.json(
        { error: "ID inválido." },
        { status: 400 },
      );
    }

    const request =
      await prisma.solicitacaoGerenciamento.findUnique(
        {
          where: {
            id: requestId,
          },
        },
      );

    if (
      !request ||
      request.recurso !== "RECADO"
    ) {
      return NextResponse.json(
        {
          error:
            "Solicitação não encontrada.",
        },
        { status: 404 },
      );
    }

    const canCancel =
      request.solicitanteId === user.id &&
      request.status === "PENDENTE";

    if (!canCancel) {
      return NextResponse.json(
        {
          error:
            "Você só pode cancelar suas próprias solicitações pendentes.",
        },
        { status: 403 },
      );
    }

    if (request.imagem) {
      await apagarArquivo(
        request.imagem,
      );
    }

    await prisma.solicitacaoGerenciamento.update({
      where: {
        id: requestId,
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
      "DELETE recados/solicitacoes/[id] error:",
      error,
    );

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}