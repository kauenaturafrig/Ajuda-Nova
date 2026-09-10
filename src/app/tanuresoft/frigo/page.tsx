"use client";

import Layout from "../../../components/Layout";
import Image from "next/image";
import { Button } from "../../../components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft, Terminal } from "lucide-react";

export default function Frigo() {
  const router = useRouter();

  return (
    <Layout>
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="h-9 rounded-xl text-gray-500 hover:text-gray-900 dark:hover:text-white border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 shadow-sm gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Button>

        <div className="bg-white dark:bg-neutral-900/40 border border-gray-100 dark:border-neutral-800/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
          
          <div className="space-y-2 border-b border-gray-100 dark:border-neutral-800/50 pb-5">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400">
                <Terminal size={18} />
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Sistema Frigo
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 pl-10">
              Tutorial para acesso ao sistema frigo através do CMD ou Prompt de comando.
            </p>
          </div>

          <div className="space-y-8 relative before:absolute before:inset-y-0 before:left-4 sm:before:left-6 before:w-0.5 before:bg-gray-100 dark:before:bg-neutral-800">
            
            <div className="relative pl-10 sm:pl-14 space-y-3 group">
              <span className="absolute left-1.5 sm:left-3.5 top-0 flex items-center justify-center w-6 h-6 rounded-lg bg-green-500 text-white font-bold text-xs shadow-md shadow-green-500/20">
                1
              </span>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Pesquise por “CMD” no menu iniciar:</h3>
              <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900 p-2 max-w-lg">
                <Image
                  src="/assets/images/tanuresoft/frigo/frigo-1.png"
                  alt="CMD FRIGO"
                  width={500}
                  height={500}
                  className="rounded-lg object-cover w-full h-auto"
                />
              </div>
            </div>

            <div className="relative pl-10 sm:pl-14 space-y-3 group">
              <span className="absolute left-1.5 sm:left-3.5 top-0 flex items-center justify-center w-6 h-6 rounded-lg bg-gray-900 dark:bg-neutral-800 text-white font-bold text-xs">
                2
              </span>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Selecione o Disco Compartilhado</h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Quando iniciar, digite <code className="bg-gray-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded font-mono text-xs text-green-600 dark:text-green-400 font-semibold">F:</code> e aperte a tecla <kbd className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 px-1 rounded text-[11px]">ENTER</kbd>:
              </p>
              <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900 p-2 max-w-lg">
                <Image
                  src="/assets/images/tanuresoft/frigo/frigo-2.png"
                  alt="CMD FRIGO"
                  width={500}
                  height={500}
                  className="rounded-lg object-cover w-full h-auto"
                />
              </div>
            </div>

            <div className="relative pl-10 sm:pl-14 space-y-3 group">
              <span className="absolute left-1.5 sm:left-3.5 top-0 flex items-center justify-center w-6 h-6 rounded-lg bg-gray-900 dark:bg-neutral-800 text-white font-bold text-xs">
                3
              </span>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Inicie o Programa</h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Digite o nome do programa desejado, no caso <code className="bg-gray-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded font-mono text-xs text-green-600 dark:text-green-400 font-semibold">FRIGO</code> e aperte <kbd className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 px-1 rounded text-[11px]">ENTER</kbd>:
              </p>
              <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900 p-2 max-w-lg">
                <Image
                  src="/assets/images/tanuresoft/frigo/frigo-3.png"
                  alt="CMD FRIGO"
                  width={500}
                  height={500}
                  className="rounded-lg object-cover w-full h-auto"
                />
              </div>
            </div>

            <div className="relative pl-10 sm:pl-14 space-y-3 group">
              <span className="absolute left-1.5 sm:left-3.5 top-0 flex items-center justify-center w-6 h-6 rounded-lg bg-gray-900 dark:bg-neutral-800 text-white font-bold text-xs">
                4
              </span>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Autenticação</h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Aguarde o programa carregar e digite seu usuário e senha:</p>
              <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900 p-2 max-w-lg">
                <Image
                  src="/assets/images/tanuresoft/frigo/frigo-4.png"
                  alt="CMD FRIGO"
                  width={500}
                  height={500}
                  className="rounded-lg object-cover w-full h-auto"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}