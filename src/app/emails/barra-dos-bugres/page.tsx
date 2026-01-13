// src/app/emails/barra-dos-bugres/page.tsx
import { prisma } from "../../../lib/prisma";
import Layout from "../../../components/Layout";
import { EmailsList } from "../_components/emails-list"; // client para busca
import Link from "next/link";
import { Button } from "../../../components/ui/button";

export const dynamic = "force-dynamic";

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
      <Link href="/emails" prefetch={false}>
        <Button variant="outline" className="mb-4 bg-gray-500 text-white">
          ← Voltar
        </Button>
      </Link>
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
