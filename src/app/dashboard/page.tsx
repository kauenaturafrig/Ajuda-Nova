export const dynamic = "force-dynamic";
export const revalidate = 0;

import { prisma } from "@/src/lib/prisma";
import { headers } from "next/headers";
import { getUnidadeByIp } from "@/src/lib/getUnidadeByIp";
import DashboardPage from "./dashboard-client";

const DIA_MS = 24 * 60 * 60 * 1000;
const NOVO_DIAS = 3;

export default async function Page() {
  const h = await headers();

  const ip =
    h.get("x-forwarded-for") ??
    h.get("x-real-ip") ??
    h.get("x-forwarded-host");

  const unidadeId = getUnidadeByIp(ip);
  const temUnidade = unidadeId !== null;

  const agora = Date.now();
  const desdeRecadoNovo = new Date(agora - NOVO_DIAS * DIA_MS);

  // Margem de 1 dia; o client filtra o dia exato.
  const desdeEventos = new Date(agora - DIA_MS);

  const recadoWhere = temUnidade
    ? { unidades: { some: { unidadeId } } }
    : null;

  const [noticias, recados, recadosNovos, eventos, unidadeComRamais] =
    await Promise.all([
      prisma.noticia.findMany({
        orderBy: { createdAt: "desc" },
        take: 3,
        select: {
          id: true,
          titulo: true,
          conteudo: true,
          imagem: true,
          createdAt: true,
          updatedAt: true,
        },
      }),

      recadoWhere
        ? prisma.recado.findMany({
            where: recadoWhere,
            orderBy: { createdAt: "desc" },
            take: 3,
            include: { unidade: true },
          })
        : [],

      recadoWhere
        ? prisma.recado.count({
            where: {
              ...recadoWhere,
              createdAt: { gte: desdeRecadoNovo },
            },
          })
        : 0,

      // Agenda continua mostrando os eventos de todas as unidades.
      prisma.agendaEvento.findMany({
        where: { data: { gte: desdeEventos } },
        orderBy: { data: "asc" },
        include: { unidade: true },
      }),

      // Carrega somente os ramais da unidade identificada pelo IP.
      // Se a unidade não for identificada, não consulta os ramais.
      temUnidade
        ? prisma.unidade.findFirst({
            where: { id: unidadeId },
            select: {
              ramais: {
                orderBy: [
                  { setor: "asc" },
                  { nome: "asc" },
                ],
                select: {
                  id: true,
                  nome: true,
                  setor: true,
                  numero: true,
                },
              },
            },
          })
        : null,
    ]);

  const ramais = (unidadeComRamais?.ramais ?? []).map((r) => ({
    id: r.id,
    // Na página de exemplo, nome pode ser null.
    nome: r.nome?.trim() || r.setor || "Sem identificação",
    setor: r.setor,
    numero: r.numero,
  }));

  return (
    <DashboardPage
      noticias={noticias.map((n) => ({
        id: n.id,
        titulo: n.titulo,
        conteudo: n.conteudo,
        imagem: n.imagem,
        createdAt: n.createdAt.toISOString(),
        updatedAt: n.updatedAt ? n.updatedAt.toISOString() : null,
      }))}
      recados={recados.map((r) => ({
        id: r.id,
        titulo: r.titulo,
        conteudo: r.conteudo,
        createdAt: r.createdAt.toISOString(),
        unidade: {
          id: r.unidade.id,
          nome: r.unidade.nome,
        },
      }))}
      recadosNovos={recadosNovos}
      eventos={eventos.map((ev) => ({
        id: ev.id,
        titulo: ev.titulo,
        descricao: ev.descricao,
        data: ev.data.toISOString(),
        unidade: {
          id: ev.unidade.id,
          nome: ev.unidade.nome,
        },
      }))}
      ramais={ramais}
      unidadeId={unidadeId}
    />
  );
}