// src/app/admin/api/ramais/export/route.ts
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/src/lib/prisma";
import {
  getApiUser,
  hasApiRole,
} from "@/src/lib/api-permissions";

export const dynamic = "force-dynamic";

const canManageRamais = (user: Awaited<
  ReturnType<typeof getApiUser>
>) => {
  if (!user) {
    return false;
  }

  return (
    hasApiRole(user, "OWNER") ||
    hasApiRole(user, "EXTENSION")
  );
};

export async function GET(req: NextRequest) {
  const user = await getApiUser(req);

  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  if (!canManageRamais(user)) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 },
    );
  }

  const where = hasApiRole(user, "OWNER")
    ? {}
    : { unidadeId: user.unidadeId ?? -1 };

  const ramais = await prisma.ramal.findMany({
    where,
    include: { unidade: true },
    orderBy: { numero: "asc" },
  });

  const headers = [
    "Número",
    "Nome",
    "Setor",
    "Unidade",
  ];

  const rows = ramais.map((r) => [
    r.numero,
    r.nome || "",
    r.setor,
    r.unidade?.nome || "",
  ]);

  const bom = "\uFEFF";

  const csv = [
    headers.join(";"),
    ...rows.map((row) =>
      row.map(String).join(";"),
    ),
  ].join("\n");

  return new NextResponse(bom + csv, {
    headers: {
      "Content-Type":
        "text/csv;charset=utf-8",
      "Content-Disposition":
        'attachment; filename="ramais.csv"',
    },
  });
}