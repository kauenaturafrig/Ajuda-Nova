// src/app/admin/api/emails/import/route.ts
import { NextRequest, NextResponse } from "next/server";
import { parse } from "papaparse";

import { prisma } from "@/src/lib/prisma";
import {
  getApiUser,
  hasApiRole,
} from "@/src/lib/api-permissions";

export const dynamic = "force-dynamic";

const canManageEmails = (user: Awaited<
  ReturnType<typeof getApiUser>
>) => {
  if (!user) {
    return false;
  }

  return (
    hasApiRole(user, "OWNER") ||
    hasApiRole(user, "EMAIL")
  );
};

const isUnitRestricted = (user: Awaited<
  ReturnType<typeof getApiUser>
>) => {
  if (!user) {
    return false;
  }

  return (
    hasApiRole(user, "EMAIL") &&
    !hasApiRole(user, "OWNER")
  );
};

export async function POST(req: NextRequest) {
  const user = await getApiUser(req);

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  if (!canManageEmails(user)) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 },
    );
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json(
      { error: "Arquivo não enviado" },
      { status: 400 },
    );
  }

  const text = await file.text();
  const results = parse(text, {
    header: true,
    skipEmptyLines: true,
  });

  const rows = results.data as Array<{
    Email: string;
    Nome?: string;
    Setor: string;
    Unidade?: string;
  }>;

  const validRows = rows.filter(
    (
      row,
    ): row is {
      Email: string;
      Nome?: string;
      Setor: string;
      Unidade: string;
    } =>
      Boolean(
        row.Email &&
          row.Setor &&
          row.Unidade,
      ),
  );

  if (validRows.length === 0) {
    return NextResponse.json(
      {
        error:
          "Nenhum registro válido encontrado no arquivo.",
      },
      { status: 400 },
    );
  }

  const unidades =
    await prisma.unidade.findMany();

  const unidadeMap = new Map(
    unidades.map((u) => [u.nome, u.id]),
  );

  const restricted = isUnitRestricted(user);
  const adminUnidadeId = restricted
    ? user.unidadeId
    : null;

  const where = hasApiRole(user, "OWNER")
    ? {}
    : { unidadeId: user.unidadeId ?? -1 };

  const currentEmails =
    await prisma.email.findMany({
      where,
      select: {
        id: true,
        email: true,
        unidadeId: true,
      },
    });

  const currentMap = new Map(
    currentEmails.map((r) => [
      `${r.unidadeId}-${r.email}`,
      r,
    ]),
  );

  const toCreate = [];
  const toUpdate = [];

  for (const row of validRows) {
    const unidadeId = unidadeMap.get(
      row.Unidade,
    );

    if (!unidadeId) {
      continue;
    }

    if (restricted && adminUnidadeId !== null) {
      if (unidadeId !== adminUnidadeId) {
        continue;
      }
    }

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
      if (
        restricted &&
        adminUnidadeId !== null &&
        existing.unidadeId !== adminUnidadeId
      ) {
        continue;
      }

      toUpdate.push({
        where: { id: existing.id },
        data: {
          nome: row.Nome || null,
          setor: row.Setor,
        },
      });
    }
  }

  await prisma.$transaction([
    prisma.email.createMany({
      data: toCreate,
      skipDuplicates: true,
    }),
    ...toUpdate.map((update) =>
      prisma.email.update(update),
    ),
  ]);

  return NextResponse.json({
    ok: true,
    imported: toCreate.length,
    updated: toUpdate.length,
  });
}