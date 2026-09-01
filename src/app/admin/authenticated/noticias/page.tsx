import Layout from "@/src/components/Layout";
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

  const noticias =
    await prisma.noticia.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

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
    }),
  );

  return (
    <Layout>
      <NoticiasClient
        initialNoticias={serializedNoticias}
        userRoles={user.roles}
      />
    </Layout>
  );
}