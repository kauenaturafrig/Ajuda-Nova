import Layout from "../../components/Layout";
import Image from "next/image";
import Link from "next/link";
import { Printer } from "lucide-react";

export default function ImpressorasTermicas() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <span className="flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shrink-0">
            <Printer size={36} />
          </span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Impressoras Zebra
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Selecione o procedimento para ver as instruções rápidas
            </p>
          </div>
        </div>

        {/* Lista de procedimentos */}
        <div className="space-y-4">
          <Link
            href="/impressoras-termicas/troca-ribbon-etq"
            className="group flex items-center gap-4 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-4 sm:p-6 shadow-sm hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="shrink-0">
              <Image
                src="/assets/images/impressoras-termicas/zt230.png"
                alt="ZT-230"
                width={120}
                height={120}
                className="object-contain"
              />
            </div>
            <span className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
              Trocar Ribbon e Etiqueta ZT-230/ZT-231/ZT411
            </span>
          </Link>

          <Link
            href="/impressoras-termicas/limpeza-printhead"
            className="group flex items-center gap-4 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-4 sm:p-6 shadow-sm hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="shrink-0">
              <Image
                src="/assets/images/impressoras-termicas/cabeca-impressao.webp"
                alt="Cabeca de impressão"
                width={120}
                height={120}
                className="object-contain"
              />
            </div>
            <span className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
              Limpar Cabeçote de Impressão ZT-230/ZT-231
            </span>
          </Link>
        </div>
      </div>
    </Layout>
  );
}