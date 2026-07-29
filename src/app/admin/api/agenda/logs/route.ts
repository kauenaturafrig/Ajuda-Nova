//src/app/admin/api/agenda/logs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { prisma } from "@/src/lib/prisma";

export const dynamic = "force-dynamic";

const noCacheHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

async function requireUser(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session?.user?.id) return null;

  return prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true, name: true },
  });
}

export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (user.role !== "OWNER") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const logs = await prisma.agendaEventoAudit.findMany({
      orderBy: { createdAt: "desc" },
    });

    const eventoIds = [...new Set(logs.map((log) => log.eventoId))];

    const eventos = await prisma.agendaEvento.findMany({
      where: { id: { in: eventoIds } },
      include: { unidade: true },
    });

    const eventosMap = new Map(eventos.map((evento) => [evento.id, evento]));

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
      { headers: noCacheHeaders }
    );
  } catch (e: any) {
    console.error("GET agenda logs Error:", e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}