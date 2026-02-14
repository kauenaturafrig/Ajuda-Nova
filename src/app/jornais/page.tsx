// src/app/jornais/page.tsx
import Image from "next/image";
import { prisma } from "@/src/lib/prisma"; // Ajuste o path

// ✅ Server Component (sem async function)
export default async function JornaisPage() {
  const jornais = await prisma.jornal.findMany({
    orderBy: { dataLancamento: "desc" }
  });

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            📰 Jornais
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">Últimas edições disponíveis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {jornais.map((jornal) => (
          <a
            key={jornal.id}
            href={jornal.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl p-8 border border-gray-200 dark:border-gray-800 hover:border-blue-500 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 hover:-translate-y-2"
          >
            <div className="relative overflow-hidden rounded-xl mb-6 h-64">
              <Image
                src={`/uploads/jornais/${jornal.imagem}`}
                alt={jornal.titulo}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 transition-colors">
                {jornal.titulo}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
                {jornal.descricao}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>📅 {new Date(jornal.dataLancamento).toLocaleDateString('pt-BR')}</span>
                <span className="ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300">
                  ↗️ Abrir
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {jornais.length === 0 && (
        <div className="text-center py-24">
          {/* ✅ Removido FileText */}
          <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-2xl mx-auto mb-6 flex items-center justify-center opacity-50">
            <span className="text-3xl">📄</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-500 dark:text-gray-400 mb-2">Nenhum jornal disponível</h3>
          <p className="text-lg text-gray-400 max-w-md mx-auto">
            Os jornais aparecerão aqui assim que forem adicionados pelo administrador.
          </p>
        </div>
      )}
    </div>
  );
}
