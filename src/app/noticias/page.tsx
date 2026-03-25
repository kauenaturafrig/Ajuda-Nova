// src/app/noticias/page.tsx
export const dynamic = 'force-dynamic';
import Layout from "@/src/components/Layout";
import Image from "next/image";
import { prisma } from "@/src/lib/prisma";

export default async function NoticiasPage() {
  const noticias = await prisma.noticia.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50
  });

  return (
    <Layout>
      <div className="container mx-auto py-12 w-[90%]">
        <div className="flex items-center mb-12">
          <Image
            src={"/assets/images/icons/icons8-news-preto.png"}
            alt="Icon news"
            width={50}
            height={50}
            className="mr-5 dark:invert"
          />
          <h1 className="text-5xl font-bold dark:text-white">Notícias</h1>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {noticias.map((noticia) => (
            <article key={noticia.id} className="group bg-white/60 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/30 hover:-translate-y-2">
              {noticia.imagem && (
                <div className="w-full h-48 rounded-xl overflow-hidden mb-6 group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src={`/uploads/noticias/${noticia.imagem}`}
                    alt={noticia.titulo}
                    fill className="object-cover"
                  />
                </div>
              )}
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600">
                {noticia.titulo}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                {noticia.conteudo}
              </p>
              <div className="text-sm text-gray-500">
                {new Date(noticia.createdAt).toLocaleDateString('pt-BR')}
              </div>
            </article>
          ))}
        </div>
        {noticias.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-3xl font-bold mb-4 dark:text-white">Nenhuma notícia</h3>
            <p className="text-muted-foreground">Aguardando primeira publicação</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
