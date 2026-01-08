// src/app/admin/api/usuarios/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { auth } from "../../../../lib/auth";

// só OWNER pode mexer
async function requireOwner(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || user.role !== "OWNER") return null;
  return session;
}

// PUT /admin/api/usuarios  -> editar nome/role/unidade
export async function PUT(req: NextRequest) {
  const session = await requireOwner(req);
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json(); // { id, name, role, unidadeId }

  const updated = await prisma.user.update({
    where: { id: body.id },
    data: {
      name: body.name,
      role: body.role,
      unidadeId: body.unidadeId,
    },
  });

  return NextResponse.json(updated);
}

// POST /admin/api/usuarios/reset-senha  -> resetar senha manualmente
export async function POST(req: NextRequest) {
  const url = new URL(req.url);

  // só trata reset-senha aqui
  if (!url.pathname.endsWith("/reset-senha")) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const session = await requireOwner(req);
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { userId, newPassword } = await req.json();

  if (!newPassword || newPassword.length < 8) {
    return NextResponse.json(
      { error: "Senha deve ter pelo menos 8 caracteres" },
      { status: 400 }
    );
  }

  // usa o helper interno de hash do Better Auth
  const ctx = await auth.$context(); // <- aqui sim é só "await", sem chamar como função

  const hashed = await ctx.password.hash(newPassword);

  // atualiza TODAS as contas de email/password desse usuário
  await prisma.account.updateMany({
    where: {
      userId,
      providerId: "email", // ajuste se estiver usando outro providerId
    },
    data: {
      password: hashed,
    },
  });

  return NextResponse.json({ ok: true });
}
