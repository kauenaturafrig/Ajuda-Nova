"use client";

import Layout from "../../../components/Layout";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Printer,
  RefreshCcw,
} from "lucide-react";

export default function RibbonEtq() {
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
          <span className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shrink-0">
            <Printer size={28} />
          </span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Trocar Ribbon e Etiqueta
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Impressoras Zebra ZT-230/ZT-231/ZT411
            </p>
          </div>
        </div>

        {/* Seção principal */}
        <div className="space-y-6">
          <section className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-5">
              <span className="flex items-center justify-center w-11 h-11 rounded-xl shrink-0 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                <RefreshCcw size={20} />
              </span>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  1.1. Carregamento de Mídia e Ribbon
                </h2>
              </div>
            </div>

            <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li>Levante a porta da mídia.</li>
              <div className="flex justify-center bg-gray-50 dark:bg-neutral-800/60 rounded-xl p-6">
                <Image
                  src="/assets/images/impressoras-termicas/zt230-1.webp"
                  alt="Passo 1 - Levantar porta da mídia"
                  width={500}
                  height={500}
                  className="object-contain"
                />
              </div>

              <li>
                Gire a alavanca dourada do cabeçote de impressão para cima para
                abrir o cabeçote de impressão.
              </li>
              <div className="flex justify-center bg-gray-50 dark:bg-neutral-800/60 rounded-xl p-6">
                <Image
                  src="/assets/images/impressoras-termicas/zt230-2.png"
                  alt="Passo 2 - Abrir cabeçote de impressão"
                  width={500}
                  height={500}
                  className="object-contain"
                />
              </div>

              <li>Deslize a guia de mídia externa dourada para fora.</li>
              <div className="flex justify-center bg-gray-50 dark:bg-neutral-800/60 rounded-xl p-6">
                <Image
                  src="/assets/images/impressoras-termicas/zt230-3.png"
                  alt="Passo 3 - Deslizar guia de mídia externa"
                  width={500}
                  height={500}
                  className="object-contain"
                />
              </div>

              <li>Coloque o rolo de mídia no suporte.</li>
              <div className="flex justify-center bg-gray-50 dark:bg-neutral-800/60 rounded-xl p-6">
                <Image
                  src="/assets/images/impressoras-termicas/zt230-4.png"
                  alt="Passo 4 - Colocar rolo de mídia no suporte"
                  width={500}
                  height={500}
                  className="object-contain"
                />
              </div>

              <li>
                Empurre-o para trás, levante a guia de suprimento de mídia e
                deslize-a para dentro enquanto passa a mídia pela frente da
                impressora.
              </li>
              <div className="flex justify-center bg-gray-50 dark:bg-neutral-800/60 rounded-xl p-6">
                <Image
                  src="/assets/images/impressoras-termicas/zt230-5.png"
                  alt="Passo 5 - Passar mídia pela frente da impressora"
                  width={500}
                  height={500}
                  className="object-contain"
                />
              </div>

              <li>
                Certifique-se de que ela passe por dentro do sensor de lacuna e
                sob a guia de mídia interna.
              </li>

              <li>
                Deslize a mídia sob o amortecedor cinza e o mecanismo de
                impressão.
              </li>
              <div className="flex justify-center bg-gray-50 dark:bg-neutral-800/60 rounded-xl p-6">
                <Image
                  src="/assets/images/impressoras-termicas/zt230-6.png"
                  alt="Passo 6 - Mídia sob amortecedor e mecanismo de impressão"
                  width={500}
                  height={500}
                  className="object-contain"
                />
              </div>

              <li>
                Deslize a guia de mídia externa dourada até que ela toque a borda
                da mídia.
              </li>

              <li>
                Coloque um núcleo de ribbon vazio no eixo de recolhimento do
                ribbon. Empurre o núcleo para trás o máximo que puder.
              </li>
              <div className="flex justify-center bg-gray-50 dark:bg-neutral-800/60 rounded-xl p-6">
                <Image
                  src="/assets/images/impressoras-termicas/zt230-7.png"
                  alt="Passo 7 - Colocar núcleo de ribbon vazio"
                  width={500}
                  height={500}
                  className="object-contain"
                />
              </div>

              <li>
                Coloque o rolo de ribbon no eixo de suprimento do ribbon com a
                ponta solta rolando para baixo no lado direito. Empurre-o para
                trás o máximo que puder.
              </li>

              <li>
                Deslize o ribbon sob a guia preta do ribbon e sob o mecanismo de
                impressão.
              </li>

              <li>Enrole o ribbon sobre a parte superior do núcleo.</li>
              <div className="flex justify-center bg-gray-50 dark:bg-neutral-800/60 rounded-xl p-6">
                <Image
                  src="/assets/images/impressoras-termicas/zt230-8.png"
                  alt="Passo 8 - Enrolar ribbon sobre o núcleo"
                  width={500}
                  height={500}
                  className="object-contain"
                />
              </div>

              <li>
                Gire o eixo para a direita para remover qualquer folga do ribbon.
              </li>

              <li>
                Gire a alavanca dourada do cabeçote de impressão para baixo para
                fechar o cabeçote de impressão.
              </li>
              <div className="flex justify-center bg-gray-50 dark:bg-neutral-800/60 rounded-xl p-6">
                <Image
                  src="/assets/images/impressoras-termicas/zt230-10.png"
                  alt="Passo 9 - Fechar cabeçote de impressão"
                  width={500}
                  height={500}
                  className="object-contain"
                />
              </div>

              <li>Pressione o botão de pausa para calibrar a impressora.</li>
              <div className="flex justify-center bg-gray-50 dark:bg-neutral-800/60 rounded-xl p-6">
                <Image
                  src="/assets/images/impressoras-termicas/zt230-9.png"
                  alt="Passo 10 - Calibrar impressora"
                  width={500}
                  height={500}
                  className="object-contain"
                />
              </div>

              <li>Feche a porta da mídia.</li>
              <div className="flex justify-center bg-gray-50 dark:bg-neutral-800/60 rounded-xl p-6">
                <Image
                  src="/assets/images/impressoras-termicas/zt230-2.webp"
                  alt="Passo 11 - Fechar porta da mídia"
                  width={500}
                  height={500}
                  className="object-contain"
                />
              </div>
            </ol>
          </section>
        </div>
      </div>
    </Layout>
  );
}