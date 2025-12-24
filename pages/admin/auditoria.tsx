//pages/admin/auditoria.tsx
"use client";

import Layout from "@/components/Layout";
import { useEffect, useState, Fragment } from "react";
import { DiffViewer } from "@/components/DiffViewer";

type Auditoria = {
  id: number;
  username: string;
  acao: string;
  entidade: string;
  entidade_id: number;
  created_at: string;
  diff: any;
  rollback_permitido: boolean;
};

export default function AuditoriaPage() {
  const [dados, setDados] = useState<Auditoria[]>([]);
  const [acao, setAcao] = useState("");
  const [entidade, setEntidade] = useState("");

  const carregar = () => {
    const params = new URLSearchParams();
    if (acao) params.append("acao", acao);
    if (entidade) params.append("entidade", entidade);

    fetch(`/api/admin/auditoria?${params}`)
      .then(r => r.json())
      .then(setDados);
  };

  useEffect(carregar, [acao, entidade]);

  const rollback = async (id: number) => {
    if (!confirm("Deseja realmente reverter esta alteração?")) return;

    const res = await fetch(`/api/admin/auditoria/${id}/rollback`, {
      method: "POST",
    });

    if (!res.ok) {
      const data = await res.json();
      alert(data.error);
      return;
    }

    carregar();
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Auditoria</h1>

        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Usuário</th>
              <th className="border p-2">Ação</th>
              <th className="border p-2">Entidade</th>
              <th className="border p-2">ID</th>
              <th className="border p-2">Data</th>
              <th className="border p-2">Ações</th>
            </tr>
          </thead>

          <tbody>
            {dados.map(a => (
              <Fragment key={a.id}>
                {/* Linha principal */}
                <tr>
                  <td className="border p-2">{a.username}</td>
                  <td className="border p-2">{a.acao}</td>
                  <td className="border p-2">{a.entidade}</td>
                  <td className="border p-2">{a.entidade_id}</td>
                  <td className="border p-2">
                    {new Date(a.created_at).toLocaleString()}
                  </td>
                  <td className="border p-2">
                    {a.acao === "UPDATE" && (
                      <button
                        disabled={!a.rollback_permitido}
                        onClick={() => rollback(a.id)}
                        className={`px-3 py-1 rounded text-white ${a.rollback_permitido
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-gray-400 cursor-not-allowed"
                          }`}
                        title={
                          a.rollback_permitido
                            ? "Reverter alteração"
                            : "Rollback bloqueado: existe alteração posterior"
                        }
                      >
                        Rollback
                      </button>
                    )}
                  </td>
                </tr>

                {/* Linha do diff */}
                {a.diff && (
                  <tr>
                    <td colSpan={6} className="bg-gray-50">
                      <DiffViewer diff={a.diff} />
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
