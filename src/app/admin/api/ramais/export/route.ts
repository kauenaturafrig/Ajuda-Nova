// src/app/admin/api/ramais/export/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { auth } from "../../../../../lib/auth";

async function getUserFromReq(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, unidadeId: true },
  });

  return user;
}

export async function GET(req: NextRequest) {
  const user = await getUserFromReq(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const where =
    user.role === "OWNER" ? {} : { unidadeId: user.unidadeId ?? -1 };

  const ramais = await prisma.ramal.findMany({
    where,
    include: { unidade: true },
    orderBy: { numero: "asc" },
  });

  // monta CSV: cabeçalho
  const headers = ["Número", "Nome", "Setor", "Unidade"];
  const rows = ramais.map((r) => [
    r.numero,
    r.nome || "",
    r.setor,
    r.unidade?.nome || "",
  ]);

  const bom = "\uFEFF"; // BOM UTF-8
  const csv = [
    headers.join(";"),
    ...rows.map((row) => row.map(String).join(";")),
  ].join("\n");

  return new NextResponse(bom + csv, {
    headers: {
      "Content-Type": "text/csv;charset=utf-8",
      "Content-Disposition": 'attachment; filename="ramais.csv"',
    },
  });
}
