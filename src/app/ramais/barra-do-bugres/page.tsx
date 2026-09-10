// src/app/ramais/barra-do-bugres/page.tsx
import { prisma } from "../../../lib/prisma";
import Layout from "../../../components/Layout";
import { RamaisList } from "../_components/ramais-list";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function RamaisBarradoBugresPage() {
  const unidade = await prisma.unidade.findFirst({
    where: { nome: "Barra do Bugres-MT" },
    include: { ramais: { orderBy: { setor: "asc" } } },
  });

  const ramais = unidade?.ramais ?? [];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-4">
        {/* Botão Voltar Alinhado com a Identidade */}
        <Link href="/ramais" prefetch={false} passHref>
          <Button
            variant="outline"
            className="mb-6 gap-2 text-gray-600 dark:text-gray-300 transition-all duration-300"
          >
            <ArrowLeft size={16} />
            Voltar para o Mapa
          </Button>
        </Link>

        <RamaisList
          titulo="Barra do Bugres - MT"
          imagem="/assets/images/unidades/BARRA2023.jpg"
          ramais={ramais.map((r) => ({
            nome: r.nome,
            setor: r.setor,
            ramal: r.numero,
          }))}
        />
      </div>
    </Layout>
  );
}