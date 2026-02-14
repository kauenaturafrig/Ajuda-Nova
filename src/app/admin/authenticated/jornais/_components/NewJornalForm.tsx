// src/app/admin/authenticated/jornais/_components/NewJornalForm.tsx

"use client";

import { useState, useCallback, useRef } from "react";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { X } from "lucide-react"; // Ícone X para remover

export function NewJornalForm({ onSuccess }: { onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    imagem: null as File | null,
    url: "",
  });
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ✅ DRAG EVENTS
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
        setFormData({ ...formData, imagem: file });
      }
    }
  }, [formData]);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setFormData(prev => ({ ...prev, imagem: file }));
      e.target.value = ""; // ✅ Limpa input
    }
  }, []);

  // ✅ SEM DOUBLE-CLICK: pointer-events none no container + click só no input
  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // ✅ BOTÃO REMOVER IMAGEM
  const removeImage = useCallback(() => {
    setFormData(prev => ({ ...prev, imagem: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titulo || !formData.url || !formData.imagem) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    setUploading(true);
    const fd = new FormData();
    fd.append("titulo", formData.titulo);
    fd.append("descricao", formData.descricao);
    fd.append("url", formData.url);
    fd.append("imagem", formData.imagem);

    try {
      const res = await fetch("/admin/api/jornais", { method: "POST", body: fd });
      if (res.ok) {
        alert("✅ Jornal criado!");
        onSuccess();
      } else {
        const err = await res.json();
        alert(`❌ Erro: ${err.error}`);
      }
    } catch (error) {
      alert("❌ Erro de conexão");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Campos iguais... */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">Título *</label>
        <Input
          value={formData.titulo}
          onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
          placeholder="Ex: Jornal Naturafrig - Edição Janeiro 2026"
          className="h-12 text-lg"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">URL Externa *</label>
        <Input
          type="url"
          value={formData.url}
          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
          placeholder="https://jornal.naturafrig.com.br/edicao-1"
          className="h-12"
          required
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium mb-2 text-gray-700">Descrição</label>
        <textarea
          value={formData.descricao}
          onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
          placeholder="Breve descrição do conteúdo desta edição..."
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-green-500 resize-vertical"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium mb-2 text-gray-700">Imagem capa *</label>
        
        {/* ✅ CONTAINER SEM DOUBLE-CLICK */}
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer pointer-events-none ${
            dragActive
              ? "border-green-400 bg-green-50 dark:bg-green-900/30"
              : "border-gray-300 hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/20"
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
            required
          />
          
          <div className="relative z-10 pointer-events-none">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            
            <p className="text-sm font-medium text-gray-700 mb-2">
              {dragActive ? "✅ Solte a imagem aqui!" : "Clique ou arraste sua imagem aqui"}
            </p>
            <p className="text-xs text-gray-500">PNG, JPG até 5MB</p>
          </div>
          
          {/* ✅ PREVIEW + REMOVER */}
          {formData.imagem && (
            <div className="absolute inset-0 bg-white/90 dark:bg-black/90 flex flex-col items-center justify-center z-30 rounded-xl">
              <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/50 p-4 rounded-lg border border-green-200 dark:border-green-800 w-full max-w-sm">
                <div className="flex-1">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200 truncate">
                    {formData.imagem.name}
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    {Math.round(formData.imagem.size / 1024)} KB
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeImage}
                  className="h-8 w-8 p-0 hover:bg-red-500 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="md:col-span-2 flex gap-4 pt-4">
        <Button
          type="submit"
          disabled={uploading || !formData.titulo || !formData.url || !formData.imagem}
          className="flex-1 bg-green-600 hover:bg-green-700 h-14 text-lg font-semibold"
        >
          {uploading ? (
            <>
              <svg className="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Criando...
            </>
          ) : (
            "📤 Criar Jornal"
          )}
        </Button>
      </div>
    </form>
  );
}
