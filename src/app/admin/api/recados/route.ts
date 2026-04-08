// src/app/admin/api/recados/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { auth } from "../../../../lib/auth";
import path from "path";
import { writeFile, rm } from "fs/promises";  // ✅ rm
import { existsSync } from "fs";
import fs from "fs/promises";

export const dynamic = "force-dynamic";

async function requireAuth(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, unidadeId: true }
  });
  return user;
}

export async function GET(req: NextRequest) {
  console.log("📡 GET /admin/api/recados");
  try {
    const user = await requireAuth(req);
    if (!user) {
      console.log("🚫 401 UNAUTHORIZED recados");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const recados = await prisma.recado.findMany({
      orderBy: { createdAt: "desc" },
      include: { unidade: { select: { nome: true } } }
    });

    console.log(`✅ ${recados.length} recados`);
    return NextResponse.json(recados);
  } catch (e: any) {
    console.error("💥 GET Recados Error:", e.message);
    return NextResponse.json([], { status: 200 });  // ✅ Array vazio
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const titulo = formData.get("titulo") as string;
    const conteudo = formData.get("conteudo") as string;
    
    // ✅ Suporte múltiplas unidades
    const unidadeIdsRaw = formData.getAll("unidadeIds[]") as string[];
    const unidadeIds = unidadeIdsRaw.map(id => Number(id)).filter(id => !isNaN(id));

    if (!titulo || !conteudo || unidadeIds.length === 0) {
      return NextResponse.json({ error: "Título, conteúdo e unidades obrigatórios" }, { status: 400 });
    }

    let imagem = null;
    const imagemFile = formData.get("imagem") as File | null;
    
    // ✅ Imagem OPCIONAL - só processa se existir
    if (imagemFile && imagemFile.size > 0) {
      const uploadDir = path.join(process.cwd(), "public", "uploads", "recados");
      await fs.mkdir(uploadDir, { recursive: true });

      // ✅ VERIFICAÇÃO CRÍTICA: file não é null
      if (!imagemFile || !(imagemFile instanceof File)) {
        return NextResponse.json({ error: "Arquivo inválido" }, { status: 400 });
      }

      const buffer = Buffer.from(await imagemFile.arrayBuffer());
      const filename = `recado-${Date.now()}-${crypto.randomUUID().slice(0, 8)}.jpg`;
      const filepath = path.join(uploadDir, filename);
      await writeFile(filepath, buffer);
      imagem = filename;

      console.log(`✅ Imagem salva: ${filename}`);
    }

    // ✅ Cria recado (imagem opcional)
    const recado = await prisma.recado.create({
      data: { 
        titulo, 
        conteudo, 
        unidadeId: unidadeIds[0], // primeira unidade como principal
        imagem 
      },
      include: { unidade: { select: { nome: true } } }
    });

    console.log(`✅ Recado criado: ${titulo}`);
    return NextResponse.json(recado);
  } catch (e: any) {
    console.error("💥 POST Recados Error:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// ✅ PUT similar (corrigido)
export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const id = Number(formData.get("id"));
    const titulo = formData.get("titulo") as string;
    const conteudo = formData.get("conteudo") as string;
    const unidadeIdsRaw = formData.getAll("unidadeIds[]") as string[];
    const unidadeIds = unidadeIdsRaw.map(id => Number(id)).filter(id => !isNaN(id));
    const imagemAntiga = formData.get("imagemAntiga") as string;

    if (!titulo || !conteudo || unidadeIds.length === 0) {
      return NextResponse.json({ error: "Dados obrigatórios faltando" }, { status: 400 });
    }

    let imagem = imagemAntiga;
    const file = formData.get("imagem") as File | null;
    
    if (file && file.size > 0) {
      if (imagemAntiga) {
        const caminhoAntigo = path.join(process.cwd(), "public", "uploads", "recados", imagemAntiga);
        if (existsSync(caminhoAntigo)) await rm(caminhoAntigo);
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const extensao = file.name.split('.').pop();
      const nome = `recado-${Date.now()}-${Math.random().toString(36).slice(2)}.${extensao}`;
      const caminho = path.join(process.cwd(), "public", "uploads", "recados", nome);
      await writeFile(caminho, buffer);
      imagem = nome;
    }

    const recado = await prisma.recado.update({
      where: { id },
      data: { titulo, conteudo, unidadeId: unidadeIds[0], imagem },
      include: { unidade: { select: { nome: true } } }
    });

    return NextResponse.json(recado);
  } catch (e: any) {
    console.error("💥 PUT Recados Error:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}