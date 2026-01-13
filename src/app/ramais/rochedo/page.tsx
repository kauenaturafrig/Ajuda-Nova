// src/app/ramais/nova-andradina/page.tsx
import { prisma } from "../../../lib/prisma";
import Layout from "../../../components/Layout";
import { RamaisList } from "../_components/ramais-list";

// desabilita cache e SSG
export const dynamic = "force-dynamic";
// ou, alternativamente:
// export const revalidate = 0;

export default async function RamaisRochedoPage() {
  const unidade = await prisma.unidade.findFirst({
    where: { nome: "Rochedo-MS" },
    include: { ramais: { orderBy: { setor: "asc" } } },
  });

  const ramais = unidade?.ramais ?? [];

  return (
    <Layout>
      <RamaisList
        titulo="Rochedo - MS"
        imagem="/assets/images/unidades/ROCHEDO2023.jpg"
        ramais={ramais.map((r) => ({
          nome: r.nome,
          setor: r.setor,
          ramal: r.numero,
        }))}
      />
    </Layout>
  );
}
