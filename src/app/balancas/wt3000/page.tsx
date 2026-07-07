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
  Trash2,
} from "lucide-react";

export default function WT3000() {
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
              Tara manual
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Balança Weightech WT3000
            </p>
          </div>
        </div>

        {/* Seções */}
        <div className="space-y-6">
          {/* Função de Tara Manual */}
          <section className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-5">
              <span className="flex items-center justify-center w-11 h-11 rounded-xl shrink-0 bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                <RotateCcw size={20} />
              </span>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Função de Tara Manual
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                  A função de tara manual é utilizada para descontar o peso de
                  recipientes em geral, permitindo que o usuário insira o valor do
                  peso que será descontado, sem a necessidade de pesar o recipiente
                  vazio.
                </p>
              </div>
            </div>
          </section>

          {/* Passos para configurar a tara manual */}
          <section className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-5">
              <span className="flex items-center justify-center w-11 h-11 rounded-xl shrink-0 bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                <Scale size={20} />
              </span>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Passos para configurar a tara manual:
                </h2>
              </div>
            </div>

            <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li>
                Com a balança sem carga aplicada (plataforma vazia), pressione a
                tecla{" "}
                <code className="bg-gray-200 text-purple-700 px-2 py-1 rounded-md font-mono">
                  &lt;TARA&gt;
                </code>.
              </li>
              <div className="flex justify-center bg-gray-50 dark:bg-neutral-800/60 rounded-xl p-6">
                <Image
                  src="/assets/images/balancas/wt3000/wt3000-tara-manual-1.png"
                  alt="Tara manual - passo 1 - WT3000"
                  width={500}
                  height={500}
                  className="object-contain"
                />
              </div>
              <li>O display mostrará "pt__" (pré-tara).</li>
              <li>
                Digite o valor da tara desejada utilizando as teclas de navegação
                (setas para cima/baixo e para os lados, conforme o modelo da
                balança e as indicações do manual).
              </li>
              <li>
                Após digitar o valor da tara, pressione a tecla [Tara] (ou a
                tecla de confirmação, conforme o manual) para confirmar.
              </li>
            </ol>
          </section>

          {/* Para limpar o valor de tara manual */}
          <section className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-5">
              <span className="flex items-center justify-center w-11 h-11 rounded-xl shrink-0 bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
                <Trash2 size={20} />
              </span>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Para limpar o valor de tara manual:
                </h2>
              </div>
            </div>

            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li>
                Pressione a tecla{" "}
                <code className="bg-gray-200 text-purple-700 px-2 py-1 rounded-md font-mono">
                  &lt;TARA&gt;
                </code>{" "}
                com a plataforma vazia.
              </li>
              <li>
                Alternativamente, insira um valor nulo de tara (0) e confirme com
                a plataforma sem peso aplicado.
              </li>
            </ul>
          </section>
        </div>
      </div>
    </Layout>
  );
}