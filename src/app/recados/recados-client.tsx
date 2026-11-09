// src/app/recados/recados-client.tsx
"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  X,
  Maximize2,
  Megaphone,
  Search,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Clock,
  Inbox,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
} from "lucide-react";
import { categoriaCores } from "@/src/lib/categoria-cor";

/* ---------- Tipos ---------- */

interface Categoria {
  id: number;
  nome: string;
  slug: string;
  cor?: string | null;
}

interface Recado {
  id: number;
  titulo: string;
  conteudo: string;
  imagem?: string | null;
  unidadeId: number;
  unidade: { id: number; nome: string };
  unidades: Array<{
    id: number;
    unidadeId: number;
    unidade: { id: number; nome: string };
  }>;
  createdAt: Date;
  updatedAt?: Date;
  categorias: Categoria[];
}

interface Props {
  initialRecados: Recado[];
  unidadeId: number;
}

type Tipo = "especifico" | "inter" | "global";
type RecadoView = Recado & { tipo: Tipo; data: Date };

/* ---------- Constantes ---------- */

const DIA_MS = 86_400_000;
const NOVO_DIAS = 3;

const TIPOS: Record<
  Tipo,
  { label: string; bar: string; dot: string; pill: string }
> = {
  especifico: {
    label: "Específico",
    bar: "bg-emerald-500",
    dot: "bg-emerald-500",
    pill: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  },
  inter: {
    label: "Inter-unidades",
    bar: "bg-blue-500",
    dot: "bg-blue-500",
    pill: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  },
  global: {
    label: "Global",
    bar: "bg-purple-500",
    dot: "bg-purple-500",
    pill: "bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
  },
};

const card =
  "rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-[#111a2d]";

/* ---------- Helpers ---------- */

function tipoDe(qtdUnidades: number): Tipo {
  if (qtdUnidades <= 1) return "especifico";
  if (qtdUnidades <= 3) return "inter";
  return "global";
}

