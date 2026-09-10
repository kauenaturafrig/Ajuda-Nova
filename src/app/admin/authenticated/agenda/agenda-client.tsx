//src/app/admin/authenticated/agenda/agenda-client.tsx
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Plus,
  Pencil,
  Trash2,
  Factory,
  ArrowLeft,
  Search,
  ArrowUpDown,
  X,
  Clock,
  MapPin,
  AlignLeft,
  ListFilter,
} from "lucide-react";
import Image from "next/image";

import type { AppUserRole } from "@/src/types/user";

type Props = {
  initialEventos: EventoAdmin[];
  initialUnidades: Unidade[];
  userRoles: AppUserRole[];
  userUnidadeId: number | null;
  userName: string;
};

type Unidade = {
  id: number;
  nome: string;
};

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

type EventoForm = {
  titulo: string;
  descricao: string;
  data: string;
  hora: string;
  unidadeId: number;
};

type SortKey =
  | "data-asc"
  | "data-desc"
  | "titulo-asc"
  | "unidade-asc";

const SORT_LABELS: Record<SortKey, string> = {
  "data-asc": "Data (mais próxima)",
  "data-desc": "Data (mais distante)",
  "titulo-asc": "Título (A-Z)",
  "unidade-asc": "Unidade (A-Z)",
};

function statusDoEvento(dataISO: string) {
  const agora = new Date();
  const data = new Date(dataISO);
  const hojeStr = agora.toDateString();
  const dataStr = data.toDateString();

  if (dataStr === hojeStr) {
    return {
      label: "Hoje",
      tone: "live" as const,
    };
  }

  if (data.getTime() < agora.getTime()) {
    return {
      label: "Concluído",
      tone: "past" as const,
    };
  }

  const diffDias = Math.ceil(
    (data.getTime() - agora.getTime()) / 86400000,
  );

  if (diffDias <= 7) {
    return {
      label: `Em ${diffDias} dia${
        diffDias > 1 ? "s" : ""
      }`,
      tone: "soon" as const,
    };
  }

  return { label: null, tone: "future" as const };
}

