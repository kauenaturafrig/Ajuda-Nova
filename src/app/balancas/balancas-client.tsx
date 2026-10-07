"use client";

import Link from "next/link";
import Image from "next/image";
import { Scale } from "lucide-react";

type Balanca = {
  id: string;
  nome: string;
  slug: string;
  imagem: string;
};

const balancas: Balanca[] = [
  {
    id: "alfa",
    nome: "Alfa",
    slug: "alfa",
    imagem: "/assets/images/balancas/alfa/indicador-3104c.png",
  },
  {
    id: "sp2500",
    nome: "SP2500",
    slug: "sp2500",
    imagem: "/assets/images/balancas/sp2500/sp2500.png",
  },
  {
    id: "wt3000",
    nome: "WT3000",
    slug: "wt3000",
    imagem: "/assets/images/balancas/wt3000/wt3000.jpg",
  },
];

export function BalancasClient() {
  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <span className="flex items-center justify-center w-14 h-14 rounded-2xl shrink-0 shadow-sm bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
          <Scale size={30} />
        </span>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Balanças
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Selecione o indicador para ver as configurações e informações
          </p>
        </div>
      </div>

      {/* Lista de indicadores */}
      <div className="space-y-4">
        {balancas.map((balanca) => (
          <Link
            key={balanca.id}
            href={`/balancas/${balanca.slug}`}
            className="group flex items-center gap-4 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-4 sm:p-6 shadow-sm hover:border-amber-300 hover:shadow-md transition-all"
          >
            <div className="shrink-0">
              <Image
                src={balanca.imagem}
                alt={balanca.nome}
                width={120}
                height={120}
                className="object-contain"
              />
            </div>
            <span className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400">
              {balanca.nome}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}