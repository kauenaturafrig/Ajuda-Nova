// src/app/admin/api/emails/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { auth } from "../../../../lib/auth";

export const dynamic = "force-dynamic";

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

  const emails = await prisma.email.findMany({
    where,
    include: { unidade: true },
    orderBy: { unidadeId: "asc" },
  });

  return NextResponse.json(emails);
}

export async function POST(req: NextRequest) {
  const user = await getUserFromReq(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json(); // { email, nome, setor, unidadeId? }

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

  const created = await prisma.email.create({
    data: {
      email: body.email,
      nome: body.nome,
      setor: body.setor,
      unidadeId,
    },
    include: { unidade: true },
  });

  return NextResponse.json(created, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const user = await getUserFromReq(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json(); // { id, email, nome, setor, unidadeId }

  if (user.role === "ADMIN") {
    const email = await prisma.email.findUnique({ where: { id: body.id } });
    if (!email || email.unidadeId !== user.unidadeId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    body.unidadeId = user.unidadeId;
  }

  const updated = await prisma.email.update({
    where: { id: body.id },
    data: {
      email: body.email,
      nome: body.nome,
      setor: body.setor,
      unidadeId: body.unidadeId,
    },
    include: { unidade: true },
  });

  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  const user = await getUserFromReq(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json(); // { id }

  const email = await prisma.email.findUnique({ where: { id } });
  if (!email) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (user.role === "ADMIN" && email.unidadeId !== user.unidadeId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.email.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}