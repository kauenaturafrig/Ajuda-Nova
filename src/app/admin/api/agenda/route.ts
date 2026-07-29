//src/app/admin/api/agenda/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

export const dynamic = "force-dynamic";

const canManage = (role?: string | null) =>
  role === "OWNER" || role === "EVENTS";

const serializeEvento = (ev: any) => ({
  ...ev,
  data: ev.data instanceof Date ? ev.data.toISOString() : ev.data,
  createdAt: ev.createdAt instanceof Date ? ev.createdAt.toISOString() : ev.createdAt,
  updatedAt: ev.updatedAt instanceof Date ? ev.updatedAt.toISOString() : ev.updatedAt,
});

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });

  const eventos = await prisma.agendaEvento.findMany({
    orderBy: { data: "asc" },
    include: { unidade: true },
  });

  const serialized = eventos.map(serializeEvento);

  if (!session) {
    return NextResponse.json({ eventos: serialized }, { status: 200 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, unidadeId: true, name: true },
  });

  return NextResponse.json(
    {
      eventos: serialized,
      user: dbUser
        ? {
            role: dbUser.role,
            unidadeId: dbUser.unidadeId,
            name: dbUser.name,
          }
        : null,
    },
    { status: 200 }
  );
}

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, name: true },
  });

  if (!dbUser || !canManage(dbUser.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();

  const evento = await prisma.agendaEvento.create({
    data: {
      titulo: body.titulo,
      descricao: body.descricao ?? null,
      data: new Date(body.data),
      unidadeId: Number(body.unidadeId),
      criadoPorId: session.user.id,
    },
  });

  // Busca unidade separadamente para o audit
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
      userId: session.user.id,
      userNome: dbUser.name ?? "Usuário",
      acao: "CREATE",
      dadosNovos: {
        titulo: evento.titulo,
        descricao: evento.descricao,
        data: evento.data,
        unidadeId: evento.unidadeId,
      },
    },
  });

  return NextResponse.json({ evento: serializeEvento(evento) }, { status: 201 });
}

export async function PUT(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, name: true },
  });

  if (!dbUser || !canManage(dbUser.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const id = Number(body.id);

  const before = await prisma.agendaEvento.findUnique({
    where: { id },
    include: { unidade: true },
  });
  if (!before) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const evento = await prisma.agendaEvento.update({
    where: { id },
    data: {
      titulo: body.titulo,
      descricao: body.descricao ?? null,
      data: new Date(body.data),
      unidadeId: Number(body.unidadeId),
      atualizadoPorId: session.user.id,
    },
    include: { unidade: true },
  });

  await prisma.agendaEventoAudit.create({
    data: {
      eventoId: evento.id,
      eventoTitulo: evento.titulo,
      unidadeId: evento.unidadeId,
      unidadeNome: evento.unidade?.nome ?? null,
      userId: session.user.id,
      userNome: dbUser.name ?? "Usuário",
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

  return NextResponse.json({ evento: serializeEvento(evento) }, { status: 200 });
}

export async function DELETE(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, name: true },
  });

  if (!dbUser || !canManage(dbUser.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id"));

  if (!id) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const before = await prisma.agendaEvento.findUnique({
    where: { id },
    include: { unidade: true },
  });
  if (!before) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.agendaEventoAudit.create({
    data: {
      eventoId: before.id,
      eventoTitulo: before.titulo,
      unidadeId: before.unidadeId,
      unidadeNome: before.unidade?.nome ?? null,
      userId: session.user.id,
      userNome: dbUser.name ?? "Usuário",
      acao: "DELETE",
      dadosAntigos: {
        titulo: before.titulo,
        descricao: before.descricao,
        data: before.data,
        unidadeId: before.unidadeId,
      },
    },
  });

  await prisma.agendaEvento.delete({ where: { id } });

  return NextResponse.json({ ok: true }, { status: 200 });
}