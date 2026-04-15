// src/app/recados/recados-client.tsx
"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import Layout from "@/src/components/Layout";
import { X, Maximize2 } from "lucide-react";

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
}

interface Props {
    initialRecados: Recado[];
    unidadeId: number;
}

export default function RecadosClient({ initialRecados, unidadeId }: Props) {
    const [imagemModal, setImagemModal] = useState<string | null>(null);
    const [zoomScale, setZoomScale] = useState(1);
    const imagemRef = useRef<HTMLDivElement>(null);

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
            setZoomScale(prev => Math.max(0.5, Math.min(5, prev * delta)));
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') fecharImagem();
        };

        document.addEventListener('wheel', handleWheel, { passive: false });
        document.addEventListener('keydown', handleKeyDown);
        
        return () => {
            document.removeEventListener('wheel', handleWheel);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [imagemModal, fecharImagem]);

    const getClassificacaoUnidade = (qtdUnidades: number) => {
        if (qtdUnidades === 1) {
            return { label: 'Específico', cor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' };
        }
        if (qtdUnidades <= 3) {
            return { label: 'Inter-unidades', cor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' };
        }
        return { label: 'Global', cor: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' };
    };

    return (
        <>
            {/* Layout wrapper para backdrop funcionar */}
            <div className="relative">
                <Layout>
                    <div className="container mx-auto py-12 w-[90%]">
                        <div className="flex justify-between items-center mb-12">
                            <div className="flex">
                                <Image
                                    src="/assets/images/icons/icons8-megaphone-preto.png"
                                    alt="Icon phone"
                                    width={50}
                                    height={50}
                                    className="mr-5 dark:invert"
                                />
                                <h1 className="text-5xl font-bold dark:text-white">Recados</h1>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Unidade {unidadeId} • {initialRecados.length} recados
                            </div>
                        </div>

                        <div className="space-y-6">
                            {initialRecados.map((recado) => {
                                const recadoUnidadeIds = recado.unidades.map(u => u.unidadeId);
                                const classificacao = getClassificacaoUnidade(recadoUnidadeIds.length);
                                const textoUnidade = recadoUnidadeIds.length === 1
                                    ? recado.unidade.nome || `Unidade ${recado.unidadeId}`
                                    : `${recadoUnidadeIds.length} unidade(s)`;

                                return (
                                    <article
                                        key={recado.id}
                                        className="group bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/50 dark:to-red-950/50 backdrop-blur-md rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-orange-200/50 relative"
                                    >
                                        {recado.imagem && (
                                            <div
                                                className="w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-6 bg-gray-200 dark:bg-gray-800 cursor-zoom-in group-hover:scale-[1.02] transition-all duration-300 relative"
                                                onClick={() => abrirImagem(`/uploads/recados/${recado.imagem}`)}
                                            >
                                                <Image
                                                    src={`/uploads/recados/${recado.imagem}`}
                                                    alt={recado.titulo}
                                                    fill
                                                    className="object-cover hover:brightness-110 transition-all duration-300"
                                                    sizes="(max-width: 768px) 100vw, 50vw"
                                                />
                                                <button className="absolute top-3 right-3 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                    <Maximize2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        )}

                                        <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                                            {recado.titulo}
                                        </h3>
                                        <p className="text-lg text-gray-700 dark:text-gray-200 mb-6 leading-relaxed line-clamp-3">
                                            {recado.conteudo}
                                        </p>

                                        <div className="flex items-center justify-between pt-4 border-t border-orange-200/50">
                                            <div className="text-sm text-gray-500 flex items-center gap-2">
                                                📍 {textoUnidade}
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${classificacao.cor}`}>
                                                    {classificacao.label}
                                                </span>
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                {new Date(recado.createdAt).toLocaleDateString('pt-BR')}
                                            </span>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>

                        {initialRecados.length === 0 && (
                            <div className="text-center py-20">
                                <h3 className="text-3xl font-bold mb-4 dark:text-white">Nenhum recado</h3>
                                <p className="text-muted-foreground">Nenhum recado para esta unidade</p>
                            </div>
                        )}
                    </div>
                </Layout>

                {/* ✅ MODAL ZOOM */}
                {imagemModal && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4"
                        onClick={fecharImagem}
                    />

                    {/* Container Modal - POSIÇÃO RELATIVA CORRIGIDA */}
                    <div 
                        className="fixed inset-0 z-[10000] flex items-center justify-center p-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div 
                            ref={imagemRef}
                            className="w-full h-full flex items-center justify-center p-4 max-w-7xl max-h-screen"
                            style={{ 
                                cursor: zoomScale > 1.2 ? 'grab' : 'zoom-in',
                                transform: `scale(${zoomScale})`,
                                transformOrigin: 'center center'
                            }}
                        >
                            {/* ✅ CONTAINER RELATIVO para Image fill */}
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

                            {/* Botão fechar - POSIÇÃO ABSOLUTA */}
                            <button
                                className="fixed top-6 right-6 z-[10001] bg-black/80 hover:bg-black text-white p-3 rounded-2xl backdrop-blur-xl shadow-2xl transition-all duration-300 hover:scale-110"
                                onClick={fecharImagem}
                                aria-label="Fechar imagem"
                            >
                                <X className="w-7 h-7" />
                            </button>

                            {/* Instruções - POSIÇÃO FIXED */}
                            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-[10001] bg-black/90 text-white px-6 py-3 rounded-2xl text-sm font-medium backdrop-blur-xl shadow-2xl whitespace-nowrap">
                                Scroll para zoom • ESC para fechar
                            </div>

                            {/* Indicador de zoom */}
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
        </>
    );
}