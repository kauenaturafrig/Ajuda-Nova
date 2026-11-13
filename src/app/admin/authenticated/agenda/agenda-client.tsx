//src/app/admin/authenticated/agenda/agenda-client.tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Plus,
  Pencil,
  Trash2,
  Copy,
  ArrowLeft,
  Search,
  X,
  Clock,
  MapPin,
  AlignLeft,
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  AlertCircle,
  Lock,
} from "lucide-react";

import type { AppUserRole } from "@/src/types/user";
import {
  BADGE_TONE,
  formatDataHora,
  statusDoEvento,
  toInputDate,
  toInputTime,
  unidadeCor,
} from "@/src/lib/agenda-utils";

type Unidade = { id: number; nome: string };

type EventoAdmin = {
  id: number;
  titulo: string;
  descricao: string | null;
  data: string;
  unidadeId: number;
  unidade: Unidade;
  criadoPorId: string;
  atualizadoPorId: string | null;
  createdAt: string;
  updatedAt: string;
};

type Props = {
  initialEventos: EventoAdmin[];
  initialUnidades: Unidade[];
  userRoles: AppUserRole[];
  userUnidadeId: number | null;
  userName: string;
};

type EventoForm = {
  titulo: string;
  descricao: string;
  data: string;
  hora: string;
  unidadeId: number;
};

type SortKey = "data-asc" | "data-desc" | "titulo-asc" | "unidade-asc";
type Aba = "proximos" | "concluidos" | "todos";

const SORT_LABELS: Record<SortKey, string> = {
  "data-asc": "Data (mais próxima)",
  "data-desc": "Data (mais distante)",
  "titulo-asc": "Título (A-Z)",
  "unidade-asc": "Unidade (A-Z)",
};

const inputCls =
  "mt-2 h-12 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white";

