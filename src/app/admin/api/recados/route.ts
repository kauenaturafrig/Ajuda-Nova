// src/app/admin/api/recados/route.ts

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
  recadoId: number,
  userId: string,
  userNome: string,
  acao: string,
  dadosAntigos: any = null,
  dadosNovos: any = null
) {
  await prisma.recadoAudit.create({
    data: {
      recadoId,
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
    const user = await requireAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const recadosWhere =
      user.role === "OWNER" || user.role === "MESSAGENEWS"
        ? {}
        : { unidadeId: user.unidadeId! };

    const recados = await prisma.recado.findMany({
      where: recadosWhere,
      orderBy: { createdAt: "desc" },
      include: {
        unidade: { select: { id: true, nome: true } },
        unidades: {
          include: {
            unidade: { select: { id: true, nome: true } },
          },
        },
      },
    });

    const formatted = recados.map((r) => ({
      ...r,
      unidadeIds: r.unidades.map((u) => u.unidadeId),
    }));

    return NextResponse.json(formatted, { headers: noCacheHeaders });
  } catch (e: any) {
    console.error("GET Error:", e.message);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const unidadeIdsRaw = formData.getAll("unidadeIds[]") as string[];
    const unidadeIds = unidadeIdsRaw.map((id) => Number(id)).filter((id) => !isNaN(id));

    if ((user.role === "ADMIN" || user.role === "MESSAGEONLY") && unidadeIds.length > 1) {
      return NextResponse.json(
        { error: "⛔ Apenas OWNER ou MESSAGENEWS podem criar recados para múltiplas unidades" },
        { status: 403 }
      );
    }

    const titulo = formData.get("titulo") as string;
    const conteudo = formData.get("conteudo") as string;

    if (!titulo || !conteudo || unidadeIds.length === 0) {
      return NextResponse.json({ error: "Dados obrigatórios" }, { status: 400 });
    }

    let imagem: string | null = null;
    const imagemFile = formData.get("imagem") as File | null;

    if (imagemFile && imagemFile.size > 0) {
      const uploadDir = path.join(process.cwd(), "storage", "uploads", "recados");
      await mkdir(uploadDir, { recursive: true });
      const buffer = Buffer.from(await imagemFile.arrayBuffer());
      const filename = `recado-${Date.now()}-${crypto.randomUUID().slice(0, 8)}.jpg`;
      await writeFile(path.join(uploadDir, filename), buffer);
      imagem = filename;
    }

    const unidadePrincipal = unidadeIds[0];

    const recado = await prisma.recado.create({
      data: {
        titulo,
        conteudo,
        unidadeId: unidadePrincipal,
        imagem,
        unidades: {
          create: unidadeIds.map((id: number) => ({ unidadeId: id })),
        },
      },
      include: {
        unidade: { select: { id: true, nome: true } },
        unidades: { include: { unidade: { select: { id: true, nome: true } } } },
      },
    });

    await logAudit(recado.id, user.id, user.name, "CREATE", null, {
      titulo,
      conteudo,
      unidadeIds,
      imagem,
    });

    return NextResponse.json(
      {
        ...recado,
        unidadeIds: recado.unidades.map((u) => u.unidadeId),
      },
      { headers: noCacheHeaders }
    );
  } catch (e: any) {
    console.error("POST Error:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const id = Number(formData.get("id"));
    const unidadeIdsRaw = formData.getAll("unidadeIds[]") as string[];
    const unidadeIds = unidadeIdsRaw.map((id) => Number(id)).filter((id) => !isNaN(id));

    const recadoAntigo = await prisma.recado.findUnique({
      where: { id },
      include: { unidades: true },
    });

    if (!recadoAntigo) {
      return NextResponse.json({ error: "Recado não encontrado" }, { status: 404 });
    }

    const antigosUnidadeIds = recadoAntigo.unidades.map((u) => u.unidadeId);
    const ehMultiUnidade = antigosUnidadeIds.length > 1 || unidadeIds.length > 1;

    if ((user.role === "ADMIN" || user.role === "MESSAGEONLY") && ehMultiUnidade) {
      return NextResponse.json(
        { error: "⛔ Apenas OWNER ou MESSAGENEWS podem editar recados multi-unidade" },
        { status: 403 }
      );
    }

    const titulo = formData.get("titulo") as string;
    const conteudo = formData.get("conteudo") as string;
    const imagemAntiga = formData.get("imagemAntiga") as string;

    let imagem = imagemAntiga;
    const file = formData.get("imagem") as File | null;

    if (file && file.size > 0) {
      if (imagemAntiga) {
        const oldPath = path.join(process.cwd(), "storage", "uploads", "recados", imagemAntiga);
        try {
          await fs.access(oldPath);
          await rm(oldPath);
        } catch {}
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const extensao = file.name.split(".").pop() || "jpg";
      const nome = `recado-${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${extensao}`;
      const caminho = path.join(process.cwd(), "storage", "uploads", "recados", nome);
      await mkdir(path.dirname(caminho), { recursive: true });
      await writeFile(caminho, buffer);
      imagem = nome;
    }

    const unidadePrincipal = unidadeIds[0];

    const dadosAntigos = {
      titulo: recadoAntigo.titulo,
      conteudo: recadoAntigo.conteudo,
      unidadeId: recadoAntigo.unidadeId,
      unidadeIds: antigosUnidadeIds,
      imagem: recadoAntigo.imagem,
    };

    const recado = await prisma.recado.update({
      where: { id },
      data: {
        titulo,
        conteudo,
        unidadeId: unidadePrincipal,
        imagem,
        unidades: {
          deleteMany: {},
          create: unidadeIds.map((id: number) => ({ unidadeId: id })),
        },
      },
      include: {
        unidade: { select: { id: true, nome: true } },
        unidades: { include: { unidade: { select: { id: true, nome: true } } } },
      },
    });

    await logAudit(recado.id, user.id, user.name, "UPDATE", dadosAntigos, {
      titulo,
      conteudo,
      unidadeIds,
      imagem,
    });

    return NextResponse.json(
      {
        ...recado,
        unidadeIds: recado.unidades.map((u) => u.unidadeId),
      },
      { headers: noCacheHeaders }
    );
  } catch (e: any) {
    console.error("PUT Error:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}