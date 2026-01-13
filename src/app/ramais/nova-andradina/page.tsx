// src/app/ramais/nova-andradina/page.tsx
import { prisma } from "../../../lib/prisma";
import Layout from "../../../components/Layout";
import { RamaisList } from "../_components/ramais-list";

// desabilita cache e SSG
export const dynamic = "force-dynamic";
// ou, alternativamente:
// export const revalidate = 0;

export default async function RamaisNovaAndradinaPage() {
  // pega a unidade pelo nome (ou id fixo, como preferir)
  const unidade = await prisma.unidade.findFirst({
    where: { nome: "Nova Andradina-MS" },
    include: { ramais: { orderBy: { setor: "asc" } } },
  });

  // se não achar unidade, mostra mensagem simples
  const ramais = unidade?.ramais ?? [];

  return (
    <Layout>
      <RamaisList
        titulo="Nova Andradina - MS"
        imagem="/assets/images/unidades/NOVA2023.jpg"
        ramais={ramais.map((r) => ({
          nome: r.nome,
          setor: r.setor,
          ramal: r.numero,
        }))}
      />
    </Layout>
  );
}
