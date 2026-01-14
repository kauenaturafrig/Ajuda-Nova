// src/app/emails/_components/emails-list.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { useRouter } from "next/navigation";

type EmailView = {
    nome: string | null;
    setor: string;
    email: string;
};

type Props = {
    titulo: string;
    imagem: string;
    emails: EmailView[];
};

export function EmailsList({ titulo, imagem, emails }: Props) {
    const [busca, setBusca] = useState("");
    const router = useRouter();
    const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

    async function handleCopy(email: string) {
        try {
            if (navigator && "clipboard" in navigator) {
                await navigator.clipboard.writeText(email);
            } else {
                // fallback simples
                const textarea = document.createElement("textarea");
                textarea.value = email;
                textarea.style.position = "fixed";
                textarea.style.left = "-9999px";
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand("copy");
                document.body.removeChild(textarea);
            }

            setCopiedEmail(email);
            setTimeout(() => setCopiedEmail(null), 1500);
        } catch (err) {
            console.error("Erro ao copiar email", err);
        }
    }

    function normalize(str: string) {
        return str
            .toLowerCase()
            .normalize("NFD") // separa acentos
            .replace(/[\u0300-\u036f]/g, ""); // remove marcas de acento
    }

    const buscaNormalizada = normalize(busca);

    const filtrados = emails.filter((r) => {
        const setor = normalize(r.setor);
        const nome = r.nome ? normalize(r.nome) : "";
        const email = r.email;

        return (
            setor.includes(buscaNormalizada) ||
            nome.includes(buscaNormalizada) ||
            email.includes(busca)
        );
    });

    return (
        <div>
            <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg my-8 max-h-[1000px]">
                <h1 className="text-4xl font-extrabold text-blue-800 mb-6 border-b-4 border-blue-200 pb-2">
                    {titulo}
                </h1>

                <input
                    type="text"
                    placeholder="Buscar por setor ou email..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="w-full p-3 mb-6 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                />

                <div className="flex gap-6">
                    <div className="w-1/2 max-h-[600px] overflow-y-auto">
                        <ul className="divide-y divide-gray-200 pr-4">
                            {filtrados.length > 0 ? (
                                filtrados.map((r, idx) => (
                                    <li
                                        key={idx}
                                        className="py-3 flex justify-between min-w-96 space-x-20"
                                    >
                                        <div>
                                            <p className="font-semibold text-lg text-gray-800">
                                                {r.setor}
                                                {r.nome && <> - {r.nome}</>}
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleCopy(r.email)}
                                            className="relative group text-xl font-bold text-blue-700"
                                        >
                                            {r.email}

                                            <span
                                                className={`
                                                    absolute -bottom-7 right-0 z-50
                                                    rounded bg-gray-800 px-2 py-1 text-xs text-white
                                                    opacity-0 scale-95 -translate-y-1
                                                    group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0
                                                    transition-all
                                                `}
                                            >
                                                {copiedEmail === r.email ? "Copiado!" : "Copiar"}
                                            </span>
                                        </button>

                                    </li>

                                ))
                            ) : (
                                <p className="text-gray-500">Nenhum email encontrado.</p>
                            )}
                        </ul>
                    </div>

                    <div className="w-1/2 flex items-center">
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
        </div>
    );
}
