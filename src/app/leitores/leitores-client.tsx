"use client";

import Image from "next/image";
import Link from "next/link";
import { ScanLine } from "lucide-react";

type Leitor = {
  id: string;
  nome: string;
  slug: string;
  imagem: string;
  altImagem: string;
};

const leitores: Leitor[] = [
  {
    id: "zebra2278",
    nome: "ZEBRA DS2278",
    slug: "zebra2278",
    imagem: "/assets/images/leitores/ZEBRA-DS2278.png",
    altImagem: "ZEBRA DS2278",
  },
  {
    id: "voyager1472g",
    nome: "VOYAGER 1472G",
    slug: "voyager1472g",
    imagem: "/assets/images/leitores/VOYAGER-1472G.png",
    altImagem: "VOYAGER 1472G",
  },
];

export function LeitoresClient() {
  return (
    <div className="container max-w-6xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <span className="flex items-center justify-center w-14 h-14 rounded-2xl shrink-0 shadow-sm bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
          <ScanLine size={30} />
        </span>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Leitores de código de barra
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Selecione o modelo do leitor para ver as configurações rápidas
          </p>
        </div>
      </div>

      {/* Lista de leitores */}
      <div className="space-y-4">
        {leitores.map((leitor) => (
          <Link
            key={leitor.id}
            href={`/leitores/${leitor.slug}`}
            className="group flex items-center gap-4 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-4 sm:p-6 shadow-sm hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="shrink-0">
              <Image
                src={leitor.imagem}
                alt={leitor.altImagem}
                width={120}
                height={120}
                className="object-contain"
              />
            </div>
            <span className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {leitor.nome}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}