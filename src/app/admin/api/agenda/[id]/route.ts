//src/app/admin/api/agenda/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

export const dynamic = "force-dynamic";

const noCacheHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

const canManage = (role?: string | null) => role === "OWNER" || role === "EVENTS";

async function requireUser(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user?.id) return null;

  return prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true, name: true },
  });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!canManage(user.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const eventoId = Number(id);
    if (!eventoId) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const evento = await prisma.agendaEvento.findUnique({
      where: { id: eventoId },
      include: { unidade: true },
    });

    if (!evento) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json(
      {
        ...evento,
        data: evento.data.toISOString(),
        createdAt: evento.createdAt.toISOString(),
        updatedAt: evento.updatedAt.toISOString(),
      },
      { headers: noCacheHeaders }
    );
  } catch (e: any) {
    console.error("GET agenda/[id] Error:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!canManage(user.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const eventoId = Number(id);
    if (!eventoId) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const body = await req.json();

    const before = await prisma.agendaEvento.findUnique({
      where: { id: eventoId },
      include: { unidade: true },
    });
    if (!before) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const evento = await prisma.agendaEvento.update({
      where: { id: eventoId },
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
      {
        ...evento,
        data: evento.data.toISOString(),
        createdAt: evento.createdAt.toISOString(),
        updatedAt: evento.updatedAt.toISOString(),
      },
      { headers: noCacheHeaders }
    );
  } catch (e: any) {
    console.error("PUT agenda/[id] Error:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!canManage(user.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { id } = await params;
    const eventoId = Number(id);
    if (!eventoId) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const before = await prisma.agendaEvento.findUnique({
      where: { id: eventoId },
      include: { unidade: true },
    });
    if (!before) return NextResponse.json({ error: "Not found" }, { status: 404 });

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

    await prisma.agendaEvento.delete({ where: { id: eventoId } });

    return NextResponse.json({ ok: true }, { headers: noCacheHeaders });
  } catch (e: any) {
    console.error("DELETE agenda/[id] Error:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}