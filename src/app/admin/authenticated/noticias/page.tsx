import NoticiasClient from "./noticias-client";
import { prisma } from "@/src/lib/prisma";
import { requirePageRoles } from "@/src/lib/permissions";
import { PAGE_ROLES } from "@/src/lib/role-permissions";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function GerenciarNoticiasPage() {
  const user = await requirePageRoles(
    PAGE_ROLES.noticias,
  );

  const [noticias, categorias] = await Promise.all([
    prisma.noticia.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        categorias: {
          orderBy: { ordem: "asc" },
          select: { id: true, nome: true, slug: true, cor: true },
        },
      },
    }),
    prisma.categoria.findMany({
      where: { ativo: true },
      orderBy: [{ ordem: "asc" }, { nome: "asc" }],
      select: { id: true, nome: true, slug: true, cor: true },
    }),
  ]);

  const serializedNoticias = noticias.map(
    (noticia) => ({
      id: noticia.id,
      titulo: noticia.titulo,
      conteudo: noticia.conteudo,
      imagem: noticia.imagem,
      createdAt:
        noticia.createdAt.toISOString(),
      updatedAt:
        noticia.updatedAt.toISOString(),
      categorias: noticia.categorias,
    }),
  );

  return (
    <NoticiasClient
      initialNoticias={serializedNoticias}
      initialCategorias={categorias}
      userRoles={user.roles}
    />
  );
}