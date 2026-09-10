//src/app/admin/authenticated/agenda/logs/page.tsx
import { prisma } from "@/src/lib/prisma";
import { requirePageRoles } from "@/src/lib/permissions";
import { PAGE_ROLES } from "@/src/lib/role-permissions";
import Layout from "@/src/components/Layout";
import AgendaLogsClient from "./logs-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AgendaLogsPage() {
  const user = await requirePageRoles(
    PAGE_ROLES.agendaLogs,
  );

  const auditsRaw =
    await prisma.agendaEventoAudit.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
      select: {
        id: true,
        eventoId: true,
        eventoTitulo: true,
        unidadeId: true,
        unidadeNome: true,
        userId: true,
        userNome: true,
        acao: true,
        createdAt: true,
        dadosAntigos: true,
        dadosNovos: true,
      },
    });

  const audits = auditsRaw.map((audit) => ({
    id: audit.id,
    eventoId: audit.eventoId,
    eventoTitulo: audit.eventoTitulo,
    unidadeId: audit.unidadeId,
    unidadeNome: audit.unidadeNome,
    userId: audit.userId,
    userNome: audit.userNome,
    acao: audit.acao,
    createdAt: audit.createdAt.toISOString(),
    dadosAntigos: audit.dadosAntigos,
    dadosNovos: audit.dadosNovos,
  }));

  return (
    <Layout>
      <AgendaLogsClient
        audits={audits}
        total={audits.length}
      />
    </Layout>
  );
}