//src/app/agenda/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { prisma } from "../../lib/prisma";
import Layout from "../../components/Layout";
import AgendaPublicClient from "./agenda-client";

export default async function AgendaPage() {
  const eventos = await prisma.agendaEvento.findMany({
    orderBy: { data: "asc" },
    include: { unidade: true },
  });

  const eventosSerializados = eventos.map((ev) => ({
    id: ev.id,
    titulo: ev.titulo,
    descricao: ev.descricao,
    data: ev.data.toISOString(),
    unidade: { id: ev.unidade.id, nome: ev.unidade.nome },
  }));

  return (
    <Layout>
      <AgendaPublicClient initialEventos={eventosSerializados} />
    </Layout>
  );
}