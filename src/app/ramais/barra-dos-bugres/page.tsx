// src/app/ramais/barra-dos-bugres/page.tsx
import Link from "next/link";
import { prisma } from "../../../lib/prisma";
import Layout from "../../../components/Layout";
import { RamaisList } from "../_components/ramais-list";
import { Button } from "../../../components/ui/button";

export const dynamic = "force-dynamic";

export default async function RamaisBarradosBugresPage() {
  const unidade = await prisma.unidade.findFirst({
    where: { nome: "Barra dos Bugres-MT" },
    include: { ramais: { orderBy: { setor: "asc" } } },
  });

  const ramais = unidade?.ramais ?? [];

  return (
    <Layout>
      <Link href="/ramais" prefetch={false}>
        <Button variant="outline" className="mb-4 bg-gray-500 text-white">
          ← Voltar
        </Button>
      </Link>
      <RamaisList
        titulo="Barra dos Bugres - MT"
        imagem="/assets/images/unidades/BARRA2023.jpg"
        ramais={ramais.map((r) => ({
          nome: r.nome,
          setor: r.setor,
          ramal: r.numero,
        }))}
      />
    </Layout>
  );
}
