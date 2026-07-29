//src/app/admin/authenticated/agenda/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import Layout from "@/src/components/Layout";
import AgendaAdminClient from "./agenda-client";

const allowedRoles = ["OWNER", "EVENTS"] as const;

export default async function AgendaAdminPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/admin");

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, unidadeId: true, name: true },
  });

  const role = dbUser?.role as string | undefined;

  if (!dbUser || !role || !allowedRoles.includes(role as any)) {
    redirect("/admin/authenticated");
  }

  const [eventos, unidades] = await Promise.all([
    prisma.agendaEvento.findMany({
      orderBy: { data: "asc" },
      include: { unidade: true },
    }),
    prisma.unidade.findMany({ orderBy: { nome: "asc" } }),
  ]);

  const eventosSerializados = eventos.map((ev) => ({
    ...ev,
    data: ev.data.toISOString(),
    createdAt: ev.createdAt.toISOString(),
    updatedAt: ev.updatedAt.toISOString(),
  }));

  return (
    <Layout>
      <AgendaAdminClient
        initialEventos={eventosSerializados as any[]}
        initialUnidades={unidades as any[]}
        userRole={role as "OWNER" | "EVENTS"}
        userUnidadeId={dbUser.unidadeId || null}
        userName={dbUser.name}
      />
    </Layout>
  );
}