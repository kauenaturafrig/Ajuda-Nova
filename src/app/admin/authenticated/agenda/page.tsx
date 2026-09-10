//src/app/admin/authenticated/agenda/page.tsx
import { prisma } from "@/src/lib/prisma";
import { requirePageRoles } from "@/src/lib/permissions";
import { PAGE_ROLES } from "@/src/lib/role-permissions";
import Layout from "@/src/components/Layout";
import AgendaAdminClient from "./agenda-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AgendaAdminPage() {
  const user = await requirePageRoles(
    PAGE_ROLES.agenda,
  );

  const [eventos, unidades] = await Promise.all([
    prisma.agendaEvento.findMany({
      orderBy: { data: "asc" },
      include: { unidade: true },
    }),
    prisma.unidade.findMany({
      orderBy: { nome: "asc" },
    }),
  ]);

  const eventosSerializados = eventos.map(
    (ev) => ({
      ...ev,
      data: ev.data.toISOString(),
      createdAt: ev.createdAt.toISOString(),
      updatedAt: ev.updatedAt.toISOString(),
    }),
  );

  return (
    <Layout>
      <AgendaAdminClient
        initialEventos={
          eventosSerializados as any[]
        }
        initialUnidades={unidades as any[]}
        userRoles={user.roles}
        userUnidadeId={user.unidadeId}
        userName={user.name}
      />
    </Layout>
  );
}