export default function AgendaAdminClient({
  initialEventos,
  initialUnidades,
  userRoles,
  userUnidadeId,
  userName,
}: Props) {
  const [eventos, setEventos] = useState(
    initialEventos,
  );

  const [unidades, setUnidades] = useState(
    initialUnidades,
  );

  const [loading, setLoading] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editando, setEditando] =
    useState<EventoAdmin | null>(null);

  const [saving, setSaving] = useState(false);

  const [busca, setBusca] = useState("");

  const [filtroUnidade, setFiltroUnidade] =
    useState<number | "all">("all");

  const [ordenacao, setOrdenacao] =
    useState<SortKey>("data-asc");

  const [ordenacaoAberta, setOrdenacaoAberta] =
    useState(false);

  const canManage =
    userRoles.includes("OWNER") ||
    userRoles.includes("EVENTS");

  const [form, setForm] = useState<EventoForm>({
    titulo: "",
    descricao: "",
    data: "",
    hora: "08:00",
    unidadeId: unidades[0]?.id || 0,
  });

  const refresh = async () => {
    setLoading(true);

    try {
      const res = await fetch("/admin/api/agenda");
      const data = await res.json();

      if (data.eventos) {
        setEventos(data.eventos);
      }

      if (data.unidades) {
        setUnidades(data.unidades);
      }
    } finally {
      setLoading(false);
    }
  };

  const openForm = (evento?: EventoAdmin) => {
    if (evento) {
      setEditando(evento);

      const dataStr =
        typeof evento.data === "string"
          ? evento.data
          : new Date(
              evento.data as any,
            ).toISOString();

      const [y, m, d] = dataStr
        .slice(0, 10)
        .split("-");

      const [hh, mm] = dataStr
        .slice(11, 16)
        .split(":");

      setForm({
        titulo: evento.titulo,
        descricao: evento.descricao || "",
        data: `${y}-${m}-${d}`,
        hora: `${hh}:${mm}`,
        unidadeId: evento.unidadeId,
      });
    } else {
      setEditando(null);

      setForm({
        titulo: "",
        descricao: "",
        data: new Date()
          .toISOString()
          .slice(0, 10),
        hora: "08:00",
        unidadeId: unidades[0]?.id || 0,
      });
    }

    setFormOpen(true);
  };

  const closeForm = () => {
    if (saving) {
      return;
    }

    setFormOpen(false);
    setEditando(null);
  };

  const handleSubmit = async () => {
    if (!canManage) {
      alert("Usuário não autorizado.");
      return;
    }

    if (!form.titulo.trim()) {
      alert("Informe um título para o evento.");
      return;
    }

    const dataISO = new Date(
      `${form.data}T${form.hora}:00`,
    ).toISOString();

    const body = {
      titulo: form.titulo,
      descricao: form.descricao || null,
      data: dataISO,
      unidadeId: form.unidadeId,
    };

    setSaving(true);

    try {
      const res = await fetch(
        editando
          ? `/admin/api/agenda/${editando.id}`
          : "/admin/api/agenda",
        {
          method: editando ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        },
      );

      if (!res.ok) {
        alert("Erro ao salvar evento.");
        return;
      }

      await refresh();
      closeForm();
    } catch {
      alert("Erro ao salvar evento.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!canManage) {
      alert("Usuário não autorizado.");
      return;
    }

    if (
      !confirm(
        "Tem certeza que deseja remover este evento?",
      )
    ) {
      return;
    }

    try {
      const res = await fetch(
        `/admin/api/agenda/${id}`,
        {
          method: "DELETE",
        },
      );

      if (!res.ok) {
        alert("Erro ao remover evento.");
        return;
      }

      await refresh();
    } catch {
      alert("Erro ao remover evento.");
    }
  };

  const eventosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    let lista = eventos.filter((ev) => {
      if (
        filtroUnidade !== "all" &&
        ev.unidadeId !== filtroUnidade
      ) {
        return false;
      }

      if (!termo) {
        return true;
      }

      return (
        ev.titulo.toLowerCase().includes(termo) ||
        ev.unidade.nome
          .toLowerCase()
          .includes(termo) ||
        (ev.descricao || "")
          .toLowerCase()
          .includes(termo)
      );
    });

    lista = [...lista].sort((a, b) => {
      switch (ordenacao) {
        case "data-desc":
          return b.data.localeCompare(a.data);

        case "titulo-asc":
          return a.titulo.localeCompare(
            b.titulo,
            "pt-BR",
          );

        case "unidade-asc":
          return a.unidade.nome.localeCompare(
            b.unidade.nome,
            "pt-BR",
          );

        case "data-asc":
        default:
          return a.data.localeCompare(b.data);
      }
    });

    return lista;
  }, [
    eventos,
    busca,
    filtroUnidade,
    ordenacao,
  ]);

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
        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>

      <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100 dark:border-neutral-800/60">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                Gerenciamento de Auditorias
                <Image
                  src="/assets/images/icons/icons8-tear-off-calendar-preto.png"
                  alt="Logo Link"
                  width={28}
                  height={28}
                  className="dark:invert opacity-80"
                />
              </h1>

              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base mt-1">
                Área exclusiva para criar, editar e remover eventos
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/agenda"
                className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <ArrowLeft size={16} />
                Voltar à agenda pública
              </Link>

              <button
                onClick={() => openForm()}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600"
              >
                <Plus size={16} />
                Novo evento
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
              <ListFilter size={16} />
            </span>

            <div>
              <h2 className="font-bold text-lg text-gray-900 dark:text-white">
                Buscar e filtrar
              </h2>

              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Encontre eventos por título, unidade ou data
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
                onChange={(e) =>
                  setBusca(e.target.value)
                }
                placeholder="Buscar por título, unidade ou descrição..."
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
              <MapPin
                size={15}
                className="text-gray-400 shrink-0"
              />

              <select
                value={filtroUnidade}
                onChange={(e) =>
                  setFiltroUnidade(
                    e.target.value === "all"
                      ? "all"
                      : Number(e.target.value),
                  )
                }
                className="bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none pr-1 cursor-pointer"
              >
                <option value="all">
                  Todas as unidades
                </option>

                {unidades.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <button
                onClick={() =>
                  setOrdenacaoAberta((v) => !v)
                }
                onBlur={() =>
                  setTimeout(
                    () => setOrdenacaoAberta(false),
                    150,
                  )
                }
                className="w-full sm:w-auto inline-flex items-center justify-between gap-2 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm text-gray-900 dark:text-white hover:border-emerald-500/50 transition-colors"
              >
                <span className="inline-flex items-center gap-2">
                  <ArrowUpDown
                    size={14}
                    className="text-gray-400"
                  />

                  {SORT_LABELS[ordenacao]}
                </span>
              </button>

              {ordenacaoAberta && (
                <div className="absolute right-0 sm:right-auto mt-1.5 w-56 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 shadow-lg overflow-hidden z-20">
                  {(
                    Object.keys(
                      SORT_LABELS,
                    ) as SortKey[]
                  ).map((key) => (
                    <button
                      key={key}
                      onMouseDown={() =>
                        setOrdenacao(key)
                      }
                      className={`w-full text-left px-3.5 py-2.5 text-sm transition-colors ${
                        ordenacao === key
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 font-medium"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-700"
                      }`}
                    >
                      {SORT_LABELS[key]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                Eventos cadastrados
              </h3>

              <span className="text-xs text-gray-400">
                {eventosFiltrados.length} de{" "}
                {eventos.length}
              </span>
            </div>

            {loading ? (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Carregando eventos...
              </div>
            ) : eventosFiltrados.length === 0 ? (
              <div className="text-center py-16 rounded-2xl border border-dashed border-gray-200 dark:border-neutral-800">
                <Calendar
                  size={28}
                  className="mx-auto text-gray-300 dark:text-neutral-600 mb-3"
                />

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {eventos.length === 0
                    ? "Nenhum evento cadastrado ainda."
                    : "Nenhum evento corresponde à busca ou aos filtros."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {eventosFiltrados.map((ev) => {
                  const status = statusDoEvento(
                    ev.data,
                  );

                  return (
                    <div
                      key={ev.id}
                      className={`group relative flex flex-col gap-3 bg-white dark:bg-neutral-900/40 rounded-2xl border border-gray-100 dark:border-neutral-800/80 shadow-sm p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-emerald-500/50 ${
                        status.tone === "past"
                          ? "opacity-60"
                          : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative w-10 h-10 shrink-0 bg-zinc-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl p-2 flex items-center justify-center">
                            <Factory
                              size={16}
                              className="text-emerald-500"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                              {ev.titulo}
                            </div>

                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {ev.unidade.nome}
                            </div>
                          </div>
                        </div>

                        {status.label && (
                          <span
                            className={`shrink-0 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                              status.tone === "live"
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

                      <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                        <Clock size={12} />

                        {new Date(
                          ev.data,
                        ).toLocaleString("pt-BR", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </div>

                      {ev.descricao ? (
                        <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                          {ev.descricao}
                        </div>
                      ) : null}

                      <div className="flex items-center gap-2 mt-1">
                        <button
                          onClick={() => openForm(ev)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300 text-xs font-semibold hover:bg-blue-100 dark:hover:bg-blue-500/20"
                        >
                          <Pencil size={12} />
                          Editar
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(ev.id)
                          }
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300 text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-500/20"
                        >
                          <Trash2 size={12} />
                          Remover
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {formOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
            style={{ animation: "fadeIn 0.2s ease" }}
            onClick={closeForm}
          />

          <div
            className="relative w-full max-w-lg rounded-2xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-2xl p-6"
            style={{ animation: "popIn 0.2s ease" }}
          >
            <div className="flex items-center justify-between mb-5">
              <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                {editando
                  ? "Editar evento"
                  : "Novo evento"}
              </h4>

              <button
                onClick={closeForm}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                  Título
                </label>

                <input
                  autoFocus
                  value={form.titulo}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      titulo: e.target.value,
                    })
                  }
                  placeholder="Ex: Auditoria de qualidade — Linha 3"
                  className="mt-1 w-full rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                  Unidade
                </label>

                <select
                  value={form.unidadeId}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      unidadeId: Number(
                        e.target.value,
                      ),
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {unidades.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                  Data
                </label>

                <input
                  type="date"
                  value={form.data}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      data: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                  Hora
                </label>

                <input
                  type="time"
                  value={form.hora}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      hora: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wide inline-flex items-center gap-1.5">
                  <AlignLeft size={12} />
                  Descrição
                </label>

                <textarea
                  value={form.descricao}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      descricao: e.target.value,
                    })
                  }
                  rows={3}
                  placeholder="Detalhes adicionais sobre a auditoria (opcional)"
                  className="mt-1 w-full rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={closeForm}
                disabled={saving}
                className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 text-sm font-semibold hover:bg-gray-200 dark:hover:bg-neutral-700 disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                onClick={handleSubmit}
                disabled={saving}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 disabled:opacity-60"
              >
                {saving
                  ? "Salvando..."
                  : editando
                    ? "Salvar alterações"
                    : "Criar evento"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}