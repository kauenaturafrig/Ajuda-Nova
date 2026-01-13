// src/app/admin/api/ramais/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { auth } from "../../../../lib/auth";

async function getUserFromReq(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, unidadeId: true },
  });

  return user;
}

export async function GET(req: NextRequest) {
  const user = await getUserFromReq(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const where =
    user.role === "OWNER" ? {} : { unidadeId: user.unidadeId ?? -1 };

  const ramais = await prisma.ramal.findMany({
    where,
    include: { unidade: true },
    orderBy: { numero: "asc" },
  });

  return NextResponse.json(ramais);
}

export async function POST(req: NextRequest) {
  const user = await getUserFromReq(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json(); // { numero, nome, setor, unidadeId? }

  let unidadeId: number | null = null;

  if (user.role === "ADMIN") {
    // admin só pode criar na própria unidade
    if (!user.unidadeId) {
      return NextResponse.json(
        { error: "Admin sem unidade vinculada" },
        { status: 400 }
      );
    }
    unidadeId = user.unidadeId;
  } else {
    // OWNER: usa o que veio do body
    if (!body.unidadeId) {
      return NextResponse.json(
        { error: "unidadeId é obrigatório para owner" },
        { status: 400 }
      );
    }
    unidadeId = Number(body.unidadeId);
  }

  const created = await prisma.ramal.create({
    data: {
      numero: body.numero,
      nome: body.nome,
      setor: body.setor,
      unidadeId, // aqui sempre tem um Int
      // NÃO passar `unidade: { ... }`
    },
  });

  return NextResponse.json(created, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const user = await getUserFromReq(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json(); // { id, numero, nome, setor, unidadeId }

  if (user.role === "ADMIN") {
    const ramal = await prisma.ramal.findUnique({ where: { id: body.id } });
    if (!ramal || ramal.unidadeId !== user.unidadeId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const user = await getUserFromReq(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json(); // { id }

  const ramal = await prisma.ramal.findUnique({ where: { id } });
  if (!ramal) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (user.role === "ADMIN" && ramal.unidadeId !== user.unidadeId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.ramal.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}