//src/app/admin/api/noticias/[id]/route.ts
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
  const p = path.join(process.cwd(), "storage", "uploads", "noticias", nome);
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
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!["OWNER", "MESSAGENEWS"].includes(user.role)) {
      return NextResponse.json(
        { error: "⛔ Apenas OWNER ou MESSAGENEWS podem excluir notícias diretamente." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const noticiaId = Number(id);

    const noticia = await prisma.noticia.findUnique({
      where: { id: noticiaId },
    });

    if (!noticia) {
      return NextResponse.json({ error: "Notícia não encontrada" }, { status: 404 });
    }

    await prisma.noticiaAudit.create({
      data: {
        noticiaId,
        userId: user.id,
        userNome: user.name || "Usuário",
        acao: "DELETE",
        dadosAntigos: {
          titulo: noticia.titulo,
          conteudo: noticia.conteudo,
          imagem: noticia.imagem,
        },
      },
    });

    await apagarArquivo(noticia.imagem);
    await prisma.noticia.delete({
      where: { id: noticiaId },
    });

    return NextResponse.json(
      { success: true },
      { headers: noCacheHeaders }
    );
  } catch (e: any) {
    console.error("DELETE Error:", e.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}