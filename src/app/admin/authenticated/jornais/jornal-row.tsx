// src/app/admin/authenticated/jornais/jornal-row.tsx

"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { X } from "lucide-react"; // npm i lucide-react

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
  jornal: Jornal;
  setGlobalLoading: (v: boolean) => void;
}

export function JornalRow({ jornal, setGlobalLoading }: Props) {
  const [editing, setEditing] = useState(false);
  const [titulo, setTitulo] = useState(jornal.titulo);
  const [descricao, setDescricao] = useState(jornal.descricao || "");
  const [url, setUrl] = useState(jornal.url);
  const [imagem, setImagem] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ DRAG & DROP HANDLERS (igual NewJornalForm)
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        setImagem(file);
      }
    }
  }, []);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImagem(file);
      e.target.value = ""; // Limpa input
    }
  }, []);

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const removeImage = useCallback(() => {
    setImagem(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const toggleEdit = () => {
    setEditing(!editing);
  };

  async function salvar() {
    setSaving(true);
    setGlobalLoading(true);

    const formData = new FormData();
    formData.append("id", jornal.id.toString());
    formData.append("titulo", titulo);
    formData.append("descricao", descricao);
    formData.append("url", url);
    if (imagem) formData.append("imagem", imagem);

    try {
      const res = await fetch("/admin/api/jornais", {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        alert("Jornal atualizado com sucesso!");
        setEditing(false);
        window.location.reload();
      } else {
        const err = await res.json();
        alert(`Erro: ${err.error}`);
      }
    } finally {
      setSaving(false);
      setGlobalLoading(false);
    }
  }

  async function deletar() {
    if (!window.confirm(`Tem certeza que deseja excluir "${jornal.titulo}"?`)) {
      return;
    }

    setDeleting(true);
    setGlobalLoading(true);

    try {
      const res = await fetch(`/admin/api/jornais/${jornal.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(`Erro ao excluir: ${err.error ?? res.status}`);
        return;
      }

      window.location.reload();
    } finally {
      setDeleting(false);
      setGlobalLoading(false);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 hover:shadow-xl transition-all duration-200">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Imagem e Info Principal */}
        <div className="space-y-4">
          <div className="relative w-full h-48 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
            <Image
              src={`/uploads/jornais/${jornal.imagem}`}
              alt={jornal.titulo}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            📅 {new Date(jornal.dataLancamento).toLocaleDateString('pt-BR')}
          </div>
        </div>

        {/* Formulário Inline */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Título
            </label>
            <Input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="h-12 text-lg dark:text-white"
              disabled={!editing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Descrição
            </label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={2}
              className="w-full p-3 border border-gray-300 dark:bg-gray-800 dark:border-gray-600 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
              disabled={!editing}
              placeholder="Descrição do jornal..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              URL Externa
            </label>
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="h-12  dark:text-white"
              disabled={!editing}
              placeholder="https://jornal.naturafrig.com.br/..."
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-2">
            {editing ? (
              <>
                <Button
                  onClick={salvar}
                  disabled={saving}
                  className="bg-green-500 hover:bg-green-600 flex-1 h-12"
                >
                  {saving ? "Salvando..." : "Salvar"}
                </Button>
                <Button
                  variant="outline"
                  onClick={toggleEdit}
                  className="h-12 px-6"
                  disabled={saving}
                >
                  Cancelar
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={toggleEdit}
                  className="bg-blue-500 hover:bg-blue-600 text-white flex-1 h-12"
                >
                  Editar
                </Button>
                <Button
                  onClick={deletar}
                  variant="destructive"
                  className="h-12 px-6 bg-red-500 hover:bg-red-600 text-white"
                  disabled={deleting}
                >
                  {deleting ? "Excluindo..." : "Excluir"}
                </Button>
              </>
            )}
          </div>

          {/* ✅ UPLOAD Drag & Drop (apenas editando) */}
          {editing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nova Imagem (opcional)
              </label>
              <div
                className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 pointer-events-none ${
                  dragActive
                    ? "border-blue-400 bg-blue-50 dark:bg-blue-900/30"
                    : "border-gray-300 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                }`}
                onDragEnter={handleDragIn}
                onDragLeave={handleDragOut}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 pointer-events-auto"
                />

                <div className="relative z-10 pointer-events-none flex flex-col items-center justify-center h-full">
                  <svg className="w-10 h-10 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    {dragActive ? "✅ Solte aqui!" : "Clique ou arraste nova imagem"}
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG (máx. 5MB)</p>
                </div>

                {/* ✅ PREVIEW + REMOVER */}
                {imagem && (
                  <div className="absolute inset-0 bg-white/95 dark:bg-black/95 flex flex-col items-center justify-center z-30 rounded-xl">
                    <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/50 p-4 rounded-lg border border-blue-200 dark:border-blue-800 w-full max-w-md">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-200 truncate">
                          {imagem.name}
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                          {Math.round(imagem.size / 1024)} KB
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={removeImage}
                        className="h-9 w-9 p-0 hover:bg-red-500 hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
