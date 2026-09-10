//src/app/admin/api/agenda/route.ts
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/src/lib/prisma";
import {
  getApiUser,
  hasApiRole,
} from "@/src/lib/api-permissions";

export const dynamic = "force-dynamic";

const canManage = (user: ReturnType<
  typeof getApiUser
> extends Promise<infer U>
  ? U
  : never) => {
  if (!user) {
    return false;
  }

  return (
    hasApiRole(user, "OWNER") ||
    hasApiRole(user, "EVENTS")
  );
};

const serializeEvento = (ev: any) => ({
  ...ev,
  data:
    ev.data instanceof Date
      ? ev.data.toISOString()
      : ev.data,
  createdAt:
    ev.createdAt instanceof Date
      ? ev.createdAt.toISOString()
      : ev.createdAt,
  updatedAt:
    ev.updatedAt instanceof Date
      ? ev.updatedAt.toISOString()
      : ev.updatedAt,
});

export async function GET(req: NextRequest) {
  const user = await getApiUser(req);

  const eventos = await prisma.agendaEvento.findMany({
    orderBy: { data: "asc" },
    include: { unidade: true },
  });

  const serialized = eventos.map(
    serializeEvento,
  );

  if (!user) {
    return NextResponse.json(
      { eventos: serialized },
      { status: 200 },
    );
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      unidadeId: true,
      name: true,
    },
  });

  return NextResponse.json(
    {
      eventos: serialized,
      user: dbUser
        ? {
            id: dbUser.id,
            unidadeId: dbUser.unidadeId,
            name: dbUser.name,
          }
        : null,
    },
    { status: 200 },
  );
}

export async function POST(req: NextRequest) {
  const user = await getApiUser(req);

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  if (!canManage(user)) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 },
    );
  }

  const body = await req.json();

  const evento = await prisma.agendaEvento.create({
    data: {
      titulo: body.titulo,
      descricao: body.descricao ?? null,
      data: new Date(body.data),
      unidadeId: Number(body.unidadeId),
      criadoPorId: user.id,
    },
  });

  const unidade = await prisma.unidade.findUnique({
    where: { id: Number(body.unidadeId) },
    select: { nome: true },
  });

  await prisma.agendaEventoAudit.create({
    data: {
      eventoId: evento.id,
      eventoTitulo: evento.titulo,
      unidadeId: evento.unidadeId,
      unidadeNome: unidade?.nome ?? null,
      userId: user.id,
      userNome: user.name ?? "Usuário",
      acao: "CREATE",
      dadosNovos: {
        titulo: evento.titulo,
        descricao: evento.descricao,
        data: evento.data,
        unidadeId: evento.unidadeId,
      },
    },
  });

  return NextResponse.json(
    { evento: serializeEvento(evento) },
    { status: 201 },
  );
}

export async function PUT(req: NextRequest) {
  const user = await getApiUser(req);

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  if (!canManage(user)) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 },
    );
  }

  const body = await req.json();
  const id = Number(body.id);

  const before = await prisma.agendaEvento.findUnique({
    where: { id },
    include: { unidade: true },
  });

  if (!before) {
    return NextResponse.json(
      { error: "Not found" },
      { status: 404 },
    );
  }

  const evento = await prisma.agendaEvento.update({
    where: { id },
    data: {
      titulo: body.titulo,
      descricao: body.descricao ?? null,
      data: new Date(body.data),
      unidadeId: Number(body.unidadeId),
      atualizadoPorId: user.id,
    },
    include: { unidade: true },
  });

  await prisma.agendaEventoAudit.create({
    data: {
      eventoId: evento.id,
      eventoTitulo: evento.titulo,
      unidadeId: evento.unidadeId,
      unidadeNome: evento.unidade?.nome ?? null,
      userId: user.id,
      userNome: user.name ?? "Usuário",
      acao: "UPDATE",
      dadosAntigos: {
        titulo: before.titulo,
        descricao: before.descricao,
        data: before.data,
        unidadeId: before.unidadeId,
      },
      dadosNovos: {
        titulo: evento.titulo,
        descricao: evento.descricao,
        data: evento.data,
        unidadeId: evento.unidadeId,
      },
    },
  });

  return NextResponse.json(
    { evento: serializeEvento(evento) },
    { status: 200 },
  );
}

export async function DELETE(req: NextRequest) {
  const user = await getApiUser(req);

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  if (!canManage(user)) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));

  if (!id) {
    return NextResponse.json(
      { error: "Invalid id" },
      { status: 400 },
    );
  }

  const before = await prisma.agendaEvento.findUnique({
    where: { id },
    include: { unidade: true },
  });

  if (!before) {
    return NextResponse.json(
      { error: "Not found" },
      { status: 404 },
    );
  }

  await prisma.agendaEventoAudit.create({
    data: {
      eventoId: before.id,
      eventoTitulo: before.titulo,
      unidadeId: before.unidadeId,
      unidadeNome: before.unidade?.nome ?? null,
      userId: user.id,
      userNome: user.name ?? "Usuário",
      acao: "DELETE",
      dadosAntigos: {
        titulo: before.titulo,
        descricao: before.descricao,
        data: before.data,
        unidadeId: before.unidadeId,
      },
    },
  });

  await prisma.agendaEvento.delete({
    where: { id },
  });

  return NextResponse.json(
    { ok: true },
    { status: 200 },
  );
}