function getImagemUrl(recado: Recado) {
  if (!recado.imagem) return "";
  const version = recado.updatedAt
    ? new Date(recado.updatedAt).getTime()
    : new Date(recado.createdAt).getTime();
  return `/admin/api/uploads/recados/${recado.imagem}?v=${version}`;
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function hora(d: Date) {
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function grupoDe(d: Date, now: Date) {
  const diff = Math.round((startOfDay(now) - startOfDay(d)) / DIA_MS);
  if (diff <= 0) return "Hoje";
  if (diff === 1) return "Ontem";
  if (diff <= 7) return "Esta semana";
  if (d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()) {
    return "Este mês";
  }
  const m = d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  return m.charAt(0).toUpperCase() + m.slice(1);
}

function dataRelativa(d: Date, now: Date) {
  const diff = Math.round((startOfDay(now) - startOfDay(d)) / DIA_MS);
  if (diff <= 0) return `Hoje, ${hora(d)}`;
  if (diff === 1) return `Ontem, ${hora(d)}`;
  if (diff <= 7) return `Há ${diff} dias`;
  return d.toLocaleDateString("pt-BR");
}

function normalize(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/* ---------- Peças ---------- */

function StatTile({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl bg-gray-50 px-3 py-3 text-center dark:bg-neutral-800/50">
      <p className="text-2xl font-bold leading-none text-gray-900 dark:text-white">
        {value}
      </p>
      <p className="mt-1.5 text-[0.6875rem] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {label}
      </p>
    </div>
  );
}

function FilterRow({
  active,
  onClick,
  label,
  count,
  dot,
  dotColor,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  dot?: string;
  dotColor?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm transition-colors duration-200 ${
        active
          ? "bg-orange-50 font-semibold text-orange-700 dark:bg-orange-500/10 dark:text-orange-400"
          : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-neutral-800/60"
      }`}
    >
      <span className="flex items-center gap-2.5">
        {dot || dotColor ? (
          <span
            className={`h-2 w-2 rounded-full ${dot ?? ""}`}
            style={dotColor ? { backgroundColor: dotColor } : undefined}
          />
        ) : (
          <span className="h-2 w-2 rounded-full bg-gray-300 dark:bg-neutral-600" />
        )}
        {label}
      </span>
      <span
        className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
          active
            ? "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300"
            : "bg-gray-100 text-gray-500 dark:bg-neutral-800 dark:text-gray-400"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function RecadoCard({
  recado,
  now,
  unidadeId,
  expandido,
  destaque,
  onToggle,
  onImagem,
}: {
  recado: RecadoView;
  now: Date;
  unidadeId: number;
  expandido: boolean;
  destaque: boolean;
  onToggle: () => void;
  onImagem: (src: string) => void;
}) {
  const tipo = TIPOS[recado.tipo];
  const principal = recado.categorias?.[0];
  const imagemUrl = getImagemUrl(recado);
  const novo = now.getTime() - recado.data.getTime() <= NOVO_DIAS * DIA_MS;
  const longo =
    recado.conteudo.length > 200 || recado.conteudo.split("\n").length > 3;

  const unidades = useMemo(
    () =>
      recado.unidades
        .map((u) => u.unidade)
        .sort((a, b) =>
          a.id === unidadeId ? -1 : b.id === unidadeId ? 1 : a.nome.localeCompare(b.nome, "pt-BR"),
        ),
    [recado.unidades, unidadeId],
  );

  const visiveis = unidades.slice(0, 3);
  const restantes = unidades.slice(3);

  return (
    <article
      id={`recado-${recado.id}`}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gray-200/60 dark:bg-[#111a2d] dark:hover:shadow-none sm:flex-row ${
        destaque
          ? "border-orange-400 ring-4 ring-orange-400/20"
          : "border-gray-100 dark:border-neutral-800"
      }`}
    >
      {/* Faixa de cor do tipo */}
      <span
        className={`absolute inset-y-0 left-0 z-10 w-1 ${principal ? "" : tipo.bar}`}
        style={
          principal
            ? { backgroundColor: categoriaCores(principal.cor).solid }
            : undefined
        }
      />

      <div className="flex min-w-0 flex-1 flex-col p-5 pl-6">
        {/* Selos + data */}
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {novo && (
            <span className="rounded-md bg-red-100 px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide text-red-600 dark:bg-red-500/10 dark:text-red-400">
              Novo
            </span>
          )}
          {(recado.categorias ?? []).map((c) => {
            const cores = categoriaCores(c.cor);
            return (
              <span
                key={c.id}
                className="rounded-md px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide"
                style={{ backgroundColor: cores.soft, color: cores.solid }}
              >
                {c.nome}
              </span>
            );
          })}

          <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wide text-gray-500 dark:bg-neutral-800 dark:text-gray-400">
            {tipo.label}
          </span>

          <span className="ml-auto flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <Clock className="h-3.5 w-3.5" />
            {dataRelativa(recado.data, now)}
          </span>
        </div>

        <h3 className="text-lg font-bold leading-snug text-gray-900 dark:text-white">
          {recado.titulo}
        </h3>

        <p
          className={`mt-1.5 whitespace-pre-line text-sm leading-relaxed text-gray-600 dark:text-gray-300 ${
            expandido ? "" : "line-clamp-3"
          }`}
        >
          {recado.conteudo}
        </p>

        {longo && (
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={expandido}
            className="mt-2 inline-flex w-fit items-center gap-1 text-sm font-semibold text-orange-600 transition-colors duration-200 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300"
          >
            {expandido ? "Ler menos" : "Ler mais"}
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-300 ${
                expandido ? "rotate-180" : ""
              }`}
            />
          </button>
        )}

        {/* Rodapé: unidades + data completa */}
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3 dark:border-neutral-800">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-orange-500" />

          {visiveis.map((u) => (
            <span
              key={u.id}
              className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                u.id === unidadeId
                  ? "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400"
                  : "bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-gray-300"
              }`}
            >
              {u.nome}
            </span>
          ))}

          {restantes.length > 0 && (
            <span
              title={restantes.map((u) => u.nome).join(", ")}
              className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500 dark:bg-neutral-800 dark:text-gray-400"
            >
              +{restantes.length}
            </span>
          )}

          <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
            {recado.data.toLocaleDateString("pt-BR")} · {hora(recado.data)}
          </span>
        </div>
      </div>

      {/* Imagem */}
      {recado.imagem && (
        <button
          type="button"
          onClick={() => onImagem(imagemUrl)}
          aria-label={`Ampliar imagem de ${recado.titulo}`}
          className="relative h-48 w-full shrink-0 cursor-zoom-in overflow-hidden bg-gray-100 dark:bg-neutral-800 sm:h-auto sm:min-h-[9rem] sm:w-56"
        >
          <Image
            src={imagemUrl}
            alt={recado.titulo}
            fill
            sizes="(max-width: 640px) 100vw, 224px"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
          <span className="absolute right-3 top-3 rounded-full bg-black/60 p-1.5 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Maximize2 className="h-4 w-4" />
          </span>
        </button>
      )}
    </article>
  );
}

function CardSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-36 animate-pulse rounded-2xl bg-white dark:bg-[#111a2d]"
        />
      ))}
    </div>
  );
}

/* ---------- Página ---------- */

export default function RecadosClient({ initialRecados, unidadeId }: Props) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
  }, []);

  const searchRef = useRef<HTMLInputElement>(null);

  const [imagemModal, setImagemModal] = useState<string | null>(null);
  const [zoomScale, setZoomScale] = useState(1);

  const [busca, setBusca] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState<Tipo | "todos">("todos");
  const [categoriaFiltro, setCategoriaFiltro] = useState<number | "todas">(
    "todas",
  );
  const [ordem, setOrdem] = useState<"recentes" | "antigos">("recentes");
  const [pagina, setPagina] = useState(1);
  const [porPagina, setPorPagina] = useState(10);

  const [expandidos, setExpandidos] = useState<Set<number>>(new Set());
  const [destaqueId, setDestaqueId] = useState<number | null>(null);

  const abrirImagem = useCallback((src: string) => {
    setImagemModal(src);
    setZoomScale(1);
  }, []);

  const fecharImagem = useCallback(() => {
    setImagemModal(null);
    setZoomScale(1);
  }, []);

  const toggleExpandido = useCallback((id: number) => {
    setExpandidos((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  /* Zoom da imagem + atalhos */
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!imagemModal) return;
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setZoomScale((prev) => Math.max(0.5, Math.min(5, prev * delta)));
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") fecharImagem();
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };

    document.addEventListener("wheel", handleWheel, { passive: false });
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("wheel", handleWheel);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [imagemModal, fecharImagem]);

  /* Vindo da dashboard (/recados#id): vai para a página do recado, abre e destaca */
  useEffect(() => {
    const id = Number(window.location.hash.replace("#", ""));
    if (!id) return;

    const ordenados = [...initialRecados].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    const idx = ordenados.findIndex((r) => r.id === id);
    if (idx === -1) return;

    setPagina(Math.floor(idx / 10) + 1);
    setExpandidos(new Set([id]));
    setDestaqueId(id);

    const t1 = setTimeout(() => {
      document
        .getElementById(`recado-${id}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 200);
    const t2 = setTimeout(() => setDestaqueId(null), 4000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [initialRecados]);

  /* Dados derivados */
  const itens = useMemo<RecadoView[]>(
    () =>
      initialRecados.map((r) => ({
        ...r,
        tipo: tipoDe(r.unidades.length),
        data: new Date(r.createdAt),
      })),
    [initialRecados],
  );

  const contagem = useMemo(() => {
    const c = { todos: itens.length, especifico: 0, inter: 0, global: 0 };
    for (const r of itens) c[r.tipo] += 1;
    return c;
  }, [itens]);

  /* Categorias que realmente aparecem nos recados desta unidade */
  const categoriasLista = useMemo(() => {
    const map = new Map<number, { cat: Categoria; count: number }>();
    for (const r of initialRecados) {
      for (const c of r.categorias ?? []) {
        const atual = map.get(c.id);
        if (atual) atual.count += 1;
        else map.set(c.id, { cat: c, count: 1 });
      }
    }
    return [...map.values()].sort((a, b) =>
      a.cat.nome.localeCompare(b.cat.nome, "pt-BR"),
    );
  }, [initialRecados]);

  const stats = useMemo(() => {
    if (!now) return { novos: 0, mes: 0 };
    return {
      novos: itens.filter((r) => now.getTime() - r.data.getTime() <= NOVO_DIAS * DIA_MS).length,
      mes: itens.filter(
        (r) =>
          r.data.getFullYear() === now.getFullYear() &&
          r.data.getMonth() === now.getMonth(),
      ).length,
    };
  }, [itens, now]);

  const nomeUnidade = useMemo(() => {
    for (const r of initialRecados) {
      const u = r.unidades.find((x) => x.unidadeId === unidadeId);
      if (u) return u.unidade.nome;
    }
    return `Unidade ${unidadeId}`;
  }, [initialRecados, unidadeId]);

  const filtrados = useMemo(() => {
    const termo = normalize(busca.trim());

    const lista = itens.filter((r) => {
      if (tipoFiltro !== "todos" && r.tipo !== tipoFiltro) return false;
      if (
        categoriaFiltro !== "todas" &&
        !(r.categorias ?? []).some((c) => c.id === categoriaFiltro)
      ) {
        return false;
      }
      if (!termo) return true;
      return (
        normalize(r.titulo).includes(termo) ||
        normalize(r.conteudo).includes(termo) ||
        r.unidades.some((u) => normalize(u.unidade.nome).includes(termo)) ||
        (r.categorias ?? []).some((c) => normalize(c.nome).includes(termo))
      );
    });

    lista.sort((a, b) =>
      ordem === "recentes"
        ? b.data.getTime() - a.data.getTime()
        : a.data.getTime() - b.data.getTime(),
    );

    return lista;
  }, [itens, busca, tipoFiltro, categoriaFiltro, ordem]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / porPagina));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const inicio = (paginaAtual - 1) * porPagina;
  const pagePag = filtrados.slice(inicio, inicio + porPagina);

  const grupos = useMemo(() => {
    if (!now) return [];
    const out: { label: string; itens: RecadoView[] }[] = [];
    for (const r of pagePag) {
      const label = grupoDe(r.data, now);
      const ultimo = out[out.length - 1];
      if (ultimo && ultimo.label === label) ultimo.itens.push(r);
      else out.push({ label, itens: [r] });
    }
    return out;
  }, [pagePag, now]);

  const filtrosAtivos =
    !!busca || tipoFiltro !== "todos" || categoriaFiltro !== "todas";

  function mudarFiltro(t: Tipo | "todos") {
    setTipoFiltro(t);
    setPagina(1);
  }

  function mudarCategoria(c: number | "todas") {
    setCategoriaFiltro(c);
    setPagina(1);
  }

  return (
    <div className="mx-auto w-full max-w-[90rem] px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 shadow-sm dark:bg-orange-900/30 dark:text-orange-400">
            <Megaphone className="h-[1.875rem] w-[1.875rem]" />
          </span>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Recados
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Comunicados e recados importantes entre unidades.
            </p>
          </div>
        </div>

        <div className="relative w-full lg:w-96">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            ref={searchRef}
            type="text"
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value);
              setPagina(1);
            }}
            placeholder="Buscar recados, unidades..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-16 text-sm text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300 focus:border-orange-500/50 focus:outline-none focus:ring-4 focus:ring-orange-500/10 dark:border-neutral-800 dark:bg-[#111a2d] dark:text-white dark:hover:border-neutral-700"
          />
          {busca ? (
            <button
              type="button"
              onClick={() => {
                setBusca("");
                setPagina(1);
              }}
              aria-label="Limpar busca"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 transition-colors hover:text-gray-700 dark:hover:text-gray-200"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-[0.6875rem] font-semibold text-gray-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-400 sm:block">
              Ctrl K
            </kbd>
          )}
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        {/* Lista */}
        <main className="min-w-0 lg:order-first">
          {!now ? (
            <CardSkeleton />
          ) : filtrados.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-gray-300 bg-white/60 px-6 py-16 text-center dark:border-neutral-700 dark:bg-[#111a2d]/60">
              <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-neutral-800">
                <Inbox className="h-7 w-7" />
              </span>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Nenhum recado encontrado
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {filtrosAtivos
                  ? "Nenhum resultado para a busca ou o filtro escolhido."
                  : "Nenhum recado para esta unidade."}
              </p>
              {filtrosAtivos && (
                <button
                  type="button"
                  onClick={() => {
                    setBusca("");
                    mudarFiltro("todos");
                    mudarCategoria("todas");
                  }}
                  className="mt-4 rounded-xl bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700 transition-colors hover:bg-orange-100 dark:bg-orange-500/10 dark:text-orange-400 dark:hover:bg-orange-500/20"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {grupos.map((grupo) => (
                <section key={grupo.label}>
                  <div className="mb-3 flex items-center gap-3">
                    <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-gray-500 dark:text-gray-400">
                      {grupo.label}
                    </h2>
                    <span className="h-px flex-1 bg-gray-300/70 dark:bg-neutral-800" />
                    <span className="text-xs text-gray-400">
                      {grupo.itens.length}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {grupo.itens.map((recado) => (
                      <RecadoCard
                        key={recado.id}
                        recado={recado}
                        now={now}
                        unidadeId={unidadeId}
                        expandido={expandidos.has(recado.id)}
                        destaque={destaqueId === recado.id}
                        onToggle={() => toggleExpandido(recado.id)}
                        onImagem={abrirImagem}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}

          {/* Paginação */}
          {now && filtrados.length > 0 && (
            <div className="mt-6 flex flex-col items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400 sm:flex-row">
              <span>
                Mostrando {inicio + 1} a{" "}
                {Math.min(inicio + porPagina, filtrados.length)} de{" "}
                {filtrados.length} recados
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPagina((p) => Math.max(1, p - 1))}
                  disabled={paginaAtual === 1}
                  aria-label="Página anterior"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-800 dark:bg-[#111a2d] dark:hover:bg-neutral-800"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <span className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-orange-500 px-2 font-semibold text-white">
                  {paginaAtual}
                </span>
                <span className="text-xs text-gray-400">de {totalPaginas}</span>

                <button
                  type="button"
                  onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                  disabled={paginaAtual === totalPaginas}
                  aria-label="Próxima página"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-800 dark:bg-[#111a2d] dark:hover:bg-neutral-800"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                <select
                  value={porPagina}
                  onChange={(e) => {
                    setPorPagina(Number(e.target.value));
                    setPagina(1);
                  }}
                  className="ml-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600 outline-none dark:border-neutral-800 dark:bg-[#111a2d] dark:text-gray-300"
                >
                  <option value={10}>10 por página</option>
                  <option value={20}>20 por página</option>
                  <option value={50}>50 por página</option>
                </select>
              </div>
            </div>
          )}
        </main>

        {/* Painel lateral */}
        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          {/* Unidade */}
          <div className={`${card} flex items-center gap-3`}>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-md">
              <MapPin className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Sua unidade
              </p>
              <p className="truncate text-sm font-bold text-gray-900 dark:text-white">
                {nomeUnidade}
              </p>
            </div>
          </div>

          {/* Resumo */}
          <div className={card}>
            <h2 className="mb-3 text-sm font-bold text-gray-900 dark:text-white">
              Resumo
            </h2>
            <div className="grid grid-cols-3 gap-2">
              <StatTile value={contagem.todos} label="Total" />
              <StatTile value={stats.novos} label="Novos" />
              <StatTile value={stats.mes} label="No mês" />
            </div>
          </div>

          {/* Categorias */}
          {categoriasLista.length > 0 && (
            <div className={card}>
              <h2 className="mb-2 text-sm font-bold text-gray-900 dark:text-white">
                Categorias
              </h2>
              <div className="space-y-0.5">
                <FilterRow
                  active={categoriaFiltro === "todas"}
                  onClick={() => mudarCategoria("todas")}
                  label="Todas"
                  count={contagem.todos}
                />
                {categoriasLista.map(({ cat, count }) => (
                  <FilterRow
                    key={cat.id}
                    active={categoriaFiltro === cat.id}
                    onClick={() => mudarCategoria(cat.id)}
                    label={cat.nome}
                    count={count}
                    dotColor={categoriaCores(cat.cor).solid}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Escopo (quantas unidades recebem o recado) */}
          <div className={card}>
            <h2 className="mb-2 text-sm font-bold text-gray-900 dark:text-white">
              Escopo
            </h2>
            <div className="space-y-0.5">
              <FilterRow
                active={tipoFiltro === "todos"}
                onClick={() => mudarFiltro("todos")}
                label="Todos"
                count={contagem.todos}
              />
              {(Object.keys(TIPOS) as Tipo[]).map((t) => (
                <FilterRow
                  key={t}
                  active={tipoFiltro === t}
                  onClick={() => mudarFiltro(t)}
                  label={TIPOS[t].label}
                  count={contagem[t]}
                  dot={TIPOS[t].dot}
                />
              ))}
            </div>
          </div>

          {/* Ordem */}
          <div className={card}>
            <h2 className="mb-2 text-sm font-bold text-gray-900 dark:text-white">
              Ordenar
            </h2>
            <div className="flex rounded-xl bg-gray-100 p-1 dark:bg-neutral-800/60">
              {(
                [
                  ["recentes", "Recentes", ArrowDownWideNarrow],
                  ["antigos", "Antigos", ArrowUpNarrowWide],
                ] as const
              ).map(([valor, rotulo, Icone]) => (
                <button
                  key={valor}
                  type="button"
                  onClick={() => {
                    setOrdem(valor);
                    setPagina(1);
                  }}
                  aria-pressed={ordem === valor}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-all duration-200 ${
                    ordem === valor
                      ? "bg-white text-gray-900 shadow-sm dark:bg-neutral-700 dark:text-white"
                      : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                >
                  <Icone className="h-4 w-4" />
                  {rotulo}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Modal de zoom */}
      {imagemModal && (
        <>
          <div
            className="fixed inset-0 z-[9999] bg-black/95"
            onClick={fecharImagem}
          />

          <div className="pointer-events-none fixed inset-0 z-[10000] flex items-center justify-center p-8">
            <div
              className="relative h-[90vh] w-full max-w-6xl overflow-hidden rounded-2xl shadow-2xl"
              style={{
                transform: `scale(${zoomScale})`,
                transformOrigin: "center center",
              }}
            >
              <Image
                src={imagemModal}
                alt="Imagem em tamanho real"
                fill
                className="object-contain"
                sizes="90vw"
                priority
              />
            </div>
          </div>

          <button
            type="button"
            className="fixed right-6 top-6 z-[10001] rounded-2xl bg-black/80 p-3 text-white shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:bg-black"
            onClick={fecharImagem}
            aria-label="Fechar imagem"
          >
            <X className="h-7 w-7" />
          </button>

          <div className="fixed bottom-8 left-1/2 z-[10001] -translate-x-1/2 whitespace-nowrap rounded-2xl bg-black/90 px-6 py-3 text-sm font-medium text-white shadow-2xl backdrop-blur-xl">
            Scroll para zoom • ESC para fechar
            {zoomScale !== 1 && ` • ${Math.round(zoomScale * 100)}%`}
          </div>
        </>
      )}
    </div>
  );
}