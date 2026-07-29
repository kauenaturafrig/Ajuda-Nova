export const dynamic = "force-dynamic";
export const revalidate = 0;

import { prisma } from "@/src/lib/prisma";
import { headers } from "next/headers";
import { getUnidadeByIp } from "@/src/lib/getUnidadeByIp";
import DashboardPage from "./dashboard-client";

export default async function Page() {
  // Identifica a unidade pelo IP, igual à tela de Recados
  const h = await headers();
  const ip =
    h.get("x-forwarded-for") ??
    h.get("x-real-ip") ??
    h.get("x-forwarded-host");
  const unidadeId = getUnidadeByIp(ip);

  const [ultimaNoticia, ultimoRecado] = await Promise.all([
    prisma.noticia.findFirst({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        titulo: true,
        conteudo: true,
        imagem: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    unidadeId
      ? prisma.recado.findFirst({
          where: {
            unidades: {
              some: { unidadeId },
            },
          },
          orderBy: { createdAt: "desc" },
          include: {
            unidade: true,
            unidades: { include: { unidade: true } },
          },
        })
      : null,
  ]);

  return (
    <DashboardPage
      ultimaNoticia={ultimaNoticia}
      ultimoRecado={ultimoRecado}
      unidadeId={unidadeId}
    />
  );
}