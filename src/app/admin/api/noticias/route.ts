import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { auth } from "../../../../lib/auth";
import path from "path";
import { writeFile, mkdir } from "fs/promises";
import crypto from "crypto";
import fs from "fs/promises";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // ✅ Leitura pública: não exige mais sessão de login.
    // (Criação/edição continuam restritas a usuários autenticados via POST/PUT.)
    const noticias = await prisma.noticia.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(noticias, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (e: any) {
    console.error("GET Error:", e.message);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const titulo = formData.get("titulo") as string;
    const conteudo = formData.get("conteudo") as string;
    const imagemFile = formData.get("imagem") as File | null;

    let filename: string | null = null;

    if (imagemFile && imagemFile.size > 0) {
      const uploadDir = path.join(process.cwd(), "storage", "uploads", "noticias");
      await mkdir(uploadDir, { recursive: true });

      const buffer = Buffer.from(await imagemFile.arrayBuffer());
      const ext = imagemFile.name.split(".").pop() || "jpg";
      filename = `noticia-${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
      const filepath = path.join(uploadDir, filename);
      await writeFile(filepath, buffer);
    }

    const noticia = await prisma.noticia.create({
      data: { titulo, conteudo, imagem: filename },
    });

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
          imagem: noticia.imagem,
        },
      },
    });

    return NextResponse.json(noticia, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (e: any) {
    console.error("POST Error:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const id = Number(formData.get("id"));
    const titulo = formData.get("titulo") as string;
    const conteudo = formData.get("conteudo") as string;
    const file = formData.get("imagem") as File | null;
    const imagemAntiga = formData.get("imagemAntiga") as string;

    const noticiaAntes = await prisma.noticia.findUnique({ where: { id } });
    if (!noticiaAntes) {
      return NextResponse.json({ error: "Notícia não encontrada" }, { status: 404 });
    }

    let imagem = imagemAntiga;

    if (file && file.size > 0) {
      if (imagemAntiga) {
        const oldPath = path.join(process.cwd(), "storage", "uploads", "noticias", imagemAntiga);
        try {
          await fs.unlink(oldPath);
        } catch {}
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const ext = file.name.split(".").pop() || "jpg";
      const nome = `noticia-${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
      const caminho = path.join(process.cwd(), "storage", "uploads", "noticias", nome);
      await mkdir(path.dirname(caminho), { recursive: true });
      await writeFile(caminho, buffer);
      imagem = nome;
    }

    const noticiaDepois = await prisma.noticia.update({
      where: { id },
      data: { titulo, conteudo, imagem: imagem || null },
    });

    await prisma.noticiaAudit.create({
      data: {
        noticiaId: id,
        userId: session.user.id,
        userNome: user.name || "Usuário",
        acao: "UPDATE",
        dadosAntigos: {
          titulo: noticiaAntes.titulo,
          conteudo: noticiaAntes.conteudo,
          imagem: noticiaAntes.imagem,
        },
        dadosNovos: {
          titulo: noticiaDepois.titulo,
          conteudo: noticiaDepois.conteudo,
          imagem: noticiaDepois.imagem,
        },
      },
    });

    return NextResponse.json(noticiaDepois, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (e: any) {
    console.error("PUT Error:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}