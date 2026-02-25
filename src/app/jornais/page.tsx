// src/app/jornais/page.tsx
export const dynamic = 'force-dynamic';
import Image from "next/image";
import { prisma } from "@/src/lib/prisma";


export default async function JornaisPage() {
  const jornais = await prisma.jornal.findMany({
    orderBy: { dataLancamento: "desc" }
  });


  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-4">
        <div>
          <div className="flex items-center mt-3 mb-7">
            <h1 className="font-bold text-5xl dark:text-white pr-4">
              Conexão Naturafrig
            </h1>
            <Image
              src={"/assets/images/icons/icons8-news-preto.png"}
              alt="Logo Jornais"
              width={50}
              height={50}
              className="mr-5 dark:invert"
            />
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300">Últimas edições da Naturafrig</p>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jornais.map((jornal) => (
          <a
            key={jornal.id}
            href={jornal.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group/card block bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/50 dark:border-white shadow-lg hover:shadow-2xl hover:border-blue-400/60 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.015] max-h-[1020px] overflow-hidden"
          >
            {/* Container flex expansão controlada */}
            <div className="flex flex-col h-full transition-all duration-500 group-hover/card:min-h-[460px] min-h-[380px]">


              {/* Imagem responsiva */}
              <div className="relative flex-shrink-0 overflow-hidden rounded-2xl mb-6 transition-all duration-700 group-hover/card:h-72 h-56">
                <Image
                  src={`/uploads/jornais/${jornal.imagem}`}
                  alt={jornal.titulo}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-all duration-700 group-hover/card:scale-110"
                />


                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover/card:opacity-100 transition-all duration-400" />


                {/* Botão flutuante */}
                <div className="absolute top-4 right-4 opacity-0 group-hover/card:opacity-100 scale-95 group-hover/card:scale-100 transition-all duration-300 delay-200">
                  <div className="w-12 h-12 bg-white/95 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-2xl hover:shadow-3xl hover:bg-white hover:scale-105 transition-all duration-200">
                    <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                </div>
              </div>


              {/* Conteúdo expansível */}
              <div className="flex-1 space-y-4 px-1 transition-all duration-500">
                {/* Título */}
                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white leading-tight line-clamp-2 group-hover/card:line-clamp-none group-hover/card:leading-relaxed transition-all duration-300">
                  {jornal.titulo}
                </h3>


                {/* Descrição - Tailwind max-h */}
                <div className="overflow-hidden transition-all duration-600 max-h-12 md:max-h-16 group-hover/card:max-h-28 md:group-hover/card:max-h-36">
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2 md:line-clamp-3 group-hover/card:line-clamp-none">
                    {jornal.descricao || "Clique para ler a edição completa do jornal!"}
                  </p>
                </div>


                {/* Footer */}
                <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100/50 dark:border-gray-800/50">
                  <span className="text-xs md:text-sm font-medium text-gray-500 bg-gray-100/60 dark:bg-gray-800/60 px-2.5 py-1 rounded-full backdrop-blur-sm">
                    📅 {new Date(jornal.dataLancamento).toLocaleDateString('pt-BR')}
                  </span>
                  <span className="text-xs md:text-sm font-semibold text-blue-600 hover:text-blue-700 opacity-0 group-hover/card:opacity-100 transform translate-x-2 group-hover/card:translate-x-0 transition-all duration-300">
                    ↗️ Abrir
                  </span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>


      {jornais.length === 0 && (
        <div className="text-center py-24 col-span-full">
          <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-2xl">
            <span className="text-4xl opacity-60">📄</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-500 dark:text-gray-400 mb-3">Nenhum jornal disponível</h3>
          <p className="text-lg md:text-xl text-gray-400 max-w-md mx-auto leading-relaxed">
            As edições aparecerão aqui quando o administrador publicar.
          </p>
        </div>
      )}
    </div>
  );
}
