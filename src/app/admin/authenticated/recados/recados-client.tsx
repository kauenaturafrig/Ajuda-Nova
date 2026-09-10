// src/app/admin/authenticated/recados/recados-client.tsx
"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { AppUserRole } from "@/src/types/user";
import Image from "next/image";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { LoadingOverlay } from "@/src/components/ui/loading-overlay";
import {
  ArrowLeft,
  Megaphone,
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

interface Recado {
  id: number;
  titulo: string;
  conteudo: string;
  imagem?: string;
  unidadeId: number;
  unidadeIds: number[];
  unidade: { id: number; nome: string };
  createdAt: string | Date;
  updatedAt?: string | Date;
}

interface Unidade {
  id: number;
  nome: string;
}

interface Props {
  initialRecados: Recado[];
  initialUnidades: Unidade[];
  userRoles: AppUserRole[];
  userUnidadeId: number | null;
}

function getImagemUrl(recado: Recado) {
  if (!recado.imagem) return "";
  const version = recado.updatedAt
    ? new Date(recado.updatedAt).getTime()
    : new Date(recado.createdAt).getTime();
  return `/admin/api/uploads/recados/${recado.imagem}?v=${version}`;
}

export default function RecadosClient({
  initialRecados,
  initialUnidades,
  userRoles,
  userUnidadeId,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [recados, setRecados] = useState<Recado[]>(initialRecados);
  const [unidades] = useState<Unidade[]>(initialUnidades);
  const [dragActive, setDragActive] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [pendentesCount, setPendentesCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const isOwner = userRoles.includes("OWNER");
  const isMessageOnly =
    userRoles.includes("MESSAGEONLY");
  const isMessageNews =
    userRoles.includes("MESSAGENEWS");

  const isSolicitante = isMessageOnly;
  const podeRevisarSolicitacoes =
    isOwner ||
    isMessageNews;

  const [formData, setFormData] = useState({
    titulo: "",
    conteudo: "",
    unidadeIds:
      (isMessageOnly) && userUnidadeId
        ? [userUnidadeId]
        : ([] as number[]),
    imagem: null as File | null,
    imagemPreview: "",
    imagemAntiga: "",
  });

  const [imagemRecado, setImagemRecado] = useState<File | null>(null);
  const [selectedUnidades, setSelectedUnidades] = useState<Record<number, boolean>>(
    (isMessageOnly) && userUnidadeId
      ? { [userUnidadeId]: true }
      : {}
  );

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    fetch("/admin/api/recados/solicitacoes?status=PENDENTE")
      .then((r) => r.json())
      .then((data) => setPendentesCount(Array.isArray(data) ? data.length : 0))
      .catch(() => { });
  }, []);

  const handleCheckboxChange = (unidadeId: number) => {
    setSelectedUnidades((prev) => {
      const newState = { ...prev, [unidadeId]: !prev[unidadeId] };

      setFormData((prevForm) => ({
        ...prevForm,
        unidadeIds: Object.keys(newState)
          .filter((id) => newState[Number(id)])
          .map(Number),
      }));

      return newState;
    });
  };

  const canManageRecado = useCallback(
    (recado: Recado) => {
      if (isOwner || isMessageNews) return true;
      const ehMultiUnidade = recado.unidadeIds.length > 1;
      const ehSuaUnidade = recado.unidadeId === userUnidadeId;
      return !ehMultiUnidade && ehSuaUnidade;
    },
    [isOwner, isMessageNews, userUnidadeId]
  );

  const resetForm = () => {
    setFormData({
      titulo: "",
      conteudo: "",
      unidadeIds: [],
      imagem: null,
      imagemPreview: "",
      imagemAntiga: "",
    });
    setEditingId(null);
    setSelectedUnidades(
      (isMessageOnly) && userUnidadeId
        ? { [userUnidadeId]: true }
        : {}
    );
    setImagemRecado(null);
  };

  const handleEdit = (recado: Recado) => {
    if (!canManageRecado(recado)) {
      alert("⛔ Você só pode editar recados da sua própria unidade!");
      return;
    }

    setEditingId(recado.id);

    const ids = recado.unidadeIds.length > 0 ? recado.unidadeIds : [recado.unidadeId];
    setFormData({
      titulo: recado.titulo,
      conteudo: recado.conteudo,
      unidadeIds: ids,
      imagem: null,
      imagemPreview: recado.imagem ? getImagemUrl(recado) : "",
      imagemAntiga: recado.imagem || "",
    });

    const selected: Record<number, boolean> = {};
    ids.forEach((id) => {
      selected[id] = true;
    });
    setSelectedUnidades(selected);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    const recado = recados.find((r) => r.id === id);

    if (recado && !canManageRecado(recado)) {
      alert("⛔ Você só pode excluir recados da sua própria unidade!");
      return;
    }

    if (isSolicitante) {
      if (!confirm("Isso enviará uma solicitação de exclusão para aprovação. Deseja continuar?")) return;

      setDeletingId(id);
      try {
        const fd = new FormData();
        fd.append("tipo", "DELETE");
        fd.append("recadoId", id.toString());

        const res = await fetch("/admin/api/recados/solicitacoes", {
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
      const res = await fetch(`/admin/api/recados/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const error = await res.json();
        alert(`Erro: ${error.error || "Falha ao excluir"}`);
        return;
      }
      setRecados((prev) => prev.filter((r) => r.id !== id));
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

    const currentUnidadeIds = Object.keys(selectedUnidades)
      .filter((id) => selectedUnidades[Number(id)])
      .map(Number);

    if (!formData.titulo?.trim() || !formData.conteudo?.trim() || currentUnidadeIds.length === 0) {
      alert("Título, conteúdo e pelo menos 1 unidade são obrigatórios!");
      setSaving(false);
      return;
    }

    try {
      const fd = new FormData();
      fd.append("titulo", formData.titulo);
      fd.append("conteudo", formData.conteudo);
      currentUnidadeIds.forEach((id) => fd.append("unidadeIds[]", id.toString()));
      if (formData.imagem) fd.append("imagem", formData.imagem);

      let url = "/admin/api/recados";
      let method = editingId ? "PUT" : "POST";

      if (isSolicitante) {
        url = "/admin/api/recados/solicitacoes";
        method = "POST";
        fd.append("tipo", editingId ? "UPDATE" : "CREATE");
        if (editingId) {
          fd.append("recadoId", editingId.toString());
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

      resetForm();

      if (isSolicitante) {
        alert("✅ Solicitação enviada! Aguarde a aprovação de um administrador para que ela apareça no mural.");
        return;
      }

      const refreshed = await fetch("/admin/api/recados").then((r) => r.json());
      setRecados(
        Array.isArray(refreshed)
          ? refreshed.map((r: any) => ({
            ...r,
            imagem: r.imagem || undefined,
            unidade: r.unidade,
            unidadeIds: r.unidadeIds || [],
          }))
          : []
      );

      router.refresh();
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
    setFormData((prev) => ({ ...prev, imagem: file, imagemPreview: preview, imagemAntiga: "" }));
    setImagemRecado(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith("image/") && file.size < 5 * 1024 * 1024) handleImageUpload(file);
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
    setImagemRecado(null);
    setFormData((prev) => ({ ...prev, imagem: null, imagemPreview: editingId ? prev.imagemAntiga : "" }));
  }, [editingId]);

  return (
    <>
      {loading && <LoadingOverlay show={true} />}
      {saving && <LoadingOverlay show={true} />}

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">

        {/* Topbar / Header Administrativo */}
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
                <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 shrink-0">
                  <Megaphone size={18} />
                </span>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Gerenciar Recados
                </h1>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 pl-12">
              {isSolicitante
                ? "Envie solicitações de comunicados para aprovação da sua unidade."
                : "Envie comunicados instantâneos direcionados a uma ou múltiplas unidades."}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {(podeRevisarSolicitacoes || isSolicitante) && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => router.push("/admin/authenticated/recados/solicitacoes")}
                className="relative rounded-xl text-xs font-semibold gap-1.5 border-gray-200 dark:border-neutral-800 h-9"
              >
                <ClipboardCheck className="w-3.5 h-3.5" />
                {isSolicitante ? "Minhas Solicitações" : "Solicitações"}
                {pendentesCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-orange-600 text-white text-[9px] font-bold rounded-full h-4 min-w-4 px-1 flex items-center justify-center">
                    {pendentesCount}
                  </span>
                )}
              </Button>
            )}
            <div className="hidden sm:block opacity-80 dark:opacity-40">
              <Image
                src="/assets/images/icons/icons8-megaphone-preto.png"
                alt="Icon megaphone"
                width={42}
                height={42}
                className="dark:invert"
              />
            </div>
          </div>
        </div>

        {/* Formulário de Criação/Edição */}
        <section className="bg-white dark:bg-neutral-900/40 rounded-2xl border border-gray-100 dark:border-neutral-800/80 p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-neutral-800/60 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  {editingId
                    ? isSolicitante ? "Solicitar Edição de Recado" : "Editar Recado Selecionado"
                    : isSolicitante ? "Solicitar Novo Comunicado" : "Escrever Novo Comunicado"}
                </h2>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Defina o escopo, corpo da mensagem e configure os destinatários de destino.
                </p>
              </div>
            </div>

            {editingId && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={resetForm}
                className="rounded-xl text-xs font-semibold hover:bg-gray-150 dark:hover:bg-neutral-800 text-gray-500"
              >
                Cancelar Edição
              </Button>
            )}
          </div>

          {isSolicitante && (
            <div className="flex items-start gap-2 p-3 mb-5 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 text-[11px] text-blue-700 dark:text-blue-400">
              <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              Suas alterações são enviadas como solicitação e só aparecem no mural após aprovação de um administrador.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

              {/* Inputs de Conteúdo */}
              <div className="lg:col-span-2 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Título do Recado</label>
                  <Input
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    placeholder="Ex: Manutenção agendada, Reunião geral..."
                    className="rounded-xl h-11 border-gray-200 dark:border-neutral-800 text-xs"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Mensagem</label>
                  <textarea
                    value={formData.conteudo}
                    onChange={(e) => setFormData({ ...formData, conteudo: e.target.value })}
                    placeholder="Descreva aqui o aviso de forma clara..."
                    rows={5}
                    className="flex w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-xs text-gray-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/50 resize-y"
                    required
                  />
                </div>
              </div>

              {/* Seletor de Unidades & Upload Dinâmico */}
              <div className="space-y-4">

                {/* Distribuição por Unidade */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Destinatários autorizados</label>

                  {isMessageOnly ? (
                    <div className="p-3.5 border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50/30 dark:bg-emerald-950/10 rounded-xl flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400">Unidade Vinculada Fixa</p>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-500 truncate">
                          {unidades.find((u) => u.id === userUnidadeId)?.nome}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="max-h-28 overflow-y-auto border border-gray-200 dark:border-neutral-800 rounded-xl p-2 bg-gray-50/50 dark:bg-neutral-900/60 space-y-1 custom-scrollbar">
                      {unidades.map((unidade) => (
                        <label key={unidade.id} className="flex items-center p-1.5 hover:bg-white dark:hover:bg-neutral-800 rounded-lg cursor-pointer transition-colors group">
                          <input
                            type="checkbox"
                            checked={selectedUnidades[unidade.id] || false}
                            onChange={() => handleCheckboxChange(unidade.id)}
                            className="w-3.5 h-3.5 text-orange-600 bg-gray-150 border-gray-300 rounded focus:ring-orange-500 focus:ring-offset-0 mr-2.5"
                          />
                          <span className="text-[11px] font-medium text-gray-600 dark:text-gray-300 group-hover:text-orange-500 transition-colors truncate">
                            {unidade.nome}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Upload de Imagem Compacto */}
                <div className="space-y-1.5">
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-4 text-center transition-all duration-200 h-[106px] flex flex-col justify-center items-center ${dragActive
                      ? "border-orange-400 bg-orange-50/20"
                      : "border-gray-200 dark:border-neutral-800 hover:border-orange-400/60 hover:bg-gray-50/50 dark:hover:bg-neutral-800/40"
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
                      <UploadCloud className="w-6 h-6 mb-1 text-gray-400" />
                      <p className="text-[11px] font-semibold text-gray-700 dark:text-gray-300">Anexar Mídia Opcional</p>
                      <p className="text-[9px] text-gray-400">Arraste ou clique (Max. 5MB)</p>
                    </div>

                    {(imagemRecado || formData.imagemPreview) && (
                      <div className="absolute inset-1 bg-white dark:bg-neutral-900 flex flex-col items-center justify-center z-30 rounded-lg p-1 border border-gray-100 dark:border-neutral-800">
                        {formData.imagemPreview ? (
                          <div className="relative w-full h-full flex items-center justify-center bg-gray-50 dark:bg-neutral-950 rounded overflow-hidden">
                            <img src={formData.imagemPreview} alt="Preview" className="max-w-full max-h-full object-contain" />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={removeImage}
                              className="absolute top-1 right-1 h-5 w-5 rounded-md"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-neutral-950 p-1.5 rounded border border-gray-200 dark:border-neutral-800 w-full">
                            <FileText className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                            <p className="text-[10px] font-bold text-gray-800 dark:text-gray-200 truncate flex-1 text-left">
                              {imagemRecado?.name}
                            </p>
                            <Button type="button" variant="ghost" size="icon" onClick={removeImage} className="h-5 w-5 p-0">
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

            <div className="flex justify-end border-t border-gray-100 dark:border-neutral-800/60 pt-4">
              <Button
                type="submit"
                disabled={saving}
                className="w-full sm:w-48 h-10 gap-2 rounded-xl text-xs font-semibold bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-500/10"
              >
                {saving
                  ? "Salvando..."
                  : isSolicitante
                    ? editingId ? "Solicitar Atualização" : "Solicitar Publicação"
                    : editingId ? "Atualizar Recado" : "Disparar Recado"}
              </Button>
            </div>
          </form>
        </section>

        {/* Feed de Recados */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <span className="w-1.5 h-3 rounded-full bg-orange-500" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Mural de Recados Ativos</h3>
          </div>

          {recados.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-neutral-900/20 rounded-2xl border border-gray-100 dark:border-neutral-800/80">
              <Megaphone className="w-8 h-8 text-gray-300 dark:text-neutral-700 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">Nenhum recado no mural</h4>
              <p className="text-xs text-gray-400 dark:text-gray-500 max-w-xs mx-auto mt-0.5">
                Crie o seu primeiro recado de aviso utilizando as ferramentas do formulário acima.
              </p>
            </div>
          ) : (
            /* Layout Estritamente Vertical */
            <div className="flex flex-col gap-4">
              {recados.map((recado) => {
                const isDeleting = deletingId === recado.id;
                const podeGerenciar = canManageRecado(recado);
                const imagemUrl = getImagemUrl(recado);
                const unidadesExibicao = unidades.filter((u) =>
                  recado.unidadeIds.length > 0 ? recado.unidadeIds.includes(u.id) : u.id === recado.unidadeId
                );

                return (
                  <div
                    key={recado.id}
                    className="p-5 bg-white dark:bg-neutral-900/40 rounded-2xl border border-gray-100 dark:border-neutral-800/80 relative flex flex-col justify-between transition-all hover:shadow-sm hover:border-gray-200/60 dark:hover:border-neutral-800 group"
                  >
                    {isDeleting && (
                      <div className="absolute inset-0 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-sm flex items-center justify-center rounded-2xl z-20 border border-orange-500/20">
                        <div className="flex items-center gap-2.5 bg-white dark:bg-neutral-900 p-4 rounded-xl shadow-md border border-gray-100 dark:border-neutral-800">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-500 border-t-transparent" />
                          <p className="font-bold text-xs text-gray-800 dark:text-gray-100">
                            {isSolicitante ? "Enviando solicitação..." : "Removendo registro..."}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className={isDeleting ? "opacity-40 blur-xs pointer-events-none" : ""}>

                      {/* Meta info & Botões de Ação */}
                      <div className="flex items-center justify-between gap-4 mb-3">
                        <div className="flex flex-wrap items-center gap-y-1 gap-x-2.5 text-[11px] font-medium text-gray-400 dark:text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-orange-500/70" />
                            {new Date(recado.createdAt).toLocaleDateString("pt-BR")}
                          </span>
                          <span className="flex items-center gap-1 max-w-[240px] sm:max-w-md truncate">
                            <MapPin className="w-3.5 h-3.5 text-orange-500/70 shrink-0" />
                            {unidadesExibicao.map((u) => u.nome).join(", ")}
                          </span>
                          {!podeGerenciar && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[9px] font-bold rounded-md uppercase border border-blue-100/40 dark:border-blue-900/30">
                              <Lock className="w-2.5 h-2.5" /> Escopo Global
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 shadow-sm rounded-lg border border-gray-100 dark:border-neutral-800/60 bg-gray-50/50 dark:bg-neutral-900/60 p-0.5 shrink-0">
                          {podeGerenciar ? (
                            <>
                              <Button
                                onClick={() => handleEdit(recado)}
                                size="icon"
                                variant="ghost"
                                title={isSolicitante ? "Solicitar edição" : "Editar"}
                                className="h-7 w-7 rounded-md text-gray-500 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-white dark:hover:bg-neutral-800"
                                disabled={isDeleting}
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                onClick={() => handleDelete(recado.id)}
                                size="icon"
                                variant="ghost"
                                title={isSolicitante ? "Solicitar exclusão" : "Excluir"}
                                className="h-7 w-7 rounded-md text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-white dark:hover:bg-neutral-800"
                                disabled={isDeleting}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </>
                          ) : (
                            <span className="text-[10px] text-gray-400 px-2 font-medium italic">
                              Apenas Leitura
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Conteúdo do Card Alinhado na Horizontal/Vertical Fluída */}
                      <div className="flex flex-col sm:flex-row gap-4 items-start">
                        {recado.imagem && (
                          <div className="relative w-full sm:w-28 h-40 sm:h-28 rounded-xl bg-gray-50 dark:bg-neutral-950 border border-gray-150 dark:border-neutral-800 shrink-0 overflow-hidden shadow-inner">
                            <img
                              src={imagemUrl}
                              alt={recado.titulo}
                              loading="lazy"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/placeholder.png";
                              }}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                            />
                          </div>
                        )}

                        <div className="space-y-1.5 min-w-0 flex-1">
                          <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-snug break-words group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                            {recado.titulo}
                          </h4>
                          {/* Texto corrido e completo, respeitando quebras de parágrafo */}
                          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed break-words whitespace-pre-wrap">
                            {recado.conteudo}
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