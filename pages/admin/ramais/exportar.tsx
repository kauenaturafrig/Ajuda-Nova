//pages/admin/ramais/exportar.tsx
"use client";

import Layout from "@/components/Layout";
import Link from "next/link";

export default function AdminRamaisIndex() {
  function exportar() {
    window.location.href =
      "/api/admin/ramais/export?unidade=Nova Andradina-MS";
  }

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Ramais</h1>
        <div className="flex gap-3 mb-6">
          <Link
            href="/admin/ramais/importar"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Importar JSON
          </Link>
          <button
            onClick={exportar}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Exportar JSON
          </button>
        </div>
        {/* aqui entra a listagem */}
      </div>
    </Layout>
  );
}
