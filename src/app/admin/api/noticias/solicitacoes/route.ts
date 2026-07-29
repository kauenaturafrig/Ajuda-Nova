import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { auth } from "../../../../../lib/auth";
import path from "path";
import { writeFile, mkdir } from "fs/promises";
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

function formatSolicitacao(s: any) {
  return {
    ...s,
    unidadeIds: s.unidadeIds ? JSON.parse(s.unidadeIds) : [],
  };
}

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const statusValidos = ["PENDENTE", "APROVADO", "RECUSADO", "CANCELADO"];

    let where: any = { recurso: "NOTICIA" };

    if (user.role === "OWNER" || user.role === "MESSAGENEWS") {
    } else if (user.role === "ADMIN") {
      if (!user.unidadeId) {
        return NextResponse.json({ error: "Usuário sem unidade vinculada" }, { status: 400 });
      }
      where.unidadeId = user.unidadeId;
    } else if (user.role === "NEWSONLY") {
      where.solicitanteId = user.id;
    } else {
      return NextResponse.json({ error: "⛔ Sem permissão" }, { status: 403 });
    }

    if (status && statusValidos.includes(status)) {
      where.status = status;
    }

    const solicitacoes = await prisma.solicitacaoGerenciamento.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(solicitacoes.map(formatSolicitacao), { headers: noCacheHeaders });
  } catch (e: any) {
    console.error("GET solicitacoes Error:", e.message);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "NEWSONLY") {
      return NextResponse.json(
        { error: "⛔ Apenas usuários NEWSONLY precisam solicitar aprovação. Seu perfil já gerencia diretamente." },
        { status: 403 }
      );
    }

    if (!user.unidadeId) {
      return NextResponse.json({ error: "Usuário sem unidade vinculada" }, { status: 400 });
    }

    const formData = await req.formData();
    const tipo = formData.get("tipo") as string;

    if (!["CREATE", "UPDATE", "DELETE"].includes(tipo)) {
      return NextResponse.json({ error: "Tipo de solicitação inválido" }, { status: 400 });
    }

    const noticiaIdRaw = formData.get("noticiaId");
    const noticiaId = noticiaIdRaw ? Number(noticiaIdRaw) : null;
    const unidadeIds = [user.unidadeId];

    if (tipo !== "CREATE") {
      if (!noticiaId) {
        return NextResponse.json({ error: "noticiaId é obrigatório para UPDATE/DELETE" }, { status: 400 });
      }

      const noticiaExistente = await prisma.noticia.findUnique({
        where: { id: noticiaId },
      });

      if (!noticiaExistente) {
        return NextResponse.json({ error: "Notícia não encontrada" }, { status: 404 });
      }

      const jaExiste = await prisma.solicitacaoGerenciamento.findFirst({
        where: { noticiaId, recurso: "NOTICIA", status: "PENDENTE" },
      });

      if (jaExiste) {
        return NextResponse.json(
          { error: "⛔ Já existe uma solicitação pendente para esta notícia" },
          { status: 409 }
        );
      }
    }

    let titulo: string | null = null;
    let conteudo: string | null = null;
    let imagem: string | null = null;
    let imagemAntiga: string | null = null;

    if (tipo === "CREATE" || tipo === "UPDATE") {
      titulo = formData.get("titulo") as string;
      conteudo = formData.get("conteudo") as string;
      imagemAntiga = (formData.get("imagemAntiga") as string) || null;

      if (!titulo?.trim() || !conteudo?.trim()) {
        return NextResponse.json({ error: "Título e conteúdo são obrigatórios" }, { status: 400 });
      }

      const imagemFile = formData.get("imagem") as File | null;
      if (imagemFile && imagemFile.size > 0) {
        const uploadDir = path.join(process.cwd(), "storage", "uploads", "noticias");
        await mkdir(uploadDir, { recursive: true });
        const buffer = Buffer.from(await imagemFile.arrayBuffer());
        const extensao = imagemFile.name.split(".").pop() || "jpg";
        const filename = `noticia-solicitacao-${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${extensao}`;
        await writeFile(path.join(uploadDir, filename), buffer);
        imagem = filename;
      }
    }

    const solicitacao = await prisma.solicitacaoGerenciamento.create({
      data: {
        recurso: "NOTICIA",
        tipo: tipo as any,
        status: "PENDENTE",
        noticiaId,
        unidadeId: user.unidadeId,
        titulo,
        conteudo,
        unidadeIds: JSON.stringify(unidadeIds),
        imagem,
        imagemAntiga,
        solicitanteId: user.id,
        solicitanteNome: user.name || "Desconhecido",
      },
    });

    return NextResponse.json(formatSolicitacao(solicitacao), { headers: noCacheHeaders });
  } catch (e: any) {
    console.error("POST solicitacoes Error:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}