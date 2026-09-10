"use client";

import Layout from "../../../components/Layout";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Scale,
  RotateCcw,
  Settings,
  Info,
  BookOpen,
} from "lucide-react";

export default function Alfa() {
  const router = useRouter();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-4">
        {/* Botão Voltar */}
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="mb-6 gap-2 text-gray-600 dark:text-gray-300"
        >
          <ArrowLeft size={16} />
          Voltar
        </Button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <span className="flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 shrink-0">
            <Scale size={28} />
          </span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Função Tara (TARA)
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Indicadores de Pesagem Alfa 3100D/DS
            </p>
          </div>
        </div>

        {/* Seções */}
        <div className="space-y-6">
          {/* O que é a Função Tara? */}
          <section className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-5">
              <span className="flex items-center justify-center w-11 h-11 rounded-xl shrink-0 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <Info size={20} />
              </span>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  O que é a Função Tara?
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                  A função <span className="font-semibold text-blue-700">Tara</span> é
                  utilizada para descontar o peso de recipientes ou embalagens,
                  permitindo que a balança indique apenas o peso líquido do material
                  contido. Essencial para medições precisas.
                </p>
              </div>
            </div>
          </section>

          {/* Configurando a Tara Manual (Modo Editável) */}
          <section className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-5">
              <span className="flex items-center justify-center w-11 h-11 rounded-xl shrink-0 bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                <Settings size={20} />
              </span>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Configurando a Tara Manual (Modo Editável)
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                  Para configurar manualmente o valor da tara no indicador Alfa 3104D,
                  siga os passos gerais abaixo:
                </p>
              </div>
            </div>

            <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-4">
              <li>
                Clique no botão{" "}
                <code className="bg-gray-200 text-purple-700 px-2 py-1 rounded-md font-mono">
                  TARA
                </code>.
              </li>
              <div className="flex justify-center bg-gray-50 dark:bg-neutral-800/60 rounded-xl p-6">
                <Image
                  src="/assets/images/balancas/alfa/alfa-3104c-tara-manual-1.png"
                  alt="Tara manual - passo 1"
                  width={500}
                  height={500}
                  className="object-contain"
                />
              </div>

              <li>
                Para digitar os números, navegue para o lado direito com a tecla
                “→ TARA” e com o botão “← ZERO” aumenta o número; se caso passar,
                continue clicando na mesma tecla até voltar.
              </li>

              <li>
                No final, só clicar na tecla{" "}
                <code className="bg-gray-200 text-purple-700 px-2 py-1 rounded-md font-mono">
                  CONFIG
                </code>{" "}
                e pronto.
              </li>
              <div className="flex justify-center bg-gray-50 dark:bg-neutral-800/60 rounded-xl p-6">
                <Image
                  src="/assets/images/balancas/alfa/alfa-3104c-tara-manual-2.png"
                  alt="Tara manual - passo 2"
                  width={500}
                  height={500}
                  className="object-contain"
                />
              </div>
            </ol>
          </section>

          {/* Modos de Tara Disponíveis */}
          <section className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-5">
              <span className="flex items-center justify-center w-11 h-11 rounded-xl shrink-0 bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                <RotateCcw size={20} />
              </span>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Modos de Tara Disponíveis
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                  O indicador Alfa 3104D oferece diversos modos de operação para a
                  função Tara. Para a operação de tara manual, os modos mais
                  relevantes são:
                </p>
              </div>
            </div>

            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li>
                <span className="font-medium text-green-700">"Editável" (E)</span>
                : Permite a inserção manual do valor da tara.
              </li>
              <li>
                <span className="font-medium text-green-700">
                  "Editável, salvando valor de TARA" (Eg)
                </span>
                : Permite a inserção manual e armazena o valor para futuras
                pesagens.
              </li>
            </ul>
          </section>

          {/* Ativação da Função Tara */}
          <section className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-5">
              <span className="flex items-center justify-center w-11 h-11 rounded-xl shrink-0 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                <Settings size={20} />
              </span>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Ativação da Função Tara
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                  A função Tara pode ser ativada de três maneiras distintas,
                  dependendo do contexto de uso:
                </p>
              </div>
            </div>

            <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li>
                Pressionando a tecla{" "}
                <code className="bg-gray-200 text-purple-700 px-2 py-1 rounded-md font-mono">
                  &lt;TARA&gt;
                </code>
                : A forma mais comum e direta de ativar a função.
              </li>
              <li>
                Via comando{" "}
                <code className="bg-gray-200 text-purple-700 px-2 py-1 rounded-md font-mono">
                  TARA REMOTO
                </code>
                : Utilizado em sistemas de automação para ativação externa.
              </li>
              <li>
                Via protocolo de comunicação: Para integração com sistemas de
                software ou outros dispositivos através da interface serial.
              </li>
            </ol>
          </section>

          {/* Observação Importante */}
          <section className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-5">
              <span className="flex items-center justify-center w-11 h-11 rounded-xl shrink-0 bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400">
                <Info size={20} />
              </span>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Observação Importante
                </h2>
              </div>
            </div>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md">
              O manual indica que, através da função de TARA, é possível obter a
              indicação de peso{" "}
              <span className="font-bold">LÍQUIDO negativo</span>
              caso haja remoção de material após a tara.
            </p>
          </section>

          {/* Para Mais Detalhes */}
          <section className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-5">
              <span className="flex items-center justify-center w-11 h-11 rounded-xl shrink-0 bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                <BookOpen size={20} />
              </span>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Para Mais Detalhes
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                  Para informações específicas sobre as teclas de navegação, o
                  processo exato de seleção do modo de tara editável, e outras
                  funcionalidades avançadas, é altamente recomendável consultar as
                  seções "Funções das Teclas" e "Configuração e Operação" do{" "}
                  <span className="font-semibold text-blue-700">
                    Manual do Usuário da Balança Alfa 3104D
                  </span>.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}