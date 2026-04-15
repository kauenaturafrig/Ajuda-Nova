// app/admin/api/noticias/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { auth } from "../../../../../lib/auth";
import { rm } from "fs/promises";  // ✅ rm
import { existsSync } from "fs";
import path from "path";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    const { id } = await params;

    // ✅ PEGAR DADOS ANTES da exclusão
    const noticia = await prisma.noticia.findUnique({ where: { id: Number(id) } });
    if (!noticia) return NextResponse.json({ error: "Notícia não encontrada" }, { status: 404 });

    // ✅ AUDIT ANTES da exclusão
    await prisma.noticiaAudit.create({
      data: {
        noticiaId: noticia.id,
        userId: session.user.id,
        userNome: user!.name || "Usuário",
        acao: "DELETE",
        dadosAntigos: {
          id: noticia.id,
          titulo: noticia.titulo,
          conteudo: noticia.conteudo,
          imagem: noticia.imagem
        }
      }
    });

    // ✅ DELETAR IMAGEM
    if (noticia.imagem) {
      const caminho = path.join(process.cwd(), "public", "uploads", "noticias", noticia.imagem);
      if (existsSync(caminho)) await rm(caminho);
    }

    // ✅ DELETAR NOTÍCIA
    await prisma.noticia.delete({ where: { id: Number(id) } });

    console.log(`✅ Notícia ${id} excluída + AUDIT`);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("💥 DELETE Error:", e.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}