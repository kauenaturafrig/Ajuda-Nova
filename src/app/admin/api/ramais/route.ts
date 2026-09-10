// src/app/admin/api/ramais/route.ts
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/src/lib/prisma";
import {
  getApiUser,
  hasApiRole,
} from "@/src/lib/api-permissions";

export const dynamic = "force-dynamic";

const canManageRamais = (user: Awaited<
  ReturnType<typeof getApiUser>
>) => {
  if (!user) {
    return false;
  }

  return (
    hasApiRole(user, "OWNER") ||
    hasApiRole(user, "EXTENSION")
  );
};

// Verifica se é ADMIN ou EXTENSION para limitar à própria unidade
const isUnitRestricted = (user: Awaited<
  ReturnType<typeof getApiUser>
>) => {
  if (!user) {
    return false;
  }

  return (
    hasApiRole(user, "EXTENSION") &&
    !hasApiRole(user, "OWNER")
  );
};

export async function GET(req: NextRequest) {
  const user = await getApiUser(req);

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const where = hasApiRole(user, "OWNER")
    ? {}
    : { unidadeId: user.unidadeId ?? -1 };

  const ramais = await prisma.ramal.findMany({
    where,
    include: { unidade: true },
    orderBy: { numero: "asc" },
  });

  return NextResponse.json(ramais);
}

export async function POST(req: NextRequest) {
  const user = await getApiUser(req);

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  if (!canManageRamais(user)) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 },
    );
  }

  const body = await req.json();

  let unidadeId: number | null = null;

  if (isUnitRestricted(user)) {
    if (!user.unidadeId) {
      return NextResponse.json(
        {
          error:
            "Usuário sem unidade vinculada.",
        },
        { status: 400 },
      );
    }

    unidadeId = user.unidadeId;
  } else {
    if (!body.unidadeId) {
      return NextResponse.json(
        {
          error:
            "unidadeId é obrigatório para owner.",
        },
        { status: 400 },
      );
    }

    unidadeId = Number(body.unidadeId);
  }

  const created = await prisma.ramal.create({
    data: {
      numero: body.numero,
      nome: body.nome,
      setor: body.setor,
      unidadeId,
    },
    include: { unidade: true },
  });

  return NextResponse.json(created, {
    status: 201,
  });
}

export async function PUT(req: NextRequest) {
  const user = await getApiUser(req);

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  if (!canManageRamais(user)) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 },
    );
  }

  const body = await req.json();

  if (isUnitRestricted(user)) {
    const ramal = await prisma.ramal.findUnique({
      where: { id: body.id },
    });

    if (
      !ramal ||
      ramal.unidadeId !== user.unidadeId
    ) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 },
      );
    }

    body.unidadeId = user.unidadeId;
  }

  const updated = await prisma.ramal.update({
    where: { id: body.id },
    data: {
      numero: body.numero,
      nome: body.nome,
      setor: body.setor,
      unidadeId: body.unidadeId,
    },
    include: { unidade: true },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const user = await getApiUser(req);

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  if (!canManageRamais(user)) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 },
    );
  }

  const { id } = await req.json();

  const ramal = await prisma.ramal.findUnique({
    where: { id },
  });

  if (!ramal) {
    return NextResponse.json(
      { error: "Not found" },
      { status: 404 },
    );
  }

  if (
    isUnitRestricted(user) &&
    ramal.unidadeId !== user.unidadeId
  ) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 },
    );
  }

  await prisma.ramal.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}