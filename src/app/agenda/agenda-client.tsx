//src/app/agenda/agenda-public-client.tsx
"use client";

import { useMemo, useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Calendar,
    Factory,
    Search,
    MapPin,
    Clock,
    AlignLeft,
    X,
    ListFilter,
    CalendarDays,
} from "lucide-react";
import Image from "next/image";

type EventoPúblico = {
    id: number;
    titulo: string;
    descricao?: string | null;
    data: string;
    unidade: {
        id: number;
        nome: string;
    };
};

type Props = {
    initialEventos: EventoPúblico[];
};

function statusDoEvento(dataISO: string) {
    const agora = new Date();
    const data = new Date(dataISO);
    const hojeStr = agora.toDateString();
    const dataStr = data.toDateString();

    if (dataStr === hojeStr) return { label: "Hoje", tone: "live" as const };
    if (data.getTime() < agora.getTime()) return { label: "Concluído", tone: "past" as const };

    const diffDias = Math.ceil((data.getTime() - agora.getTime()) / 86400000);
    if (diffDias <= 7) return { label: `Em ${diffDias} dia${diffDias > 1 ? "s" : ""}`, tone: "soon" as const };
    return { label: null, tone: "future" as const };
}

// Um evento concluído só continua aparecendo na lista se ainda for do mês
// corrente. Eventos concluídos de meses anteriores ficam escondidos da
// listagem (mas seguem visíveis navegando pelo calendário).
function eventoConcluidoAntigoDemais(ev: EventoPúblico) {
    const status = statusDoEvento(ev.data);
    if (status.tone !== "past") return false;

    const agora = new Date();
    const data = new Date(ev.data);
    return !(
        data.getFullYear() === agora.getFullYear() && data.getMonth() === agora.getMonth()
    );
}

function EventoCard({ ev, compact = false }: { ev: EventoPúblico; compact?: boolean }) {
    const status = statusDoEvento(ev.data);
    return (
        <div
            className={`group relative flex flex-col gap-3 bg-white dark:bg-neutral-900/40 rounded-2xl border border-gray-100 dark:border-neutral-800/80 shadow-sm p-4 transition-all duration-300 ${compact ? "" : "hover:-translate-y-1 hover:shadow-lg hover:border-emerald-500/50"
                } ${status.tone === "past" ? "opacity-60" : ""}`}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-11 h-11 shrink-0 bg-zinc-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl p-2 flex items-center justify-center overflow-hidden">
                        <Factory size={17} className="text-emerald-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                            {ev.titulo}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 truncate">
                            <MapPin size={11} className="shrink-0" />
                            {ev.unidade.nome}
                        </div>
                    </div>
                </div>

                {status.label && (
                    <span
                        className={`shrink-0 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${status.tone === "live"
                                ? "bg-emerald-500 text-white"
                                : status.tone === "soon"
                                    ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                                    : "bg-gray-100 text-gray-500 dark:bg-neutral-800 dark:text-gray-400"
                            }`}
                    >
                        {status.label}
                    </span>
                )}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
                <Clock size={12} />
                {new Date(ev.data).toLocaleString("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short",
                })}
            </div>

            {ev.descricao ? (
                <div className="flex items-start gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <AlignLeft size={12} className="shrink-0 mt-0.5" />
                    <span className="line-clamp-3">{ev.descricao}</span>
                </div>
            ) : null}
        </div>
    );
}

