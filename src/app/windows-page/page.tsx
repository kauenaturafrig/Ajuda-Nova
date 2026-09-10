"use client";

import Layout from "../../components/Layout";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft, Monitor, Terminal, RefreshCw } from "lucide-react";

const opcoesWindows = [
  {
    href: "/windows-page/cmd-page",
    titulo: "Como configurar o CMD - (Prompt de comando)",
    descricao: "Acesse o guia completo para ajustar janelas, fontes, layouts e rotinas de atualização do terminal.",
    icon: <Terminal size={20} />,
    corIcone: "bg-zinc-100 text-zinc-700 dark:bg-neutral-800 dark:text-neutral-300",
  },
  {
    href: "/windows-page/update",
    titulo: "Como atualizar o Windows",
    descricao: "Passo a passo para verificar novas atualizações de segurança e melhorias no Windows Update.",
    icon: <RefreshCw size={20} />,
    corIcone: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  },
];

export default function WindowsHelp() {
  const router = useRouter();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-4">
        {/* Botão Voltar Padronizado */}
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="mb-6 gap-2 text-gray-600 dark:text-gray-300 transition-all duration-300"
        >
          <ArrowLeft size={16} />
          Voltar
        </Button>

        {/* Header com Ícone Embalado, Título e Subtítulo */}
        <div className="flex items-center gap-4 mb-8">
          <span className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shrink-0 shadow-sm">
            <Monitor size={26} />
          </span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Windows
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-0.5">
              Selecione o procedimento para ver as instruções rápidas de suporte
            </p>
          </div>
        </div>

        {/* Grid/Lista de Cards de Links com Hover Suave */}
        <div className="space-y-4">
          {opcoesWindows.map((opcao, index) => (
            <Link
              key={index}
              href={opcao.href}
              className="flex items-start sm:items-center gap-4 p-5 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-2xl shadow-sm hover:border-gray-200 dark:hover:border-neutral-700/60 hover:shadow-md transition-all duration-300 ease-in-out group"
            >
              {/* Badge do Ícone do Card */}
              <span
                className={`flex items-center justify-center w-11 h-11 rounded-xl shrink-0 ${opcao.corIcone}`}
              >
                {opcao.icon}
              </span>

              {/* Texto descritivo do Link */}
              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {opcao.titulo}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
                  {opcao.descricao}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}