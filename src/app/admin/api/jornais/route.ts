// src/app/admin/api/jornais/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { auth } from "../../../../lib/auth";
import path from "path";
import { writeFile } from "fs/promises";
import fs from "fs/promises";

export const dynamic = "force-dynamic";

// ✅ EXATAMENTE IGUAL aos usuários
async function requireOwner(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || user.role !== "OWNER") return null;
  return session;
}

export async function GET() {
  const jornais = await prisma.jornal.findMany({
    orderBy: { dataLancamento: "desc" }
  });
  return NextResponse.json(jornais);
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireOwner(req);
    if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const formData = await req.formData();
    const titulo = formData.get("titulo") as string;
    const descricao = formData.get("descricao") as string;
    const url = formData.get("url") as string;
    const imagemFile = formData.get("imagem") as File;

    if (!titulo || !url || !imagemFile) {
      return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
    }

    // ✅ VERIFICAÇÃO CROSS-PLATFORM
    const uploadDir = path.join(process.cwd(), "public", "uploads", "jornais");
    await fs.mkdir(uploadDir, { recursive: true }); // ✅ Cria pasta se não existe

    const buffer = Buffer.from(await imagemFile.arrayBuffer());
    const filename = `jornal-${Date.now()}-${crypto.randomUUID().slice(0,8)}.jpg`; // ✅ UUID único
    const filepath = path.join(uploadDir, filename);

    await writeFile(filepath, buffer);

    // ✅ Verifica se salvou
    const stats = await fs.stat(filepath);
    console.log(`✅ Imagem salva: ${filename} (${stats.size} bytes)`);

    const jornal = await prisma.jornal.create({
      data: { titulo, descricao: descricao, imagem: filename, url }
    });

    return NextResponse.json(jornal);
  } catch (e) {
    console.error("Erro POST jornais:", e);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}


export async function PUT(req: NextRequest) {
  try {
    const session = await requireOwner(req);
    if (!session) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await req.formData();
    const id = Number(formData.get("id"));
    const titulo = formData.get("titulo") as string;
    const descricao = formData.get("descricao") as string;
    const url = formData.get("url") as string;
    const imagemFile = formData.get("imagem") as File;

    // ✅ BUSCA JORNAL ANTIGO
    const jornalAntigo = await prisma.jornal.findUnique({ 
      where: { id },
      select: { imagem: true }
    });

    const updateData: any = { 
      titulo, 
      descricao: descricao || null, 
      url 
    };

    // ✅ NOVA IMAGEM → DELETA ANTIGA + SALVA NOVA
    if (imagemFile && imagemFile.size > 0) {
      // 1. Deleta imagem antiga
      if (jornalAntigo?.imagem) {
        const oldPath = path.join(process.cwd(), "public", "uploads", "jornais", jornalAntigo.imagem);
        try {
          await fs.unlink(oldPath);
          console.log(`🗑️ Deletada: ${jornalAntigo.imagem}`);
        } catch (err) {
          console.warn("Imagem antiga não encontrada:", err);
        }
      }

      // 2. Salva nova (igual POST)
      const uploadDir = path.join(process.cwd(), "public", "uploads", "jornais");
      await fs.mkdir(uploadDir, { recursive: true });
      
      const buffer = Buffer.from(await imagemFile.arrayBuffer());
      const filename = `jornal-${Date.now()}-${crypto.randomUUID().slice(0,8)}.jpg`;
      const filepath = path.join(uploadDir, filename);
      await writeFile(filepath, buffer);
      
      updateData.imagem = filename;
      console.log(`✅ Nova imagem: ${filename}`);
    }

    const jornal = await prisma.jornal.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(jornal);
  } catch (e) {
    console.error("Erro PUT jornais:", e);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

