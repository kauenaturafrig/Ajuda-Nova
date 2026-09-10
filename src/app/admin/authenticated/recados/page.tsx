export const dynamic = "force-dynamic";
export const revalidate = 0;

import Layout from "@/src/components/Layout";
import RecadosClient from "./recados-client";
import { prisma } from "@/src/lib/prisma";
import { requirePageRoles } from "@/src/lib/permissions";
import {
  PAGE_ROLES,
  GLOBAL_ROLES,
} from "@/src/lib/role-permissions";

export default async function GerenciarRecadosPage() {
  const user = await requirePageRoles(
    PAGE_ROLES.recados,
  );

  const canSeeAllUnits = user.roles.some((role) =>
    GLOBAL_ROLES.recados.includes(role),
  );

  const recadosWhere =
    canSeeAllUnits
      ? {}
      : user.unidadeId !== null
        ? { unidadeId: user.unidadeId }
        : { unidadeId: -1 };

  const [recadosRaw, unidades] = await Promise.all([
    prisma.recado.findMany({
      where: recadosWhere,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        unidade: {
          select: {
            id: true,
            nome: true,
          },
        },
        unidades: {
          include: {
            unidade: {
              select: {
                id: true,
                nome: true,
              },
            },
          },
        },
      },
    }),

    prisma.unidade.findMany({
      orderBy: {
        nome: "asc",
      },
    }),
  ]);

  const recados = recadosRaw.map((recado) => ({
    id: recado.id,
    titulo: recado.titulo,
    conteudo: recado.conteudo,
    imagem: recado.imagem ?? undefined,
    unidadeId: recado.unidadeId,
    unidade: recado.unidade,
    unidadeIds: recado.unidades.map(
      (item) => item.unidade.id,
    ),
    createdAt: recado.createdAt,
  }));

  return (
    <Layout>
      <RecadosClient
        initialRecados={recados}
        initialUnidades={unidades}
        userRoles={user.roles}
        userUnidadeId={user.unidadeId}
      />
    </Layout>
  );
}