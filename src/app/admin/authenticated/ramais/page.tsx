import { requirePageRoles } from "@/src/lib/permissions";
import { PAGE_ROLES } from "@/src/lib/role-permissions";
import Layout from "@/src/components/Layout";
import RamaisClient from "./ramais-client";
import { prisma } from "@/src/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function RamaisPage() {
  const user = await requirePageRoles(
    PAGE_ROLES.ramais,
  );

  let userUnidadeNome: string | null = null;

  if (user.unidadeId) {
    const unidade = await prisma.unidade.findUnique({
      where: { id: user.unidadeId },
      select: { nome: true },
    });

    userUnidadeNome = unidade?.nome ?? null;
  }

  return (
    <Layout>
      <RamaisClient
        userRoles={user.roles}
        userUnidadeId={user.unidadeId}
        userUnidadeNome={userUnidadeNome}
      />
    </Layout>
  );
}