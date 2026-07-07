// src/app/emails/barra-dos-bugres/page.tsx
import { prisma } from "../../../lib/prisma";
import Layout from "../../../components/Layout";
import { EmailsList } from "../_components/emails-list";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EmailsBarradosBugresPage() {
  const unidade = await prisma.unidade.findFirst({
    where: { nome: "Barra dos Bugres-MT" },
    include: { emails: { orderBy: { setor: "asc" } } },
  });

  const emails = unidade?.emails ?? [];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-4">
        {/* Botão Voltar Padronizado */}
        <Link href="/emails" prefetch={false} passHref>
          <Button
            variant="outline"
            className="mb-6 gap-2 text-gray-600 dark:text-gray-300 transition-all duration-300"
          >
            <ArrowLeft size={16} />
            Voltar para E-mails
          </Button>
        </Link>

        <EmailsList
          titulo="Barra dos Bugres - MT"
          imagem="/assets/images/unidades/BARRA2023.jpg"
          emails={emails.map((e) => ({
            nome: e.nome,
            setor: e.setor,
            email: e.email,
          }))}
        />
      </div>
    </Layout>
  );
}