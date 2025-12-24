// pages/admin/ramais/index.tsx
"use client";

import Layout from "@/components/Layout";
import Link from "next/link";
import { useEffect, useState } from "react";

type Ramal = {
  id: number;
  numero: string;
  setor: string;
  responsavel: string | null;
  unidade: string;
};

export default function AdminRamaisIndex() {
  const [ramais, setRamais] = useState<Ramal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/ramais")
      .then(r => r.json())
      .then(data => {
        setRamais(data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">
          Administração de Ramais
        </h1>
        <div className="mb-4 flex gap-3">
          <button className="px-4 py-2 bg-green-600 text-white rounded">
            Exportar JSON
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded">
            Importar JSON
          </button>
        </div>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Número</th>
                <th className="border p-2">Setor</th>
                <th className="border p-2">Responsável</th>
                <th className="border p-2">Unidade</th>
                <th className="border p-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {ramais.map(r => (
                <tr key={r.id}>
                  <td className="border p-2">{r.numero}</td>
                  <td className="border p-2">{r.setor}</td>
                  <td className="border p-2">
                    {r.responsavel ?? "-"}
                  </td>
                  <td className="border p-2">{r.unidade}</td>
                  <td className="border p-2">
                    <Link
                      href={`/admin/ramais/${r.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}
