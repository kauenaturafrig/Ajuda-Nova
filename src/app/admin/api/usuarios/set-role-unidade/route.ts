// src/app/admin/api/usuarios/set-role-unidade/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { auth } from "../../../../../lib/auth";

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

export async function POST(req: NextRequest) {
  try {
    const session = await requireOwner(req);
    if (!session) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { email, role, unidadeId } = await req.json();
    console.log("set-role-unidade body:", { email, role, unidadeId });

    if (!email || !role) {
      return NextResponse.json(
        { error: "Email e role são obrigatórios" },
        { status: 400 }
      );
    }

    const updated = await prisma.user.update({
      where: { email },
      data: {
        role,
        unidadeId: unidadeId ?? null, // garante null se vier undefined
      },
    });

    console.log("set-role-unidade updated:", updated);

    return NextResponse.json(updated);
  } catch (e) {
    console.error("Erro no POST /admin/api/usuarios/set-role-unidade:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

