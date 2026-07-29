// src/app/admin/api/recados/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { auth } from "../../../../../lib/auth";
import { rm } from "fs/promises";
import path from "path";
import fs from "fs/promises";

export const dynamic = "force-dynamic";

const noCacheHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

async function requireAuth(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true, unidadeId: true, name: true },
  });
  return user;
}

async function apagarArquivo(nome?: string | null) {
  if (!nome) return;
  const p = path.join(process.cwd(), "storage", "uploads", "recados", nome);
  try {
    await fs.access(p);
    await rm(p);
  } catch {}
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const recadoId = Number(id);

    const recado = await prisma.recado.findUnique({
      where: { id: recadoId },
      include: { unidades: true },
    });

    if (!recado) {
      return NextResponse.json({ error: "Recado não encontrado" }, { status: 404 });
    }

    const recadoUnidadeIds = recado.unidades.map((u) => u.unidadeId);
    const ehMultiUnidade = recadoUnidadeIds.length > 1;

    if ((user.role === "ADMIN" || user.role === "MESSAGEONLY") && ehMultiUnidade) {
      return NextResponse.json(
        { error: "⛔ Apenas OWNER ou MESSAGENEWS podem excluir recados multi-unidade" },
        { status: 403 }
      );
    }

    await prisma.recadoAudit.create({
      data: {
        recadoId,
        userId: user.id,
        userNome: user.name || "Desconhecido",
        acao: "DELETE",
        dadosAntigos: {
          titulo: recado.titulo,
          conteudo: recado.conteudo,
          unidadeIds: recadoUnidadeIds,
          imagem: recado.imagem,
        },
      },
    });

    await apagarArquivo(recado.imagem);
    await prisma.recado.delete({ where: { id: recadoId } });

    return NextResponse.json(
      { success: true },
      { headers: noCacheHeaders }
    );
  } catch (e: any) {
    console.error("DELETE Error:", e.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}