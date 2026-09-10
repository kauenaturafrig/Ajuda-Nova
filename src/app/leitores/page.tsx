import Layout from "../../components/Layout";
import Image from "next/image";
import Link from "next/link";
import { ScanLine } from "lucide-react";

export default function ImpressorasTermicas() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <span className="flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shrink-0">
            <ScanLine size={36} />
          </span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Leitores de código de barra
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Selecione o modelo do leitor para ver as configurações rápidas
            </p>
          </div>
        </div>

        {/* Lista de leitores */}
        <div className="space-y-4">
          <Link
            href="/leitores/zebra2278"
            className="group flex items-center gap-4 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-4 sm:p-6 shadow-sm hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="shrink-0">
              <Image
                src="/assets/images/leitores/ZEBRA-DS2278.png"
                alt="ZEBRA DS2278"
                width={120}
                height={120}
                className="object-contain"
              />
            </div>
            <span className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
              ZEBRA DS2278
            </span>
          </Link>

          <Link
            href="/leitores/voyager1472g"
            className="group flex items-center gap-4 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-4 sm:p-6 shadow-sm hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="shrink-0">
              <Image
                src="/assets/images/leitores/VOYAGER-1472G.png"
                alt="VOYAGER 1472G"
                width={120}
                height={120}
                className="object-contain"
              />
            </div>
            <span className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
              VOYAGER 1472G
            </span>
          </Link>
        </div>
      </div>
    </Layout>
  );
}