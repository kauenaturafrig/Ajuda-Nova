// pages/admin/ramais/importar.tsx
import { useState } from "react";
import DiffTable from "@/components/ramais/DiffTable";

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

export default function ImportarRamaisPage() {
  const [preview, setPreview] = useState<PreviewResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [aplicando, setAplicando] = useState(false);

  const existeCampoAplicavel =
    preview?.diff.some(item =>
      Object.values(item.diff).some(campo => campo.bloqueado === false)
    ) ?? false;

  async function handlePreview() {
    setLoading(true);
    setPreview(null);

    const res = await fetch("/api/admin/ramais/import/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        meta: { unidade: { id: 1 } },
        ramais: [] // ← aqui entra seu JSON real
      })
    });

    const data = await res.json();
    setPreview(data);
    setLoading(false);
  }

  async function handleApply() {
    if (!preview || !existeCampoAplicavel) return;

    setAplicando(true);

    await fetch("/api/admin/ramais/import/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(preview)
    });

    setAplicando(false);
    alert("Importação aplicada");
  }

  return (
    <div className="p-6 max-w-5xl">
      <h1 className="text-xl font-bold mb-4">
        Importação de Ramais
      </h1>

      <button
        onClick={handlePreview}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? "Gerando preview..." : "Gerar preview"}
      </button>

      {preview && (
        <>
          <div className="mt-6 text-sm text-gray-700 space-y-1">
            <p>Total no arquivo: {preview.total}</p>
            <p>Válidos: {preview.validos}</p>
            <p>Inválidos: {preview.invalidos}</p>
          </div>

          <DiffTable items={preview.diff} />

          {!existeCampoAplicavel && (
            <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 text-sm rounded">
              Todas as alterações estão bloqueadas.  
              Nenhuma modificação será aplicada.
            </div>
          )}

          <button
            onClick={handleApply}
            disabled={!existeCampoAplicavel || aplicando}
            className={`mt-6 px-4 py-2 rounded text-white ${
              existeCampoAplicavel
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {aplicando ? "Aplicando..." : "Aplicar importação"}
          </button>
        </>
      )}
    </div>
  );
}
