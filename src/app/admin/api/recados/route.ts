// src/app/admin/api/recados/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { auth } from "../../../../lib/auth";
import path from "path";
import { writeFile, rm } from "fs/promises";  // ✅ rm
import { existsSync } from "fs";

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
    const unidadeId = Number(formData.get("unidadeId"));
    const file = formData.get("imagem") as File;

    // Permissão
    if (user.role !== "OWNER" && user.unidadeId !== unidadeId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    let imagem = "";
    if (file && file.size > 0) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const extensao = file.name.split('.').pop();
      const nome = `recado-${Date.now()}-${Math.random().toString(36).slice(2)}.${extensao}`;
      
      const caminho = path.join(process.cwd(), "public", "uploads", "recados", nome);
      await writeFile(caminho, buffer);
      imagem = nome;
    }

    const recado = await prisma.recado.create({
      data: { titulo, conteudo, unidadeId, imagem },
      include: { unidade: { select: { nome: true } } }
    });

    return NextResponse.json(recado);
  } catch (e: any) {
    console.error("💥 POST Recados Error:", e.message);
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
    const unidadeId = Number(formData.get("unidadeId"));
    const file = formData.get("imagem") as File;
    const imagemAntiga = formData.get("imagemAntiga") as string;

    // Permissão
    if (user.role !== "OWNER" && user.unidadeId !== unidadeId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    let imagem = imagemAntiga;
    if (file && file.size > 0) {
      // Deletar antiga
      if (imagemAntiga) {
        const caminhoAntigo = path.join(process.cwd(), "public", "uploads", "recados", imagemAntiga);
        if (existsSync(caminhoAntigo)) await rm(caminhoAntigo);  // ✅ rm
      }
      
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const extensao = file.name.split('.').pop();
      const nome = `recado-${Date.now()}-${Math.random().toString(36).slice(2)}.${extensao}`;
      
      const caminho = path.join(process.cwd(), "public", "uploads", "recados", nome);
      await writeFile(caminho, buffer);
      imagem = nome;
    }

    const recado = await prisma.recado.update({
      where: { id },
      data: { titulo, conteudo, unidadeId, imagem },
      include: { unidade: { select: { nome: true } } }
    });

    return NextResponse.json(recado);
  } catch (e: any) {
    console.error("💥 PUT Recados Error:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}