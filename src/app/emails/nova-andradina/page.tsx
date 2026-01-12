// src/app/emails/nova-andradina/page.tsx
import { prisma } from "../../../lib/prisma";
import Layout from "../../../components/Layout";
import { EmailsList } from "../_components/emails-list"; // client para busca

export default async function EmailsNovaAndradinaPage() {
  // pega a unidade pelo nome (ou id fixo, como preferir)
  const unidade = await prisma.unidade.findFirst({
    where: { nome: "Nova Andradina-MS" },
    include: { emails: { orderBy: { setor: "asc" } } },
  });

  // se não achar unidade, mostra mensagem simples
  const emails = unidade?.emails ?? [];
  return (
    <Layout>
      <EmailsList
        titulo="Nova Andradina - MS"
        imagem="/assets/images/unidades/NOVA2023.jpg"
        emails={emails.map((r) => ({
          nome: r.nome,
          setor: r.setor,
          email: r.email,
        }))}
      />
    </Layout>
  );
}
