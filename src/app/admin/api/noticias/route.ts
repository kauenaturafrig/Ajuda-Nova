//src/app/admin/api/noticias/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { auth } from "../../../../lib/auth";
import path from "path";
import { writeFile, rm } from "fs/promises";  // ✅ rm ao invés unlink
import { existsSync } from "fs";
import fs from "fs/promises";

export const dynamic = "force-dynamic";

async function requireAuth(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  });
  return user;
}

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const noticias = await prisma.noticia.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(noticias);
  } catch (e: any) {
    console.error("💥 GET Error:", e.message);
    return NextResponse.json([], { status: 200 });  // ✅ Array vazio em erro
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const titulo = formData.get("titulo") as string;
    const conteudo = formData.get("conteudo") as string;
    const imagemFile = formData.get("imagem") as File | null;

    let filename: string | null = null;
    if (imagemFile && imagemFile.size > 0) {
      const uploadDir = path.join(process.cwd(), "public", "uploads", "noticias");
      await fs.mkdir(uploadDir, { recursive: true });

      const buffer = Buffer.from(await imagemFile.arrayBuffer());
      filename = `noticia-${Date.now()}-${crypto.randomUUID().slice(0, 8)}.jpg`;
      const filepath = path.join(uploadDir, filename);
      await writeFile(filepath, buffer);
    }

    // ✅ CRIAR NOTÍCIA
    const noticia = await prisma.noticia.create({
      data: { titulo, conteudo, imagem: filename }
    });

    // ✅ CRIAR AUDIT
    await prisma.noticiaAudit.create({
      data: {
        noticiaId: noticia.id,
        userId: session.user.id,
        userNome: user.name || "Usuário",
        acao: "CREATE",
        dadosNovos: {
          id: noticia.id,
          titulo: noticia.titulo,
          conteudo: noticia.conteudo,
          imagem: noticia.imagem
        }
      }
    });

    console.log(`✅ Notícia ${noticia.id} criada + AUDIT`);
    return NextResponse.json(noticia);
  } catch (e: any) {
    console.error("💥 POST Error:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    const formData = await req.formData();
    const id = Number(formData.get("id"));
    const titulo = formData.get("titulo") as string;
    const conteudo = formData.get("conteudo") as string;
    const file = formData.get("imagem") as File | null;
    const imagemAntiga = formData.get("imagemAntiga") as string;

    // ✅ PEGAR DADOS ANTES da atualização
    const noticiaAntes = await prisma.noticia.findUnique({ where: { id } });
    if (!noticiaAntes) return NextResponse.json({ error: "Notícia não encontrada" }, { status: 404 });

    let imagem = imagemAntiga;
    if (file && file.size > 0) {
      if (imagemAntiga && existsSync(path.join(process.cwd(), "public", "uploads", "noticias", imagemAntiga))) {
        await rm(path.join(process.cwd(), "public", "uploads", "noticias", imagemAntiga));
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const extensao = file.name.split('.').pop();
      const nome = `noticia-${Date.now()}-${Math.random().toString(36).slice(2)}.${extensao}`;
      const caminho = path.join(process.cwd(), "public", "uploads", "noticias", nome);
      await writeFile(caminho, buffer);
      imagem = nome;
    }

    // ✅ ATUALIZAR NOTÍCIA
    const noticiaDepois = await prisma.noticia.update({
      where: { id },
      data: { titulo, conteudo, imagem: imagem || null }
    });

    // ✅ CRIAR AUDIT UPDATE
    await prisma.noticiaAudit.create({
      data: {
        noticiaId: id,
        userId: session.user.id,
        userNome: user!.name || "Usuário",
        acao: "UPDATE",
        dadosAntigos: {
          titulo: noticiaAntes.titulo,
          conteudo: noticiaAntes.conteudo,
          imagem: noticiaAntes.imagem
        },
        dadosNovos: {
          titulo: noticiaDepois.titulo,
          conteudo: noticiaDepois.conteudo,
          imagem: noticiaDepois.imagem
        }
      }
    });

    console.log(`✅ Notícia ${id} atualizada + AUDIT`);
    return NextResponse.json(noticiaDepois);
  } catch (e: any) {
    console.error("💥 PUT Error:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}