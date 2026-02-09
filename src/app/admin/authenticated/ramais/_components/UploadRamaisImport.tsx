// src/app/admin/authenticated/ramais/_components/UploadRamaisImport.tsx
"use client";

import { useState, useRef, useCallback, DragEvent } from "react";
import { Button } from "../../../../../components/ui/button";
import { Input } from "../../../../../components/ui/input";
import { useToast } from "../../../../../components/ui/use-toast";
import { Upload, X, FileText, Loader2, CheckCircle } from "lucide-react";

interface Props {
  onImportSuccess?: () => Promise<void>;
}

export default function UploadRamaisImport({ onImportSuccess }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setFile(null);
    setIsUploading(false);
    setDragActive(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ✅ DRAG & DROP FUNCIONAL
  const handleDrag = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = Array.from(e.dataTransfer.files)[0];
    if (droppedFile?.name.toLowerCase().endsWith('.csv')) {
      setFile(droppedFile);
      showToast({
        title: "✅ Arquivo arrastado",
        message: droppedFile.name,
      });
    } else {
      showToast({
        title: "❌ Arquivo inválido",
        message: "Arraste apenas arquivos CSV (.csv)",
        variant: "destructive",
      });
    }
  }, [showToast]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile?.name.toLowerCase().endsWith('.csv')) {
      setFile(selectedFile);
      showToast({
        title: "✅ Arquivo selecionado",
        message: selectedFile.name,
      });
    } else {
      showToast({
        title: "❌ Arquivo inválido",
        message: "Selecione apenas arquivos CSV (.csv)",
        variant: "destructive",
      });
    }
  };

  const handleUpload = async () => {
    if (!file) {
      showToast({
        title: "❌ Nenhum arquivo",
        message: "Selecione um arquivo CSV primeiro",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    
    try {
      showToast({
        title: "⏳ Importando...",
        message: "Analisando e importando ramais...",
      });

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/admin/api/ramais/import", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        // ✅ Toast REALISTA com números do backend
        showToast({
          title: "✅ Importação concluída!",
          message: `Adicionados: ${data.imported} | Atualizados: ${data.updated || 0}`,
        });
        await onImportSuccess?.();
        setTimeout(() => setIsOpen(false), 2000);
      } else {
        const error = await res.json();
        showToast({
          title: "❌ Erro na importação",
          message: error.error || "Falha ao processar arquivo",
          variant: "destructive",
        });
      }
    } catch (error) {
      showToast({
        title: "❌ Erro de conexão",
        message: "Verifique sua conexão e tente novamente",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      resetForm();
    }
  };

  return (
    <>
      {/* Botão principal */}
      <Button 
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6"
      >
        <Upload className="w-4 h-4 mr-2" />
        Importar CSV
      </Button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">
            
            {/* Header */}
            <div className="p-6 pb-4 border-b border-gray-200 dark:border-gray-800 relative">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Upload className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Importar Ramais</h3>
                  <p className="text-sm text-gray-500">
                    Novos ramais serão adicionados. Existentes serão atualizados.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  resetForm();
                }}
                className="absolute top-6 right-6 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                disabled={isUploading}
              >
                <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            {/* Drop Zone - ✅ DRAG & DROP FUNCIONAL */}
            <div className="p-6">
              <div
                className={`
                  border-2 rounded-xl p-8 text-center transition-all duration-200 cursor-pointer min-h-[180px] flex flex-col items-center justify-center
                  ${dragActive 
                    ? 'border-purple-500 bg-purple-50/80 dark:bg-purple-950/50 shadow-lg scale-105' 
                    : 'border-dashed border-purple-300 hover:border-purple-400 bg-gradient-to-b from-purple-50/50 to-pink-50/50 dark:from-purple-950/30 dark:to-pink-950/30'
                  }
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <FileText className="w-14 h-14 text-purple-500 mb-4 opacity-80" />
                <div className="space-y-1">
                  <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                    {file ? `📄 ${file.name}` : dragActive ? "👆 Solte o arquivo!" : "Clique ou arraste CSV"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {file ? `${(file.size / 1024).toFixed(1)} KB` : "Apenas arquivos .csv"}
                  </p>
                </div>
                
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Preview */}
              {file && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-green-900 dark:text-green-100 truncate">{file.name}</p>
                        <p className="text-sm text-green-700 dark:text-green-300">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFile(null)}
                      className="h-9 w-9 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 ml-2"
                      disabled={isUploading}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 pt-0 border-t border-gray-200 dark:border-gray-800 bg-gradient-to-t from-white/70 to-transparent dark:from-gray-900/70">
              <div className="flex gap-3 justify-end pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsOpen(false);
                    resetForm();
                  }}
                  disabled={isUploading}
                  className="px-6 dark:text-white"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!file || isUploading}
                  className="px-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl disabled:opacity-50 min-h-[44px]"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      {file ? "Importar" : "Selecionar arquivo"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
