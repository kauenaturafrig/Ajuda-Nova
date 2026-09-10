// src/app/emails/_components/emails-list.tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { Search, Copy, Check, Mail, Building2 } from "lucide-react";

type EmailView = {
  nome: string | null;
  setor: string;
  email: string;
};

type Props = {
  titulo: string;
  imagem: string;
  emails: EmailView[];
};

export function EmailsList({ titulo, imagem, emails }: Props) {
  const [busca, setBusca] = useState("");
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  async function handleCopy(email: string) {
    try {
      if (navigator && "clipboard" in navigator) {
        await navigator.clipboard.writeText(email);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = email;
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopiedEmail(email);
      setTimeout(() => setCopiedEmail(null), 1500);
    } catch (err) {
      console.error("Erro ao copiar e-mail", err);
    }
  }

  function normalize(str: string) {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  const buscaNormalizada = normalize(busca);

  const filtrados = emails.filter((e) => {
    const setor = normalize(e.setor);
    const nome = e.nome ? normalize(e.nome) : "";
    return (
      setor.includes(buscaNormalizada) ||
      nome.includes(buscaNormalizada) ||
      e.email.toLowerCase().includes(busca.toLowerCase())
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
            placeholder="Buscar por setor, colaborador ou endereço de e-mail..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-zinc-50 dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-300"
          />
        </div>

        {/* Lista Fina de Linha Única */}
        <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {filtrados.length > 0 ? (
            <div className="divide-y divide-gray-100 dark:divide-neutral-800/60 border-b border-gray-100 dark:border-neutral-800/60">
              {filtrados.map((e, idx) => {
                const isCopied = copiedEmail === e.email;
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-2.5 px-2 hover:bg-zinc-50/50 dark:hover:bg-neutral-950/30 transition-colors duration-150 group"
                  >
                    {/* Alinhamento dos Textos */}
                    <div className="flex items-center gap-4 min-w-0 flex-1 mr-4">
                      <span className="text-gray-400 dark:text-neutral-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors shrink-0">
                        <Mail size={15} />
                      </span>
                      <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3 min-w-0">
                        <p className="font-medium text-gray-900 dark:text-white text-base shrink-0">
                          {e.setor}
                        </p>
                        {e.nome && (
                          <p className="text-sm text-gray-400 dark:text-gray-500 font-normal truncate">
                            {e.nome}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Botão Copiar Dinâmico para E-mail */}
                    <button
                      type="button"
                      onClick={() => handleCopy(e.email)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all duration-200 max-w-xs sm:max-w-none truncate ${
                        isCopied
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800 text-blue-600 dark:text-blue-400 hover:border-blue-500 dark:hover:border-blue-400"
                      }`}
                    >
                      <span className="tracking-wider font-mono block truncate max-w-[140px] sm:max-w-none">
                        {e.email}
                      </span>
                      {isCopied ? (
                        <Check size={12} className="shrink-0" />
                      ) : (
                        <Copy size={12} className="opacity-50 group-hover:opacity-100 transition-opacity shrink-0" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-zinc-50 dark:bg-neutral-950/40 border border-dashed border-gray-200 dark:border-neutral-800 rounded-2xl">
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                Nenhum endereço de e-mail foi localizado.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}