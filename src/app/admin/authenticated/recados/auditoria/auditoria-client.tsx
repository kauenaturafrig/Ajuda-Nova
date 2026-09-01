//src/app/admin/authenticated/recados/auditoria/auditoria-client.tsx
"use client";

import Link from "next/link";
import Image from "next/image";

import { JsonViewer } from "@/src/components/JsonViewer";

type Audit = {
  id: number;
  recadoId: number;
  userId: string;
  userNome: string;
  acao: string;
  createdAt: string;
  dadosAntigos: unknown;
  dadosNovos: unknown;
};

type Props = {
  audits: Audit[];
};

function getActionClass(action: string) {
  if (action === "CREATE") {
    return "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200";
  }

  if (action === "UPDATE") {
    return "bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200";
  }

  return "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200";
}

function isValidJsonValue(
  value: unknown,
): value is Record<string, unknown> | unknown[] {
  return (
    value !== null &&
    typeof value === "object"
  );
}

export default function AuditoriaClient({
  audits,
}: Props) {
  return (
    <div className="container mx-auto py-8 px-4 w-full">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
        <Link
          href="/admin/authenticated"
          className="inline-flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
        >
          ← Voltar
        </Link>

        <div className="flex items-center gap-3">
          <Image
            src="/assets/images/icons/icons8-megaphone-preto.png"
            alt="Ícone de megafone"
            width={40}
            height={40}
            className="dark:invert w-auto h-10"
          />

          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
            Auditoria Recados
          </h1>
        </div>

        <span className="px-3 py-1.5 bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200 text-xs font-bold rounded-full">
          {audits.length} registro
          {audits.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-gray-700/50 shadow-2xl overflow-hidden">
        <div
          className="overflow-x-auto"
          style={{
            maxHeight: "calc(100vh - 300px)",
            overflowY: "auto",
          }}
        >
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gradient-to-r from-orange-500/20 to-red-500/20 dark:from-orange-500/30 dark:to-red-500/30 border-b border-orange-200 dark:border-orange-800/50 sticky top-0 z-10">
              <tr>
                <th className="p-4 text-left font-bold text-gray-900 dark:text-white text-xs uppercase tracking-wider whitespace-nowrap">
                  Data/Hora
                </th>

                <th className="p-4 text-left font-bold text-gray-900 dark:text-white text-xs uppercase tracking-wider whitespace-nowrap">
                  Usuário
                </th>

                <th className="p-4 text-left font-bold text-gray-900 dark:text-white text-xs uppercase tracking-wider whitespace-nowrap">
                  Recado ID
                </th>

                <th className="p-4 text-left font-bold text-gray-900 dark:text-white text-xs uppercase tracking-wider whitespace-nowrap">
                  Ação
                </th>

                <th className="p-4 text-left font-bold text-gray-900 dark:text-white text-xs uppercase tracking-wider whitespace-nowrap min-w-[200px]">
                  Antes
                </th>

                <th className="p-4 text-left font-bold text-gray-900 dark:text-white text-xs uppercase tracking-wider whitespace-nowrap min-w-[200px]">
                  Depois
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {audits.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-12 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    Nenhum registro de auditoria encontrado.
                  </td>
                </tr>
              ) : (
                audits.map((audit) => (
                  <tr
                    key={audit.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="p-4 font-mono text-xs text-gray-900 dark:text-gray-100 whitespace-nowrap">
                      {new Date(
                        audit.createdAt,
                      ).toLocaleString("pt-BR")}
                    </td>

                    <td className="p-4 font-medium text-xs text-gray-900 dark:text-gray-100 whitespace-nowrap">
                      {audit.userNome}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span className="font-mono bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200 px-2 py-0.5 rounded-full text-xs font-bold">
                        #{audit.recadoId}
                      </span>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${getActionClass(
                          audit.acao,
                        )}`}
                      >
                        {audit.acao}
                      </span>
                    </td>

                    <td className="p-4 align-top">
                      {isValidJsonValue(
                        audit.dadosAntigos,
                      ) ? (
                        <JsonViewer
                          data={audit.dadosAntigos}
                          color="gray"
                        />
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400 italic text-xs">
                          —
                        </span>
                      )}
                    </td>

                    <td className="p-4 align-top">
                      {isValidJsonValue(
                        audit.dadosNovos,
                      ) ? (
                        <JsonViewer
                          data={audit.dadosNovos}
                          color="emerald"
                        />
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400 italic text-xs">
                          —
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}