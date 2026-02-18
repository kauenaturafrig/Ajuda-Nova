// src/app/admin/authenticated/jornais/_components/NewJornalForm.tsx

"use client";

import { useState, useCallback, useRef } from "react";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { X } from "lucide-react";

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

  // ✅ DRAG EVENTS - CORRIGIDO STALE CLOSURE
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

  // ✅ DRAG DROP CORRIGIDO - useCallback SEM formData dependency
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith("image/"));
    
    if (imageFile) {
      setFormData(prev => ({ ...prev, imagem: imageFile })); // ✅ Functional update
    }
  }, []);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setFormData(prev => ({ ...prev, imagem: file }));
    }
    // ✅ Limpa input sempre
    e.target.value = "";
  }, []);

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const removeImage = useCallback(() => {
    setFormData(prev => ({ ...prev, imagem: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ✅ DEBUG - Veja no console
    console.log("📤 SUBMIT - formData.imagem:", formData.imagem);
    if (!formData.titulo.trim() || !formData.url.trim() || !formData.imagem) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    setUploading(true);
    const fd = new FormData();
    fd.append("titulo", formData.titulo);
    fd.append("descricao", formData.descricao);
    fd.append("url", formData.url);
    
    // ✅ VERIFICA se imagem VÁLIDA antes append
    if (formData.imagem instanceof File) {
      fd.append("imagem", formData.imagem);
      console.log("✅ FormData com imagem:", formData.imagem.name, formData.imagem.size);
    } else {
      console.error("❌ Imagem inválida:", formData.imagem);
      alert("Selecione uma imagem válida!");
      setUploading(false);
      return;
    }

    try {
      const res = await fetch("/admin/api/jornais", { 
        method: "POST", 
        body: fd 
      });
      
      console.log("📡 Response status:", res.status);
      
      if (res.ok) {
        const data = await res.json();
        console.log("✅ Criado:", data);
        alert("✅ Jornal criado!");
        onSuccess();
      } else {
        const err = await res.json().catch(() => ({ error: "Erro desconhecido" }));
        console.error("❌ Backend error:", err);
        alert(`❌ Erro: ${err.error || res.statusText}`);
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      alert("❌ Erro de conexão");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Título */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-white">Título *</label>
        <Input
          value={formData.titulo}
          onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
          placeholder="Ex: Jornal Naturafrig - Edição Janeiro 2026"
          className="h-12 text-lg"
          required
        />
      </div>

      {/* URL */}
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-white">URL Externa *</label>
        <Input
          type="url"
          value={formData.url}
          onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
          placeholder="https://jornal.naturafrig.com.br/edicao-1"
          className="h-12"
          required
        />
      </div>

      {/* Descrição */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-white">Descrição</label>
        <textarea
          value={formData.descricao}
          onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
          placeholder="Breve descrição do conteúdo desta edição..."
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-green-500 resize-vertical"
        />
      </div>

      {/* IMAGEM - CONTAINER CORRIGIDO */}
      <div className="md:col-span-2">
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-white">Imagem capa *</label>
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
            dragActive
              ? "border-green-400 bg-green-50/80 shadow-lg"
              : "border-gray-300 hover:border-green-400 hover:bg-green-50/50"
          }`}
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog} // ✅ Click funciona
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" // ✅ z-10
          />
          
          {/* Conteúdo visual */}
          <div className="pointer-events-none z-0 flex flex-col items-center justify-center">
            <svg className="w-12 h-12 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <p className="text-sm font-medium text-gray-700 mb-1">
              {dragActive ? "✅ Solte a imagem aqui!" : "Clique ou arraste sua imagem"}
            </p>
            <p className="text-xs text-gray-500">PNG, JPG (máx. 5MB)</p>
          </div>

          {/* ✅ Preview com remover */}
          {formData.imagem && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-xl">
              <div className="flex items-center gap-3 bg-green-50 border-2 border-green-200 p-4 rounded-xl shadow-lg max-w-sm w-full mx-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-green-800 truncate pr-2">
                    {formData.imagem.name}
                  </p>
                  <p className="text-xs text-green-600">
                    {Math.round(formData.imagem.size / 1024)} KB
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeImage}
                  className="h-8 w-8 p-0 -mr-1 hover:bg-red-500 hover:text-white border border-red-300"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submit */}
      <div className="md:col-span-2 flex gap-4 pt-4">
        <Button
          type="submit"
          disabled={uploading || !formData.titulo.trim() || !formData.url.trim() || !formData.imagem}
          className="flex-1 bg-green-600 hover:bg-green-700 h-14 text-lg font-semibold shadow-lg"
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
            <p className="text-white">📤 Criar Jornal</p>
          )}
        </Button>
      </div>
    </form>
  );
}
