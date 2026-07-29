"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../../../components/ui/button";
import {
  ArrowLeft,
  ClipboardCheck,
  Check,
  X,
  Clock,
  MapPin,
  PlusCircle,
  Pencil,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";

type Tipo = "CREATE" | "UPDATE" | "DELETE";
type Status = "PENDENTE" | "APROVADO" | "RECUSADO";

interface Solicitacao {
  id: number;
  recurso: "NOTICIA";
  tipo: Tipo;
  status: Status;
  noticiaId: number | null;
  unidadeId: number | null;
  unidadeIds: number[];
  unidade?: { id: number; nome: string } | null;
  titulo: string | null;
  conteudo: string | null;
  imagem: string | null;
  imagemAntiga: string | null;
  solicitanteId: string;
  solicitanteNome: string;
  revisorId: string | null;
  revisorNome: string | null;
  motivoRecusa: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  initialSolicitacoes: Solicitacao[];
  userRole: "OWNER" | "ADMIN" | "NEWSONLY" | "MESSAGENEWS";
  userId: string;
  userUnidadeId: number | null;
}

function imagemUrl(nome?: string | null) {
  if (!nome) return "";
  return `/admin/api/uploads/noticias/${nome}`;
}

const tipoLabel: Record<Tipo, string> = {
  CREATE: "Nova notícia",
  UPDATE: "Edição de notícia",
  DELETE: "Exclusão de notícia",
};

const tipoIcon: Record<Tipo, any> = {
  CREATE: PlusCircle,
  UPDATE: Pencil,
  DELETE: Trash2,
};

export default function NoticiasSolicitacoesClient({
  initialSolicitacoes,
  userRole,
  userId,
}: Props) {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>(initialSolicitacoes);
  const [filtro, setFiltro] = useState<Status | "TODAS">("PENDENTE");
  const [processandoId, setProcessandoId] = useState<number | null>(null);
  const router = useRouter();

  const podeRevisar = userRole === "OWNER" || userRole === "ADMIN" || userRole === "MESSAGENEWS";
  const listaFiltrada = solicitacoes.filter((s) => filtro === "TODAS" || s.status === filtro);
  const pendentesCount = solicitacoes.filter((s) => s.status === "PENDENTE").length;

  const revisar = async (id: number, acao: "aprovar" | "recusar") => {
    let motivo: string | undefined;
    if (acao === "recusar") {
      motivo = prompt("Motivo da recusa (opcional):") || undefined;
    } else if (!confirm("Confirmar aprovação desta solicitação?")) {
      return;
    }

    setProcessandoId(id);
    try {
      const res = await fetch(`/admin/api/noticias/solicitacoes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ acao, motivo }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(`Erro: ${err.error || "Falha ao processar"}`);
        return;
      }

      const atualizada = await res.json();
      setSolicitacoes((prev) => prev.map((s) => (s.id === id ? { ...s, ...atualizada } : s)));
      router.refresh();
    } catch {
      alert("Erro de conexão");
    } finally {
      setProcessandoId(null);
    }
  };

  const cancelar = async (id: number) => {
    if (!confirm("Cancelar esta solicitação?")) return;

    setProcessandoId(id);
    try {
      const res = await fetch(`/admin/api/noticias/solicitacoes/${id}`, { method: "DELETE" });

      if (!res.ok) {
        const err = await res.json();
        alert(`Erro: ${err.error || "Falha ao cancelar"}`);
        return;
      }

      setSolicitacoes((prev) => prev.filter((s) => s.id !== id));
    } catch {
      alert("Erro de conexão");
    } finally {
      setProcessandoId(null);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-gray-100 dark:border-neutral-800/60 pb-6">
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
              <ClipboardCheck size={18} />
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {podeRevisar ? "Solicitações de Notícias" : "Minhas Solicitações"}
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {podeRevisar
                  ? "Aprove ou recuse os pedidos de gerenciamento enviados."
                  : "Acompanhe o status das notícias que você solicitou."}
              </p>
            </div>
          </div>
        </div>

        {pendentesCount > 0 && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-xl border border-blue-100 dark:border-blue-900/40 w-fit">
            <Clock className="w-3.5 h-3.5" />
            {pendentesCount} pendente{pendentesCount > 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {(["PENDENTE", "APROVADO", "RECUSADO", "TODAS"] as const).map((opt) => (
          <button
            key={opt}
            onClick={() => setFiltro(opt)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
              filtro === opt
                ? "bg-blue-600 border-blue-600 text-white"
                : "bg-white dark:bg-neutral-900/40 border-gray-200 dark:border-neutral-800 text-gray-500 hover:border-blue-300"
            }`}
          >
            {opt === "TODAS" ? "Todas" : opt.charAt(0) + opt.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {listaFiltrada.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-neutral-900/20 rounded-2xl border border-gray-100 dark:border-neutral-800/80">
          <ClipboardCheck className="w-8 h-8 text-gray-300 dark:text-neutral-700 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">Nenhuma solicitação por aqui</h4>
          <p className="text-xs text-gray-400 dark:text-gray-500 max-w-xs mx-auto mt-0.5">
            Quando novas solicitações forem enviadas, elas aparecerão nesta lista.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {listaFiltrada.map((s) => {
            const Icone = tipoIcon[s.tipo];
            const processando = processandoId === s.id;
            const podeCancelar = s.solicitanteId === userId && s.status === "PENDENTE";

            return (
              <div
                key={s.id}
                className="p-5 bg-white dark:bg-neutral-900/40 rounded-2xl border border-gray-100 dark:border-neutral-800/80 relative"
              >
                {processando && (
                  <div className="absolute inset-0 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-sm flex items-center justify-center rounded-2xl z-20">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
                  </div>
                )}

                <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                  <div className="flex items-center gap-2.5">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                      <Icone size={15} />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-gray-900 dark:text-white">{tipoLabel[s.tipo]}</p>
                      <p className="text-[10px] text-gray-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {s.unidade?.nome || "Sem unidade"} · por {s.solicitanteNome} ·{" "}
                        {new Date(s.createdAt).toLocaleString("pt-BR")}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase border ${
                      s.status === "PENDENTE"
                        ? "bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400 border-yellow-100 dark:border-yellow-900/40"
                        : s.status === "APROVADO"
                        ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40"
                        : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-100 dark:border-red-900/40"
                    }`}
                  >
                    {s.status}
                  </span>
                </div>

                {s.tipo === "DELETE" ? (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Solicita a exclusão da notícia <strong>&ldquo;{s.noticiaId ? `#${s.noticiaId}` : ""}&rdquo;</strong>.
                  </p>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3 items-start">
                    {s.imagem && (
                      <div className="w-full sm:w-24 h-28 sm:h-24 rounded-xl bg-gray-50 dark:bg-neutral-950 border border-gray-150 dark:border-neutral-800 shrink-0 overflow-hidden flex items-center justify-center">
                        <img src={imagemUrl(s.imagem)} alt={s.titulo || ""} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="space-y-1 min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white break-words">{s.titulo}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed break-words whitespace-pre-wrap">
                        {s.conteudo}
                      </p>
                      {!s.imagem && s.tipo === "UPDATE" && (
                        <p className="text-[10px] text-gray-400 flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" /> Mantém a imagem atual
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {s.status === "RECUSADO" && s.motivoRecusa && (
                  <p className="mt-3 text-[11px] text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 rounded-lg px-3 py-2 border border-red-100 dark:border-red-900/30">
                    Motivo da recusa: {s.motivoRecusa}
                  </p>
                )}

                {s.status !== "PENDENTE" && s.revisorNome && (
                  <p className="mt-2 text-[10px] text-gray-400">
                    Revisado por {s.revisorNome} em {new Date(s.updatedAt).toLocaleString("pt-BR")}
                  </p>
                )}

                {s.status === "PENDENTE" && (
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-neutral-800/60">
                    {podeRevisar && (
                      <>
                        <Button
                          onClick={() => revisar(s.id, "aprovar")}
                          size="sm"
                          className="rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white gap-1.5"
                        >
                          <Check className="w-3.5 h-3.5" /> Aprovar
                        </Button>
                        <Button
                          onClick={() => revisar(s.id, "recusar")}
                          size="sm"
                          variant="outline"
                          className="rounded-xl text-xs font-semibold text-red-600 border-red-200 hover:bg-red-50 gap-1.5"
                        >
                          <X className="w-3.5 h-3.5" /> Recusar
                        </Button>
                      </>
                    )}
                    {podeCancelar && (
                      <Button
                        onClick={() => cancelar(s.id)}
                        size="sm"
                        variant="ghost"
                        className="rounded-xl text-xs font-semibold text-gray-500"
                      >
                        Cancelar solicitação
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}