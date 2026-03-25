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
    const user = await requireAuth(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const titulo = formData.get("titulo") as string;
    const conteudo = formData.get("conteudo") as string;
    const imagemFile = formData.get("imagem") as File;

    const uploadDir = path.join(process.cwd(), "public", "uploads", "noticias");
    await fs.mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await imagemFile.arrayBuffer());
    const filename = `noticia-${Date.now()}-${crypto.randomUUID().slice(0, 8)}.jpg`;

    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    const stats = await fs.stat(filepath);
    console.log(`✅ Imagem salva: ${filename} (${stats.size} bytes)`);

    const noticia = await prisma.noticia.create({
      data: { titulo, conteudo, imagem: filename }
    });

    return NextResponse.json(noticia);
  } catch (e: any) {
    console.error("💥 POST Error:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const id = Number(formData.get("id"));
    const titulo = formData.get("titulo") as string;
    const conteudo = formData.get("conteudo") as string;
    const file = formData.get("imagem") as File;
    const imagemAntiga = formData.get("imagemAntiga") as string;

    let imagem = imagemAntiga;
    if (file && file.size > 0) {
      // Deletar antiga
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

    const noticia = await prisma.noticia.update({
      where: { id },
      data: { titulo, conteudo, imagem }
    });

    return NextResponse.json(noticia);
  } catch (e: any) {
    console.error("💥 PUT Error:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}