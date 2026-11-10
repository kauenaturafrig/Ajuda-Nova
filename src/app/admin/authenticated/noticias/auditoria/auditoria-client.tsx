"use client";

import { Button } from "@/src/components/ui/button";
import {
  ArrowLeft,
  CalendarClock,
  FileClock,
  Newspaper,
  UserRound,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { JsonViewer } from "@/src/components/JsonViewer";

type Audit = {
  id: number;
  noticiaId: number;
  userId: string;
  userNome: string;
  acao: string;
  createdAt: string;
  dadosAntigos: unknown;
  dadosNovos: unknown;
};

type Props = {
  audits: Audit[];
  total: number;
};

function actionClassName(action: string) {
  if (action === "CREATE") {
    return "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200";
  }

  if (action === "UPDATE") {
    return "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200";
  }

  return "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200";
}

function actionLabel(action: string) {
  if (action === "CREATE") return "Criação";
  if (action === "UPDATE") return "Edição";
  if (action === "DELETE") return "Exclusão";
  return action;
}

function isValidJsonValue(
  value: unknown,
): value is Record<string, unknown> | unknown[] {
  return value !== null && typeof value === "object";
}

export default function AuditoriaNoticiasClient({
  audits,
  total,
}: Props) {
  const router = useRouter();

  return (
    <main className="mx-auto w-full max-w-7xl space-y-7 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <header className="flex flex-col gap-5 rounded-2xl border border-gray-100 bg-white/80 p-5 shadow-sm dark:border-neutral-800 dark:bg-[#111a2d]/80 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-10 w-10 shrink-0 rounded-xl border border-gray-100 bg-white text-gray-500 shadow-sm hover:text-gray-900 dark:border-neutral-800 dark:bg-neutral-900/40 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-sm dark:bg-blue-900/30 dark:text-blue-400 sm:h-14 sm:w-14">
            <Newspaper size={26} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
              Auditoria de Notícias
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Histórico de alterações e responsáveis pelas publicações.
            </p>
          </div>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2 dark:border-blue-900/40 dark:bg-blue-950/30">
          <FileClock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
            {total} {total === 1 ? "registro" : "registros"}
          </span>
        </div>
      </header>

      {audits.length === 0 ? (
        <section className="rounded-2xl border border-gray-100 bg-white px-6 py-20 text-center shadow-sm dark:border-neutral-800 dark:bg-[#111a2d]">
          <FileClock className="mx-auto mb-3 h-10 w-10 text-gray-300 dark:text-neutral-700" />
          <h2 className="text-base font-bold text-gray-800 dark:text-gray-200">
            Nenhum registro de auditoria encontrado
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            As alterações nas notícias aparecerão aqui.
          </p>
        </section>
      ) : (
        <section aria-label="Registros de auditoria" className="space-y-4">
          {audits.map((audit) => (
            <article
              key={audit.id}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-[#111a2d] sm:p-6"
            >
              <div className="flex flex-col gap-4 border-b border-gray-100 pb-4 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-lg px-3 py-1.5 text-xs font-bold ${actionClassName(audit.acao)}`}>
                    {actionLabel(audit.acao)}
                  </span>
                  <span className="rounded-lg bg-blue-50 px-3 py-1.5 font-mono text-xs font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
                    Notícia #{audit.noticiaId}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="inline-flex items-center gap-2">
                    <UserRound className="h-4 w-4 text-gray-400" />
                    <span className="font-medium text-gray-700 dark:text-gray-200">{audit.userNome}</span>
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-gray-400" />
                    {new Date(audit.createdAt).toLocaleString("pt-BR")}
                  </span>
                </div>
              </div>

              <div className="grid gap-4 pt-5 md:grid-cols-2">
                <div className="min-w-0 rounded-xl border border-gray-100 bg-gray-50/70 p-4 dark:border-neutral-800 dark:bg-neutral-900/40">
                  <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Antes</h2>
                  {isValidJsonValue(audit.dadosAntigos) ? (
                    <JsonViewer data={audit.dadosAntigos} color="gray" />
                  ) : (
                    <p className="text-sm italic text-gray-400 dark:text-gray-500">Sem dados anteriores</p>
                  )}
                </div>
                <div className="min-w-0 rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/10">
                  <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Depois</h2>
                  {isValidJsonValue(audit.dadosNovos) ? (
                    <JsonViewer data={audit.dadosNovos} color="emerald" />
                  ) : (
                    <p className="text-sm italic text-gray-400 dark:text-gray-500">Sem dados novos</p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}