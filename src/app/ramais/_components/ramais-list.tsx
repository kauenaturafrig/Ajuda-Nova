// src/app/ramais/_components/ramais-list.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { Search, Copy, Check, PhoneCall, Building2 } from "lucide-react";

type RamalView = {
  nome: string | null;
  setor: string;
  ramal: string;
};

type Props = {
  titulo: string;
  imagem: string;
  ramais: RamalView[];
};

export function RamaisList({ titulo, imagem, ramais }: Props) {
  const [busca, setBusca] = useState("");
  const [copiedRamal, setCopiedRamal] = useState<string | null>(null);

  async function handleCopy(ramal: string) {
    try {
      if (navigator && "clipboard" in navigator) {
        await navigator.clipboard.writeText(ramal);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = ramal;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopiedRamal(ramal);
      setTimeout(() => setCopiedRamal(null), 1500);
    } catch (err) {
      console.error("Erro ao copiar ramal", err);
    }
  }

  function normalize(str: string) {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  const buscaNormalizada = normalize(busca);

  const filtrados = ramais.filter((r) => {
    const setor = normalize(r.setor);
    const nome = r.nome ? normalize(r.nome) : "";
    return (
      setor.includes(buscaNormalizada) ||
      nome.includes(buscaNormalizada) ||
      r.ramal.includes(busca)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header Retangular da Unidade (Banner) */}
      <div className="relative w-full h-48 sm:h-64 md:h-72 rounded-3xl overflow-hidden border border-gray-100 dark:border-neutral-800 shadow-sm">
        <Image
          src={imagem}
          alt={`Fachada da Unidade ${titulo}`}
          fill
          priority
          className="object-cover object-center filter contrast-[1.02] brightness-[0.85] dark:brightness-[0.75]"
        />
        {/* Camada gradiente sutil para destacar o título */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Título integrado ao Banner */}
        <div className="absolute bottom-6 left-6 flex items-center gap-3 text-white">
          <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-white/20 backdrop-blur-md text-white shrink-0">
            <Building2 size={20} />
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight drop-shadow-sm">
            {titulo}
          </h1>
        </div>
      </div>

      {/* Container Principal da Lista Ampliada */}
      <div className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-3xl p-6 shadow-sm">
        
        {/* Input de Busca */}
        <div className="relative mb-6">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none">
            <Search size={20} />
          </span>
          <input
            type="text"
            placeholder="Buscar por setor, colaborador ou número do ramal..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-zinc-50 dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300"
          />
        </div>

        {/* Lista Fina de Linha Única Ocupando Largura Total */}
        <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {filtrados.length > 0 ? (
            <div className="divide-y divide-gray-100 dark:divide-neutral-800/60 border-b border-gray-100 dark:border-neutral-800/60">
              {filtrados.map((r, idx) => {
                const isCopied = copiedRamal === r.ramal;
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2.5 px-2 hover:bg-zinc-50/50 dark:hover:bg-neutral-950/30 transition-colors duration-150 group"
                  >
                    {/* Alinhamento dos Textos da Lista */}
                    <div className="flex items-center gap-4">
                      <span className="text-gray-400 dark:text-neutral-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors shrink-0">
                        <PhoneCall size={15} />
                      </span>
                      <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3">
                        <p className="font-medium text-gray-900 dark:text-white text-base">
                          {r.setor}
                        </p>
                        {r.nome && (
                          <p className="text-sm text-gray-400 dark:text-gray-500 font-normal">
                            {r.nome}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Botão Copiar */}
                    <button
                      type="button"
                      onClick={() => handleCopy(r.ramal)}
                      className={`flex items-center gap-2 px-3 py-1 rounded-lg border text-xs font-bold transition-all duration-200 min-w-[85px] justify-between ${
                        isCopied
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 text-blue-600 dark:text-blue-400 hover:border-blue-500 dark:hover:border-blue-400"
                      }`}
                    >
                      <span className="tracking-wider">{r.ramal}</span>
                      {isCopied ? (
                        <Check size={12} />
                      ) : (
                        <Copy size={12} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-zinc-50 dark:bg-neutral-950/40 border border-dashed border-gray-200 dark:border-neutral-800 rounded-2xl">
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                Nenhum ramal ou setor foi localizado.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}