import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/src/lib/prisma";
import { auth } from "../../../../../lib/auth";
import NoticiasSolicitacoesClient from "./solicitacoes-client";

export const dynamic = "force-dynamic";

export default async function NoticiasSolicitacoesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) redirect("/admin/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true, unidadeId: true, name: true },
  });

  if (!user) redirect("/admin/login");

  if (!["OWNER", "ADMIN", "MESSAGENEWS", "NEWSONLY"].includes(user.role)) {
    redirect("/admin");
  }

  const where: any = { recurso: "NOTICIA" };

  if (user.role === "ADMIN") {
    if (!user.unidadeId) redirect("/admin");
    where.unidadeId = user.unidadeId;
  }

  if (user.role === "NEWSONLY") {
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
    <NoticiasSolicitacoesClient
      initialSolicitacoes={JSON.parse(JSON.stringify(formatted))}
      userRole={user.role as any}
      userId={user.id}
      userUnidadeId={user.unidadeId ?? null}
    />
  );
}