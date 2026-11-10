// src/app/agenda/agenda-client.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Search,
  MapPin,
  Clock,
  AlignLeft,
  X,
  CalendarDays,
  CalendarCheck,
  CalendarClock,
} from "lucide-react";
import {
  BADGE_TONE,
  dayKey,
  formatHora,
  mesmoDia,
  rotuloDia,
  startOfDay,
  statusDoEvento,
  unidadeCor,
} from "@/src/lib/agenda-utils";

type EventoPublico = {
  id: number;
  titulo: string;
  descricao?: string | null;
  data: string;
  unidade: { id: number; nome: string };
};

type Props = { initialEventos: EventoPublico[] };

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

/* ---------- Peças ---------- */

function UnidadeTag({ unidade }: { unidade: { id: number; nome: string } }) {
  const c = unidadeCor(unidade.id);
  return (
    <span
      className="inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.6875rem] font-semibold"
      style={{ color: c.solid, backgroundColor: c.soft, borderColor: c.border }}
    >
      <MapPin size={10} className="shrink-0" />
      <span className="truncate">{unidade.nome}</span>
    </span>
  );
}

function EventoItem({ ev, now }: { ev: EventoPublico; now: Date }) {
  const status = statusDoEvento(ev.data, now);
  const c = unidadeCor(ev.unidade.id);

  return (
    <div
      className={`flex gap-3 rounded-xl border border-gray-100 border-l-4 bg-white p-3.5 transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900/60 ${
        status.tone === "past" ? "opacity-60" : ""
      }`}
      style={{ borderLeftColor: c.solid }}
    >
      <div className="flex w-14 shrink-0 flex-col items-center justify-center rounded-lg bg-gray-50 py-1.5 dark:bg-neutral-800">
        <Clock size={12} className="mb-0.5 text-gray-400" />
        <span className="text-sm font-bold text-gray-800 dark:text-gray-100">
          {formatHora(ev.data)}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className="break-words text-sm font-semibold leading-snug text-gray-900 dark:text-white">
            {ev.titulo}
          </h4>
          {status.label && (
            <span
              className={`shrink-0 rounded-md px-2 py-0.5 text-[0.5625rem] font-bold uppercase tracking-wider ${BADGE_TONE[status.tone]}`}
            >
              {status.label}
            </span>
          )}
        </div>

        <div className="mt-1.5">
          <UnidadeTag unidade={ev.unidade} />
        </div>

        {ev.descricao && (
          <p className="mt-2 flex items-start gap-1.5 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
            <AlignLeft size={12} className="mt-0.5 shrink-0" />
            <span className="line-clamp-3 whitespace-pre-line break-words">
              {ev.descricao}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Calendar;
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-[#111a2d]">
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tone}`}>
        <Icon size={20} />
      </span>
      <div>
        <p className="text-2xl font-bold leading-none text-gray-900 dark:text-white">
          {value}
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{label}</p>
      </div>
    </div>
  );
}

/* ---------- Página ---------- */

export default function AgendaPublicClient({ initialEventos }: Props) {
  const eventos = initialEventos;

  // Datas dependem do relógio do navegador: só montamos depois do mount (evita hydration mismatch).
  const [now, setNow] = useState<Date | null>(null);
  const [currMonth, setCurrMonth] = useState<Date>(new Date(2000, 0, 1));
  const [selecionado, setSelecionado] = useState<Date | null>(null);

  const [busca, setBusca] = useState("");
  const [filtroUnidade, setFiltroUnidade] = useState<number | "all">("all");

  useEffect(() => {
    const n = new Date();
    setNow(n);
    setCurrMonth(new Date(n.getFullYear(), n.getMonth(), 1));
    setSelecionado(startOfDay(n));
  }, []);

  const unidades = useMemo(() => {
    const map = new Map<number, string>();
    eventos.forEach((ev) => map.set(ev.unidade.id, ev.unidade.nome));
    return Array.from(map, ([id, nome]) => ({ id, nome })).sort((a, b) =>
      a.nome.localeCompare(b.nome, "pt-BR"),
    );
  }, [eventos]);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return eventos
      .filter((ev) => {
        if (filtroUnidade !== "all" && ev.unidade.id !== filtroUnidade) return false;
        if (!termo) return true;
        return (
          ev.titulo.toLowerCase().includes(termo) ||
          ev.unidade.nome.toLowerCase().includes(termo) ||
          (ev.descricao || "").toLowerCase().includes(termo)
        );
      })
      .sort((a, b) => a.data.localeCompare(b.data));
  }, [eventos, busca, filtroUnidade]);

  const porDia = useMemo(() => {
    const map: Record<string, EventoPublico[]> = {};
    for (const ev of filtrados) {
      const k = dayKey(new Date(ev.data));
      (map[k] ||= []).push(ev);
    }
    return map;
  }, [filtrados]);

  const stats = useMemo(() => {
    if (!now) return { hoje: 0, semana: 0, mes: 0 };
    const limite = new Date(now.getTime() + 7 * 86400000);
    return {
      hoje: filtrados.filter((ev) => mesmoDia(new Date(ev.data), now)).length,
      semana: filtrados.filter((ev) => {
        const d = new Date(ev.data);
        return d >= startOfDay(now) && d <= limite;
      }).length,
      mes: filtrados.filter((ev) => {
        const d = new Date(ev.data);
        return (
          d.getFullYear() === currMonth.getFullYear() &&
          d.getMonth() === currMonth.getMonth()
        );
      }).length,
    };
  }, [filtrados, now, currMonth]);

  const proximos = useMemo(() => {
    if (!now) return [];
    const inicio = startOfDay(now).getTime();
    return filtrados.filter((ev) => new Date(ev.data).getTime() >= inicio).slice(0, 8);
  }, [filtrados, now]);

  const eventosDoSelecionado = selecionado ? porDia[dayKey(selecionado)] ?? [] : [];

  const firstDay = new Date(currMonth.getFullYear(), currMonth.getMonth(), 1);
  const daysInMonth = new Date(currMonth.getFullYear(), currMonth.getMonth() + 1, 0).getDate();
  const startWeekday = firstDay.getDay();

  const mudarMes = (delta: number) =>
    setCurrMonth(new Date(currMonth.getFullYear(), currMonth.getMonth() + delta, 1));

  const irParaHoje = () => {
    if (!now) return;
    setCurrMonth(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelecionado(startOfDay(now));
  };

  return (
    <div className="mx-auto w-full max-w-[90rem] px-4 py-6 sm:px-6 lg:px-8">
      {/* Cabeçalho */}
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex items-center gap-3">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-sm dark:bg-emerald-900/30 dark:text-emerald-400">
            <Calendar size={30} />
          </span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Agenda de Auditorias
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Acompanhe as próximas auditorias de todas as unidades.
            </p>
          </div>
        </div>

        <div className="flex w-full items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 lg:w-80">
          <Search size={16} className="text-gray-400" />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar título, unidade ou descrição..."
            className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400 dark:text-gray-200"
          />
          {busca && (
            <button
              type="button"
              onClick={() => setBusca("")}
              aria-label="Limpar busca"
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {!now || !selecionado ? (
        <div className="h-96 animate-pulse rounded-2xl bg-white/60 dark:bg-neutral-900/40" />
      ) : (
        <>
          {/* Resumo */}
          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StatCard
              icon={CalendarCheck}
              label="Auditorias hoje"
              value={stats.hoje}
              tone="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
            />
            <StatCard
              icon={CalendarClock}
              label="Nos próximos 7 dias"
              value={stats.semana}
              tone="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
            />
            <StatCard
              icon={CalendarDays}
              label={`Em ${currMonth.toLocaleDateString("pt-BR", { month: "long" })}`}
              value={stats.mes}
              tone="bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
            {/* Calendário */}
            <section className="min-w-0 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-[#111a2d] sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <h2 className="text-xl font-bold capitalize text-gray-900 dark:text-white">
                  {currMonth.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
                </h2>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={irParaHoje}
                    className="h-9 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:text-gray-300 dark:hover:bg-neutral-800"
                  >
                    Hoje
                  </button>
                  <button
                    type="button"
                    onClick={() => mudarMes(-1)}
                    aria-label="Mês anterior"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:text-gray-300 dark:hover:bg-neutral-800"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => mudarMes(1)}
                    aria-label="Próximo mês"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:text-gray-300 dark:hover:bg-neutral-800"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Filtro por unidade (também serve de legenda de cores) */}
              {unidades.length > 1 && (
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFiltroUnidade("all")}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                      filtroUnidade === "all"
                        ? "border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900"
                        : "border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                    }`}
                  >
                    Todas
                  </button>
                  {unidades.map((u) => {
                    const ativo = filtroUnidade === u.id;
                    const c = unidadeCor(u.id);
                    return (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => setFiltroUnidade(ativo ? "all" : u.id)}
                        aria-pressed={ativo}
                        className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold transition-colors"
                        style={
                          ativo
                            ? { color: c.solid, backgroundColor: c.soft, borderColor: c.solid }
                            : undefined
                        }
                      >
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.solid }} />
                        <span className={ativo ? "" : "text-gray-500 dark:text-gray-400"}>{u.nome}</span>
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                {DIAS_SEMANA.map((d) => (
                  <div
                    key={d}
                    className="pb-1 text-center text-[0.6875rem] font-bold uppercase tracking-wider text-gray-400"
                  >
                    {d}
                  </div>
                ))}

                {Array.from({ length: startWeekday }).map((_, i) => (
                  <div key={`v-${i}`} />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const dayNum = i + 1;
                  const date = new Date(currMonth.getFullYear(), currMonth.getMonth(), dayNum);
                  const evs = porDia[dayKey(date)] ?? [];
                  const hoje = mesmoDia(date, now);
                  const ativo = mesmoDia(date, selecionado);

                  return (
                    <button
                      key={dayNum}
                      type="button"
                      onClick={() => setSelecionado(date)}
                      aria-pressed={ativo}
                      aria-label={`${date.toLocaleDateString("pt-BR", { day: "numeric", month: "long" })}: ${evs.length} evento${evs.length === 1 ? "" : "s"}`}
                      className={`flex h-16 flex-col gap-1 overflow-hidden rounded-xl border p-1.5 text-left transition-all hover:border-emerald-400/60 hover:shadow-sm sm:h-24 sm:p-2 xl:h-28 ${
                        ativo
                          ? "border-emerald-500 bg-emerald-50/60 ring-1 ring-emerald-500 dark:bg-emerald-500/10"
                          : "border-gray-100 bg-white dark:border-neutral-800 dark:bg-neutral-900"
                      }`}
                    >
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                          hoje
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 dark:text-gray-200"
                        }`}
                      >
                        {dayNum}
                      </span>

                      {/* Telas pequenas: bolinhas */}
                      <div className="flex flex-wrap gap-0.5 sm:hidden">
                        {evs.slice(0, 4).map((ev) => (
                          <span
                            key={ev.id}
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: unidadeCor(ev.unidade.id).solid }}
                          />
                        ))}
                      </div>

                      {/* Telas maiores: chips */}
                      <div className="hidden min-h-0 flex-1 flex-col gap-0.5 sm:flex">
                        {evs.slice(0, 2).map((ev) => {
                          const c = unidadeCor(ev.unidade.id);
                          return (
                            <span
                              key={ev.id}
                              className="truncate rounded-md px-1.5 py-0.5 text-[0.6875rem] font-semibold leading-tight"
                              style={{ color: c.solid, backgroundColor: c.soft }}
                            >
                              {formatHora(ev.data)} {ev.titulo}
                            </span>
                          );
                        })}
                        {evs.length > 2 && (
                          <span className="px-1 text-[0.625rem] text-gray-400">
                            +{evs.length - 2} mais
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Painel lateral */}
            <aside className="space-y-6 xl:sticky xl:top-6 xl:self-start">
              <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-[#111a2d]">
                <div className="mb-4">
                  <h3 className="text-base font-bold capitalize text-gray-900 dark:text-white">
                    {rotuloDia(selecionado, now)}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {selecionado.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })} ·{" "}
                    {eventosDoSelecionado.length} auditoria{eventosDoSelecionado.length === 1 ? "" : "s"}
                  </p>
                </div>

                {eventosDoSelecionado.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-gray-200 py-8 text-center dark:border-neutral-800">
                    <Calendar size={22} className="mx-auto mb-2 text-gray-300 dark:text-neutral-600" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Nenhuma auditoria neste dia.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {eventosDoSelecionado.map((ev) => (
                      <EventoItem key={ev.id} ev={ev} now={now} />
                    ))}
                  </div>
                )}
              </section>

              <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-[#111a2d]">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    Próximas auditorias
                  </h3>
                  <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:bg-neutral-800 dark:text-gray-300">
                    {proximos.length}
                  </span>
                </div>

                {proximos.length === 0 ? (
                  <p className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    {eventos.length === 0
                      ? "Nenhum evento cadastrado."
                      : "Nenhuma auditoria futura para os filtros atuais."}
                  </p>
                ) : (
                  <ul className="space-y-1">
                    {proximos.map((ev) => {
                      const d = new Date(ev.data);
                      const c = unidadeCor(ev.unidade.id);
                      return (
                        <li key={ev.id}>
                          <button
                            type="button"
                            onClick={() => {
                              setSelecionado(startOfDay(d));
                              setCurrMonth(new Date(d.getFullYear(), d.getMonth(), 1));
                            }}
                            className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800/60"
                          >
                            <span
                              className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg leading-none"
                              style={{ color: c.solid, backgroundColor: c.soft }}
                            >
                              <span className="text-base font-bold">{d.getDate()}</span>
                              <span className="text-[0.5625rem] font-semibold uppercase">
                                {d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "")}
                              </span>
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-semibold text-gray-900 dark:text-white">
                                {ev.titulo}
                              </span>
                              <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                                {formatHora(ev.data)} · {ev.unidade.nome}
                              </span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
            </aside>
          </div>
        </>
      )}
    </div>
  );
}