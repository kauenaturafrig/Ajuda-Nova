// src/app/admin/api/usuarios/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { auth } from "../../../../lib/auth";
import { hashPassword } from "better-auth/crypto"; // <- novo import [web:365]

export const dynamic = "force-dynamic";

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

// PUT /admin/api/usuarios -> editar nome/role/unidade
export async function PUT(req: NextRequest) {
  try {
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
  } catch (e) {
    console.error("Erro no PUT /admin/api/usuarios:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /admin/api/usuarios -> resetar senha manualmente
export async function POST(req: NextRequest) {
  try {
    const session = await requireOwner(req);
    if (!session) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { action, userId, newPassword } = await req.json();

    if (action !== "reset-senha") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json(
        { error: "Senha deve ter pelo menos 8 caracteres" },
        { status: 400 },
      );
    }

    // Usa o mesmo algoritmo/formato que o Better Auth espera
    const hashed = await hashPassword(newPassword); // scrypt em formato suportado [web:365][web:369]

    const result = await prisma.account.updateMany({
      where: {
        userId,
        providerId: "credential", // seu providerId real
      },
      data: {
        password: hashed,
      },
    });

    console.log("reset-senha updateMany result:", result);

    return NextResponse.json({ ok: true, updated: result.count });
  } catch (e) {
    console.error("Erro no POST /admin/api/usuarios (reset-senha):", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /admin/api/usuarios?id=USER_ID -> excluir usuário
export async function DELETE(req: NextRequest) {
  try {
    const session = await requireOwner(req);
    if (!session) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing user id" },
        { status: 400 },
      );
    }

    // apaga contas e sessões ligadas ao user, depois o user
    await prisma.$transaction([
      prisma.account.deleteMany({ where: { userId: id } }),
      prisma.session.deleteMany({ where: { userId: id } }),
      prisma.user.delete({ where: { id } }),
    ]); // [web:400][web:404]

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Erro no DELETE /admin/api/usuarios:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}