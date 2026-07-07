"use client";

import Layout from "../../../components/Layout";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sliders, RefreshCw } from "lucide-react";

const opcoesCMD = [
  {
    href: "/windows-page/cmd-page/configurar",
    titulo: "Como configurar o CMD - (Prompt de comando)",
    descricao: "Passo a passo para ajustar as propriedades visuais, fontes e comportamento padrão do terminal.",
    icon: <Sliders size={20} />,
    corIcone: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  {
    href: "/windows-page/cmd-page/atualizar",
    titulo: 'Como atualizar os Programas executados no Windows "F:atualiza"',
    descricao: "Guia prático para rodar a rotina de atualização do sistema via linha de comando.",
    icon: <RefreshCw size={20} />,
    corIcone: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  },
];

export default function CMDHelp() {
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
          <span className="flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-neutral-800 shrink-0 shadow-sm p-2.5">
            <Image
              src="/assets/images/icons/icons8-cmd-preto.png"
              alt="Logo CMD"
              width={28}
              height={28}
              className="dark:invert object-contain"
            />
          </span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Prompt de Comando (CMD)
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-0.5">
              O que você busca? Selecione um dos guias de suporte abaixo
            </p>
          </div>
        </div>

        {/* Grid/Lista de Cards de Links com Hover Suave */}
        <div className="space-y-4">
          {opcoesCMD.map((opcao, index) => (
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