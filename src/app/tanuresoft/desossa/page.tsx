"use client";

import Layout from "../../../components/Layout";
import Image from "next/image";
import { Button } from "../../../components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft, Terminal, Monitor, KeyRound, Play } from "lucide-react";

export default function Desossa() {
  const router = useRouter();
  
  return (
    <Layout>
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Botão Voltar Alinhado */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="h-9 rounded-xl text-gray-500 hover:text-gray-900 dark:hover:text-white border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 shadow-sm gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Button>

        {/* Card Principal */}
        <div className="bg-white dark:bg-neutral-900/40 border border-gray-100 dark:border-neutral-800/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
          
          {/* Header */}
          <div className="space-y-2 border-b border-gray-100 dark:border-neutral-800/50 pb-5">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400">
                <Terminal size={18} />
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Sistema Desossa
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 pl-10">
              Acompanhe abaixo as instruções passo a passo para acessar a aplicação utilizando o Prompt de Comando (CMD).
            </p>
          </div>

          {/* Container dos Passos (Timeline/Cards) */}
          <div className="space-y-8 relative before:absolute before:inset-y-0 before:left-4 sm:before:left-6 before:w-0.5 before:bg-gray-100 dark:before:bg-neutral-800">
            
            {/* Passo 1 */}
            <div className="relative pl-10 sm:pl-14 space-y-3 group">
              <span className="absolute left-1.5 sm:left-3.5 top-0 flex items-center justify-center w-6 h-6 rounded-lg bg-green-500 text-white font-bold text-xs shadow-md shadow-green-500/20">
                1
              </span>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Abra o Prompt de Comando
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Pesquise por <code className="bg-gray-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded font-mono text-xs text-green-600 dark:text-green-400 font-semibold">CMD</code> no menu iniciar do Windows.
              </p>
              <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900 p-2 max-w-lg transition-all group-hover:border-gray-200 dark:group-hover:border-neutral-700">
                <Image
                  src="/assets/images/tanuresoft/desossa/desossa-1.png"
                  alt="CMD Menu Iniciar"
                  width={500}
                  height={300}
                  className="rounded-lg object-cover w-full h-auto"
                />
              </div>
            </div>

            {/* Passo 2 */}
            <div className="relative pl-10 sm:pl-14 space-y-3 group">
              <span className="absolute left-1.5 sm:left-3.5 top-0 flex items-center justify-center w-6 h-6 rounded-lg bg-gray-900 dark:bg-neutral-800 text-white font-bold text-xs">
                2
              </span>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Direcione para a Unidade de Rede
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Assim que a janela preta inicializar, digite <code className="bg-gray-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded font-mono text-xs text-green-600 dark:text-green-400 font-semibold">F:</code> e pressione a tecla <kbd className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 px-1 rounded text-[11px] shadow-sm">ENTER</kbd>.
              </p>
              <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900 p-2 max-w-lg transition-all group-hover:border-gray-200 dark:group-hover:border-neutral-700">
                <Image
                  src="/assets/images/tanuresoft/desossa/desossa-2.png"
                  alt="Comando Unidade F:"
                  width={500}
                  height={300}
                  className="rounded-lg object-cover w-full h-auto"
                />
              </div>
            </div>

            {/* Passo 3 */}
            <div className="relative pl-10 sm:pl-14 space-y-3 group">
              <span className="absolute left-1.5 sm:left-3.5 top-0 flex items-center justify-center w-6 h-6 rounded-lg bg-gray-900 dark:bg-neutral-800 text-white font-bold text-xs">
                3
              </span>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Inicie o Executável
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Digite exatamente o nome do programa desejado, no caso <code className="bg-gray-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded font-mono text-xs text-green-600 dark:text-green-400 font-semibold">DESOSSA</code> e pressione <kbd className="bg-gray-100 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 px-1 rounded text-[11px] shadow-sm">ENTER</kbd>.
              </p>
              <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900 p-2 max-w-lg transition-all group-hover:border-gray-200 dark:group-hover:border-neutral-700">
                <Image
                  src="/assets/images/tanuresoft/desossa/desossa-3.png"
                  alt="Executando Desossa"
                  width={500}
                  height={300}
                  className="rounded-lg object-cover w-full h-auto"
                />
              </div>
            </div>

            {/* Passo 4 */}
            <div className="relative pl-10 sm:pl-14 space-y-3 group">
              <span className="absolute left-1.5 sm:left-3.5 top-0 flex items-center justify-center w-6 h-6 rounded-lg bg-gray-900 dark:bg-neutral-800 text-white font-bold text-xs">
                4
              </span>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                Autenticação no Sistema
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Aguarde a interface interna carregar por completo e preencha com seu usuário e credenciais homologadas.
              </p>
              <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900 p-2 max-w-lg transition-all group-hover:border-gray-200 dark:group-hover:border-neutral-700">
                <Image
                  src="/assets/images/tanuresoft/desossa/desossa-4.png"
                  alt="Tela de login Desossa"
                  width={500}
                  height={300}
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