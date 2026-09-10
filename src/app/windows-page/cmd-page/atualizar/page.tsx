"use client";

import Layout from "../../../../components/Layout";
import Image from "next/image";
import { Button } from "../../../../components/ui/button";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  RefreshCw,
  Terminal,
  Keyboard,
  Download,
} from "lucide-react";

const passos = [
  {
    id: "executar-comando",
    numero: 1,
    titulo: "Executar o Comando no CMD",
    descricao: "Abra o CMD, digite as letras F: e pressione a tecla Enter. Em seguida, digite a palavra Atualiza e pressione Enter novamente.",
    icon: <Terminal size={20} />,
    corIcone: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    imagem: "/assets/images/cmd-imgs/cmd-update/cmd-1.png",
  },
  {
    id: "confirmar-instrucoes",
    numero: 2,
    titulo: "Seguir as Instruções na Tela",
    descricao: "Logo após, uma tela será exibida conforme a imagem abaixo. Siga as instruções indicadas no terminal e pressione a tecla Enter.",
    icon: <Keyboard size={20} />,
    corIcone: "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    imagem: "/assets/images/cmd-imgs/cmd-update/cmd-2.png",
  },
  {
    id: "concluir-atualizacao",
    numero: 3,
    titulo: "Aguardar a Inicialização do Sistema",
    descricao: "Após esse passo, o utilitário carregará todos os arquivos de atualização necessários, fechará o terminal CMD automaticamente e abrirá as novas versões dos sistemas.",
    icon: <Download size={20} />,
    corIcone: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    imagem: null,
  },
];

export default function CMDupdate() {
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

        {/* Header com Ícone, Título e Subtítulo */}
        <div className="flex items-center gap-4 mb-8">
          <span className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shrink-0 shadow-sm">
            <RefreshCw size={26} />
          </span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Atualização do Sistema TANURESOFT
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-0.5">
              Rotina prática para atualizar os módulos de Frigo, Desossa, Matança e Pesagem
            </p>
          </div>
        </div>

        {/* Índice Rápido com Efeito Hover Suave */}
        <div className="flex flex-wrap gap-2 mb-8">
          {passos.map((passo) => (
            <a
              key={passo.id}
              href={`#${passo.id}`}
              className="flex items-center gap-1.5 text-xs font-medium bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-gray-600 dark:text-gray-300 rounded-full px-3 py-1.5 shadow-sm hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 ease-in-out"
            >
              {passo.icon}
              Passo {passo.numero}
            </a>
          ))}
        </div>

        {/* Lista de Passos / Cards Estilizados */}
        <div className="space-y-6">
          {passos.map((passo) => (
            <section
              key={passo.id}
              id={passo.id}
              className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm p-6 sm:p-8 scroll-mt-6 hover:shadow-md hover:border-gray-200 dark:hover:border-neutral-700/60 transition-all duration-300 ease-in-out"
            >
              <div className="flex items-start gap-4 mb-5">
                <span
                  className={`flex items-center justify-center w-11 h-11 rounded-xl shrink-0 ${passo.corIcone}`}
                >
                  {passo.icon}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-400">
                      {String(passo.numero).padStart(2, "0")}
                    </span>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {passo.titulo}
                    </h2>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                    {passo.descricao}
                  </p>
                </div>
              </div>

              {/* Box de imagem centralizada */}
              {passo.imagem && (
                <div className="flex justify-center bg-gray-50 dark:bg-neutral-800/60 rounded-xl p-6 border border-gray-50 dark:border-neutral-800/40">
                  <Image
                    src={passo.imagem}
                    alt={`Atualização do Sistema - Passo ${passo.numero}`}
                    width={700}
                    height={400}
                    className="object-contain rounded-lg"
                  />
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </Layout>
  );
}