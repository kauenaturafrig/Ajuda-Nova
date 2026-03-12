// src/app/admin/authenticated/recados/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/src/components/Layout";
import Image from "next/image";
import { Button } from "../../../../components/ui/button";
import { LoadingOverlay } from "../../../../components/ui/loading-overlay";

interface Recado {
  id: number;
  titulo: string;
  conteudo: string;
  imagem?: string;
  unidadeId: number;
  unidade: { nome: string };
  createdAt: Date;
}

interface FormData {
  titulo: string;
  conteudo: string;
  unidadeId: number;
  imagem: File | null;
  imagemPreview: string;
  imagemAntiga: string;
}

export default function GerenciarRecados() {
  const [recados, setRecados] = useState<Recado[]>([]);
  const [unidades, setUnidades] = useState<{ id: number; nome: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    titulo: "",
    conteudo: "",
    unidadeId: 0,
    imagem: null,
    imagemPreview: "",
    imagemAntiga: ""
  });
  const router = useRouter();

  useEffect(() => {
    fetchRecados();
    fetchUnidades();
  }, []);

  const fetchRecados = async () => {
    try {
      const res = await fetch("/admin/api/recados");
      if (!res.ok) throw new Error("Falha ao carregar");
      const data = await res.json();
      setRecados(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro:", error);
      setRecados([]);
    }
    setLoading(false);
  };

  const fetchUnidades = async () => {
    try {
      const res = await fetch("/admin/api/unidades");
      if (!res.ok) throw new Error("Falha unidades");
      const data = await res.json();
      setUnidades(Array.isArray(data) ? data : []);
    } catch {
      setUnidades([]);  // Fallback
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.titulo || !formData.conteudo || !formData.unidadeId) return;

    const fd = new FormData();
    fd.append("titulo", formData.titulo);
    fd.append("conteudo", formData.conteudo);
    fd.append("unidadeId", formData.unidadeId.toString());
    if (formData.imagem) fd.append("imagem", formData.imagem);
    if (editingId) {
      fd.append("id", editingId.toString());
      fd.append("imagemAntiga", formData.imagemAntiga);
    }

    const method = editingId ? "PUT" : "POST";
    await fetch("/admin/api/recados", { method, body: fd });

    setFormData({ titulo: "", conteudo: "", unidadeId: 0, imagem: null, imagemPreview: "", imagemAntiga: "" });
    setEditingId(null);
    fetchRecados();
  };

  const handleEdit = (recado: Recado) => {
    setEditingId(recado.id);
    setFormData({
      titulo: recado.titulo,
      conteudo: recado.conteudo,
      unidadeId: recado.unidadeId,
      imagem: null,
      imagemPreview: recado.imagem || "",
      imagemAntiga: recado.imagem || ""
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Confirmar exclusão?")) return;
    await fetch(`/admin/api/recados/${id}`, { method: "DELETE" });
    fetchRecados();
  };

  if (loading) return <LoadingOverlay show={true} />;

  return (
    <Layout>
      <div className="container mx-auto py-12 w-[90%]">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-5xl font-bold dark:text-white">📢 Gerenciar Recados</h1>
          <Button onClick={() => router.back()} className="bg-gray-600 hover:bg-gray-700">
            ← Voltar
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white/60 dark:bg-gray-900/60 backdrop-blur p-8 rounded-2xl mb-12">
          <div className="grid md:grid-cols-2 gap-6">
            <input
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              placeholder="Título do recado"
              className="w-full p-4 border rounded-xl text-lg"
              required
            />
            <select
              value={formData.unidadeId}
              onChange={(e) => setFormData({ ...formData, unidadeId: Number(e.target.value) })}
              className="w-full p-4 border rounded-xl"
              required
            >
              <option value={0}>Selecione unidade</option>
              {unidades.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nome}
                </option>
              ))}
            </select>
          </div>
          <div className="grid md:grid-cols-2 gap-6 mt-6">
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
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
            />
            <textarea
              value={formData.conteudo}
              onChange={(e) => setFormData({ ...formData, conteudo: e.target.value })}
              placeholder="Conteúdo do recado"
              rows={4}
              className="md:col-span-2 w-full p-4 border rounded-xl text-lg"
              required
            />
          </div>
          {formData.imagemPreview && (
            <div className="mt-4 p-4 bg-gray-100 rounded-xl">
              <img src={formData.imagemPreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
            </div>
          )}
          <Button type="submit" className="mt-6 w-full bg-orange-600 hover:bg-orange-700">
            {editingId ? "Atualizar" : "Criar"} Recado
          </Button>
        </form>

        {/* Lista */}
        <div className="space-y-4">
          {recados.length === 0 ? (
            <div className="text-center py-20 col-span-full">
              <h3 className="text-3xl font-bold mb-4 dark:text-white">Nenhum recado</h3>
              <p>Crie o primeiro recado acima!</p>
            </div>
          ) : (
            recados.map((recado) => (
              <div key={recado.id} className="p-6 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/50 rounded-2xl border">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold">{recado.titulo}</h3>
                    <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                      📍 {recado.unidade.nome} • {new Date(recado.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => handleEdit(recado)} size="sm" className="bg-green-600">
                      Editar
                    </Button>
                    <Button onClick={() => handleDelete(recado.id)} size="sm" variant="destructive">
                      Excluir
                    </Button>
                  </div>
                </div>
                {recado.imagem && (
                  <img src={`/uploads/recados/${recado.imagem}`} alt={recado.titulo} className="w-24 h-24 object-cover rounded-lg mb-4" />
                )}
                <p className="text-gray-700 dark:text-gray-300 mb-2">{recado.conteudo.slice(0, 200)}...</p>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
