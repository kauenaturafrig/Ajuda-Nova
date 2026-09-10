// src/app/admin/api/recados/solicitacoes/route.ts

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

const VALID_TYPES = [
  "CREATE",
  "UPDATE",
  "DELETE",
] as const;

const VALID_STATUS = [
  "PENDENTE",
  "APROVADO",
  "RECUSADO",
  "CANCELADO",
] as const;

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

function formatRequest(item: any) {
  return {
    ...item,
    unidadeIds: parseUnitIds(item.unidadeIds),
  };
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

    const status = new URL(req.url)
      .searchParams.get("status");

    const where: {
      recurso: "RECADO";
      status?: (typeof VALID_STATUS)[number];
      unidadeId?: number;
      solicitanteId?: string;
    } = {
      recurso: "RECADO",
    };

    if (
      status &&
      VALID_STATUS.includes(
        status as (typeof VALID_STATUS)[number],
      )
    ) {
      where.status =
        status as (typeof VALID_STATUS)[number];
    }

    const canSeeAll =
      hasApiRole(user, "OWNER") ||
      hasApiRole(user, "MESSAGENEWS");

    if (canSeeAll) {
      // Pode visualizar todas as unidades.
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
    } else if (
      hasApiRole(user, "MESSAGEONLY")
    ) {
      where.solicitanteId = user.id;
    } else {
      return NextResponse.json(
        { error: "Sem permissão." },
        { status: 403 },
      );
    }

    const requests =
      await prisma.solicitacaoGerenciamento.findMany(
        {
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
        },
      );

    return NextResponse.json(
      requests.map(formatRequest),
      {
        headers: noCacheHeaders,
      },
    );
  } catch (error) {
    console.error(
      "GET recados/solicitacoes error:",
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

    const isOnlyMessageRole =
      hasApiRole(user, "MESSAGEONLY") &&
      !hasApiRole(user, "OWNER") &&
      !hasApiRole(user, "ADMIN") &&
      !hasApiRole(user, "MESSAGENEWS");

    if (!isOnlyMessageRole) {
      return NextResponse.json(
        {
          error:
            "Apenas usuários MESSAGEONLY precisam enviar solicitações.",
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

    const type = String(
      formData.get("tipo") ?? "",
    ).toUpperCase();

    if (
      !VALID_TYPES.includes(
        type as (typeof VALID_TYPES)[number],
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

    const rawRecadoId =
      formData.get("recadoId");

    const recadoId =
      rawRecadoId !== null &&
      String(rawRecadoId).trim() !== ""
        ? Number(rawRecadoId)
        : null;

    if (
      type !== "CREATE" &&
      (!recadoId ||
        !Number.isInteger(recadoId) ||
        recadoId <= 0)
    ) {
      return NextResponse.json(
        {
          error:
            "recadoId é obrigatório para UPDATE/DELETE.",
        },
        { status: 400 },
      );
    }

    let existingRecado: {
      id: number;
      titulo: string | null;
      conteudo: string | null;
      imagem: string | null;
      unidadeId: number;
      unidades: { unidadeId: number }[];
    } | null = null;

    if (type !== "CREATE" && recadoId) {
      const recado =
        await prisma.recado.findUnique({
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

      const isMultiUnit =
        recado.unidades.length > 1;

      const belongsToUserUnit =
        recado.unidadeId ===
        user.unidadeId;

      if (
        isMultiUnit ||
        !belongsToUserUnit
      ) {
        return NextResponse.json(
          {
            error:
              "Você só pode solicitar alterações em recados da sua própria unidade.",
          },
          { status: 403 },
        );
      }

      const pending =
        await prisma.solicitacaoGerenciamento.findFirst(
          {
            where: {
              recurso: "RECADO",
              recadoId,
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
              "Já existe uma solicitação pendente para este recado.",
          },
          { status: 409 },
        );
      }

      existingRecado = recado;
    }

    let title: string | null = null;
    let content: string | null = null;
    let image: string | null = null;
    let oldImage: string | null = null;

    if (type === "DELETE" && existingRecado) {
      title = existingRecado.titulo;
      content = existingRecado.conteudo;
      oldImage = existingRecado.imagem;
    }

    if (
      type === "CREATE" ||
      type === "UPDATE"
    ) {
      title = String(
        formData.get("titulo") ?? "",
      ).trim();

      content = String(
        formData.get("conteudo") ?? "",
      ).trim();

      oldImage =
        String(
          formData.get("imagemAntiga") ?? "",
        ).trim() || null;

      if (!title || !content) {
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
        if (
          !imageValue.type.startsWith("image/")
        ) {
          return NextResponse.json(
            {
              error:
                "O arquivo precisa ser uma imagem.",
            },
            { status: 400 },
          );
        }

        if (
          imageValue.size > 5 * 1024 * 1024
        ) {
          return NextResponse.json(
            {
              error:
                "A imagem não pode ultrapassar 5 MB.",
            },
            { status: 400 },
          );
        }

        const uploadDirectory = path.join(
          process.cwd(),
          "storage",
          "uploads",
          "recados",
        );

        await mkdir(uploadDirectory, {
          recursive: true,
        });

        const extension =
          imageValue.name
            .split(".")
            .pop()
            ?.toLowerCase() || "jpg";

        const safeExtension =
          extension.replace(
            /[^a-z0-9]/gi,
            "",
          ) || "jpg";

        const filename =
          [
            "recado-solicitacao",
            Date.now(),
            crypto
              .randomUUID()
              .slice(0, 8),
          ].join("-") +
          `.${safeExtension}`;

        const buffer = Buffer.from(
          await imageValue.arrayBuffer(),
        );

        await writeFile(
          path.join(
            uploadDirectory,
            filename,
          ),
          buffer,
        );

        uploadedImage = filename;
        image = filename;
      }
    }

    const request =
      await prisma.solicitacaoGerenciamento.create(
        {
          data: {
            recurso: "RECADO",
            tipo: type as
              | "CREATE"
              | "UPDATE"
              | "DELETE",
            status: "PENDENTE",
            recadoId,
            unidadeId: user.unidadeId,
            titulo: title,
            conteudo: content,
            unidadeIds: JSON.stringify([
              user.unidadeId,
            ]),
            imagem: image,
            imagemAntiga: oldImage,
            solicitanteId: user.id,
            solicitanteNome:
              user.name || "Desconhecido",
          },
        },
      );

    return NextResponse.json(
      formatRequest(request),
      {
        headers: noCacheHeaders,
      },
    );
  } catch (error) {
    console.error(
      "POST recados/solicitacoes error:",
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