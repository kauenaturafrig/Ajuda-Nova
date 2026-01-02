// pages/admin/ramais/importacoes.tsx
import { useEffect, useState } from "react";

type Importacao = {
  import_id: string;
  data: string;
  usuario: string;
  total_alteracoes: number;
};

export default function HistoricoImportacoesPage() {
  const [items, setItems] = useState<Importacao[]>([]);

  useEffect(() => {
    fetch("/api/admin/ramais/import/history")
      .then(res => res.json())
      .then(setItems);
  }, []);

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-xl font-bold mb-6">
        Histórico de Importações
      </h1>

      <ul className="space-y-3">
        {items.map(item => (
          <li
            key={item.import_id}
            className="border rounded p-4 hover:bg-gray-50 cursor-pointer"
            onClick={() =>
              window.location.href =
                `/admin/ramais/importacoes/${item.import_id}`
            }
          >
            <div className="font-semibold">
              {item.usuario}
            </div>

            <div className="text-sm text-gray-600">
              {new Date(item.data).toLocaleString()}
            </div>

            <div className="text-sm mt-1">
              {item.total_alteracoes} alterações
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
