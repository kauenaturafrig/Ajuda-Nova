// src/app/admin/authenticated/noticias/noticias-client.tsx
"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { LoadingOverlay } from "@/src/components/ui/loading-overlay";
import {
  ArrowLeft,
  Newspaper,
  UploadCloud,
  FileText,
  Calendar,
  Edit3,
  Trash2,
  X,
  Check,
  MapPin,
  Lock,
  ClipboardCheck,
  Info,
} from "lucide-react";
import type { AppUserRole } from "@/src/types/user";

interface Noticia {
  id: number;
  titulo: string;
  conteudo: string;
  imagem: string | null | undefined;
  createdAt: string | Date;
  updatedAt?: string | Date;
  unidadeId?: number | null;
}

interface Props {
  initialNoticias: Noticia[];
  userRoles: AppUserRole[];
}

function getImagemUrl(noticia: Noticia) {
  if (!noticia.imagem) return "";
  const version = noticia.updatedAt
    ? new Date(noticia.updatedAt).getTime()
    : new Date(noticia.createdAt).getTime();
  return `/admin/api/uploads/noticias/${noticia.imagem}?v=${version}`;
}

export default function NoticiasClient({
  initialNoticias,
  userRoles,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [noticias, setNoticias] = useState<Noticia[]>(initialNoticias);
  const [dragActive, setDragActive] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [pendentesCount, setPendentesCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const isOwner = userRoles.includes("OWNER");
  const isNewsOnly =
    userRoles.includes("NEWSONLY");
  const isMessageNews =
    userRoles.includes("MESSAGENEWS");

  const isSolicitante =
    isNewsOnly &&
    !isOwner &&
    !isMessageNews;

  const podeRevisarSolicitacoes =
    isOwner ||
    isMessageNews;

  const [formData, setFormData] = useState({
    titulo: "",
    conteudo: "",
    imagem: null as File | null,
    imagemPreview: "",
    imagemAntiga: "",
  });

  const [imagemNoticia, setImagemNoticia] = useState<File | null>(null);

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch("/admin/api/noticias/solicitacoes?status=PENDENTE")
      .then((r) => r.json())
      .then((data) => setPendentesCount(Array.isArray(data) ? data.length : 0))
      .catch(() => { });
  }, []);

  const refreshNoticias = useCallback(async () => {
    const res = await fetch("/admin/api/noticias", { cache: "no-store" });
    const data = await res.json();
    setNoticias(Array.isArray(data) ? data : []);
    router.refresh();
  }, [router]);

  const handleEdit = (noticia: Noticia) => {
    setEditingId(noticia.id);
    setFormData({
      titulo: noticia.titulo,
      conteudo: noticia.conteudo,
      imagem: null,
      imagemPreview: noticia.imagem ? getImagemUrl(noticia) : "",
      imagemAntiga: noticia.imagem || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (isSolicitante) {
      if (!confirm("Isso enviará uma solicitação de exclusão para aprovação. Deseja continuar?")) return;

      setDeletingId(id);
      try {
        const fd = new FormData();
        fd.append("tipo", "DELETE");
        fd.append("noticiaId", id.toString());

        const res = await fetch("/admin/api/noticias/solicitacoes", {
          method: "POST",
          body: fd,
        });

        if (!res.ok) {
          const error = await res.json();
          alert(`Erro: ${error.error || "Falha ao solicitar exclusão"}`);
          return;
        }

        alert("✅ Solicitação de exclusão enviada! Aguarde a aprovação de um administrador.");
      } catch {
        alert("Erro de conexão");
      } finally {
        setDeletingId(null);
      }
      return;
    }

    if (!confirm("Confirmar exclusão?")) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/admin/api/noticias/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const error = await res.json();
        alert(`Erro: ${error.error || "Falha ao excluir"}`);
        return;
      }
      setNoticias((prev) => prev.filter((n) => n.id !== id));
      router.refresh();
    } catch {
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

      let url = "/admin/api/noticias";
      let method = editingId ? "PUT" : "POST";

      if (isSolicitante) {
        url = "/admin/api/noticias/solicitacoes";
        method = "POST";
        fd.append("tipo", editingId ? "UPDATE" : "CREATE");
        if (editingId) {
          fd.append("noticiaId", editingId.toString());
          fd.append("imagemAntiga", formData.imagemAntiga);
        }
      } else if (editingId) {
        fd.append("id", editingId.toString());
        fd.append("imagemAntiga", formData.imagemAntiga);
      }

      const res = await fetch(url, { method, body: fd });

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
        imagemAntiga: "",
      });
      setEditingId(null);
      setImagemNoticia(null);

      if (isSolicitante) {
        alert("✅ Solicitação enviada! Aguarde a aprovação de um administrador.");
        return;
      }

      await refreshNoticias();
    } catch {
      alert("Erro de conexão");
    } finally {
      setSaving(false);
    }
  };

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
    setFormData((prev) => ({
      ...prev,
      imagem: file,
      imagemPreview: preview,
      imagemAntiga: "",
    }));
    setImagemNoticia(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith("image/") && file.size < 5 * 1024 * 1024) {
          handleImageUpload(file);
        }
      }
    },
    [handleImageUpload]
  );

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type.startsWith("image/") && file.size < 5 * 1024 * 1024) {
        handleImageUpload(file);
        e.target.value = "";
      }
    },
    [handleImageUpload]
  );

  const removeImage = useCallback(() => {
    setImagemNoticia(null);
    setFormData((prev) => ({
      ...prev,
      imagem: null,
      imagemPreview: editingId ? prev.imagemAntiga : "",
    }));
  }, [editingId]);

  return (
    <>
      {loading && <LoadingOverlay show={true} />}
      {saving && <LoadingOverlay show={true} />}

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-gray-100 dark:border-neutral-800/60 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="h-9 w-9 rounded-xl text-gray-500 hover:text-gray-900 dark:hover:text-white border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                  <Newspaper size={18} />
                </span>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Gerenciar Notícias
                </h1>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 pl-12">
              {isSolicitante
                ? "Envie solicitações de notícias para aprovação."
                : "Publique informativos, avisos gerais e comunicados internos na plataforma."}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {(podeRevisarSolicitacoes || isSolicitante) && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => router.push("/admin/authenticated/noticias/solicitacoes")}
                className="relative rounded-xl text-xs font-semibold gap-1.5 border-gray-200 dark:border-neutral-800 h-9"
              >
                <ClipboardCheck className="w-3.5 h-3.5" />
                {isSolicitante ? "Minhas Solicitações" : "Solicitações"}
                {pendentesCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[9px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                    {pendentesCount}
                  </span>
                )}
              </Button>
            )}
            <div className="hidden sm:block opacity-80 dark:opacity-40">
              <Image
                src="/assets/images/icons/icons8-news-preto.png"
                alt="Icon news"
                width={42}
                height={42}
                className="dark:invert"
              />
            </div>
          </div>
        </div>

        <section className="bg-white dark:bg-neutral-900/40 rounded-2xl border border-gray-100 dark:border-neutral-800/80 p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-neutral-800/60 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  {editingId
                    ? isSolicitante
                      ? "Solicitar Edição de Notícia"
                      : "Editar Notícia Selecionada"
                    : isSolicitante
                      ? "Solicitar Nova Notícia"
                      : "Escrever Nova Notícia"}
                </h2>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Defina o título, conteúdo e adicione uma imagem de destaque opcional.
                </p>
              </div>
            </div>

            {editingId && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    titulo: "",
                    conteudo: "",
                    imagem: null,
                    imagemPreview: "",
                    imagemAntiga: "",
                  });
                  setImagemNoticia(null);
                }}
                className="rounded-xl text-xs font-semibold hover:bg-gray-150 dark:hover:bg-neutral-800 text-gray-500"
              >
                Cancelar Edição
              </Button>
            )}
          </div>

          {isSolicitante && (
            <div className="flex items-start gap-2 p-3 mb-5 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 text-[11px] text-blue-700 dark:text-blue-400">
              <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              Suas alterações são enviadas como solicitação e só aparecem após aprovação.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Título da Notícia</label>
                  <Input
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    placeholder="Escreva um título chamativo e direto..."
                    className="rounded-xl h-11 border-gray-200 dark:border-neutral-800 text-xs"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Corpo da Publicação</label>
                  <textarea
                    value={formData.conteudo}
                    onChange={(e) => setFormData({ ...formData, conteudo: e.target.value })}
                    placeholder="Digite o conteúdo detalhado da notícia aqui..."
                    rows={5}
                    className="flex w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-xs text-gray-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 resize-y"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Imagem de Destaque</label>
                <div
                  className={`relative border-2 border-dashed rounded-xl p-5 text-center transition-all duration-200 h-[198px] flex flex-col justify-center items-center ${dragActive
                      ? "border-blue-400 bg-blue-50/20 dark:bg-blue-950/10"
                      : "border-gray-200 dark:border-neutral-800 hover:border-blue-400/60 hover:bg-gray-50/50 dark:hover:bg-neutral-800/40"
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
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  />

                  <div className="relative z-10 pointer-events-none flex flex-col items-center justify-center">
                    <UploadCloud className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-0.5">
                      {dragActive ? "Solte a imagem aqui" : "Arraste ou clique para upload"}
                    </p>
                    <p className="text-[10px] text-gray-400">Suporta PNG, JPG (máx. 5MB)</p>
                  </div>

                  {(imagemNoticia || formData.imagemPreview) && (
                    <div className="absolute inset-1.5 bg-white dark:bg-neutral-900 flex flex-col items-center justify-center z-30 rounded-lg p-2 border border-gray-100 dark:border-neutral-800">
                      {formData.imagemPreview ? (
                        <div className="relative w-full h-full flex items-center justify-center bg-gray-50 dark:bg-neutral-950 rounded-md overflow-hidden">
                          <img
                            src={formData.imagemPreview}
                            alt="Preview"
                            className="max-w-full max-h-full object-contain rounded"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={removeImage}
                            className="absolute top-1.5 right-1.5 h-6 w-6 rounded-lg opacity-90 hover:opacity-100"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-neutral-950 p-2 rounded-lg border border-gray-200 dark:border-neutral-800 w-full">
                          <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                          <div className="flex-1 min-w-0 text-left">
                            <p className="text-[11px] font-bold text-gray-800 dark:text-gray-200 truncate">
                              {imagemNoticia?.name}
                            </p>
                            <p className="text-[10px] text-gray-400">
                              {imagemNoticia ? Math.round(imagemNoticia.size / 1024) : 0} KB
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={removeImage}
                            className="h-7 w-7 p-0 rounded-lg text-gray-400 hover:text-red-500"
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-gray-100 dark:border-neutral-800/60 pt-4">
              <Button
                type="submit"
                disabled={saving}
                className="w-full sm:w-48 h-10 gap-2 rounded-xl text-xs font-semibold bg-blue-500 hover:bg-blue-600 text-white shadow-md shadow-blue-500/10"
              >
                {saving ? "Salvando..." : editingId ? "Atualizar Notícia" : "Publicar Notícia"}
              </Button>
            </div>
          </form>
        </section>

        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <span className="w-1.5 h-3 rounded-full bg-blue-500" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Feed de Publicações Ativas</h3>
          </div>

          {noticias.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-neutral-900/20 rounded-2xl border border-gray-100 dark:border-neutral-800/80">
              <Newspaper className="w-8 h-8 text-gray-300 dark:text-neutral-700 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">Nenhuma notícia registrada</h4>
              <p className="text-xs text-gray-400 dark:text-gray-500 max-w-xs mx-auto mt-0.5">
                Crie sua primeira publicação utilizando o formulário acima.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {noticias.map((noticia) => {
                const isDeleting = deletingId === noticia.id;
                const imagemUrl = getImagemUrl(noticia);

                return (
                  <div
                    key={noticia.id}
                    className="p-5 bg-white dark:bg-neutral-900/40 rounded-2xl border border-gray-100 dark:border-neutral-800/80 relative flex flex-col justify-between transition-all hover:shadow-sm hover:border-gray-200/60 dark:hover:border-neutral-800 group"
                  >
                    {isDeleting && (
                      <div className="absolute inset-0 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-sm flex items-center justify-center rounded-2xl z-20 border border-blue-500/20">
                        <div className="flex items-center gap-2.5 bg-white dark:bg-neutral-900 p-4 rounded-xl shadow-md border border-gray-100 dark:border-neutral-800">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
                          <p className="font-bold text-xs text-gray-800 dark:text-gray-100">Removendo registro...</p>
                        </div>
                      </div>
                    )}

                    <div className={isDeleting ? "opacity-40 blur-xs pointer-events-none" : ""}>
                      <div className="flex items-center justify-between gap-4 mb-3">
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-400 dark:text-gray-500">
                          <Calendar className="w-3.5 h-3.5 text-blue-500/70" />
                          {new Date(noticia.createdAt).toLocaleDateString("pt-BR")}
                        </div>

                        <div className="flex items-center gap-1 shadow-sm rounded-lg border border-gray-100 dark:border-neutral-800/60 bg-gray-50/50 dark:bg-neutral-900/60 p-0.5">
                          <Button
                            onClick={() => handleEdit(noticia)}
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 rounded-md text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-neutral-800"
                            disabled={isDeleting}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            onClick={() => handleDelete(noticia.id)}
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 rounded-md text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-white dark:hover:bg-neutral-800"
                            disabled={isDeleting}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 items-start">
                        {noticia.imagem && (
                          <div className="relative w-full sm:w-28 h-40 sm:h-28 rounded-xl bg-gray-50 dark:bg-neutral-950 border border-gray-150 dark:border-neutral-800 shrink-0 overflow-hidden shadow-inner">
                            <img
                              src={imagemUrl}
                              alt={noticia.titulo}
                              loading="lazy"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/placeholder.png";
                              }}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                            />
                          </div>
                        )}

                        <div className="space-y-1.5 min-w-0 flex-1">
                          <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-snug break-words group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                            {noticia.titulo}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed break-words whitespace-pre-wrap">
                            {noticia.conteudo}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}