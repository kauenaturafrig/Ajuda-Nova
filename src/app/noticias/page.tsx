// src/app/noticias/page.tsx - VERSÃO SIMPLES (RECOMENDADA)
export const dynamic = "force-dynamic";
import { prisma } from "@/src/lib/prisma";
import NoticiasPublica from "./noticias-client";

interface Noticia {
    id: number;
    titulo: string;
    conteudo: string;
    imagem: string | null | undefined;
    createdAt: Date;
}

export default async function NoticiasPage() {
    const noticias = await prisma.noticia.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50
    });

    return <NoticiasPublica initialNoticias={noticias} />;
}