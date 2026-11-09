export const dynamic = "force-dynamic";
export const revalidate = 0;

import { prisma } from "@/src/lib/prisma";
import NoticiasPublica from "./noticias-client";

interface Noticia {
  id: number;
  titulo: string;
  conteudo: string;
  imagem: string | null | undefined;
  createdAt: Date;
  updatedAt?: Date;
  categorias: {
    id: number;
    nome: string;
    slug: string;
    cor: string | null;
  }[];
}

export default async function NoticiasPage() {
  const noticias = await prisma.noticia.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      categorias: {
        where: { ativo: true },
        orderBy: { ordem: "asc" },
        select: { id: true, nome: true, slug: true, cor: true },
      },
    },
  });

  return <NoticiasPublica initialNoticias={noticias} />;
}