// src/app/admin/api/jornais/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { auth } from "../../../../../lib/auth";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

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

export async function DELETE(
  req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }  // ✅ Next.js 15: Promise<{ id: string }>
) {
  try {
    const session = await requireOwner(req);
    if (!session) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // ✅ Next.js 15: AWAIT params!
    const { id } = await params;  // ← MUDANÇA AQUI!
    const jornalId = Number(id);

    // ✅ Verifica se ID válido
    if (isNaN(jornalId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const jornal = await prisma.jornal.findUnique({ where: { id: jornalId } });

    // ✅ Deleta imagem do disco
    if (jornal?.imagem) {
      const filepath = path.join(process.cwd(), "public", "uploads", "jornais", jornal.imagem);
      try {
        await fs.unlink(filepath);
        console.log(`🗑️ Deletada imagem: ${jornal.imagem}`);
      } catch (err) {
        console.warn("Imagem não encontrada:", err);
      }
    }

    // ✅ Deleta do banco
    await prisma.jornal.delete({ where: { id: jornalId } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Erro DELETE jornais:", e);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}