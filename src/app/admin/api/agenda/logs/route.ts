//src/app/admin/api/agenda/logs/route.ts
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/src/lib/prisma";
import {
  getApiUser,
  hasApiRole,
} from "@/src/lib/api-permissions";

export const dynamic = "force-dynamic";

const noCacheHeaders = {
  "Cache-Control":
    "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

export async function GET(req: NextRequest) {
  try {
    const user = await getApiUser(req);

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    if (!hasApiRole(user, "OWNER")) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 },
      );
    }

    const logs =
      await prisma.agendaEventoAudit.findMany({
        orderBy: { createdAt: "desc" },
      });

    const eventoIds = [
      ...new Set(logs.map((log) => log.eventoId)),
    ];

    const eventos =
      await prisma.agendaEvento.findMany({
        where: { id: { in: eventoIds } },
        include: { unidade: true },
      });

    const eventosMap = new Map(
      eventos.map((evento) => [evento.id, evento]),
    );

    return NextResponse.json(
      logs.map((log) => {
        const evento = eventosMap.get(log.eventoId);

        return {
          id: log.id,
          eventoId: log.eventoId,
          evento: evento
            ? {
                id: evento.id,
                titulo: evento.titulo,
                unidade: {
                  id: evento.unidade.id,
                  nome: evento.unidade.nome,
                },
              }
            : null,
          acao: log.acao,
          dadosAntigos: log.dadosAntigos,
          dadosNovos: log.dadosNovos,
          usuario: log.userNome,
          createdAt: log.createdAt.toISOString(),
        };
      }),
      { headers: noCacheHeaders },
    );
  } catch (e: any) {
    console.error(
      "GET agenda logs Error:",
      e.message,
    );

    return NextResponse.json(
      { error: e.message },
      { status: 500 },
    );
  }
}