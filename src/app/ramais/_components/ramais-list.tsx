// src/app/ramais/_components/ramais-list.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

type RamalView = {
    nome: string | null;
    setor: string;
    ramal: string;
};

type Props = {
    titulo: string;
    imagem: string;
    ramais: RamalView[];
};

export function RamaisList({ titulo, imagem, ramais }: Props) {
    const [busca, setBusca] = useState("");

    function normalize(str: string) {
        return str
            .toLowerCase()
            .normalize("NFD") // separa acentos
            .replace(/[\u0300-\u036f]/g, ""); // remove marcas de acento
    }

    const buscaNormalizada = normalize(busca);

    const filtrados = ramais.filter((r) => {
        const setor = normalize(r.setor);
        const nome = r.nome ? normalize(r.nome) : "";
        const ramal = r.ramal; // número não precisa normalizar

        return (
            setor.includes(buscaNormalizada) ||
            nome.includes(buscaNormalizada) ||
            ramal.includes(busca)
        );
    });
    
    return (
        <>
            <Link href="/ramais">
                <span className="text-blue-600 dark:text-blue-400 hover:underline font-semibold text-3xl ml-5">
                    ← Voltar
                </span>
            </Link>

            <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg my-8 max-h-[1000px]">
                <h1 className="text-4xl font-extrabold text-blue-800 mb-6 border-b-4 border-blue-200 pb-2">
                    {titulo}
                </h1>

                <input
                    type="text"
                    placeholder="Buscar por setor ou ramal..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="w-full p-3 mb-6 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                />

                <div className="flex items-start gap-6">
                    <div className="max-h-[600px] max-w-lg overflow-y-auto flex-1">
                        <ul className="divide-y divide-gray-200 pr-4">
                            {filtrados.length > 0 ? (
                                filtrados.map((r, idx) => (
                                    <li key={idx} className="py-3 flex justify-between min-w-96">
                                        <div>
                                            <p className="font-semibold text-lg text-gray-800">
                                                {r.setor}
                                                {r.nome ? ` - ${r.nome}` : ""}
                                            </p>
                                        </div>
                                        <span className="text-xl font-bold text-blue-700">
                                            {r.ramal}
                                        </span>
                                    </li>
                                ))
                            ) : (
                                <p className="text-gray-500">Nenhum ramal encontrado.</p>
                            )}
                        </ul>
                    </div>

                    <div className="flex-1">
                        <Image
                            src={imagem}
                            alt={titulo}
                            width={0}
                            height={0}
                            sizes="100vw"
                            className="w-full h-auto rounded-lg"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