export default function AgendaPublicClient({ initialEventos }: Props) {
    const [eventos] = useState(initialEventos);
    const [currMonth, setCurrMonth] = useState(new Date());

    const [busca, setBusca] = useState("");
    const [filtroUnidade, setFiltroUnidade] = useState<number | "all">("all");
    const [diaSelecionado, setDiaSelecionado] = useState<Date | null>(null);

    const unidades = useMemo(() => {
        const map = new Map<number, string>();
        eventos.forEach((ev) => map.set(ev.unidade.id, ev.unidade.nome));
        return Array.from(map, ([id, nome]) => ({ id, nome })).sort((a, b) =>
            a.nome.localeCompare(b.nome, "pt-BR")
        );
    }, [eventos]);

    const firstDay = new Date(currMonth.getFullYear(), currMonth.getMonth(), 1);
    const lastDay = new Date(currMonth.getFullYear(), currMonth.getMonth() + 1, 0);
    const startWeekday = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const prevMonth = () =>
        setCurrMonth(new Date(currMonth.getFullYear(), currMonth.getMonth() - 1, 1));
    const nextMonth = () =>
        setCurrMonth(new Date(currMonth.getFullYear(), currMonth.getMonth() + 1, 1));

    const eventsByDay = useMemo(() => {
        const byDay: Record<string, EventoPúblico[]> = {};
        for (const ev of eventos) {
            const d = new Date(ev.data);
            const iso = d.toISOString().slice(0, 10);
            if (!byDay[iso]) byDay[iso] = [];
            byDay[iso].push(ev);
        }
        return byDay;
    }, [eventos]);

    const eventosFiltrados = useMemo(() => {
        const termo = busca.trim().toLowerCase();
        return eventos
            .filter((ev) => {
                if (eventoConcluidoAntigoDemais(ev)) return false;
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

    const eventosDoDiaSelecionado = useMemo(() => {
        if (!diaSelecionado) return [];
        const iso = diaSelecionado.toISOString().slice(0, 10);
        return (eventsByDay[iso] || []).sort((a, b) => a.data.localeCompare(b.data));
    }, [diaSelecionado, eventsByDay]);

    return (
        <>
            <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: scale(0.85);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>

            <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100 dark:border-neutral-800/60">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                                Agenda de Auditorias
                                <Image
                                    src="/assets/images/icons/icons8-tear-off-calendar-preto.png"
                                    alt="Logo Link"
                                    width={28}
                                    height={28}
                                    className="dark:invert opacity-80"
                                />
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base mt-1">
                                Visualização pública das próximas auditorias em todas as unidades
                            </p>
                        </div>
                    </div>

                    {/* Navegação de mês */}
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={prevMonth}
                            className="flex items-center justify-center w-9 h-9 rounded-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800"
                        >
                            <ChevronLeft size={18} />
                        </button>

                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                            {currMonth.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
                        </h2>

                        <button
                            onClick={nextMonth}
                            className="flex items-center justify-center w-9 h-9 rounded-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-800"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>

                    {/* Calendário */}
                    <div className="grid grid-cols-7 gap-2 mb-10">
                        {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => (
                            <div
                                key={`${d}-${i}`}
                                className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide"
                            >
                                {d}
                            </div>
                        ))}

                        {Array.from({ length: startWeekday }).map((_, i) => (
                            <div key={`empty-start-${i}`} className="h-24" />
                        ))}

                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const dayNum = i + 1;
                            const date = new Date(currMonth.getFullYear(), currMonth.getMonth(), dayNum);
                            const iso = date.toISOString().slice(0, 10);
                            const eventosDoDia = eventsByDay[iso] || [];
                            const isToday = date.toDateString() === new Date().toDateString();

                            return (
                                <button
                                    key={`day-${dayNum}`}
                                    onClick={() => setDiaSelecionado(date)}
                                    className={`h-24 rounded-2xl border p-2 flex flex-col gap-1 overflow-hidden text-left transition-all hover:-translate-y-0.5 hover:shadow-md hover:border-emerald-500/50 cursor-pointer ${isToday
                                            ? "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30"
                                            : "bg-white dark:bg-neutral-900 border-gray-100 dark:border-neutral-800"
                                        }`}
                                >
                                    <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">{dayNum}</div>

                                    {eventosDoDia.length === 0 ? (
                                        <div className="text-xs text-gray-300 dark:text-gray-600">—</div>
                                    ) : (
                                        eventosDoDia.slice(0, 2).map((ev) => (
                                            <div
                                                key={ev.id}
                                                className="text-xs rounded-md px-2 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-500/20"
                                            >
                                                <div className="font-semibold truncate">{ev.titulo}</div>
                                                <div className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80 truncate">
                                                    {ev.unidade.nome}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                    {eventosDoDia.length > 2 && (
                                        <div className="text-[10px] text-gray-400 px-1">
                                            +{eventosDoDia.length - 2} mais
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Buscar e filtrar */}
                    <div className="flex items-center gap-3 mb-4">
                        <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                            <ListFilter size={16} />
                        </span>
                        <div>
                            <h2 className="font-bold text-lg text-gray-900 dark:text-white">
                                Buscar e filtrar
                            </h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                                Encontre auditorias por título, unidade ou descrição
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mb-8">
                        <div className="relative flex-1">
                            <Search
                                size={16}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                value={busca}
                                onChange={(e) => setBusca(e.target.value)}
                                placeholder="Buscar auditoria por título, unidade ou descrição..."
                                className="w-full rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 pl-10 pr-9 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                            {busca && (
                                <button
                                    onClick={() => setBusca("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                                >
                                    <X size={15} />
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2">
                            <MapPin size={15} className="text-gray-400 shrink-0" />
                            <select
                                value={filtroUnidade}
                                onChange={(e) =>
                                    setFiltroUnidade(e.target.value === "all" ? "all" : Number(e.target.value))
                                }
                                className="bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none pr-1 cursor-pointer"
                            >
                                <option value="all">Todas as unidades</option>
                                {unidades.map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.nome}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Lista completa */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                                Próximas auditorias
                            </h3>
                            <span className="text-xs text-gray-400">
                                {eventosFiltrados.length} de {eventos.length}
                            </span>
                        </div>

                        {eventosFiltrados.length === 0 ? (
                            <div className="text-center py-16 rounded-2xl border border-dashed border-gray-200 dark:border-neutral-800">
                                <Calendar size={28} className="mx-auto text-gray-300 dark:text-neutral-600 mb-3" />
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {eventos.length === 0
                                        ? "Nenhum evento cadastrado para este período."
                                        : "Nenhum evento corresponde à busca ou ao filtro."}
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {eventosFiltrados.map((ev) => (
                                    <EventoCard key={ev.id} ev={ev} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Zoom do dia selecionado */}
            {diaSelecionado && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    role="dialog"
                    aria-modal="true"
                >
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-md"
                        style={{ animation: "fadeIn 0.2s ease" }}
                        onClick={() => setDiaSelecionado(null)}
                    />

                    <div
                        className="relative w-full max-w-lg max-h-[80vh] flex flex-col rounded-2xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xl p-6"
                        style={{ animation: "zoomIn 0.2s ease" }}
                    >
                        <div className="flex items-center justify-between mb-5 shrink-0">
                            <div className="flex items-center gap-3">
                                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
                                    <CalendarDays size={18} />
                                </span>
                                <div>
                                    <h4 className="text-base font-semibold text-gray-900 dark:text-white capitalize">
                                        {diaSelecionado.toLocaleDateString("pt-BR", {
                                            weekday: "long",
                                            day: "2-digit",
                                            month: "long",
                                        })}
                                    </h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {eventosDoDiaSelecionado.length} auditoria
                                        {eventosDoDiaSelecionado.length === 1 ? "" : "s"} neste dia
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setDiaSelecionado(null)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-700 dark:hover:text-gray-200 transition-colors shrink-0"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="flex flex-col gap-3 overflow-y-auto pr-1">
                            {eventosDoDiaSelecionado.length === 0 ? (
                                <div className="text-center py-10">
                                    <Calendar size={24} className="mx-auto text-gray-300 dark:text-neutral-600 mb-2" />
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Nenhuma auditoria agendada para este dia.
                                    </p>
                                </div>
                            ) : (
                                eventosDoDiaSelecionado.map((ev) => <EventoCard key={ev.id} ev={ev} compact />)
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}