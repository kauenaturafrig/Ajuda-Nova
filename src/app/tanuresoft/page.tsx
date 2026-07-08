import Layout from "../../components/Layout";
import Link from "next/link";
import { type ReactNode } from "react";
import {
  Terminal,
  Scissors,
  Snowflake,
  Beef,
  Scale,
  AppWindow,
  Settings,
  HelpCircle,
  ArrowRight,
  MessageCircleQuestion,
} from "lucide-react";

export default function Tanuresoft() {
  return (
    <Layout>
      <div className="max-w-[1100px] mx-auto pt-2 p-1">
        {/* Header */}
        <div className="flex items-center gap-3 mb-1">
          <h1 className="font-bold text-4xl dark:text-white">Tanuresoft</h1>
          <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400">
            <Terminal size={20} />
          </span>
        </div>
        <p className="mb-8 text-gray-500 dark:text-gray-400">
          Central de informações e manuais dos programas Tanure
        </p>

        {/* Programas de CMD */}
        <section className="border-l-4 border-green-600 bg-white dark:bg-neutral-900 rounded-r-xl shadow-sm p-6 mb-6">
          <div className="flex items-start gap-4 mb-5">
            <span className="flex items-center justify-center w-11 h-11 shrink-0 rounded-lg bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <Terminal size={22} />
            </span>
            <div>
              <h2 className="font-semibold text-xl dark:text-white">
                Programas de CMD
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Acesse os principais programas via prompt de comando.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <CmdCard
              href="/tanuresoft/desossa"
              icon={<Scissors size={20} />}
              title="Desossa"
              description="Programa de desossa"
            />
            <CmdCard
              href="/tanuresoft/frigo"
              icon={<Snowflake size={20} />}
              title="Frigo"
              description="Programa frigorífico"
            />
            <CmdCard
              href="/tanuresoft/matanca"
              icon={<Beef size={20} />}
              title="Matanca"
              description="Programa de matança"
            />
            <CmdCard
              href="/tanuresoft/pesagem"
              icon={<Scale size={20} />}
              title="Pesagem"
              description="Programa de pesagem"
            />
          </div>
        </section>

        {/* Programas executados no Windows */}
        <section className="border-l-4 border-red-600 bg-white dark:bg-neutral-900 rounded-r-xl shadow-sm p-6 mb-6">
          <div className="flex items-start gap-4 mb-5">
            <span className="flex items-center justify-center w-11 h-11 shrink-0 rounded-lg bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400">
              <AppWindow size={22} />
            </span>
            <div>
              <h2 className="font-semibold text-xl dark:text-white">
                Programas executados no Windows
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Como localizar os programas no seu computador.
              </p>
            </div>
          </div>

          <Link
            href={"/tanuresoft/localizar-programas"}
            className="block rounded-lg border border-red-100 dark:border-red-900/40 bg-red-50/40 dark:bg-red-900/10 p-5 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <p className="font-medium text-red-700 dark:text-red-400 mb-3">
              Como localizar os programas:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3">
              {["MatWin", "FrigoWin", "AlmoxWin", "BancoWin", "PortWin"].map(
                (name) => (
                  <div
                    key={name}
                    className="flex items-center gap-2 text-gray-700 dark:text-gray-200"
                  >
                    <Terminal
                      size={16}
                      className="text-red-500 dark:text-red-400"
                    />
                    <span>{name}</span>
                  </div>
                )
              )}
            </div>
          </Link>
        </section>

        {/* Configurar e atualizar CMD */}
        <section className="border-l-4 border-yellow-500 bg-white dark:bg-neutral-900 rounded-r-xl shadow-sm p-6 mb-6">
          <div className="flex items-start gap-4 mb-5">
            <span className="flex items-center justify-center w-11 h-11 shrink-0 rounded-lg bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400">
              <Settings size={22} />
            </span>
            <div>
              <h2 className="font-semibold text-xl dark:text-white">
                Como CONFIGURAR e ATUALIZAR o CMD
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Prompt de Comando para os programas do Tanure
              </p>
            </div>
          </div>

          <Link
            href={"/windows-page/cmd-page"}
            className="flex items-center justify-between rounded-lg bg-yellow-50 dark:bg-yellow-900/10 p-5 hover:bg-yellow-100 dark:hover:bg-yellow-900/20 transition-colors"
          >
            <div>
              <p className="font-medium dark:text-white">CMD</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Guia completo para configurar e atualizar o CMD corretamente.
              </p>
            </div>
            <ArrowRight size={18} className="text-yellow-600 shrink-0" />
          </Link>
        </section>

        {/* Precisa de ajuda */}
        <section className="flex items-center justify-between rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm p-6 mb-10">
          <div className="flex items-center gap-4">
            <span className="flex items-center justify-center w-11 h-11 shrink-0 rounded-full bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <HelpCircle size={22} />
            </span>
            <div>
              <p className="font-semibold dark:text-white">Precisa de ajuda?</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Entre em contato com o suporte de TI para mais informações.
              </p>
            </div>
          </div>
          <Link
            href={"https://helpdesk.naturafrig.com.br/"}
            className="flex items-center gap-2 whitespace-nowrap rounded-lg border border-green-600 text-green-700 dark:text-green-400 px-4 py-2 text-sm font-medium hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
          >
            <MessageCircleQuestion size={16} />
            Abrir chamado de suporte
            <ArrowRight size={16} />
          </Link>
        </section>
      </div>
    </Layout>
  );
}

interface CmdCardProps {
  href: string;
  icon: ReactNode;
  title: string;
  description: string;
}

function CmdCard({ href, icon, title, description }: CmdCardProps) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between gap-3 rounded-lg border border-gray-200 dark:border-neutral-800 p-4 hover:border-green-300 hover:shadow-sm transition-all"
    >
      <div className="flex items-center gap-3">
        <span className="flex items-center justify-center w-9 h-9 rounded-md bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
          {icon}
        </span>
        <div>
          <p className="font-medium dark:text-white leading-tight">{title}</p>
          <p className="text-gray-500 dark:text-gray-400 text-xs">
            {description}
          </p>
        </div>
      </div>
      <ArrowRight
        size={16}
        className="text-gray-300 group-hover:text-green-600 shrink-0 transition-colors"
      />
    </Link>
  );
}