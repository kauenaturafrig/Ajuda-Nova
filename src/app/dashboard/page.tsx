export const dynamic = "force-dynamic";
export const revalidate = 0;

import { prisma } from "@/src/lib/prisma";
import { headers } from "next/headers";
import { getUnidadeByIp } from "@/src/lib/getUnidadeByIp";
import DashboardPage from "./dashboard-client";

export default async function Page() {
  const h = await headers();

  const ip =
    h.get("x-forwarded-for") ??
    h.get("x-real-ip") ??
    h.get("x-forwarded-host");

  const unidadeId = getUnidadeByIp(ip);
  const agora = new Date();

  const [ultimaNoticia, ultimoRecado, proximoEvento] =
    await Promise.all([
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
            unidades: {
              include: { unidade: true },
            },
          },
        })
        : null,

      prisma.agendaEvento.findFirst({
        where: {
          data: {
            gte: agora,
          },
          ...(unidadeId
            ? { unidadeId }
            : {}),
        },
        orderBy: {
          data: "asc",
        },
        include: {
          unidade: true,
        },
      }),
    ]);

  return (
    <DashboardPage
      ultimaNoticia={ultimaNoticia}
      ultimoRecado={ultimoRecado}
      proximoEvento={proximoEvento}
      unidadeId={unidadeId}
    />
  );
}