"use client";

import Layout from "../../../components/Layout";
import Image from "next/image";
import { Button } from "../../../components/ui/button";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  RefreshCw,
  Monitor,
  LayoutGrid,
  Search,
  CheckSquare,
  Download,
  Percent,
  RotateCcw,
} from "lucide-react";

const passos = [
  {
    id: "verificar-icone",
    numero: 1,
    titulo: "Verificar o ícone na barra de tarefas",
    descricao:
      "Verifique o ícone de atualização do Windows na janela. Se estiver com o símbolo conforme a imagem abaixo, clique com o botão direito sobre ele.",
    icon: <Monitor size={20} />,
    corIcone: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    imagem: "/assets/images/windows-images/update-1.png",
  },
  {
    id: "menu-iniciar",
    numero: 2,
    titulo: "Menu Iniciar",
    descricao:
      "Ou clique no botão “INICIAR” do Windows conforme a seta vermelha indica.",
    icon: <LayoutGrid size={20} />,
    corIcone: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
    imagem: "/assets/images/windows-images/update-2.png",
  },
  {
    id: "pesquisar-update",
    numero: 3,
    titulo: "Pesquisar por Atualizações",
    descricao:
      "Após digite na barra de pesquisa a palavra “UPDATE” ou “ATUALIZAÇÃO”, depois clique em “VERIFICAR SE HÁ ATUALIZAÇÕES”, depois clique em “ABRIR”.",
    icon: <Search size={20} />,
    corIcone: "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    imagem: "/assets/images/windows-images/update-3.png",
  },
  {
    id: "janela-update",
    numero: 4,
    titulo: "Verificar se há Atualizações",
    descricao:
      "Logo em seguida vai abrir uma janela conforme imagem abaixo, clique em “VERIFICAR SE HÁ ATUALIZAÇÕES”.",
    icon: <CheckSquare size={20} />,
    corIcone: "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    imagem: "/assets/images/windows-images/update-4.png",
  },
  {
    id: "instalar-update",
    numero: 5,
    titulo: "Instalar Atualizações",
    descricao:
      "Se tiver atualizações disponíveis vai aparecer a atualização igual na imagem abaixo, depois clica em “INSTALAR”.",
    icon: <Download size={20} />,
    corIcone: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    imagem: "/assets/images/windows-images/update-5.png",
  },
  {
    id: "porcentagem-instalar",
    numero: 6,
    titulo: "Acompanhar o Progresso",
    descricao:
      "Quando estiver instalando vai aparecer igual à página abaixo, mostrando a porcentagem da instalação.",
    icon: <Percent size={20} />,
    corIcone: "bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400",
    imagem: "/assets/images/windows-images/update-6.png",
  },
  {
    id: "reiniciar-sistema",
    numero: 7,
    titulo: "Reiniciar o Computador",
    descricao:
      "Quando finalizar de instalar pode ser que apareça a solicitação de “Reiniciar”. Salve todos os documentos e programas que você estava utilizando, clique no botão para reiniciar e aguarde. Pronto, seu computador está atualizado!",
    icon: <RotateCcw size={20} />,
    corIcone: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    imagem: null, // O passo 7 não possuía imagem associada no código original
  },
];

export default function UpdateWin() {
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
            <RefreshCw size={28} />
          </span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Atualização do Windows e Programas
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-0.5">
              Siga o passo a passo abaixo para manter o seu sistema operacional seguro e otimizado
            </p>
          </div>
        </div>

        {/* Índice Rápido (Cards de links com borda e hover suave) */}
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

        {/* Seções / Cards com transição e bordas suaves */}
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

              {/* Renderização condicional da Imagem caso ela exista no passo */}
              {passo.imagem && (
                <div className="flex justify-center bg-gray-50 dark:bg-neutral-800/60 rounded-xl p-6 border border-gray-50 dark:border-neutral-800/40">
                  <Image
                    src={passo.imagem}
                    alt={`Passo ${passo.numero} - ${passo.titulo}`}
                    width={800}
                    height={450}
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