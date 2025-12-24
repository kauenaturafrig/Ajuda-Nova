//pages/admin/ramais/importar.tsx
"use client";

import Layout from "@/components/Layout";
import { useState } from "react";

/* ─────────── TIPOS ─────────── */

type ImportState =
  | "idle"
  | "validating"
  | "preview"
  | "importing"
  | "done";

type DiffCampo = {
  antes: string | null;
  depois: string | null;
};

type PreviewItem =
  | {
      tipo: "NOVO";
      numero: string;
      depois: {
        setor: string;
        responsavel: string | null;
      };
    }
  | {
      tipo: "ALTERADO";
      numero: string;
      diff: Record<string, DiffCampo>;
    }
  | {
      tipo: "ERRO";
      numero?: string;
      erro: string;
    };

/* ─────────── COMPONENTE ─────────── */

export default function ImportarRamaisPage() {
  const [state, setState] = useState<ImportState>("idle");
  const [preview, setPreview] = useState<PreviewItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  async function handleFile(file: File) {
    setState("validating");
    setError(null);
    setPreview([]);
    setFileName(file.name);

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      const res = await fetch("/api/admin/ramais/import/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          unidade: "Nova Andradina-MS",
          ramais: parsed,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao gerar preview");
      }

      setPreview(data.preview);
      setState("preview");
    } catch (err: any) {
      setError(err.message || "Arquivo JSON inválido");
      setState("idle");
    }
  }

  async function aplicarImportacao() {
    if (!confirm("Deseja aplicar a importação?")) return;

    setState("importing");

    const res = await fetch("/api/admin/ramais/import/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        unidade: "Nova Andradina-MS",
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Erro ao aplicar importação");
      setState("preview");
      return;
    }

    setState("done");
    alert("Importação concluída com sucesso");
  }

  return (
    <Layout>
      <div className="p-6 max-w-4xl">
        <h1 className="text-xl font-bold mb-4">
          Importar Ramais (JSON)
        </h1>

        {/* Upload */}
        <input
          type="file"
          accept="application/json"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />

        {fileName && (
          <p className="mt-2 text-sm text-gray-600">
            Arquivo: {fileName}
          </p>
        )}

        {/* Estado */}
        {state === "validating" && (
          <p className="mt-4 text-blue-600">
            Validando arquivo…
          </p>
        )}

        {error && (
          <p className="mt-4 text-red-600 font-semibold">
            {error}
          </p>
        )}

        {/* Preview */}
        {state === "preview" && preview.length > 0 && (
          <>
            <h2 className="mt-6 font-semibold text-lg">
              Preview da Importação
            </h2>

            <ul className="mt-4 space-y-3">
              {preview.map((item, i) => (
                <li
                  key={i}
                  className="border p-3 rounded bg-gray-50"
                >
                  {item.tipo === "NOVO" && (
                    <>
                      <strong>{item.numero}</strong> — NOVO
                      <pre className="mt-2 text-sm bg-white p-2 border">
                        {JSON.stringify(item.depois, null, 2)}
                      </pre>
                    </>
                  )}

                  {item.tipo === "ALTERADO" && (
                    <>
                      <strong>{item.numero}</strong> — ALTERADO
                      <pre className="mt-2 text-sm bg-white p-2 border">
                        {JSON.stringify(item.diff, null, 2)}
                      </pre>
                    </>
                  )}

                  {item.tipo === "ERRO" && (
                    <span className="text-red-600">
                      ERRO: {item.erro}
                    </span>
                  )}
                </li>
              ))}
            </ul>

            <button
              onClick={aplicarImportacao}
              className="mt-6 px-4 py-2 bg-green-600 text-white rounded"
            >
              Aplicar Importação
            </button>
          </>
        )}

        {state === "done" && (
          <p className="mt-6 text-green-700 font-semibold">
            Importação finalizada.
          </p>
        )}
      </div>
    </Layout>
  );
}
