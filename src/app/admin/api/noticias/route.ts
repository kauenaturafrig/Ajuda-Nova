//src/app/admin/api/noticias/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { auth } from "../../../../lib/auth";
import path from "path";
import { writeFile, rm, mkdir } from "fs/promises";
import fs from "fs/promises";
import crypto from "crypto";

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

async function logAudit(
  noticiaId: number,
  userId: string,
  userNome: string,
  acao: string,
  dadosAntigos: any = null,
  dadosNovos: any = null
) {
  await prisma.noticiaAudit.create({
    data: {
      noticiaId,
      userId,
      userNome,
      acao,
      dadosAntigos: dadosAntigos ? JSON.parse(JSON.stringify(dadosAntigos)) : null,
      dadosNovos: dadosNovos ? JSON.parse(JSON.stringify(dadosNovos)) : null,
    },
  });
}

export async function GET(req: NextRequest) {
  try {
    const noticias = await prisma.noticia.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(noticias, { headers: noCacheHeaders });
  } catch (e: any) {
    console.error("GET Error:", e.message);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!["OWNER", "MESSAGENEWS"].includes(user.role)) {
      return NextResponse.json(
        { error: "⛔ Apenas OWNER ou MESSAGENEWS podem criar notícias diretamente." },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const titulo = formData.get("titulo") as string;
    const conteudo = formData.get("conteudo") as string;
    const imagemFile = formData.get("imagem") as File | null;

    if (!titulo || !conteudo) {
      return NextResponse.json({ error: "Dados obrigatórios" }, { status: 400 });
    }

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

    await logAudit(noticia.id, user.id, user.name || "Usuário", "CREATE", null, {
      id: noticia.id,
      titulo: noticia.titulo,
      conteudo: noticia.conteudo,
      imagem: noticia.imagem,
    });

    return NextResponse.json(noticia, { headers: noCacheHeaders });
  } catch (e: any) {
    console.error("POST Error:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!["OWNER", "MESSAGENEWS"].includes(user.role)) {
      return NextResponse.json(
        { error: "⛔ Apenas OWNER ou MESSAGENEWS podem editar notícias diretamente." },
        { status: 403 }
      );
    }

    const formData = await req.formData();
    const id = Number(formData.get("id"));
    const titulo = formData.get("titulo") as string;
    const conteudo = formData.get("conteudo") as string;
    const file = formData.get("imagem") as File | null;
    const imagemAntiga = (formData.get("imagemAntiga") as string) || null;

    if (!id || !titulo || !conteudo) {
      return NextResponse.json({ error: "Dados obrigatórios" }, { status: 400 });
    }

    const noticiaAntes = await prisma.noticia.findUnique({ where: { id } });
    if (!noticiaAntes) {
      return NextResponse.json({ error: "Notícia não encontrada" }, { status: 404 });
    }

    let imagem = imagemAntiga;

    if (file && file.size > 0) {
      if (imagemAntiga) {
        const oldPath = path.join(process.cwd(), "storage", "uploads", "noticias", imagemAntiga);
        try {
          await fs.access(oldPath);
          await rm(oldPath);
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

    await logAudit(
      noticiaDepois.id,
      user.id,
      user.name || "Usuário",
      "UPDATE",
      {
        titulo: noticiaAntes.titulo,
        conteudo: noticiaAntes.conteudo,
        imagem: noticiaAntes.imagem,
      },
      {
        titulo: noticiaDepois.titulo,
        conteudo: noticiaDepois.conteudo,
        imagem: noticiaDepois.imagem,
      }
    );

    return NextResponse.json(noticiaDepois, { headers: noCacheHeaders });
  } catch (e: any) {
    console.error("PUT Error:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}