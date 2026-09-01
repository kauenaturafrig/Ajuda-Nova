import Layout from "@/src/components/Layout";
import { prisma } from "@/src/lib/prisma";
import { requirePageRoles } from "@/src/lib/permissions";
import { PAGE_ROLES } from "@/src/lib/role-permissions";
import AuditoriaClient from "./auditoria-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AuditoriaRecadosPage() {
  const user = await requirePageRoles(
    PAGE_ROLES.auditoriaRecados,
  );

  const isOwner = user.roles.includes("OWNER");

  if (!isOwner) {
    return null;
  }

  const audits = await prisma.recadoAudit.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
    select: {
      id: true,
      recadoId: true,
      userId: true,
      userNome: true,
      acao: true,
      createdAt: true,
      dadosAntigos: true,
      dadosNovos: true,
    },
  });

  const serializedAudits = audits.map((audit) => ({
    id: audit.id,
    recadoId: audit.recadoId,
    userId: audit.userId,
    userNome: audit.userNome,
    acao: audit.acao,
    createdAt: audit.createdAt.toISOString(),
    dadosAntigos: audit.dadosAntigos,
    dadosNovos: audit.dadosNovos,
  }));

  return (
    <Layout>
      <AuditoriaClient audits={serializedAudits} />
    </Layout>
  );
}