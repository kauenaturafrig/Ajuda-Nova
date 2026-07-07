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
} from "lucide-react";

export default function SP2500() {
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
              Configuração de Tara
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Balança EPM SP2500
            </p>
          </div>
        </div>

        {/* Seções */}
        <div className="space-y-6">
          {/* Modos de Tara no SP2500 */}
          <section className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-5">
              <span className="flex items-center justify-center w-11 h-11 rounded-xl shrink-0 bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                <RotateCcw size={20} />
              </span>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  No SP-2500 existem duas maneiras de colocar um valor de tara:
                </h2>
              </div>
            </div>

            {/* Tara Automática */}
            <div className="mb-6">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Tara Automática:
              </p>
              <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-2">
                <li>
                  <span className="font-medium">
                    Coloque sobre a balança o peso a ser descontado
                    carretilha/gancheira
                  </span>.
                </li>
                <li>
                  <span className="font-medium">Digite a tecla TARA.</span>
                </li>
                <div className="flex justify-center bg-gray-50 dark:bg-neutral-800/60 rounded-xl p-6">
                  <Image
                    src="/assets/images/balancas/sp2500/sp2500-tara-automatica.png"
                    alt="Tara automática - SP2500"
                    width={500}
                    height={500}
                    className="object-contain"
                  />
                </div>
                <li>
                  <span className="font-medium">
                    A balança é zerada e o LED de TARA é aceso, indicando que existe
                    um valor de tara sendo descontado do peso.
                  </span>
                </li>
              </ol>
            </div>

            {/* Tara Manual */}
            <div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 mt-4">
                Tara Manual:
              </p>
              <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-2">
                <li>
                  <span className="font-medium">
                    Digite as teclas “Função” e “8 - Manual”.
                  </span>.
                </li>
                <div className="flex justify-center bg-gray-50 dark:bg-neutral-800/60 rounded-xl p-6">
                  <Image
                    src="/assets/images/balancas/sp2500/sp2500-tara-manual-1.png"
                    alt="Tara manual - passo 1 - SP2500"
                    width={500}
                    height={500}
                    className="object-contain"
                  />
                </div>
                <li>
                  <span className="font-medium">
                    Digite o peso desejado, lembre-se de colocar o ponto/vírgula, se
                    precisar.
                  </span>
                </li>
                <li>
                  <span className="font-medium">
                    Clique no botão “Aceita” e pronto, a tara está configurada.
                  </span>
                </li>
                <div className="flex justify-center bg-gray-50 dark:bg-neutral-800/60 rounded-xl p-6">
                  <Image
                    src="/assets/images/balancas/sp2500/sp2500-tara-manual-2.png"
                    alt="Tara manual - passo 2 - SP2500"
                    width={500}
                    height={500}
                    className="object-contain"
                  />
                </div>
              </ol>
            </div>
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
              O valor da tara está limitado ao fundo de escala da balança.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md mt-1">
              Dependendo da configuração do equipamento, as teclas de tara podem
              estar desabilitadas. Consulte o manual completo para mais detalhes
              sobre as configurações avançadas.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}