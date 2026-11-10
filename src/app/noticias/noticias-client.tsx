"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  Maximize2,
  X,
  Newspaper,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Clock,
  Inbox,
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
} from "lucide-react";
import { categoriaCores } from "@/src/lib/categoria-cor";

interface Categoria {
  id: number;
  nome: string;
  slug: string;
  cor?: string | null;
}

interface Noticia {
  id: number;
  titulo: string;
  conteudo: string;
  imagem: string | null | undefined;
  createdAt: Date;
  updatedAt?: Date;
  categorias: Categoria[];
}

const card =
  "rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-[#111a2d]";

function normalizar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function FilterRow({
  active,
  onClick,
  label,
  count,
  dotColor,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  dotColor?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm transition-colors ${
        active
          ? "bg-blue-50 font-semibold text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
          : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-neutral-800/60"
      }`}
    >
      <span className="flex items-center gap-2.5">
        <span
          className="h-2 w-2 rounded-full bg-gray-300 dark:bg-neutral-600"
          style={dotColor ? { backgroundColor: dotColor } : undefined}
        />
        {label}
      </span>
      <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-500 dark:bg-neutral-800 dark:text-gray-400">
        {count}
      </span>
    </button>
  );
}

function getImagemUrl(noticia: Noticia) {
  if (!noticia.imagem) return "";
  const version = noticia.updatedAt
    ? new Date(noticia.updatedAt).getTime()
    : new Date(noticia.createdAt).getTime();
  return `/admin/api/uploads/noticias/${noticia.imagem}?v=${version}`;
}

export default function NoticiasPublica({
  initialNoticias,
}: {
  initialNoticias: Noticia[];
}) {
  const [imagemModal, setImagemModal] = useState<string | null>(null);
  const [zoomScale, setZoomScale] = useState(1);
  const imagemRef = useRef<HTMLDivElement>(null);

  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(1);
  const [porPagina, setPorPagina] = useState(10);
  const [categoriaFiltro, setCategoriaFiltro] = useState<number | "todas">("todas");
  const [ordem, setOrdem] = useState<"recentes" | "antigas">("recentes");
  const [expandidos, setExpandidos] = useState<Set<number>>(new Set());
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
  }, []);

  const abrirImagem = useCallback((src: string) => {
    setImagemModal(src);
    setZoomScale(1);
  }, []);

  const fecharImagem = useCallback(() => {
    setImagemModal(null);
    setZoomScale(1);
  }, []);

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
        document.getElementById("busca-noticias")?.focus();
      }
    };

    document.addEventListener("wheel", handleWheel, { passive: false });
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("wheel", handleWheel);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [imagemModal, fecharImagem]);

  const noticiasFiltradas = useMemo(() => {
    const termo = normalizar(busca.trim());
    const filtradas = initialNoticias.filter((noticia) => {
      if (
        categoriaFiltro !== "todas" &&
        !(noticia.categorias ?? []).some((categoria) => categoria.id === categoriaFiltro)
      ) {
        return false;
      }

      if (!termo) return true;
      return (
        normalizar(noticia.titulo).includes(termo) ||
        normalizar(noticia.conteudo).includes(termo) ||
        (noticia.categorias ?? []).some((categoria) =>
          normalizar(categoria.nome).includes(termo),
        )
      );
    });

    filtradas.sort((a, b) =>
      ordem === "recentes"
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
    return filtradas;
  }, [initialNoticias, busca, categoriaFiltro, ordem]);

  const categoriasLista = useMemo(() => {
    const map = new Map<number, { categoria: Categoria; count: number }>();
    for (const noticia of initialNoticias) {
      for (const categoria of noticia.categorias ?? []) {
        const atual = map.get(categoria.id);
        if (atual) atual.count += 1;
        else map.set(categoria.id, { categoria, count: 1 });
      }
    }

    return [...map.values()].sort((a, b) =>
      a.categoria.nome.localeCompare(b.categoria.nome, "pt-BR"),
    );
  }, [initialNoticias]);

  const noticiasEsteMes = now
    ? initialNoticias.filter((noticia) => {
        const data = new Date(noticia.createdAt);
        return (
          data.getFullYear() === now.getFullYear() &&
          data.getMonth() === now.getMonth()
        );
      }).length
    : 0;
  const noticiasNovas = now
    ? initialNoticias.filter(
        (noticia) =>
          now.getTime() - new Date(noticia.createdAt).getTime() <=
          3 * 86_400_000,
      ).length
    : 0;

  const filtrosAtivos = Boolean(busca) || categoriaFiltro !== "todas";

  function mudarCategoria(categoria: number | "todas") {
    setCategoriaFiltro(categoria);
    setPagina(1);
  }

  const totalPaginas = Math.max(1, Math.ceil(noticiasFiltradas.length / porPagina));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const inicio = (paginaAtual - 1) * porPagina;
  const noticiasPagina = noticiasFiltradas.slice(inicio, inicio + porPagina);

  return (
    <div className="mx-auto w-full max-w-[90rem] px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-14 h-14 rounded-2xl shrink-0 shadow-sm bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            <Newspaper size={30} />
          </span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Notícias
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Fique por dentro das novidades e comunicados da empresa.
            </p>
          </div>
        </div>

        <div className="relative w-full lg:max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            id="busca-noticias"
            type="search"
            value={busca}
            onChange={(e) => {
              setBusca(e.target.value);
              setPagina(1);
            }}
            placeholder="Buscar notícias e categorias..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-16 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:border-neutral-800 dark:bg-[#111a2d] dark:text-white"
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] text-gray-400 sm:block dark:border-neutral-700 dark:bg-neutral-800">
            Ctrl K
          </kbd>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <main className="min-w-0">
          {noticiasPagina.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-gray-300 bg-white/60 px-6 py-16 text-center dark:border-neutral-700 dark:bg-[#111a2d]/60">
              <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-neutral-800">
                <Inbox className="h-7 w-7" />
              </span>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Nenhuma notícia encontrada
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {filtrosAtivos
                  ? "Nenhum resultado para a busca ou categoria selecionada."
                  : "Aguardando a primeira publicação."}
              </p>
              {filtrosAtivos && (
                <button
                  type="button"
                  onClick={() => {
                    setBusca("");
                    mudarCategoria("todas");
                  }}
                  className="mt-4 rounded-xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {noticiasPagina.map((noticia) => {
                const imagemUrl = getImagemUrl(noticia);
                const principal = noticia.categorias?.[0];
                const data = new Date(noticia.createdAt);
                const novo =
                  now !== null &&
                  now.getTime() - data.getTime() <= 3 * 86_400_000;
                const expandido = expandidos.has(noticia.id);
                const longo =
                  noticia.conteudo.length > 240 ||
                  noticia.conteudo.split("\n").length > 3;

                return (
                  <article
                    key={noticia.id}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-neutral-800 dark:bg-[#111a2d]"
                  >
                    <span
                      className="absolute inset-y-0 left-0 z-10 w-1 bg-blue-500"
                      style={
                        principal
                          ? { backgroundColor: categoriaCores(principal.cor).solid }
                          : undefined
                      }
                    />
                    <div className="flex min-w-0 flex-1 flex-col p-5 pl-6">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        {novo && (
                          <span className="rounded-md bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-red-600 dark:bg-red-500/10 dark:text-red-400">
                            Nova
                          </span>
                        )}
                        {(noticia.categorias ?? []).map((categoria) => {
                          const cores = categoriaCores(categoria.cor);
                          return (
                            <span
                              key={categoria.id}
                              className="rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
                              style={{
                                backgroundColor: cores.soft,
                                color: cores.solid,
                              }}
                            >
                              {categoria.nome}
                            </span>
                          );
                        })}
                        <span className="ml-auto flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                          <Clock className="h-3.5 w-3.5" />
                          {data.toLocaleDateString("pt-BR")} ·{" "}
                          {data.toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <h2 className="text-lg font-bold leading-snug text-gray-900 dark:text-white">
                        {noticia.titulo}
                      </h2>

                      <p
                        className={`mt-1.5 whitespace-pre-line text-sm leading-relaxed text-gray-600 dark:text-gray-300 ${
                          expandido ? "" : "line-clamp-4"
                        }`}
                      >
                        {noticia.conteudo}
                      </p>
                      {longo && (
                        <button
                          type="button"
                          onClick={() =>
                            setExpandidos((prev) => {
                              const next = new Set(prev);
                              if (next.has(noticia.id)) next.delete(noticia.id);
                              else next.add(noticia.id);
                              return next;
                            })
                          }
                          aria-expanded={expandido}
                          className="mt-2 inline-flex w-fit items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                        >
                          {expandido ? "Ler menos" : "Ler notícia completa"}
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              expandido ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                      )}

                      {noticia.imagem && (
                        <button
                          type="button"
                          onClick={() => abrirImagem(imagemUrl)}
                          aria-label={`Ampliar imagem de ${noticia.titulo}`}
                          className="relative mt-4 h-52 w-full overflow-hidden rounded-xl bg-gray-100 text-left dark:bg-neutral-800 sm:h-64"
                        >
                          <Image
                            src={imagemUrl}
                            alt={noticia.titulo}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                            sizes="(max-width: 768px) 100vw, 900px"
                          />
                          <span className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white">
                            <Maximize2 className="h-4 w-4" />
                          </span>
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <div className={`${card} flex items-center gap-3`}>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
              <Newspaper className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                Mural corporativo
              </p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                Todas as unidades
              </p>
            </div>
          </div>

          <div className={card}>
            <h2 className="mb-3 text-sm font-bold text-gray-900 dark:text-white">
              Resumo
            </h2>
            <div className="grid grid-cols-3 gap-2">
              {[
                ["Total", initialNoticias.length],
                ["Novas", noticiasNovas],
                ["No mês", noticiasEsteMes],
              ].map(([label, count]) => (
                <div
                  key={label}
                  className="rounded-xl bg-gray-50 px-2 py-3 text-center dark:bg-neutral-800/50"
                >
                  <p className="text-2xl font-bold leading-none text-gray-900 dark:text-white">
                    {count}
                  </p>
                  <p className="mt-1.5 text-[10px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

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
                  count={initialNoticias.length}
                />
                {categoriasLista.map(({ categoria, count }) => (
                  <FilterRow
                    key={categoria.id}
                    active={categoriaFiltro === categoria.id}
                    onClick={() => mudarCategoria(categoria.id)}
                    label={categoria.nome}
                    count={count}
                    dotColor={categoriaCores(categoria.cor).solid}
                  />
                ))}
              </div>
            </div>
          )}

          <div className={card}>
            <h2 className="mb-2 text-sm font-bold text-gray-900 dark:text-white">
              Ordenar
            </h2>
            <div className="flex rounded-xl bg-gray-100 p-1 dark:bg-neutral-800/60">
              {(
                [
                  ["recentes", "Recentes", ArrowDownWideNarrow],
                  ["antigas", "Antigas", ArrowUpNarrowWide],
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
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-medium transition-all ${
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

      {/* Paginação */}
      {noticiasFiltradas.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 text-sm text-gray-500 dark:text-gray-400">
          <span>
            Mostrando {inicio + 1} a {Math.min(inicio + porPagina, noticiasFiltradas.length)} de{" "}
            {noticiasFiltradas.length} notícias
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
              disabled={paginaAtual === 1}
              className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-600 text-white font-medium">
              {paginaAtual}
            </span>

            <button
              type="button"
              onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
              disabled={paginaAtual === totalPaginas}
              className="flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
            >
              <ChevronRight size={16} />
            </button>

            <select
              value={porPagina}
              onChange={(e) => {
                setPorPagina(Number(e.target.value));
                setPagina(1);
              }}
              className="ml-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg px-3 py-2 text-sm text-gray-600 dark:text-gray-300 outline-none"
            >
              <option value={10}>10 por página</option>
              <option value={20}>20 por página</option>
              <option value={50}>50 por página</option>
            </select>
          </div>
        </div>
      )}


      {imagemModal && (
        <>
          <div
            className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4"
            onClick={fecharImagem}
          />
          <div
            className="fixed inset-0 z-[10000] flex items-center justify-center p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              ref={imagemRef}
              className="relative w-full h-[90vh] max-w-6xl max-h-[90vh] flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl"
              style={{
                cursor: zoomScale > 1.2 ? "grab" : "zoom-in",
                transform: `scale(${zoomScale})`,
                transformOrigin: "center center",
              }}
            >
              <Image
                src={imagemModal}
                alt="Imagem em tamanho real"
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
            <button
              type="button"
              aria-label="Fechar imagem"
              className="fixed top-6 right-6 z-[10001] bg-black/80 hover:bg-black text-white p-3 rounded-2xl backdrop-blur-xl shadow-2xl transition-all hover:scale-110"
              onClick={fecharImagem}
            >
              <X className="w-7 h-7" />
            </button>
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[10001] bg-black/90 text-white px-6 py-3 rounded-2xl text-sm font-medium backdrop-blur-xl">
              Scroll para zoom • ESC para fechar
            </div>
          </div>
        </>
      )}
    </div>
  );
}