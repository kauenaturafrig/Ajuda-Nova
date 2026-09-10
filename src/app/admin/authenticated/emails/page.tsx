// src/app/admin/authenticated/emails/page.tsx
import { requirePageRoles } from "@/src/lib/permissions";
import { PAGE_ROLES } from "@/src/lib/role-permissions";
import Layout from "@/src/components/Layout";
import EmailsClient from "./emails-client";
import { prisma } from "@/src/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EmailsPage() {
  const user = await requirePageRoles(
    PAGE_ROLES.emails,
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
      <EmailsClient
        userRoles={user.roles}
        userUnidadeId={user.unidadeId}
        userUnidadeNome={userUnidadeNome}
      />
    </Layout>
  );
}