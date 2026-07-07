// src/app/recados/recados-client.tsx
"use client";
import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Layout from "@/src/components/Layout";
import {
    X,
    Maximize2,
    Megaphone,
    Search,
    Bell,
    MoreVertical,
    MapPin,
    ChevronLeft,
    ChevronRight,
    PenSquare,
} from "lucide-react";

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
}

interface Props {
    initialRecados: Recado[];
    unidadeId: number;
}

function getImagemUrl(recado: Recado) {
    if (!recado.imagem) return "";
    const version = recado.updatedAt
        ? new Date(recado.updatedAt).getTime()
        : new Date(recado.createdAt).getTime();
    return `/admin/api/uploads/recados/${recado.imagem}?v=${version}`;
}

export default function RecadosClient({ initialRecados, unidadeId }: Props) {
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

    const getClassificacaoUnidade = (qtdUnidades: number) => {
        if (qtdUnidades === 1) {
            return {
                label: "Específico",
                cor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
            };
        }
        if (qtdUnidades <= 3) {
            return {
                label: "Inter-unidades",
                cor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
            };
        }
        return {
            label: "Global",
            cor: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
        };
    };

    const recadosFiltrados = useMemo(() => {
        if (!busca.trim()) return initialRecados;
        const termo = busca.toLowerCase();
        return initialRecados.filter(
            (r) =>
                r.titulo.toLowerCase().includes(termo) ||
                r.conteudo.toLowerCase().includes(termo) ||
                r.unidade?.nome?.toLowerCase().includes(termo)
        );
    }, [initialRecados, busca]);

    const totalPaginas = Math.max(1, Math.ceil(recadosFiltrados.length / porPagina));
    const paginaAtual = Math.min(pagina, totalPaginas);
    const inicio = (paginaAtual - 1) * porPagina;
    const recadosPagina = recadosFiltrados.slice(inicio, inicio + porPagina);

    return (
        <div className="relative">
            <Layout>
                <div className="container mx-auto py-4 w-[90%] max-w-6xl">
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                                <Megaphone size={24} />
                            </span>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    Recados
                                </h1>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                    Comunicados e recados importantes entre unidades.
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
                                    placeholder="Buscar recados, unidades..."
                                    className="bg-transparent outline-none text-sm w-full text-gray-700 dark:text-gray-200 placeholder:text-gray-400"
                                />
                                <kbd className="text-[10px] text-gray-400 border border-gray-200 dark:border-neutral-700 rounded px-1.5 py-0.5">
                                    ⌘K
                                </kbd>
                            </div>
                        </div>
                    </div>

                    {/* Lista de recados */}
                    <div className="space-y-5">
                        {recadosPagina.map((recado) => {
                            const recadoUnidadeIds = recado.unidades.map((u) => u.unidadeId);
                            const classificacao = getClassificacaoUnidade(recadoUnidadeIds.length);
                            const imagemUrl = getImagemUrl(recado);
                            const textoUnidade =
                                recadoUnidadeIds.length === 1
                                    ? recado.unidade.nome || `Unidade ${recado.unidadeId}`
                                    : `${recadoUnidadeIds.length} unidade(s)`;

                            return (
                                <article
                                    key={recado.id}
                                    className="group flex flex-col sm:flex-row bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                                >
                                    {recado.imagem && (
                                        <div
                                            className="relative w-full sm:w-72 h-56 sm:h-auto shrink-0 bg-gray-100 dark:bg-gray-800 cursor-zoom-in overflow-hidden"
                                            onClick={() => abrirImagem(imagemUrl)}
                                        >
                                            <Image
                                                src={imagemUrl}
                                                alt={recado.titulo}
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
                                                {recado.titulo}
                                            </h3>
                                            <span
                                                className={`inline-flex w-fit px-3 py-1 rounded-full text-xs font-medium ${classificacao.cor}`}
                                            >
                                                {classificacao.label}
                                            </span>
                                        </div>

                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                                            {recado.conteudo}
                                        </p>

                                        <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100 dark:border-neutral-800">
                                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                <MapPin size={14} className="text-orange-500" />
                                                {textoUnidade}
                                                <span
                                                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${classificacao.cor}`}
                                                >
                                                    {classificacao.label}
                                                </span>
                                            </div>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(recado.createdAt).toLocaleDateString("pt-BR")}
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                    {recadosFiltrados.length === 0 && (
                        <div className="text-center py-20">
                            <h3 className="text-3xl font-bold mb-4 dark:text-white">
                                Nenhum recado
                            </h3>
                            <p className="text-muted-foreground">
                                {busca
                                    ? "Nenhum resultado para sua busca"
                                    : "Nenhum recado para esta unidade"}
                            </p>
                        </div>
                    )}

                    {/* Paginação */}
                    {recadosFiltrados.length > 0 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 text-sm text-gray-500 dark:text-gray-400">
                            <span>
                                Mostrando {inicio + 1} a{" "}
                                {Math.min(inicio + porPagina, recadosFiltrados.length)} de{" "}
                                {recadosFiltrados.length} recados
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

                    {/* Info da unidade (mantido do original) */}
                    <p className="text-xs text-gray-400 mt-6">
                        Unidade {unidadeId} • {initialRecados.length} recados no total
                    </p>
                </div>
            </Layout>

            {/* ✅ MODAL ZOOM */}
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
                            className="w-full h-full flex items-center justify-center p-4 max-w-7xl max-h-screen"
                            style={{
                                cursor: zoomScale > 1.2 ? "grab" : "zoom-in",
                                transform: `scale(${zoomScale})`,
                                transformOrigin: "center center",
                            }}
                        >
                            <div className="relative w-full h-[90vh] max-w-6xl max-h-[90vh] flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl">
                                <Image
                                    src={imagemModal}
                                    alt="Imagem em tamanho real"
                                    fill
                                    className="object-contain"
                                    sizes="(max-width: 768px) 95vw, 90vw"
                                    priority
                                />
                            </div>

                            <button
                                className="fixed top-6 right-6 z-[10001] bg-black/80 hover:bg-black text-white p-3 rounded-2xl backdrop-blur-xl shadow-2xl transition-all duration-300 hover:scale-110"
                                onClick={fecharImagem}
                                aria-label="Fechar imagem"
                            >
                                <X className="w-7 h-7" />
                            </button>

                            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[10001] bg-black/90 text-white px-6 py-3 rounded-2xl text-sm font-medium backdrop-blur-xl shadow-2xl whitespace-nowrap">
                                Scroll para zoom • ESC para fechar
                            </div>

                            {zoomScale > 1 && (
                                <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[10001] bg-black/90 text-white px-4 py-2 rounded-xl text-sm backdrop-blur-xl">
                                    Zoom: {Math.round(zoomScale * 100)}%
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}