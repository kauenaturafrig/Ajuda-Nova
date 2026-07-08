"use client";

import Layout from "../../../components/Layout";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft, FolderSearch, AlertCircle, ArrowUpRight } from "lucide-react";

export default function LocatePrograms() {
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
              <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400">
                <FolderSearch size={18} />
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Localizando Aplicativos TANURESOFT
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 pl-10">
              Guia para encontrar as pastas internas do sistema e criar atalhos na Área de Trabalho.
            </p>
          </div>

          {/* Alerta de Observação Importante */}
          <div className="flex gap-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 p-4 rounded-xl text-amber-800 dark:text-amber-400">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wide">Observação Obrigatória</h4>
              <p className="text-xs sm:text-sm leading-relaxed opacity-90">
                Sempre atualize os programas utilizando o comando <code className="bg-amber-100/80 dark:bg-amber-900/50 px-1 py-0.5 rounded font-mono text-xs font-semibold">F:atualiza</code> dentro do Prompt de Comando.
              </p>
              <Link
                href="/windows-page/cmd-page/atualizar/"
                className="inline-flex items-center gap-1 text-xs font-semibold underline underline-offset-4 hover:opacity-80 mt-1"
              >
                Clique aqui para ver detalhes do processo
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          <div className="space-y-8 relative before:absolute before:inset-y-0 before:left-4 sm:before:left-6 before:w-0.5 before:bg-gray-100 dark:before:bg-neutral-800">
            
            <div className="relative pl-10 sm:pl-14 space-y-3">
              <span className="absolute left-1.5 sm:left-3.5 top-0 flex items-center justify-center w-6 h-6 rounded-lg bg-red-500 text-white font-bold text-xs shadow-md shadow-red-500/20">
                1
              </span>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Acesse o Disco Local</h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Abra o gerenciador de arquivos em <span className="font-semibold text-gray-700 dark:text-gray-300">Este Computador</span> e dê um duplo clique no <span className="font-semibold text-gray-700 dark:text-gray-300">Disco Local (C:)</span>.
              </p>
              <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900 p-2 max-w-2xl">
                <Image
                  src="/assets/images/tanuresoft/localizar-programas/l-p-1.png"
                  alt="Explorer Localization"
                  width={1000}
                  height={500}
                  className="rounded-lg object-cover w-full h-auto"
                />
              </div>
            </div>

            <div className="relative pl-10 sm:pl-14 space-y-3">
              <span className="absolute left-1.5 sm:left-3.5 top-0 flex items-center justify-center w-6 h-6 rounded-lg bg-gray-900 dark:bg-neutral-800 text-white font-bold text-xs">
                2
              </span>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Localize o Diretório Principal</h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Procure pela pasta chamada <code className="bg-gray-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded font-mono text-xs text-red-600 dark:text-red-400 font-semibold">TANURESOFT</code> e abra-a.
              </p>
              <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900 p-2 max-w-2xl">
                <Image
                  src="/assets/images/tanuresoft/localizar-programas/l-p-2.png"
                  alt="Explorer Localization"
                  width={1000}
                  height={500}
                  className="rounded-lg object-cover w-full h-auto"
                />
              </div>
            </div>

            <div className="relative pl-10 sm:pl-14 space-y-3">
              <span className="absolute left-1.5 sm:left-3.5 top-0 flex items-center justify-center w-6 h-6 rounded-lg bg-gray-900 dark:bg-neutral-800 text-white font-bold text-xs">
                3
              </span>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Selecione o Sistema Desejado</h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Dentro da pasta, você verá subpastas correspondentes a cada módulo operacional da empresa. Entre na pasta correspondente ao sistema que deseja executar.
              </p>
            </div>

            <div className="relative pl-10 sm:pl-14 space-y-3">
              <span className="absolute left-1.5 sm:left-3.5 top-0 flex items-center justify-center w-6 h-6 rounded-lg bg-gray-900 dark:bg-neutral-800 text-white font-bold text-xs">
                4
              </span>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Criar o Atalho na Área de Trabalho</h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Clique com o botão direito sobre o ícone do sistema interno, navegue até <span className="font-semibold text-gray-700 dark:text-gray-300">"Enviar para"</span> e escolha <span className="font-semibold text-gray-700 dark:text-gray-300">"Área de trabalho (criar atalho)"</span>.
              </p>
              <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900 p-2 max-w-2xl">
                <Image
                  src="/assets/images/tanuresoft/localizar-programas/l-p-3.png"
                  alt="Explorer Localization"
                  width={1000}
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