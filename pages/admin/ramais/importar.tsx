// pages/admin/ramais/importar.tsx
import { useState } from "react";
import DiffTable from "@/components/ramais/DiffTable";

/* ─────────── TIPOS ─────────── */

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

type PreviewResponse = {
  total: number;
  validos: number;
  invalidos: number;
  erros: any[];
  diff: DiffItem[];
};

type ApplyResult = {
  aplicados: {
    numero: string;
    campos: string[];
  }[];
  ignorados: {
    numero: string;
    motivo: string;
  }[];
  totalAplicados: number;
  totalIgnorados: number;
};

/* ─────────── COMPONENTE ─────────── */

export default function ImportarRamaisPage() {
  const [preview, setPreview] = useState<PreviewResponse | null>(null);
  const [resultado, setResultado] = useState<ApplyResult | null>(null);

  const [loading, setLoading] = useState(false);
  const [aplicando, setAplicando] = useState(false);

  const existeCampoAplicavel =
    preview?.diff.some(item =>
      Object.values(item.diff).some(c => c.bloqueado === false)
    ) ?? false;

  /* ─────────── PREVIEW ─────────── */

  async function handlePreview() {
    setLoading(true);
    setPreview(null);
    setResultado(null);

    const res = await fetch("/api/admin/ramais/import/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        meta: { unidade: { id: 1 } },
        ramais: [] // ← JSON real aqui
      })
    });

    const data = await res.json();
    setPreview(data);
    setLoading(false);
  }

  /* ─────────── APPLY ─────────── */

  async function handleApply() {
    if (!preview || !existeCampoAplicavel) return;

    setAplicando(true);

    const payload = {
      diffs: preview.diff
    };

    const res = await fetch("/api/admin/ramais/import/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    setResultado(data);
    setAplicando(false);
  }

  /* ─────────── UI ─────────── */

  return (
    <div className="p-6 max-w-5xl space-y-6">
      <h1 className="text-xl font-bold">
        Importação de Ramais
      </h1>

      {!preview && !resultado && (
        <button
          onClick={handlePreview}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {loading ? "Gerando preview..." : "Gerar preview"}
        </button>
      )}

      {preview && !resultado && (
        <>
          <div className="text-sm text-gray-700 space-y-1">
            <p>Total no arquivo: {preview.total}</p>
            <p>Válidos: {preview.validos}</p>
            <p>Inválidos: {preview.invalidos}</p>
          </div>

          <DiffTable items={preview.diff} />

          {!existeCampoAplicavel && (
            <div className="p-3 bg-yellow-100 text-yellow-800 text-sm rounded">
              Todas as alterações estão bloqueadas.
              Nenhuma modificação será aplicada.
            </div>
          )}

          <button
            onClick={handleApply}
            disabled={!existeCampoAplicavel || aplicando}
            className={`px-4 py-2 rounded text-white ${
              existeCampoAplicavel
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {aplicando ? "Aplicando..." : "Aplicar importação"}
          </button>
        </>
      )}

      {resultado && (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold">
            Resultado da Importação
          </h2>

          <div className="flex gap-6">
            <div className="p-4 border rounded bg-green-50">
              <p className="font-semibold text-green-800">
                Aplicados
              </p>
              <p className="text-3xl font-bold text-green-700">
                {resultado.totalAplicados}
              </p>
            </div>

            <div className="p-4 border rounded bg-yellow-50">
              <p className="font-semibold text-yellow-800">
                Ignorados
              </p>
              <p className="text-3xl font-bold text-yellow-700">
                {resultado.totalIgnorados}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
