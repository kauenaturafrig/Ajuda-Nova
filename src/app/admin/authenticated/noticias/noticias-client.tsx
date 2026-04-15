// src/app/admin/authenticated/noticias/noticias-client.tsx
"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "../../../../components/ui/button";
import { X, Maximize2 } from "lucide-react";
import { LoadingOverlay } from "@/src/components/ui/loading-overlay";
import Layout from "@/src/components/Layout";

export type UserRole = "OWNER" | "ADMIN" | "NEWSONLY" | "MESSAGENEWS";

interface Noticia {
  id: number;
  titulo: string;
  conteudo: string;
  imagem: string | null | undefined; // ✅ Aceita null do Prisma
  createdAt: Date;
  updatedAt?: Date; // ✅ Opcional
}

interface Props {
  initialNoticias: Noticia[];
  userRole: UserRole;
  userUnidadeId: number | null;
}

export default function NoticiasClient({ initialNoticias, userRole, userUnidadeId }: Props) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [noticias, setNoticias] = useState<Noticia[]>(initialNoticias);
  const [dragActive, setDragActive] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    titulo: "",
    conteudo: "",
    imagem: null as File | null,
    imagemPreview: "",
    imagemAntiga: ""
  });

  const [imagemNoticia, setImagemNoticia] = useState<File | null>(null);
  const router = useRouter();

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleEdit = (noticia: Noticia) => {
    setEditingId(noticia.id);
    setFormData({
      titulo: noticia.titulo,
      conteudo: noticia.conteudo,
      imagem: null,
      imagemPreview: noticia.imagem ? `/uploads/noticias/${noticia.imagem}` : "",
      imagemAntiga: noticia.imagem || ""
    });
  };

  // ✅ DELETE com loading
  const handleDelete = async (id: number) => {
    if (!confirm("Confirmar exclusão?")) return;
    setDeletingId(id);
    try {
      await fetch(`/admin/api/noticias/${id}`, { method: "DELETE" });
      setNoticias(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      alert("Erro ao excluir");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    if (!formData.titulo?.trim() || !formData.conteudo?.trim()) {
      alert("Título e conteúdo são obrigatórios!");
      setSaving(false);
      return;
    }

    try {
      const fd = new FormData();
      fd.append("titulo", formData.titulo);
      fd.append("conteudo", formData.conteudo);
      if (formData.imagem) fd.append("imagem", formData.imagem);
      if (editingId) {
        fd.append("id", editingId.toString());
        fd.append("imagemAntiga", formData.imagemAntiga);
      }

      const method = editingId ? "PUT" : "POST";
      const res = await fetch("/admin/api/noticias", { method, body: fd });

      if (!res.ok) {
        const error = await res.json();
        alert(`Erro: ${error.error || "Falha ao salvar"}`);
        return;
      }

      setFormData({
        titulo: "",
        conteudo: "",
        imagem: null,
        imagemPreview: "",
        imagemAntiga: ""
      });
      setEditingId(null);
      setImagemNoticia(null);

      const refreshed = await fetch("/admin/api/noticias").then(r => r.json());
      setNoticias(Array.isArray(refreshed) ? refreshed : []);

      setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      alert("Erro de conexão");
    } finally {
      setSaving(false);
    }
  };

  // Drag & Drop handlers (igual recados - igual ao seu código)
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

  const handleImageUpload = useCallback((file: File) => {
    const preview = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      imagem: file,
      imagemPreview: preview,
      imagemAntiga: ""
    }));
    setImagemNoticia(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/") && file.size < 5 * 1024 * 1024) {
        handleImageUpload(file);
      }
    }
  }, [handleImageUpload]);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/") && file.size < 5 * 1024 * 1024) {
      handleImageUpload(file);
      e.target.value = "";
    }
  }, [handleImageUpload]);

  const removeImage = useCallback(() => {
    setImagemNoticia(null);
    setFormData(prev => ({
      ...prev,
      imagem: null,
      imagemPreview: editingId ? prev.imagemAntiga : ""
    }));
  }, [editingId]);

  return (
    <>
      {loading && <LoadingOverlay show={true} />}
      {saving && <LoadingOverlay show={true} />}

      <Layout>
        <div className="container mx-auto py-12 w-[90%]">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <Button onClick={() => router.back()} className="bg-gray-600 hover:bg-gray-700 text-white">
              ← Voltar
            </Button>
            <h1 className="text-5xl font-bold dark:text-white">Gerenciar Notícias</h1>
            <Image
              src="/assets/images/icons/icons8-news-preto.png"
              alt="Icon news"
              width={50}
              height={50}
              className="mr-5 dark:invert"
            />
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="bg-white/60 dark:bg-gray-500 backdrop-blur p-8 rounded-2xl mb-12">
            <div className="grid md:grid-cols-2 gap-6">
              <input
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="Título da notícia"
                className="w-full p-4 border rounded-xl text-lg"
                required
              />

              {/* Upload Drag & Drop */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nova Imagem (opcional)
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 w-full ${dragActive
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

                  {imagemNoticia && (
                    <div className="absolute inset-0 bg-white/95 dark:bg-black/95 flex flex-col items-center justify-center z-30 rounded-xl">
                      <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/50 p-4 rounded-lg border border-blue-200 dark:border-blue-800 w-full max-w-md">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-blue-800 dark:text-blue-200 truncate">
                            {imagemNoticia.name}
                          </p>
                          <p className="text-xs text-blue-700 dark:text-blue-300">
                            {Math.round(imagemNoticia.size / 1024)} KB
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
            </div>

            <textarea
              value={formData.conteudo}
              onChange={(e) => setFormData({ ...formData, conteudo: e.target.value })}
              placeholder="Conteúdo da notícia"
              rows={6}
              className="w-full p-4 border rounded-xl mt-6 text-lg"
              required
            />

            {formData.imagemPreview && (
              <div className="mt-4 p-4 bg-gray-100 rounded-xl">
                <img src={formData.imagemPreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
              </div>
            )}

            <Button type="submit" disabled={saving} className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50">
              {saving ? "Salvando..." : (editingId ? "Atualizar" : "Criar")} Notícia
            </Button>
          </form>

          {/* Lista */}
          <div className="space-y-4">
            {noticias.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-3xl font-bold mb-4 dark:text-white">Nenhuma notícia</h3>
                <p>Crie a primeira notícia acima!</p>
              </div>
            ) : (
              noticias.map((noticia) => {
                const isDeleting = deletingId === noticia.id;
                return (
                  <div key={noticia.id} className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 rounded-2xl border relative group">
                    {isDeleting && (
                      <div className="absolute inset-0 bg-white/95 dark:bg-black/80 backdrop-blur-md flex items-center justify-center rounded-2xl z-20 border-2 border-blue-400 animate-pulse">
                        <div className="flex items-center gap-3 bg-white/95 dark:bg-gray-900/95 p-6 rounded-2xl shadow-2xl border">
                          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                          <div>
                            <p className="font-bold text-lg text-gray-800 dark:text-gray-100">Excluindo...</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Aguarde</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className={`transition-all ${isDeleting ? 'opacity-50 blur-sm pointer-events-none' : ''}`}>
                      <div className="flex justify-between items-start mb-4">
                        <div className="text-sm text-gray-500 flex items-center gap-2 mt-1 dark:text-gray-400">
                          📰 {new Date(noticia.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => handleEdit(noticia)} size="sm" className="bg-green-600 text-white" disabled={isDeleting}>
                            Editar
                          </Button>
                          <Button
                            onClick={() => handleDelete(noticia.id)}
                            size="sm"
                            variant="destructive"
                            className="bg-red-600 text-white flex items-center gap-2"
                            disabled={isDeleting}
                          >
                            {isDeleting ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                Excluindo...
                              </>
                            ) : (
                              <>
                                <X className="w-4 h-4" />
                                Excluir
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                      {noticia.imagem && (
                        <img
                          src={`/uploads/noticias/${noticia.imagem}`}
                          alt={noticia.titulo}
                          loading="lazy"
                          onError={(e) => {
                            console.log('❌ NOTÍCIA IMAGEM FALHOU:', noticia.imagem);  // ✅ DEBUG
                            (e.target as HTMLImageElement).src = '/placeholder.png';
                          }}
                          className="w-28 h-28 object-cover rounded-xl mb-4 shadow-md hover:shadow-xl transition-all cursor-pointer group-hover:scale-105"
                        />
                      )}
                      <h3 className="text-xl font-bold mb-2 dark:text-white">{noticia.titulo}</h3>
                      <p className="text-gray-700 dark:text-gray-300">{noticia.conteudo.slice(0, 200)}...</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}