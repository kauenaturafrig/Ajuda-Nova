// src/app/admin/api/recados/solicitacoes/[id]/route.ts

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

async function apagarArquivo(nome?: string | null) {
  if (!nome) return;
  const p = path.join(process.cwd(), "storage", "uploads", "recados", nome);
  try {
    await fs.access(p);
    await rm(p);
  } catch {}
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

    const solicitacao = await prisma.solicitacaoGerenciamento.findUnique({ where: { id: solicitacaoId } });
    if (!solicitacao) return NextResponse.json({ error: "Solicitação não encontrada" }, { status: 404 });

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
          revisorNome: user.name,
          motivoRecusa: motivo || null,
        },
      });

      return NextResponse.json(atualizada, { headers: noCacheHeaders });
    }

    const unidadeIds: number[] = solicitacao.unidadeIds ? JSON.parse(solicitacao.unidadeIds) : [];

    if (solicitacao.tipo === "CREATE") {
      const unidadePrincipal = unidadeIds[0];

      const recado = await prisma.recado.create({
        data: {
          titulo: solicitacao.titulo!,
          conteudo: solicitacao.conteudo!,
          unidadeId: unidadePrincipal,
          imagem: solicitacao.imagem,
          unidades: { create: unidadeIds.map((id) => ({ unidadeId: id })) },
        },
      });

      await logAudit(recado.id, user.id, user.name, "CREATE", null, {
        titulo: solicitacao.titulo,
        conteudo: solicitacao.conteudo,
        unidadeIds,
        imagem: solicitacao.imagem,
        origemSolicitacaoId: solicitacao.id,
        solicitadoPor: solicitacao.solicitanteNome,
      });
    }

    if (solicitacao.tipo === "UPDATE" && solicitacao.recadoId) {
      const recadoAntigo = await prisma.recado.findUnique({
        where: { id: solicitacao.recadoId },
        include: { unidades: true },
      });

      if (!recadoAntigo) {
        return NextResponse.json({ error: "Recado original não existe mais" }, { status: 404 });
      }

      let imagemFinal = recadoAntigo.imagem;
      if (solicitacao.imagem) {
        await apagarArquivo(recadoAntigo.imagem);
        imagemFinal = solicitacao.imagem;
      }

      const dadosAntigos = {
        titulo: recadoAntigo.titulo,
        conteudo: recadoAntigo.conteudo,
        unidadeIds: recadoAntigo.unidades.map((u) => u.unidadeId),
        imagem: recadoAntigo.imagem,
      };

      const unidadePrincipal = unidadeIds[0] ?? recadoAntigo.unidadeId;

      await prisma.recado.update({
        where: { id: recadoAntigo.id },
        data: {
          titulo: solicitacao.titulo!,
          conteudo: solicitacao.conteudo!,
          unidadeId: unidadePrincipal,
          imagem: imagemFinal,
          unidades: {
            deleteMany: {},
            create: unidadeIds.map((id) => ({ unidadeId: id })),
          },
        },
      });

      await logAudit(recadoAntigo.id, user.id, user.name, "UPDATE", dadosAntigos, {
        titulo: solicitacao.titulo,
        conteudo: solicitacao.conteudo,
        unidadeIds,
        imagem: imagemFinal,
        origemSolicitacaoId: solicitacao.id,
        solicitadoPor: solicitacao.solicitanteNome,
      });
    }

    if (solicitacao.tipo === "DELETE" && solicitacao.recadoId) {
      const recadoAntigo = await prisma.recado.findUnique({
        where: { id: solicitacao.recadoId },
        include: { unidades: true },
      });

      if (recadoAntigo) {
        await apagarArquivo(recadoAntigo.imagem);

        await logAudit(
          recadoAntigo.id,
          user.id,
          user.name,
          "DELETE",
          {
            titulo: recadoAntigo.titulo,
            conteudo: recadoAntigo.conteudo,
            unidadeIds: recadoAntigo.unidades.map((u) => u.unidadeId),
            imagem: recadoAntigo.imagem,
          },
          {
            origemSolicitacaoId: solicitacao.id,
            solicitadoPor: solicitacao.solicitanteNome,
          }
        );

        await prisma.recado.delete({ where: { id: recadoAntigo.id } });
      }
    }

    const atualizada = await prisma.solicitacaoGerenciamento.update({
      where: { id: solicitacaoId },
      data: {
        status: "APROVADO",
        revisorId: user.id,
        revisorNome: user.name,
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

    const solicitacao = await prisma.solicitacaoGerenciamento.findUnique({ where: { id: solicitacaoId } });
    if (!solicitacao) return NextResponse.json({ error: "Solicitação não encontrada" }, { status: 404 });

    const podeCancelar = solicitacao.solicitanteId === user.id && solicitacao.status === "PENDENTE";
    if (!podeCancelar) {
      return NextResponse.json(
        { error: "⛔ Você só pode cancelar suas próprias solicitações pendentes" },
        { status: 403 }
      );
    }

    await apagarArquivo(solicitacao.imagem);
    await prisma.solicitacaoGerenciamento.delete({ where: { id: solicitacaoId } });

    return NextResponse.json({ ok: true }, { headers: noCacheHeaders });
  } catch (e: any) {
    console.error("DELETE solicitacao Error:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}