// src/app/recados/page.tsx

export const dynamic = 'force-dynamic';
import Layout from "@/src/components/Layout";
import Image from "next/image";
import { prisma } from "@/src/lib/prisma";
import { headers } from "next/headers";
import { getUnidadeByIp } from "@/src/lib/getUnidadeByIp";

export default async function RecadosPage() {
    const h = await headers();
    const ip = h.get('x-forwarded-for') ?? h.get('x-real-ip') ?? h.get('x-forwarded-host');
    const unidadeId = getUnidadeByIp(ip);

    if (!unidadeId) {
        return (
            <Layout>
                <div className="container mx-auto py-20 text-center">
                    <h1 className="text-4xl font-bold mb-4 dark:text-white">Recados</h1>
                    <div className="bg-red-100 dark:bg-red-900/50 p-6 rounded-xl mb-4">
                        <p className="font-mono text-sm">IP: <span className="font-bold">{ip || 'N/A'}</span></p>
                        <p className="font-mono text-sm">Unidade: <span className="font-bold text-red-600">NÃO IDENTIFICADA</span></p>
                    </div>
                    <p className="text-xl text-muted-foreground">Acesso restrito à intranet</p>
                </div>
            </Layout>
        );
    }

    const recados = await prisma.recado.findMany({
        where: {
            unidades: {
                some: {
                    unidadeId: unidadeId
                }
            }
        },
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: {
            unidade: true,
            unidades: { include: { unidade: true } }
        }
    });

    return (
        <Layout>
            <div className="container mx-auto py-12 w-[90%]">
                <div className="flex justify-between items-center mb-12">
                    <div className="flex">
                        <Image
                            src={"/assets/images/icons/icons8-megaphone-preto.png"}
                            alt="Icon phone"
                            width={50}
                            height={50}
                            className="mr-5 dark:invert"
                        />
                        <h1 className="text-5xl font-bold dark:text-white">Recados</h1>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Unidade {unidadeId} • {recados.length} recados
                    </div>
                </div>

                <div className="space-y-6">
                    {recados.map((recado) => {
                        // ✅ CORRIGIDO: cria unidadeIds via map
                        const recadoUnidadeIds = recado.unidades.map(u => u.unidadeId);
                        
                        return (
                            <article
                                key={recado.id}
                                className="group bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/50 dark:to-red-950/50 backdrop-blur-md rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-orange-200/50"
                            >
                                {recado.imagem && (
                                    <div className="w-full h-48 md:h-64 rounded-xl overflow-hidden mb-6 group-hover:scale-105 transition-transform duration-300">
                                        <Image
                                            src={`/uploads/recados/${recado.imagem}`}
                                            alt={recado.titulo}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                        />
                                    </div>
                                )}

                                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                                    {recado.titulo}
                                </h3>
                                <p className="text-lg text-gray-700 dark:text-gray-200 mb-4 leading-relaxed">
                                    {recado.conteudo}
                                </p>
                                <div className="text-sm text-gray-500 flex items-center gap-2">
                                    📍 {recadoUnidadeIds.length > 1 
                                        ? 'Múltiplas Unidades' 
                                        : recado.unidade.nome || `Unidade ${recado.unidadeId}`}
                                    {recadoUnidadeIds.length > 1 && (
                                        <span className="ml-2 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                                            Global
                                        </span>
                                    )}
                                    <span className="ml-auto">
                                        {new Date(recado.createdAt).toLocaleDateString('pt-BR')}
                                    </span>
                                </div>
                            </article>
                        );
                    })}
                </div>

                {recados.length === 0 && (
                    <div className="text-center py-20">
                        <h3 className="text-3xl font-bold mb-4 dark:text-white">Nenhum recado</h3>
                        <p className="text-muted-foreground">Nenhum recado para esta unidade</p>
                    </div>
                )}
            </div>
        </Layout>
    );
}