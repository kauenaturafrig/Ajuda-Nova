"use client";

import Layout from "@/components/Layout";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from 'next/image'

type Ramal = {
  id: number;
  numero: string;
  setor: string;
  responsavel: string | null;
};

export default function RamaisRochedo() {
  const [ramais, setRamais] = useState<Ramal[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");

  useEffect(() => {
  const timeout = setTimeout(() => {
    setLoading(true);

    const params = new URLSearchParams({
      unidade: "Rochedo-MS",
    });

    if (busca.trim()) {
      params.append("busca", busca);
    }

    fetch(`/api/ramais?${params.toString()}`)
      .then(res => res.json())
      .then(json => {
        if (!json.success) throw new Error(json.error);
        setRamais(json.data);
      })
      .catch(err => {
        console.error(err);
        setRamais([]);
      })
      .finally(() => setLoading(false));
  }, 400); // ← tempo humano de digitação

  return () => clearTimeout(timeout);
  }, [busca]);

  return (
    <Layout>
      <Link href="/ramais">
        <span className="text-blue-600 dark:text-blue-400 hover:underline font-semibold text-3xl ml-5">
          ← Voltar
        </span>
      </Link>

      <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg my-8">
        <h1 className="text-4xl font-extrabold text-blue-800 mb-6 border-b-4 border-blue-200 pb-2">
          Rochedo - MS
        </h1>

        {/* Campo de busca */}
        <input
          type="text"
          placeholder="Buscar por nome, setor ou ramal..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="w-full p-3 mb-6 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex items-start gap-6">
          {/* Lista de ramais com scroll */}
          <div className="max-h-[1000px] max-w-lg overflow-y-auto flex-1">
            <ul className="divide-y divide-gray-200 pr-4">
              {loading ? (
                <p className="text-gray-500">Buscando...</p>
              ) : ramais.length > 0 ? (
                ramais.map((r, idx) => (
                  <li
                    key={idx}
                    className="py-3 flex justify-between min-w-96"
                  >
                    <div>
                      <p className="font-semibold text-lg text-gray-800">
                        {r.setor} {r.responsavel && ` - ${r.responsavel}`}
                      </p>
                    </div>
                    <span className="text-xl font-bold text-blue-700">
                      {r.numero}
                    </span>
                  </li>
                ))
              ) : (
                <p className="text-gray-500">Nenhum ramal encontrado.</p>
              )}
            </ul>
          </div>

          {/* Imagem responsiva */}
          <div className="flex-1">
            <Image
              src={'/assets/images/ramais/rochedo.png'}
              alt="Ramais Rochedo"
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
