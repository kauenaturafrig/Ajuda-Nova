// src/app/noticias/noticias-client.tsx
"use client";

export const dynamic = "force-dynamic";
import { useState, useCallback, useRef, useEffect } from "react";
import Layout from "@/src/components/Layout";
import Image from "next/image";
import { Maximize2, X } from "lucide-react";

interface Noticia {
    id: number;
    titulo: string;
    conteudo: string;
    imagem: string | null | undefined;
    createdAt: Date;
}

export default function NoticiasPublica({ initialNoticias }: { initialNoticias: Noticia[] }) {
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

    return (
        <Layout>
            <div className="container mx-auto py-12 w-[90%]">
                <div className="flex items-center mb-12">
                    <Image
                        src="/assets/images/icons/icons8-news-preto.png"
                        alt="Icon news"
                        width={50}
                        height={50}
                        className="mr-5 dark:invert"
                    />
                    <h1 className="text-5xl font-bold dark:text-white">Notícias</h1>
                </div>

                <div className="space-y-6"> {/* ✅ Layout horizontal */}
                    {initialNoticias.map((noticia) => (
                        <article
                            key={noticia.id}
                            className="group bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 backdrop-blur-md rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-blue-200/50 relative"
                        >
                            {noticia.imagem && (
                                <div
                                    className="w-full h-64 md:h-80 rounded-2xl overflow-hidden mb-6 bg-gray-200 dark:bg-gray-800 cursor-zoom-in group-hover:scale-[1.02] transition-all duration-300 relative"
                                    onClick={() => abrirImagem(`/uploads/noticias/${noticia.imagem}` as string)}
                                >
                                    <Image
                                        src={`/uploads/noticias/${noticia.imagem}` as string}
                                        alt={noticia.titulo}
                                        fill
                                        className="object-cover hover:brightness-110 transition-all duration-300"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                    <button className="absolute top-3 right-3 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <Maximize2 className="w-5 h-5" />
                                    </button>
                                </div>
                            )}

                            <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                                {noticia.titulo}
                            </h3>
                            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed line-clamp-3">
                                {noticia.conteudo}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-blue-200/50">
                                <div className="text-sm text-gray-500 flex items-center gap-2">
                                    📰 {new Date(noticia.createdAt).toLocaleDateString('pt-BR')}
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                        Notícia
                                    </span>
                                </div>
                                <span className="text-sm text-gray-500">
                                    {new Date(noticia.createdAt).toLocaleDateString('pt-BR')}
                                </span>
                            </div>
                        </article>
                    ))}
                </div>

                {initialNoticias.length === 0 && (
                    <div className="text-center py-20 col-span-full">
                        <h3 className="text-3xl font-bold mb-4 dark:text-white">Nenhuma notícia</h3>
                        <p className="text-muted-foreground text-lg">Aguardando primeira publicação</p>
                    </div>
                )}
            </div>

            {/* Modal Zoom */}
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
                                cursor: zoomScale > 1.2 ? 'grab' : 'zoom-in',
                                transform: `scale(${zoomScale})`,
                                transformOrigin: 'center center'
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