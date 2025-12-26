// components/ramais/DiffTable.tsx
// components/DiffTable.tsx
import React from "react";

type DiffCampo = {
  antes: string | null;
  depois: string | null;
  bloqueado: boolean;
};

type DiffItem = {
  tipo: "ALTERADO";
  numero: string;
  diff: Record<string, DiffCampo>;
};

type Props = {
  items: DiffItem[];
};

export default function DiffTable({ items }: Props) {
  if (!items.length) {
    return (
      <p className="text-sm text-gray-500 mt-4">
        Nenhuma alteração detectada.
      </p>
    );
  }

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="p-2 text-left">Ramal</th>
            <th className="p-2 text-left">Campo</th>
            <th className="p-2 text-left">Antes</th>
            <th className="p-2 text-left">Depois</th>
            <th className="p-2 text-center">Status</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) =>
            Object.entries(item.diff).map(
              ([campo, dados], idx) => {
                const bloqueado = dados.bloqueado;

                return (
                  <tr
                    key={`${item.numero}-${campo}`}
                    className={`border-b ${
                      bloqueado
                        ? "bg-gray-100 text-gray-500"
                        : "bg-green-50"
                    }`}
                  >
                    {/* Ramal */}
                    <td className="p-2 font-mono font-semibold">
                      {item.numero}
                    </td>

                    {/* Campo */}
                    <td className="p-2 capitalize">
                      {campo}
                    </td>

                    {/* Antes */}
                    <td className="p-2 font-mono">
                      {dados.antes ?? "—"}
                    </td>

                    {/* Depois */}
                    <td className="p-2 font-mono">
                      {dados.depois ?? "—"}
                    </td>

                    {/* Status */}
                    <td className="p-2 text-center">
                      {bloqueado ? (
                        <span className="inline-flex items-center gap-1 text-gray-600">
                          🔒 Bloqueado
                        </span>
                      ) : (
                        <span className="text-green-700 font-semibold">
                          Aplicável
                        </span>
                      )}
                    </td>
                  </tr>
                );
              }
            )
          )}
        </tbody>
      </table>

      {/* Legenda */}
      <div className="mt-3 text-xs text-gray-600 flex gap-6">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-green-200 inline-block" /> Alteração será aplicada
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-gray-300 inline-block" /> Campo bloqueado
        </span>
      </div>
    </div>
  );
}
