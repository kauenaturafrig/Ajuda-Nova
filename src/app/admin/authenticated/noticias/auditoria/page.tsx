import { prisma } from "@/src/lib/prisma";
import { requirePageRoles } from "@/src/lib/permissions";
import { PAGE_ROLES } from "@/src/lib/role-permissions";
import Layout from "@/src/components/Layout";
import AuditoriaNoticiasClient from "./auditoria-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AuditoriaNoticiasPage() {
  const user = await requirePageRoles(
    PAGE_ROLES.noticiasAuditoria,
  );

  const auditsRaw =
    await prisma.noticiaAudit.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
      select: {
        id: true,
        noticiaId: true,
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
    noticiaId: audit.noticiaId,
    userId: audit.userId,
    userNome: audit.userNome,
    acao: audit.acao,
    createdAt: audit.createdAt.toISOString(),
    dadosAntigos: audit.dadosAntigos,
    dadosNovos: audit.dadosNovos,
  }));

  return (
    <Layout>
      <AuditoriaNoticiasClient
        audits={audits}
        total={audits.length}
      />
    </Layout>
  );
}