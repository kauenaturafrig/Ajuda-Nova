// src/app/admin/authenticated/recados/solicitacoes/page.tsx

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/src/lib/prisma";
import { auth } from "../../../../../lib/auth";
import SolicitacoesClient from "./solicitacoes-client";

export const dynamic = "force-dynamic";

export default async function SolicitacoesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) redirect("/admin/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true, unidadeId: true, name: true },
  });

  if (!user) redirect("/admin/login");

  if (!["OWNER", "ADMIN", "MESSAGENEWS", "MESSAGEONLY"].includes(user.role)) {
    redirect("/admin");
  }

  const where: any = {};
  if (user.role === "ADMIN") {
    if (!user.unidadeId) redirect("/admin");
    where.unidadeId = user.unidadeId;
  }
  if (user.role === "MESSAGEONLY") {
    where.solicitanteId = user.id;
  }

  const solicitacoes = await prisma.solicitacaoGerenciamento.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const formatted = solicitacoes.map((s) => ({
    ...s,
    unidadeIds: s.unidadeIds ? JSON.parse(s.unidadeIds) : [],
  }));

  return (
    <SolicitacoesClient
      initialSolicitacoes={JSON.parse(JSON.stringify(formatted))}
      userRole={user.role as any}
      userId={user.id}
      userUnidadeId={user.unidadeId ?? null}
    />
  );
}