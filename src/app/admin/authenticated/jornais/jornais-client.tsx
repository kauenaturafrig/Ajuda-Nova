// src/app/admin/authenticated/jornais/jornais-client.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../../../../components/ui/button";
import { LoadingOverlay } from "../../../../components/ui/loading-overlay";
import { JornalRow } from "./jornal-row";
import { NewJornalForm } from "./_components/NewJornalForm";

interface Jornal {
  id: number;
  titulo: string;
  descricao: string | null;
  imagem: string;
  url: string;
  dataLancamento: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface Props {
  jornais: Jornal[];
}

export function JornaisClient({ jornais }: Props) {
  const [loading, setLoading] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);
  const router = useRouter();

  return (
    <div className="container mx-auto min-h-screen py-10 space-y-6 w-[90%]">
      <LoadingOverlay show={loading} text="Processando..." />

      <Button
        type="button"
        variant="outline"
        onClick={() => router.back()}
        className="bg-gray-500 text-white mb-5"
      >
        ← Voltar
      </Button>

      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center mt-3 mb-7">
            <h1 className="font-bold text-5xl dark:text-white pr-4">
              Conexão Naturafrig
            </h1>
            <Image
              src={"/assets/images/icons/icons8-news-preto.png"}
              alt="Logo Jornais"
              width={50}
              height={50}
              className="mr-5 dark:invert"
            />
          </div>
          <p className="text-sm text-muted-foreground dark:text-white">
            Gerencie jornais, imagens e links externos.
          </p>
        </div>
        {/* ✅ BOTÃO NOVO JORNAL */}
        <Button
          onClick={() => setShowNewForm(!showNewForm)}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          <span className="mr-2">+</span>
          {showNewForm ? "Cancelar" : "Novo Jornal"}
        </Button>
      </div>

      {/* ✅ FORMULÁRIO NOVO JORNAL */}
      {showNewForm && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 p-8 rounded-2xl border-2 border-green-200 dark:border-green-800">
          <h2 className="text-2xl font-bold mb-6 text-green-800 dark:text-green-200">
            📄 Novo Jornal
          </h2>
          <NewJornalForm onSuccess={() => {
            setShowNewForm(false);
            window.location.reload();
          }} />
        </div>
      )}

      <div className="space-y-4">
        {jornais.map((jornal) => (
          <JornalRow
            key={jornal.id}
            jornal={jornal}
            setGlobalLoading={setLoading}
          />
        ))}

        {jornais.length === 0 && !showNewForm && (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-xl dark:border-gray-600">
            <div className="w-20 h-20 bg-gray-200 dark:bg-gray-800 rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">📰</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-500 dark:text-gray-400 mb-2">
              Nenhum jornal cadastrado
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Clique em "Novo Jornal" para adicionar o primeiro!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
