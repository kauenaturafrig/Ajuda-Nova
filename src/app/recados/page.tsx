// src/app/recados/page.tsx
export const dynamic = 'force-dynamic';
import Layout from "@/src/components/Layout";
import Image from "next/image";
import { prisma } from "@/src/lib/prisma";
import { headers } from "next/headers";
import { getUnidadeByIp } from "@/src/lib/getUnidadeByIp";  // ✅ Caminho correto

export default async function RecadosPage() {
  const h = await headers();
  const ip = h.get('x-forwarded-for') ?? h.get('x-real-ip') ?? h.get('x-forwarded-host');
  const unidadeId = getUnidadeByIp(ip);

  console.log("🌐 IP:", ip, "→ Unidade:", unidadeId);  // DEBUG

  if (!unidadeId) {
    return (
      <Layout>
        <div className="container mx-auto py-20 text-center">
          <h1 className="text-4xl font-bold mb-4 dark:text-white">📢 Recados</h1>
          <div className="bg-red-100 dark:bg-red-900/50 p-6 rounded-xl mb-4">
            <p className="font-mono text-sm mb-2">IP: <span className="font-bold">{ip || 'N/A'}</span></p>
            <p className="font-mono text-sm">Unidade: <span className="font-bold text-red-600">NÃO IDENTIFICADA</span></p>
          </div>
          <p className="text-xl text-muted-foreground">Acesso restrito à intranet das unidades</p>
        </div>
      </Layout>
    );
  }


  const recados = await prisma.recado.findMany({
    where: { unidadeId },
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: { unidade: true }  // Para nome
  });

  return (
    <Layout>
      <div className="container mx-auto py-12 w-[90%]">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-5xl font-bold dark:text-white">📢 Recados</h1>
          <div className="text-sm text-muted-foreground">
            Unidade {unidadeId} • {recados.length} recados
          </div>
        </div>

        <div className="space-y-6">
          {recados.map((recado) => (
            <article
              key={recado.id}
              className="group bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/50 dark:to-red-950/50 backdrop-blur-md rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-orange-200/50"
            >
              {/* IMAGEM ✅ */}
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
                📍 {recado.unidade.nome || `Unidade ${recado.unidadeId}`}
                <span className="ml-auto">
                  {new Date(recado.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </article>
          ))}
        </div>

        {recados.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 p-6 bg-orange-100 dark:bg-orange-900/50 rounded-2xl">
              📢
            </div>
            <h3 className="text-3xl font-bold mb-4 dark:text-white">Nenhum recado</h3>
            <p className="text-muted-foreground">Nenhum recado para esta unidade</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
