//pages/ramais/[unidade].tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
import Link from "next/link";
import Image from "next/image";

/**
 * Tipagem do Ramal
 */
type Ramal = {
    id: number;
    numero: string;
    setor: string;
    responsavel: string | null;
};

/**
 * Configuração CENTRAL das unidades
 * → aqui você controla nome, imagem, slug
 * → evita duplicação e bug
 */
const UNIDADES: Record<
    string,
    {
        nome: string;
        imagem: string;
    }
> = {
    "nova-andradina": {
        nome: "Nova Andradina-MS",
        imagem: "/assets/images/ramais/nova.png",
    },
    "pirapozinho": {
        nome: "Pirapozinho-SP",
        imagem: "/assets/images/ramais/pirapozinho.png",
    },
    "rochedo": {
        nome: "Rochedo-MS",
        imagem: "/assets/images/ramais/rochedo.png",
    },
    "barra-dos-bugres": {
        nome: "Barra dos Bugres-MT",
        imagem: "/assets/images/ramais/barra-dos-bugres.png",
    },
    // adicione as próximas aqui
};

export default function RamaisPorUnidade() {
    const router = useRouter();
    const { unidade } = router.query;

    const [ramais, setRamais] = useState<Ramal[]>([]);
    const [loading, setLoading] = useState(true);
    const [busca, setBusca] = useState("");

    /**
     * Resolve config da unidade atual
     */
    const unidadeConfig = useMemo(() => {
        if (!unidade || typeof unidade !== "string") return null;
        return UNIDADES[unidade];
    }, [unidade]);

    /**
     * Busca ramais
     */
    useEffect(() => {
        if (!unidadeConfig) return;

        const timeout = setTimeout(() => {
            setLoading(true);

            const params = new URLSearchParams({
                unidade: unidadeConfig.nome,
            });

            if (busca.trim()) {
                params.append("busca", busca);
            }

            fetch(`/api/ramais?${params.toString()}`)
                .then((res) => res.json())
                .then((json) => {
                    if (!json.success) throw new Error(json.error);
                    setRamais(json.data);
                })
                .catch((err) => {
                    console.error(err);
                    setRamais([]);
                })
                .finally(() => setLoading(false));
        }, 400);

        return () => clearTimeout(timeout);
    }, [busca, unidadeConfig]);

    /**
     * Unidade inválida → 404 lógico
     */
    if (!unidadeConfig) {
        return (
            <Layout>
                <div className="p-10 text-center">
                    <h1 className="text-3xl font-bold text-red-600">
                        Unidade não encontrada
                    </h1>
                    <Link href="/ramais" className="text-blue-600 underline mt-4 block">
                        Voltar
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <Link href="/ramais">
                <span className="text-blue-600 hover:underline font-semibold text-3xl ml-5">
                    ← Voltar
                </span>
            </Link>

            <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg my-8 max-h-[1000px]">
                <h1 className="text-4xl font-extrabold text-blue-800 mb-6 border-b-4 border-blue-200 pb-2">
                    {unidadeConfig.nome}
                </h1>

                {/* Busca */}
                <input
                    type="text"
                    placeholder="Buscar por nome, setor ou ramal..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="w-full p-3 mb-6 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                />

                <div className="flex items-start gap-6">
                    {/* Lista */}
                    <div className="max-h-[600px] max-w-lg overflow-y-auto flex-1">
                        <ul className="divide-y divide-gray-200 pr-4">
                            {loading ? (
                                <p className="text-gray-500">Buscando...</p>
                            ) : ramais.length > 0 ? (
                                ramais.map((r) => (
                                    <li
                                        key={r.id}
                                        className="py-3 flex justify-between min-w-96"
                                    >
                                        <div>
                                            <p className="font-semibold text-lg text-gray-800">
                                                {r.setor}
                                                {r.responsavel && ` - ${r.responsavel}`}
                                            </p>
                                        </div>
                                        <span className="text-xl font-bold text-blue-700">
                                            {r.numero}
                                        </span>
                                    </li>
                                ))
                            ) : (
                                <p className="text-gray-500">
                                    Nenhum ramal encontrado.
                                </p>
                            )}
                        </ul>
                    </div>

                    {/* Imagem */}
                    <div className="flex-1">
                        <Image
                            src={unidadeConfig.imagem}
                            alt={`Ramais ${unidadeConfig.nome}`}
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
