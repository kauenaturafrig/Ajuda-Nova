import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { auth } from "../../../../../../lib/auth";
import path from "path";
import { rm } from "fs/promises";
import fs from "fs/promises";

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

async function apagarArquivo(nome?: string | null) {
  if (!nome) return;
  const p = path.join(process.cwd(), "storage", "uploads", "noticias", nome);
  try {
    await fs.access(p);
    await rm(p);
  } catch {}
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

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!["OWNER", "ADMIN", "MESSAGENEWS"].includes(user.role)) {
      return NextResponse.json({ error: "⛔ Sem permissão para revisar solicitações" }, { status: 403 });
    }

    const { id } = await params;
    const solicitacaoId = Number(id);

    const solicitacao = await prisma.solicitacaoGerenciamento.findUnique({
      where: { id: solicitacaoId },
    });

    if (!solicitacao || solicitacao.recurso !== "NOTICIA") {
      return NextResponse.json({ error: "Solicitação não encontrada" }, { status: 404 });
    }

    if (solicitacao.status !== "PENDENTE") {
      return NextResponse.json({ error: "Esta solicitação já foi revisada" }, { status: 400 });
    }

    if (user.role === "ADMIN" && solicitacao.unidadeId !== user.unidadeId) {
      return NextResponse.json(
        { error: "⛔ Você só pode revisar solicitações da sua própria unidade" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const acao = body.acao as "aprovar" | "recusar";
    const motivo = body.motivo as string | undefined;

    if (!["aprovar", "recusar"].includes(acao)) {
      return NextResponse.json({ error: "Ação inválida" }, { status: 400 });
    }

    if (acao === "recusar") {
      await apagarArquivo(solicitacao.imagem);

      const atualizada = await prisma.solicitacaoGerenciamento.update({
        where: { id: solicitacaoId },
        data: {
          status: "RECUSADO",
          revisorId: user.id,
          revisorNome: user.name || "Desconhecido",
          motivoRecusa: motivo || null,
        },
      });

      return NextResponse.json(atualizada, { headers: noCacheHeaders });
    }

    if (solicitacao.tipo === "CREATE") {
      const noticia = await prisma.noticia.create({
        data: {
          titulo: solicitacao.titulo!,
          conteudo: solicitacao.conteudo!,
          imagem: solicitacao.imagem,
        },
      });

      await logAudit(noticia.id, user.id, user.name || "Desconhecido", "CREATE", null, {
        titulo: solicitacao.titulo,
        conteudo: solicitacao.conteudo,
        imagem: solicitacao.imagem,
        origemSolicitacaoId: solicitacao.id,
        solicitadoPor: solicitacao.solicitanteNome,
      });
    }

    if (solicitacao.tipo === "UPDATE" && solicitacao.noticiaId) {
      const noticiaAntes = await prisma.noticia.findUnique({
        where: { id: solicitacao.noticiaId },
      });

      if (!noticiaAntes) {
        return NextResponse.json({ error: "Notícia original não existe mais" }, { status: 404 });
      }

      let imagemFinal = noticiaAntes.imagem;
      if (solicitacao.imagem) {
        await apagarArquivo(noticiaAntes.imagem);
        imagemFinal = solicitacao.imagem;
      }

      await prisma.noticia.update({
        where: { id: noticiaAntes.id },
        data: {
          titulo: solicitacao.titulo!,
          conteudo: solicitacao.conteudo!,
          imagem: imagemFinal,
        },
      });

      await logAudit(
        noticiaAntes.id,
        user.id,
        user.name || "Desconhecido",
        "UPDATE",
        {
          titulo: noticiaAntes.titulo,
          conteudo: noticiaAntes.conteudo,
          imagem: noticiaAntes.imagem,
        },
        {
          titulo: solicitacao.titulo,
          conteudo: solicitacao.conteudo,
          imagem: imagemFinal,
          origemSolicitacaoId: solicitacao.id,
          solicitadoPor: solicitacao.solicitanteNome,
        }
      );
    }

    if (solicitacao.tipo === "DELETE" && solicitacao.noticiaId) {
      const noticiaAntes = await prisma.noticia.findUnique({
        where: { id: solicitacao.noticiaId },
      });

      if (noticiaAntes) {
        await apagarArquivo(noticiaAntes.imagem);

        await logAudit(
          noticiaAntes.id,
          user.id,
          user.name || "Desconhecido",
          "DELETE",
          {
            titulo: noticiaAntes.titulo,
            conteudo: noticiaAntes.conteudo,
            imagem: noticiaAntes.imagem,
          },
          {
            origemSolicitacaoId: solicitacao.id,
            solicitadoPor: solicitacao.solicitanteNome,
          }
        );

        await prisma.noticia.delete({
          where: { id: noticiaAntes.id },
        });
      }
    }

    const atualizada = await prisma.solicitacaoGerenciamento.update({
      where: { id: solicitacaoId },
      data: {
        status: "APROVADO",
        revisorId: user.id,
        revisorNome: user.name || "Desconhecido",
      },
    });

    return NextResponse.json(atualizada, { headers: noCacheHeaders });
  } catch (e: any) {
    console.error("PUT solicitacao Error:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const solicitacaoId = Number(id);

    const solicitacao = await prisma.solicitacaoGerenciamento.findUnique({
      where: { id: solicitacaoId },
    });

    if (!solicitacao || solicitacao.recurso !== "NOTICIA") {
      return NextResponse.json({ error: "Solicitação não encontrada" }, { status: 404 });
    }

    const podeCancelar = solicitacao.solicitanteId === user.id && solicitacao.status === "PENDENTE";
    if (!podeCancelar) {
      return NextResponse.json(
        { error: "⛔ Você só pode cancelar suas próprias solicitações pendentes" },
        { status: 403 }
      );
    }

    await apagarArquivo(solicitacao.imagem);
    await prisma.solicitacaoGerenciamento.delete({
      where: { id: solicitacaoId },
    });

    return NextResponse.json({ ok: true }, { headers: noCacheHeaders });
  } catch (e: any) {
    console.error("DELETE solicitacao Error:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}