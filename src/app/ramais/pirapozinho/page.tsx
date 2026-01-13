// src/app/ramais/nova-andradina/page.tsx
import { prisma } from "../../../lib/prisma";
import Layout from "../../../components/Layout";
import { RamaisList } from "../_components/ramais-list"; // client para busca

export default async function RamaisPirapozinhoPage() {
  // pega a unidade pelo nome (ou id fixo, como preferir)
  const unidade = await prisma.unidade.findFirst({
    where: { nome: "Pirapozinho-SP" },
    include: { ramais: { orderBy: { setor: "asc" } } },
  });

  // se não achar unidade, mostra mensagem simples
  const ramais = unidade?.ramais ?? [];

  return (
    <Layout>
      <RamaisList
        titulo="Pirapozinho - SP"
        imagem="/assets/images/unidades/PIRAPOZINHO2023.jpg"
        ramais={ramais.map((r) => ({
          nome: r.nome,
          setor: r.setor,
          ramal: r.numero,
        }))}
      />
    </Layout>
  );
}
