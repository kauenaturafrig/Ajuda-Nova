"use client";

import Image from "next/image";
import Link from "next/link";
import { Printer } from "lucide-react";

type Procedimento = {
  id: string;
  titulo: string;
  slug: string;
  imagem: string;
  altImagem: string;
};

const procedimentos: Procedimento[] = [
  {
    id: "troca-ribbon-etq",
    titulo: "Trocar Ribbon e Etiqueta ZT-230/ZT-231/ZT411",
    slug: "troca-ribbon-etq",
    imagem: "/assets/images/impressoras-termicas/zt230.png",
    altImagem: "ZT-230",
  },
  {
    id: "limpeza-printhead",
    titulo: "Limpar Cabeçote de Impressão ZT-230/ZT-231",
    slug: "limpeza-printhead",
    imagem: "/assets/images/impressoras-termicas/cabeca-impressao.webp",
    altImagem: "Cabeça de impressão",
  },
];

export function ImpressorasTermicasClient() {
  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <span className="flex items-center justify-center w-14 h-14 rounded-2xl shrink-0 shadow-sm bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
          <Printer size={30} />
        </span>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Impressoras Zebra
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Selecione o procedimento para ver as instruções rápidas
          </p>
        </div>
      </div>

      {/* Lista de procedimentos */}
      <div className="space-y-4">
        {procedimentos.map((proc) => (
          <Link
            key={proc.id}
            href={`/impressoras-termicas/${proc.slug}`}
            className="group flex items-center gap-4 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-4 sm:p-6 shadow-sm hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="shrink-0">
              <Image
                src={proc.imagem}
                alt={proc.altImagem}
                width={120}
                height={120}
                className="object-contain"
              />
            </div>
            <span className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {proc.titulo}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}