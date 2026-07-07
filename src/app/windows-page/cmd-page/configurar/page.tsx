"use client";

import Layout from "../../../../components/Layout";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../../../../components/ui/button";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Terminal,
  Search,
  MousePointer,
  Type,
  Maximize,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

const passos = [
  {
    id: "pesquisar-cmd",
    numero: 1,
    titulo: "Pesquisar por CMD",
    descricao: "Pesquise por “CMD” no menu iniciar.",
    icon: <Search size={20} />,
    corIcone: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    imagem: "/assets/images/cmd-imgs/cmd-config/cmd-1.png",
  },
  {
    id: "propriedades-cmd",
    numero: 2,
    titulo: "Acessar as Propriedades",
    descricao: "Quando iniciar, clique com o botão esquerdo na janela e vá para “Propriedades”.",
    icon: <MousePointer size={20} />,
    corIcone: "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    imagem: "/assets/images/cmd-imgs/cmd-config/cmd-2.png",
  },
  {
    id: "ajustar-fonte",
    numero: 3,
    titulo: "Ajustar Tamanho e Fonte",
    descricao: "Na aba “Fonte”, ajuste o tamanho para 24 e a fonte para Lucida Console.",
    icon: <Type size={20} />,
    corIcone: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    imagem: "/assets/images/cmd-imgs/cmd-config/cmd-3.png",
  },
  {
    id: "ajustar-layout",
    numero: 4,
    titulo: "Configurar o Layout",
    descricao: "Na aba “Layout”, ajuste a Largura em 80 e a Altura em 25. Certifique-se de marcar as caixas de seleção assim como na imagem abaixo.",
    icon: <Maximize size={20} />,
    corIcone: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
    imagem: "/assets/images/cmd-imgs/cmd-config/cmd-4.png",
  },
  {
    id: "salvar-terminal",
    numero: 5,
    titulo: "Concluir e Reiniciar",
    descricao: "Clique em OK para salvar as alterações e abra novamente o terminal para aplicar o novo tamanho.",
    icon: <CheckCircle2 size={20} />,
    corIcone: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    imagem: null,
  },
];

export default function CMDconfig() {
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
          <span className="flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-neutral-800 text-gray-900 dark:text-white shrink-0 shadow-sm">
            <Terminal size={26} />
          </span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Ajuste de Tamanho da Janela
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-0.5">
              Siga as etapas para padronizar a exibição, fontes e dimensões do Prompt de Comando
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

        {/* Lista de Passos / Cards Reestilizados */}
        <div className="space-y-6 mb-10">
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
                    alt={`Configuração do CMD - Passo ${passo.numero}`}
                    width={700}
                    height={400}
                    className="object-contain rounded-lg"
                  />
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Seção unificada de Observações Importantes */}
        <div className="bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 mb-2">
            <AlertTriangle size={22} />
            <h2 className="text-xl font-bold">Observações Importantes</h2>
          </div>

          {/* <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
            Se a janela não estiver no modo de visualização igual ao deste manual, acesse o guia de{" "}
            <Link href="/windows-page/cmd-page/atualizar" className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
              [Atualização do Sistema TANURESOFT]
            </Link>{" "}
            para aplicar os patches necessários.
          </p>

          <div className="h-px bg-amber-200/60 dark:bg-amber-900/40" /> */}

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base font-medium">
            ⚠️ Lembre-se: Fixe o CMD na sua barra de tarefas apenas após concluir todos os passos descritos acima.
          </p>
        </div>
      </div>
    </Layout>
  );
}