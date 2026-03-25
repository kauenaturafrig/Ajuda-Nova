// src/app/admin/authenticated/recados/page.tsx
"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/src/components/Layout";
import Image from "next/image";
import { Button } from "../../../../components/ui/button";
import { LoadingOverlay } from "../../../../components/ui/loading-overlay";
import { X } from "lucide-react";

interface Noticia {
  id: number;
  titulo: string;
  conteudo: string;
  imagem?: string;
  createdAt: Date;
}

export default function GerenciarNoticias() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editing, setEditing] = useState(false);
  const [imagemNoticia, setImagemNoticia] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    titulo: "",
    conteudo: "",
    imagem: null as File | null,
    imagemPreview: "",
    imagemAntiga: ""
  });
  const router = useRouter();

  useEffect(() => {
    fetchNoticias();
  }, []);

  const fetchNoticias = async () => {
    try {
      const res = await fetch("/admin/api/noticias");
      if (!res.ok) throw new Error("Falha ao carregar");
      const data = await res.json();
      setNoticias(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro:", error);
      setNoticias([]);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titulo || !formData.conteudo) return;

    const fd = new FormData();
    fd.append("titulo", formData.titulo);
    fd.append("conteudo", formData.conteudo);
    if (formData.imagem) fd.append("imagem", formData.imagem);
    if (editingId) {
      fd.append("id", editingId.toString());
      fd.append("imagemAntiga", formData.imagemAntiga);
    }

    const method = editingId ? "PUT" : "POST";
    await fetch("/admin/api/noticias", {
      method,
      body: fd
    });

    setFormData({ titulo: "", conteudo: "", imagem: null, imagemPreview: "", imagemAntiga: "" });
    setEditingId(null);
    fetchNoticias();
  };

  const handleEdit = (noticia: Noticia) => {
    setEditingId(noticia.id);
    setFormData({
      titulo: noticia.titulo,
      conteudo: noticia.conteudo,
      imagem: null,
      imagemPreview: noticia.imagem || "",
      imagemAntiga: noticia.imagem || ""
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Confirmar exclusão?")) return;
    await fetch(`/admin/api/noticias/${id}`, { method: "DELETE" });
    fetchNoticias();
  };

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

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/") && file.size < 5 * 1024 * 1024) { // 5MB
        handleImageUpload(file); // ✅ Agora sincroniza formData!
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

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const removeImage = useCallback(() => {
    setImagemNoticia(null);
    setFormData(prev => ({
      ...prev,
      imagem: null,
      imagemPreview: editingId ? prev.imagemAntiga : ""
    }));
  }, [editingId]);

  const toggleEdit = () => {
    setEditing(!editing);
  };

  if (loading) return <LoadingOverlay show={true} />;

  return (
    <Layout>
      <div className="container mx-auto py-12 w-[90%]">
        <div className="flex justify-between items-center mb-12">
          <Image
            src={"/assets/images/icons/icons8-news-preto.png"}
            alt="Icon news"
            width={50}
            height={50}
            className="mr-5 dark:invert"
          />
          <h1 className="text-5xl font-bold dark:text-white">Gerenciar Notícias</h1>
          <Button onClick={() => router.back()} className="bg-gray-600 hover:bg-gray-700 dark:text-white">
            ← Voltar
          </Button>
        </div>

        {/* Form Criar/Editar */}
        <form onSubmit={handleSubmit} className="bg-white/60 dark:bg-gray-500 backdrop-blur p-8 rounded-2xl mb-12">
          <div className="grid md:grid-cols-2 gap-6">
            <input
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              placeholder="Título da notícia"
              className="w-full p-4 border rounded-xl text-lg"
              required
            />
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nova Imagem (opcional)
            </label>
            <div
              className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${dragActive
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

              {/* ✅ PREVIEW DA IMAGEM ARRASTADA */}
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
          <Button type="submit" className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white">
            {editingId ? "Atualizar" : "Criar"} Notícia
          </Button>
        </form>

        {/* Lista */}
        <div className="space-y-4">
          {noticias.length === 0 ? (
            <div className="text-center py-20 col-span-full">
              <h3 className="text-3xl font-bold mb-4 dark:text-white">Nenhuma notícia</h3>
              <p>Crie a primeira notícia acima!</p>
            </div>
          ) : (
            noticias.map((noticia) => (
              <div key={noticia.id} className="p-6 bg-white/60 dark:bg-gray-900/60 rounded-2xl border">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold dark:text-white">{noticia.titulo}</h3>
                  <div className="flex gap-2">
                    <Button className="bg-green-600 text-white" onClick={() => handleEdit(noticia)} size="sm">
                      Editar
                    </Button>
                    <Button className="bg-red-600" onClick={() => handleDelete(noticia.id)} size="sm" variant="destructive">
                      Excluir
                    </Button>
                  </div>
                </div>
                {noticia.imagem && (
                  <img src={`/uploads/noticias/${noticia.imagem}`} alt={noticia.titulo} className="w-24 h-24 object-cover rounded-lg mb-4" />
                )}
                <p className="text-gray-700 dark:text-gray-300 mb-2">{noticia.conteudo.slice(0, 200)}...</p>
                <small className="text-gray-500">{new Date(noticia.createdAt).toLocaleDateString('pt-BR')}</small>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
