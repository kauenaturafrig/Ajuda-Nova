import Layout from "../../components/Layout";
import Link from "next/link";
import Image from "next/image";
import { Scale } from "lucide-react";

export default function Balancas() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <span className="flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 shrink-0">
            <Scale size={36} />
          </span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Balanças
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Selecione o indicador para ver as configurações e informações
            </p>
          </div>
        </div>

        {/* Lista de indicadores */}
        <div className="space-y-4">
          <Link
            href="/balancas/alfa"
            className="group flex items-center gap-4 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-4 sm:p-6 shadow-sm hover:border-amber-300 hover:shadow-md transition-all"
          >
            <div className="shrink-0">
              <Image
                src="/assets/images/balancas/alfa/indicador-3104c.png"
                alt="Alfa"
                width={120}
                height={120}
                className="object-contain"
              />
            </div>
            <span className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400">
              Alfa
            </span>
          </Link>

          <Link
            href="/balancas/sp2500"
            className="group flex items-center gap-4 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-4 sm:p-6 shadow-sm hover:border-amber-300 hover:shadow-md transition-all"
          >
            <div className="shrink-0">
              <Image
                src="/assets/images/balancas/sp2500/sp2500.png"
                alt="SP2500"
                width={120}
                height={120}
                className="object-contain"
              />
            </div>
            <span className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400">
              SP2500
            </span>
          </Link>

          <Link
            href="/balancas/wt3000"
            className="group flex items-center gap-4 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-4 sm:p-6 shadow-sm hover:border-amber-300 hover:shadow-md transition-all"
          >
            <div className="shrink-0">
              <Image
                src="/assets/images/balancas/wt3000/wt3000.jpg"
                alt="WT3000"
                width={120}
                height={120}
                className="object-contain"
              />
            </div>
            <span className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400">
              WT3000
            </span>
          </Link>
        </div>
      </div>
    </Layout>
  );
}