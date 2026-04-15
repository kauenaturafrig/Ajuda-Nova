// src/app/recados/page.tsx
export const revalidate = 30;
export const dynamicParams = true;
import Layout from "@/src/components/Layout";
import Image from "next/image";
import { prisma } from "@/src/lib/prisma";
import { headers } from "next/headers";
import { getUnidadeByIp } from "@/src/lib/getUnidadeByIp";
import RecadosClient from "./recados-client"; // ✅ Client separado

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

export default async function RecadosPage() {
    // ✅ SERVER COMPONENT: só faz fetch
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

    const recadosData = await prisma.recado.findMany({
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

    return <RecadosClient initialRecados={recadosData} unidadeId={unidadeId} />;
}