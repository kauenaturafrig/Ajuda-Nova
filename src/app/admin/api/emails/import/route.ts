// src/app/admin/api/emails/import/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { auth } from "../../../../../lib/auth";
import { parse } from "papaparse";

async function getUserFromReq(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, unidadeId: true },
  });

  return user;
}

export async function POST(req: NextRequest) {
  const user = await getUserFromReq(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "Arquivo não enviado" }, { status: 400 });
  }

  const text = await file.text();
  const results = parse(text, { header: true, skipEmptyLines: true });

  const rows = results.data as Array<{
    Email: string;
    Nome?: string;
    Setor: string;
    Unidade?: string;
  }>;

  // validação mínima
  const validRows = rows.filter(
    (row): row is { Email: string; Nome?: string; Setor: string; Unidade: string } =>
      Boolean(row.Email && row.Setor && row.Unidade)
  );

  if (validRows.length === 0) {
    return NextResponse.json(
      { error: "Nenhum registro válido encontrado no arquivo" },
      { status: 400 }
    );
  }

  // 1) buscar todas as unidades pelo nome
  const unidades = await prisma.unidade.findMany();
  const unidadeMap = new Map(unidades.map(u => [u.nome, u.id]));

  // 2) buscar todos os emails atuais da unidade do usuário
  const where =
    user.role === "OWNER" ? {} : { unidadeId: user.unidadeId ?? -1 };

  const currentEmails = await prisma.email.findMany({
    where,
    select: { id: true, email: true, unidadeId: true },
  });

  const currentMap = new Map(
    currentEmails.map(r => [`${r.unidadeId}-${r.email}`, r])
  );

  const toCreate = [];
  const toUpdate = [];

  for (const row of validRows) {
    const unidadeId = unidadeMap.get(row.Unidade); // row.Unidade é string aqui

    if (!unidadeId) continue;

    const key = `${unidadeId}-${row.Email}`;
    const existing = currentMap.get(key);

    if (!existing) {
      toCreate.push({
        email: row.Email,
        nome: row.Nome || null,
        setor: row.Setor,
        unidadeId,
      });
    } else {
      toUpdate.push({
        where: { id: existing.id },
        data: {
          nome: row.Nome || null,
          setor: row.Setor,
        },
      });
    }
  }

  // 3) executar em transação
  await prisma.$transaction([
    prisma.email.createMany({ data: toCreate, skipDuplicates: true }),
    ...toUpdate.map(update =>
      prisma.email.update(update)
    ),
  ]);

  return NextResponse.json({
    ok: true,
    imported: toCreate.length,
    updated: toUpdate.length,
  });
}