export default function AgendaAdminClient({
  initialEventos,
  initialUnidades,
  userRoles,
  userUnidadeId,
}: Props) {
  const [eventos, setEventos] = useState(initialEventos);
  const [unidades, setUnidades] = useState(initialUnidades);

  // Relógio do navegador (evita hydration mismatch com fuso do servidor)
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editando, setEditando] = useState<EventoAdmin | null>(null);
  const [removendo, setRemovendo] = useState<EventoAdmin | null>(null);
  const [erroForm, setErroForm] = useState("");
  const [toast, setToast] = useState<{ tipo: "ok" | "erro"; msg: string } | null>(null);

  const [aba, setAba] = useState<Aba>("proximos");
  const [busca, setBusca] = useState("");
  const [filtroUnidade, setFiltroUnidade] = useState<number | "all">("all");
  const [ordenacao, setOrdenacao] = useState<SortKey>("data-asc");

  const canManage = userRoles.includes("OWNER") || userRoles.includes("EVENTS");

  const unidadePadrao =
    (userUnidadeId && unidades.some((u) => u.id === userUnidadeId) ? userUnidadeId : unidades[0]?.id) || 0;

  const [form, setForm] = useState<EventoForm>({
    titulo: "",
    descricao: "",
    data: "",
    hora: "08:00",
    unidadeId: unidadePadrao,
  });

  const avisar = useCallback((tipo: "ok" | "erro", msg: string) => {
    setToast({ tipo, msg });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await fetch("/admin/api/agenda", { cache: "no-store" });
      const data = await res.json();
      if (data.eventos) setEventos(data.eventos);
      if (data.unidades) setUnidades(data.unidades);
    } finally {
      setLoading(false);
    }
  };

  const closeForm = useCallback(() => {
    if (saving) return;
    setFormOpen(false);
    setEditando(null);
    setErroForm("");
  }, [saving]);

  useEffect(() => {
    if (!formOpen && !removendo) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (removendo) setRemovendo(null);
      else closeForm();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [formOpen, removendo, closeForm]);

  const openForm = (evento?: EventoAdmin, duplicar = false) => {
    setErroForm("");

    if (evento) {
      // Usa o fuso LOCAL (antes lia o horário em UTC e mostrava hora errada ao editar)
      const d = new Date(evento.data);
      setEditando(duplicar ? null : evento);
      setForm({
        titulo: duplicar ? `${evento.titulo} (cópia)` : evento.titulo,
        descricao: evento.descricao || "",
        data: toInputDate(d),
        hora: toInputTime(d),
        unidadeId: evento.unidadeId,
      });
    } else {
      setEditando(null);
      setForm({
        titulo: "",
        descricao: "",
        data: toInputDate(new Date()),
        hora: "08:00",
        unidadeId: unidadePadrao,
      });
    }

    setFormOpen(true);
  };

  const handleSubmit = async () => {
    if (!canManage) {
      setErroForm("Usuário não autorizado.");
      return;
    }
    if (!form.titulo.trim()) {
      setErroForm("Informe um título para o evento.");
      return;
    }
    if (!form.data || !form.hora) {
      setErroForm("Informe a data e a hora.");
      return;
    }
    if (!form.unidadeId) {
      setErroForm("Selecione a unidade.");
      return;
    }

    const body = {
      titulo: form.titulo.trim(),
      descricao: form.descricao.trim() || null,
      data: new Date(`${form.data}T${form.hora}:00`).toISOString(),
      unidadeId: form.unidadeId,
    };

    setSaving(true);
    setErroForm("");

    try {
      const res = await fetch(editando ? `/admin/api/agenda/${editando.id}` : "/admin/api/agenda", {
        method: editando ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        setErroForm("Erro ao salvar evento. Tente novamente.");
        return;
      }

      await refresh();
      setFormOpen(false);
      setEditando(null);
      avisar("ok", editando ? "Evento atualizado." : "Evento criado.");
    } catch {
      setErroForm("Erro de conexão ao salvar o evento.");
    } finally {
      setSaving(false);
    }
  };

  const confirmarRemocao = async () => {
    if (!removendo) return;
    if (!canManage) {
      avisar("erro", "Usuário não autorizado.");
      setRemovendo(null);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/admin/api/agenda/${removendo.id}`, { method: "DELETE" });
      if (!res.ok) {
        avisar("erro", "Erro ao remover evento.");
        return;
      }
      await refresh();
      avisar("ok", "Evento removido.");
    } catch {
      avisar("erro", "Erro ao remover evento.");
    } finally {
      setSaving(false);
      setRemovendo(null);
    }
  };

  /* ---------- Derivados ---------- */

  const contagens = useMemo(() => {
    if (!now) return { total: eventos.length, hoje: 0, proximos: 0, concluidos: 0 };
    const hojeKey = toInputDate(now);
    let hoje = 0;
    let proximos = 0;
    let concluidos = 0;
    for (const ev of eventos) {
      const d = new Date(ev.data);
      if (toInputDate(d) === hojeKey) hoje++;
      if (d.getTime() >= now.getTime() || toInputDate(d) === hojeKey) proximos++;
      else concluidos++;
    }
    return { total: eventos.length, hoje, proximos, concluidos };
  }, [eventos, now]);

  const eventosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    const hojeKey = now ? toInputDate(now) : "";

    const lista = eventos.filter((ev) => {
      if (filtroUnidade !== "all" && ev.unidadeId !== filtroUnidade) return false;

      if (now && aba !== "todos") {
        const d = new Date(ev.data);
        const futuro = d.getTime() >= now.getTime() || toInputDate(d) === hojeKey;
        if (aba === "proximos" && !futuro) return false;
        if (aba === "concluidos" && futuro) return false;
      }

      if (!termo) return true;
      return (
        ev.titulo.toLowerCase().includes(termo) ||
        ev.unidade.nome.toLowerCase().includes(termo) ||
        (ev.descricao || "").toLowerCase().includes(termo)
      );
    });

    return [...lista].sort((a, b) => {
      switch (ordenacao) {
        case "data-desc":
          return b.data.localeCompare(a.data);
        case "titulo-asc":
          return a.titulo.localeCompare(b.titulo, "pt-BR");
        case "unidade-asc":
          return a.unidade.nome.localeCompare(b.unidade.nome, "pt-BR");
        case "data-asc":
        default:
          return a.data.localeCompare(b.data);
      }
    });
  }, [eventos, busca, filtroUnidade, ordenacao, aba, now]);

  const abas: { id: Aba; label: string; n: number }[] = [
    { id: "proximos", label: "Próximos", n: contagens.proximos },
    { id: "concluidos", label: "Concluídos", n: contagens.concluidos },
    { id: "todos", label: "Todos", n: contagens.total },
  ];

  return (
    <>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <main className="mx-auto w-full max-w-[90rem] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-sm dark:bg-emerald-900/30 dark:text-emerald-400">
              <Calendar size={30} />
            </span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Gerenciar Agenda
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Crie, edite e remova os eventos de cada unidade.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/agenda"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-600 transition-colors hover:text-gray-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-300 dark:hover:text-white"
            >
              <ArrowLeft size={16} />
              Agenda pública
            </Link>

            {canManage && (
              <button
                type="button"
                onClick={() => openForm()}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
              >
                <Plus size={16} />
                Novo evento
              </button>
            )}
          </div>
        </header>

        {!canManage && (
          <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300">
            <Lock size={16} className="mt-0.5 shrink-0" />
            Você pode visualizar os eventos, mas não tem permissão para criar, editar ou remover.
          </div>
        )}

        {/* Resumo */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { icon: Calendar, label: "Total de eventos", value: contagens.total, tone: "bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-gray-300" },
            { icon: CalendarCheck, label: "Hoje", value: contagens.hoje, tone: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
            { icon: CalendarClock, label: "Próximos", value: contagens.proximos, tone: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" },
            { icon: CheckCircle2, label: "Concluídos", value: contagens.concluidos, tone: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400" },
          ].map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-[#111a2d]"
            >
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${s.tone}`}>
                <s.icon size={20} />
              </span>
              <div>
                <p className="text-2xl font-bold leading-none text-gray-900 dark:text-white">{s.value}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-[#111a2d] sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="grid grid-cols-3 gap-1 rounded-xl bg-gray-100 p-1 dark:bg-neutral-800 lg:w-auto">
              {abas.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setAba(a.id)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    aba === a.id
                      ? "bg-white text-gray-900 shadow-sm dark:bg-neutral-700 dark:text-white"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                  }`}
                >
                  {a.label}
                  <span className="ml-1.5 text-xs text-gray-400">{a.n}</span>
                </button>
              ))}
            </div>

            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por título, unidade ou descrição..."
                className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-9 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              />
              {busca && (
                <button
                  type="button"
                  onClick={() => setBusca("")}
                  aria-label="Limpar busca"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 dark:border-neutral-700 dark:bg-neutral-900">
              <MapPin size={15} className="shrink-0 text-gray-400" />
              <select
                value={filtroUnidade}
                onChange={(e) =>
                  setFiltroUnidade(e.target.value === "all" ? "all" : Number(e.target.value))
                }
                className="h-11 cursor-pointer bg-transparent pr-1 text-sm text-gray-900 focus:outline-none dark:text-white"
              >
                <option value="all">Todas as unidades</option>
                {unidades.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nome}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={ordenacao}
              onChange={(e) => setOrdenacao(e.target.value as SortKey)}
              className="h-11 cursor-pointer rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
            >
              {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
                <option key={k} value={k}>
                  {SORT_LABELS[k]}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Lista */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Eventos cadastrados</h2>
            <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 dark:bg-neutral-800 dark:text-gray-300">
              {eventosFiltrados.length} de {eventos.length}
            </span>
          </div>

          {loading || !now ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-44 animate-pulse rounded-2xl bg-white/70 dark:bg-neutral-900/40" />
              ))}
            </div>
          ) : eventosFiltrados.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center dark:border-neutral-800 dark:bg-[#111a2d]">
              <Calendar size={28} className="mx-auto mb-3 text-gray-300 dark:text-neutral-600" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {eventos.length === 0
                  ? "Nenhum evento cadastrado ainda."
                  : "Nenhum evento corresponde à aba, busca ou filtros."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {eventosFiltrados.map((ev) => {
                const status = statusDoEvento(ev.data, now);
                const c = unidadeCor(ev.unidadeId);
                const d = new Date(ev.data);

                return (
                  <article
                    key={ev.id}
                    className={`group flex flex-col gap-4 rounded-2xl border border-gray-100 border-l-4 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-neutral-800/80 dark:bg-[#111a2d] ${
                      status.tone === "past" ? "opacity-60" : ""
                    }`}
                    style={{ borderLeftColor: c.solid }}
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl leading-none"
                        style={{ color: c.solid, backgroundColor: c.soft }}
                      >
                        <span className="text-lg font-bold">{d.getDate()}</span>
                        <span className="text-[0.5625rem] font-semibold uppercase">
                          {d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "")}
                        </span>
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="break-words text-base font-bold leading-snug text-gray-900 dark:text-white">
                            {ev.titulo}
                          </h3>
                          {status.label && (
                            <span
                              className={`shrink-0 rounded-md px-2 py-0.5 text-[0.5625rem] font-bold uppercase tracking-wider ${BADGE_TONE[status.tone]}`}
                            >
                              {status.label}
                            </span>
                          )}
                        </div>

                        <span
                          className="mt-1.5 inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.6875rem] font-semibold"
                          style={{ color: c.solid, backgroundColor: c.soft, borderColor: c.border }}
                        >
                          <MapPin size={10} className="shrink-0" />
                          <span className="truncate">{ev.unidade.nome}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <Clock size={15} className="text-emerald-600 dark:text-emerald-400" />
                      {formatDataHora(ev.data)}
                    </div>

                    {ev.descricao && (
                      <p className="line-clamp-3 whitespace-pre-line break-words text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                        {ev.descricao}
                      </p>
                    )}

                    {canManage && (
                      <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4 dark:border-neutral-800">
                        <button
                          type="button"
                          onClick={() => openForm(ev)}
                          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-blue-50 px-3 text-sm font-semibold text-blue-600 transition-colors hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-300 dark:hover:bg-blue-500/20"
                        >
                          <Pencil size={13} />
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => openForm(ev, true)}
                          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-gray-100 px-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-200 dark:bg-neutral-800 dark:text-gray-300 dark:hover:bg-neutral-700"
                        >
                          <Copy size={13} />
                          Duplicar
                        </button>
                        <button
                          type="button"
                          onClick={() => setRemovendo(ev)}
                          className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-lg bg-red-50 px-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/20"
                        >
                          <Trash2 size={13} />
                          Remover
                        </button>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Formulário */}
      {formOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
            style={{ animation: "fadeIn 0.2s ease" }}
            onClick={closeForm}
          />

          <div
            className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 sm:p-8"
            style={{ animation: "popIn 0.2s ease" }}
          >
            <div className="mb-5 flex items-center justify-between">
              <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                {editando ? "Editar evento" : "Novo evento"}
              </h4>
              <button
                type="button"
                onClick={closeForm}
                aria-label="Fechar"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-neutral-800 dark:hover:text-gray-200"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Título</label>
                <input
                  autoFocus
                  value={form.titulo}
                  onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  placeholder="Ex: Auditoria de qualidade — Linha 3"
                  className={inputCls}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Unidade</label>
                <div className="relative">
                  <span
                    className="pointer-events-none absolute left-3 top-1/2 mt-1 h-2.5 w-2.5 -translate-y-1/2 rounded-full"
                    style={{ backgroundColor: unidadeCor(form.unidadeId).solid }}
                  />
                  <select
                    value={form.unidadeId}
                    onChange={(e) => setForm({ ...form, unidadeId: Number(e.target.value) })}
                    className={`${inputCls} pl-8`}
                  >
                    {unidades.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.nome}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Data</label>
                  <input
                    type="date"
                    value={form.data}
                    onChange={(e) => setForm({ ...form, data: e.target.value })}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Hora</label>
                  <input
                    type="time"
                    value={form.hora}
                    onChange={(e) => setForm({ ...form, hora: e.target.value })}
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <AlignLeft size={12} />
                  Descrição
                  <span className="font-normal text-gray-400">(opcional)</span>
                </label>
                <textarea
                  value={form.descricao}
                  onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                  rows={3}
                  placeholder="Detalhes adicionais sobre o evento, como instruções, links ou contatos."
                  className="mt-2 w-full resize-y rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                />
              </div>
            </div>

            {erroForm && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-300">
                <AlertCircle size={16} className="shrink-0" />
                {erroForm}
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="h-10 rounded-xl bg-gray-100 px-4 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50 dark:bg-neutral-800 dark:text-gray-300 dark:hover:bg-neutral-700"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving}
                className="h-10 rounded-xl bg-emerald-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
              >
                {saving ? "Salvando..." : editando ? "Salvar alterações" : "Criar evento"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmação de remoção */}
      {removendo && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" role="alertdialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
            style={{ animation: "fadeIn 0.2s ease" }}
            onClick={() => !saving && setRemovendo(null)}
          />
          <div
            className="relative w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
            style={{ animation: "popIn 0.2s ease" }}
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                <Trash2 size={20} />
              </span>
              <div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">Remover evento?</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Essa ação não pode ser desfeita.</p>
              </div>
            </div>

            <p className="mb-6 rounded-xl bg-gray-50 p-3 text-sm text-gray-700 dark:bg-neutral-800 dark:text-gray-200">
              <span className="font-semibold">{removendo.titulo}</span>
              <span className="block text-xs text-gray-500 dark:text-gray-400">
                {removendo.unidade.nome} · {formatDataHora(removendo.data)}
              </span>
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setRemovendo(null)}
                disabled={saving}
                className="h-10 rounded-xl bg-gray-100 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-200 disabled:opacity-50 dark:bg-neutral-800 dark:text-gray-300 dark:hover:bg-neutral-700"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmarRemocao}
                disabled={saving}
                className="h-10 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {saving ? "Removendo..." : "Remover"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Aviso */}
      {toast && (
        <div
          role="status"
          className={`fixed bottom-6 right-6 z-[120] flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-xl ${
            toast.tipo === "ok" ? "bg-emerald-600" : "bg-red-600"
          }`}
          style={{ animation: "slideUp 0.25s ease" }}
        >
          {toast.tipo === "ok" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
        </div>
      )}
    </>
  );
}