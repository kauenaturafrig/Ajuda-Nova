// src/app/admin/authenticated/ramais/_components/UploadRamaisImport.tsx
"use client";

import { useState } from "react";
import { Button } from "../../../../../components/ui/button";
import { useToast } from "../../../../../components/ui/use-toast";

export default function UploadRamaisImport() {
  const [file, setFile] = useState<File | null>(null);
  const { showToast } = useToast();

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/admin/api/ramais/import", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      showToast({
        title: "Importação concluída",
        message: `${data.imported} ramais importados.`,
      });
    } else {
      const error = await res.json();
      showToast({
        title: "Erro ao importar",
        message: error.error,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="text-sm file:bg-gray-500 file:border-none file:rounded file:px-9 file:py-2 file:text-white cursor-pointer dark:text-white"
      />
      <Button onClick={handleUpload} disabled={!file} className="bg-purple-500 border-none text-white">
        Importar CSV
      </Button>
    </div>
  );
}
