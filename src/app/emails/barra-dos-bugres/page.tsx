// src/app/emails/barra-dos-bugres/page.tsx
import { prisma } from "../../../lib/prisma";
import Layout from "../../../components/Layout";
import { EmailsList } from "../_components/emails-list"; // client para busca

export default async function EmailsBarraDosBugresPage() {
  // pega a unidade pelo nome (ou id fixo, como preferir)
  const unidade = await prisma.unidade.findFirst({
    where: { nome: "Barra dos Bugres-MT" },
    include: { emails: { orderBy: { setor: "asc" } } },
  });

  // se não achar unidade, mostra mensagem simples
  const emails = unidade?.emails ?? [];
  return (
    <Layout>
      <EmailsList
        titulo="Barra dos Bugres - MT"
        imagem="/assets/images/unidades/BARRA2023.jpg"
        emails={emails.map((r) => ({
          nome: r.nome,
          setor: r.setor,
          email: r.email,
        }))}
      />
    </Layout>
  );
}
