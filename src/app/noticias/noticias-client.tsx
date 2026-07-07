"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import Layout from "@/src/components/Layout";
import Image from "next/image";
import {
  Maximize2,
  X,
  Newspaper,
  Search,
  Bell,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Noticia {
  id: number;
  titulo: string;
  conteudo: string;
  imagem: string | null | undefined;
  createdAt: Date;
  updatedAt?: Date;
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
    };

    document.addEventListener("wheel", handleWheel, { passive: false });
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("wheel", handleWheel);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [imagemModal, fecharImagem]);

  const noticiasFiltradas = useMemo(() => {
    if (!busca.trim()) return initialNoticias;
    const termo = busca.toLowerCase();
    return initialNoticias.filter(
      (n) =>
        n.titulo.toLowerCase().includes(termo) ||
        n.conteudo.toLowerCase().includes(termo)
    );
  }, [initialNoticias, busca]);

  const totalPaginas = Math.max(1, Math.ceil(noticiasFiltradas.length / porPagina));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const inicio = (paginaAtual - 1) * porPagina;
  const noticiasPagina = noticiasFiltradas.slice(inicio, inicio + porPagina);

  return (
    <Layout>
      <div className="container mx-auto py-4 w-[90%] max-w-6xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <Newspaper size={24} />
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

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 shadow-sm w-72">
              <Search size={16} className="text-gray-400" />
              <input
                type="text"
                value={busca}
                onChange={(e) => {
                  setBusca(e.target.value);
                  setPagina(1);
                }}
                placeholder="Buscar notícias..."
                className="bg-transparent outline-none text-sm w-full text-gray-700 dark:text-gray-200 placeholder:text-gray-400"
              />
              <kbd className="text-[10px] text-gray-400 border border-gray-200 dark:border-neutral-700 rounded px-1.5 py-0.5">
                ⌘K
              </kbd>
            </div>
            {/* <button
              type="button"
              aria-label="Notificações"
              className="relative flex items-center justify-center w-11 h-11 rounded-full bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-sm hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
            >
              <Bell size={18} className="text-gray-500 dark:text-gray-300" />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
            </button> */}
          </div>
        </div>

        {/* Lista de notícias */}
        <div className="space-y-5">
          {noticiasPagina.map((noticia) => {
            const imagemUrl = getImagemUrl(noticia);

            return (
              <article
                key={noticia.id}
                className="group flex flex-col sm:flex-row gap-0 sm:gap-0 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                {noticia.imagem && (
                  <div
                    className="relative w-full sm:w-72 h-56 sm:h-auto shrink-0 bg-gray-100 dark:bg-gray-800 cursor-zoom-in overflow-hidden"
                    onClick={() => abrirImagem(imagemUrl)}
                  >
                    <Image
                      src={imagemUrl}
                      alt={noticia.titulo}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 288px"
                    />
                    <button className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="flex-1 min-w-0 p-6 flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-2">
                                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {noticia.titulo}
                  </h3>
                    <span className="inline-flex w-fit px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      Notícia
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                    {noticia.conteudo}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100 dark:border-neutral-800">
                    <span className="text-xs text-gray-400">
                      Publicado em
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(noticia.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {noticiasFiltradas.length === 0 && (
          <div className="text-center py-20 col-span-full">
            <h3 className="text-3xl font-bold mb-4 dark:text-white">
              Nenhuma notícia
            </h3>
            <p className="text-muted-foreground text-lg">
              {busca ? "Nenhum resultado para sua busca" : "Aguardando primeira publicação"}
            </p>
          </div>
        )}

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
      </div>

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
              className="w-full h-[90vh] max-w-6xl max-h-[90vh] flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl"
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
    </Layout>
  );
}