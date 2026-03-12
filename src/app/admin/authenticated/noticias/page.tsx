// src/app/admin/authenticated/recados/page.tsx

"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/src/components/Layout";
import Image from "next/image";
import { Button } from "../../../../components/ui/button";
import { LoadingOverlay } from "../../../../components/ui/loading-overlay";

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

  if (loading) return <LoadingOverlay show={true} />;

  return (
    <Layout>
      <div className="container mx-auto py-12 w-[90%]">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-5xl font-bold dark:text-white">📰 Gerenciar Notícias</h1>
          <Button onClick={() => router.back()} className="bg-gray-600 hover:bg-gray-700">
            ← Voltar
          </Button>
        </div>

        {/* Form Criar/Editar */}
        <form onSubmit={handleSubmit} className="bg-white/60 dark:bg-gray-900/60 backdrop-blur p-8 rounded-2xl mb-12">
          <div className="grid md:grid-cols-2 gap-6">
            <input
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              placeholder="Título da notícia"
              className="w-full p-4 border rounded-xl text-lg"
              required
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFormData({
                    ...formData,
                    imagem: file,
                    imagemPreview: URL.createObjectURL(file)
                  });
                }
              }}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
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
          <Button type="submit" className="mt-6 w-full bg-blue-600 hover:bg-blue-700">
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
                  <h3 className="text-2xl font-bold">{noticia.titulo}</h3>
                  <div className="flex gap-2">
                    <Button onClick={() => handleEdit(noticia)} size="sm" className="bg-green-600">
                      Editar
                    </Button>
                    <Button onClick={() => handleDelete(noticia.id)} size="sm" variant="destructive">
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
