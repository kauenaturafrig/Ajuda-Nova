import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { auth } from "../../../../../lib/auth";
import { rm } from "fs/promises";
import path from "path";
import fs from "fs/promises";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const noticia = await prisma.noticia.findUnique({
      where: { id: Number(id) },
    });

    if (!noticia) {
      return NextResponse.json({ error: "Notícia não encontrada" }, { status: 404 });
    }

    await prisma.noticiaAudit.create({
      data: {
        noticiaId: noticia.id,
        userId: session.user.id,
        userNome: user.name || "Usuário",
        acao: "DELETE",
        dadosAntigos: {
          id: noticia.id,
          titulo: noticia.titulo,
          conteudo: noticia.conteudo,
          imagem: noticia.imagem,
        },
      },
    });

    if (noticia.imagem) {
      const caminho = path.join(
        process.cwd(),
        "storage",
        "uploads",
        "noticias",
        noticia.imagem
      );
      try {
        await fs.access(caminho);
        await rm(caminho);
      } catch {}
    }

    await prisma.noticia.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json(
      { success: true },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (e: any) {
    console.error("DELETE Error:", e.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}