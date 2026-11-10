"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

import { Button } from "../../../../../components/ui/button";
import type { AppUserRole } from "@/src/types/user";
import { categoriaCores } from "@/src/lib/categoria-cor";

type Tipo =
  | "CREATE"
  | "UPDATE"
  | "DELETE";

type Status =
  | "PENDENTE"
  | "APROVADO"
  | "RECUSADO"
  | "CANCELADO";

type Filtro = Status | "TODAS";

type Solicitacao = {
  id: number;
  recurso: "NOTICIA";
  tipo: Tipo;
  status: Status;
  noticiaId: number | null;
  unidadeId: number | null;
  unidadeIds: number[];
  unidade?: {
    id: number;
    nome: string;
  } | null;
  titulo: string | null;
  conteudo: string | null;
  categorias: {
    id: number;
    nome: string;
    cor: string | null;
  }[];
  imagem: string | null;
  imagemAntiga: string | null;
  solicitanteId: string;
  solicitanteNome: string;
  revisorId: string | null;
  revisorNome: string | null;
  motivoRecusa: string | null;
  createdAt: string;
  updatedAt: string;
};

type Props = {
  initialSolicitacoes: Solicitacao[];
  userRoles: AppUserRole[];
  userId: string;
  userUnidadeId: number | null;
};

const tipoLabel: Record<Tipo, string> = {
  CREATE: "Nova notícia",
  UPDATE: "Edição de notícia",
  DELETE: "Exclusão de notícia",
};

const tipoIcon: Record<
  Tipo,
  typeof PlusCircle
> = {
  CREATE: PlusCircle,
  UPDATE: Pencil,
  DELETE: Trash2,
};

function imagemUrl(nome?: string | null) {
  if (!nome) {
    return "";
  }

  return `/admin/api/uploads/noticias/${nome}`;
}

function CategoriasTags({
  categorias,
}: {
  categorias: Solicitacao["categorias"];
}) {
  if (categorias.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {categorias.map((categoria) => {
        const cores = categoriaCores(categoria.cor);
        return (
          <span
            key={categoria.id}
            className="rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
            style={{ backgroundColor: cores.soft, color: cores.solid }}
          >
            {categoria.nome}
          </span>
        );
      })}
    </div>
  );
}

export default function NoticiasSolicitacoesClient({
  initialSolicitacoes,
  userRoles,
  userId,
}: Props) {
  const router = useRouter();

  const [solicitacoes, setSolicitacoes] =
    useState<Solicitacao[]>(
      initialSolicitacoes,
    );

  const [filtro, setFiltro] =
    useState<Filtro>("PENDENTE");

  const [processandoId, setProcessandoId] =
    useState<number | null>(null);

  const isOwner =
    userRoles.includes("OWNER");

  const isAdmin =
    userRoles.includes("ADMIN");

  const isMessageNews =
    userRoles.includes("MESSAGENEWS");

  const isNewsOnly =
    userRoles.includes("NEWSONLY");

  const podeRevisar =
    isOwner ||
    isAdmin ||
    isMessageNews;

  const isOnlyNews =
    isNewsOnly &&
    !isOwner &&
    !isAdmin &&
    !isMessageNews;

  const listaFiltrada =
    solicitacoes.filter(
      (solicitacao) =>
        filtro === "TODAS" ||
        solicitacao.status === filtro,
    );

  const pendentesCount =
    solicitacoes.filter(
      (solicitacao) =>
        solicitacao.status === "PENDENTE",
    ).length;

  async function revisar(
    id: number,
    acao: "aprovar" | "recusar",
  ) {
    let motivo: string | undefined;

    if (acao === "recusar") {
      motivo =
        window.prompt(
          "Motivo da recusa (opcional):",
        ) || undefined;
    } else {
      const confirmado = window.confirm(
        "Confirmar aprovação desta solicitação?",
      );

      if (!confirmado) {
        return;
      }
    }

    setProcessandoId(id);

    try {
      const response = await fetch(
        `/admin/api/noticias/solicitacoes/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            acao,
            motivo,
          }),
        },
      );

      const data = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        alert(
          `Erro: ${data?.error ||
          "Falha ao processar solicitação"
          }`,
        );

        return;
      }

      setSolicitacoes((current) =>
        current.map((solicitacao) =>
          solicitacao.id === id
            ? {
              ...solicitacao,
              ...data,
              updatedAt:
                data.updatedAt ??
                new Date().toISOString(),
            }
            : solicitacao,
        ),
      );

      router.refresh();
    } catch {
      alert("Erro de conexão.");
    } finally {
      setProcessandoId(null);
    }
  }

  async function cancelar(id: number) {
    const confirmado = window.confirm(
      "Cancelar esta solicitação?",
    );

    if (!confirmado) {
      return;
    }

    setProcessandoId(id);

    try {
      const response = await fetch(
        `/admin/api/noticias/solicitacoes/${id}`,
        {
          method: "DELETE",
        },
      );

      const data = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        alert(
          `Erro: ${data?.error ||
          "Falha ao cancelar solicitação"
          }`,
        );

        return;
      }

      setSolicitacoes((current) =>
        current.map((solicitacao) =>
          solicitacao.id === id
            ? {
              ...solicitacao,
              status: "CANCELADO",
              updatedAt:
                new Date().toISOString(),
            }
            : solicitacao,
        ),
      );
    } catch {
      alert("Erro de conexão.");
    } finally {
      setProcessandoId(null);
    }
  }

  function renderizarImagem(solicitacao: Solicitacao) {
    if (solicitacao.tipo === "DELETE") {
      if (solicitacao.status === "APROVADO") {
        return (
          <p className="text-[10px] text-gray-400 flex items-center gap-1">
            <ImageIcon className="w-3 h-3" />
            Imagem removida após exclusão
          </p>
        );
      }

      if (
        solicitacao.status === "PENDENTE" ||
        solicitacao.status === "RECUSADO"
      ) {
        if (solicitacao.imagemAntiga) {
          return (
            <div className="w-full sm:w-24 h-28 sm:h-24 rounded-xl bg-gray-50 dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 overflow-hidden">
              <img
                src={imagemUrl(
                  solicitacao.imagemAntiga,
                )}
                alt={
                  solicitacao.titulo ??
                  "Imagem da notícia excluída"
                }
                className="w-full h-full object-cover"
              />
            </div>
          );
        }

        return (
          <p className="text-[10px] text-gray-400 flex items-center gap-1">
            <ImageIcon className="w-3 h-3" />
            Sem imagem
          </p>
        );
      }

      return (
        <p className="text-[10px] text-gray-400 flex items-center gap-1">
          <ImageIcon className="w-3 h-3" />
          Imagem não disponível
        </p>
      );
    }

    if (
      solicitacao.tipo === "CREATE" ||
      solicitacao.tipo === "UPDATE"
    ) {
      if (solicitacao.status === "APROVADO") {
        return (
          <p className="text-[10px] text-gray-400 flex items-center gap-1">
            <ImageIcon className="w-3 h-3" />
            Imagem movida para a notícia
          </p>
        );
      }

      if (
        solicitacao.status === "PENDENTE" ||
        solicitacao.status === "RECUSADO"
      ) {
        if (solicitacao.imagem) {
          return (
            <div className="w-full sm:w-24 h-28 sm:h-24 rounded-xl bg-gray-50 dark:bg-neutral-950 border border-gray-150 dark:border-neutral-800 shrink-0 overflow-hidden flex items-center justify-center">
              <img
                src={imagemUrl(
                  solicitacao.imagem,
                )}
                alt={
                  solicitacao.titulo ??
                  "Imagem da solicitação"
                }
                className="w-full h-full object-cover"
              />
            </div>
          );
        }

        if (solicitacao.tipo === "UPDATE") {
          return (
            <p className="text-[10px] text-gray-400 flex items-center gap-1">
              <ImageIcon className="w-3 h-3" />
              Mantém a imagem atual
            </p>
          );
        }

        return (
          <p className="text-[10px] text-gray-400 flex items-center gap-1">
            <ImageIcon className="w-3 h-3" />
            Sem imagem
          </p>
        );
      }

      return (
        <p className="text-[10px] text-gray-400 flex items-center gap-1">
          <ImageIcon className="w-3 h-3" />
          Imagem não disponível
        </p>
      );
    }

    return null;
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-7 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="flex flex-col gap-5 rounded-2xl border border-gray-100 bg-white/80 p-5 shadow-sm dark:border-neutral-800 dark:bg-[#111a2d]/80 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-10 w-10 rounded-xl text-gray-500 hover:text-gray-900 dark:hover:text-white border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <ClipboardCheck size={21} />
            </span>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
                {podeRevisar
                  ? "Solicitações de Notícias"
                  : "Minhas Solicitações"}
              </h1>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {podeRevisar
                  ? "Aprove ou recuse os pedidos de gerenciamento enviados."
                  : "Acompanhe o status das notícias que você solicitou."}
              </p>
            </div>
          </div>
        </div>

        {pendentesCount > 0 && (
          <span className="inline-flex w-fit items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-600 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-400">
            <Clock className="w-3.5 h-3.5" />

            {pendentesCount} pendente
            {pendentesCount > 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {(
          [
            "PENDENTE",
            "APROVADO",
            "RECUSADO",
            "CANCELADO",
            "TODAS",
          ] as const
        ).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setFiltro(option)}
            className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${filtro === option
              ? "bg-blue-600 border-blue-600 text-white"
              : "bg-white dark:bg-neutral-900/40 border-gray-200 dark:border-neutral-800 text-gray-500 hover:border-blue-300"
              }`}
          >
            {option === "TODAS"
              ? "Todas"
              : option.charAt(0) +
              option.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {listaFiltrada.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white py-20 text-center dark:border-neutral-800/80 dark:bg-neutral-900/20">
          <ClipboardCheck className="mx-auto mb-3 h-10 w-10 text-gray-300 dark:text-neutral-700" />

          <h4 className="text-base font-bold text-gray-800 dark:text-gray-200">
            Nenhuma solicitação por aqui
          </h4>

          <p className="mx-auto mt-1 max-w-md text-sm text-gray-500 dark:text-gray-400">
            Quando novas solicitações forem enviadas,
            elas aparecerão nesta lista.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {listaFiltrada.map((solicitacao) => {
            const Icone =
              tipoIcon[solicitacao.tipo];

            const processando =
              processandoId === solicitacao.id;

            const podeCancelar =
              isOnlyNews &&
              solicitacao.solicitanteId ===
              userId &&
              solicitacao.status ===
              "PENDENTE";

            return (
              <div
                key={solicitacao.id}
                className="relative rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-neutral-800/80 dark:bg-[#111a2d] sm:p-7"
              >
                {processando && (
                  <div className="absolute inset-0 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-sm flex items-center justify-center rounded-2xl z-20">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
                  </div>
                )}

                <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      <Icone size={18} />
                    </span>

                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {tipoLabel[solicitacao.tipo]}
                      </p>

                      <p className="mt-1 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <MapPin className="w-3 h-3" />

                        {solicitacao.unidade?.nome ??
                          solicitacao.unidadeId ??
                          "Sem unidade"}{" "}
                        · por{" "}
                        {solicitacao.solicitanteNome}{" "}
                        ·{" "}
                        {new Date(
                          solicitacao.createdAt,
                        ).toLocaleString("pt-BR")}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`rounded-lg border px-3 py-1.5 text-xs font-bold uppercase ${solicitacao.status ===
                      "PENDENTE"
                      ? "bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400 border-yellow-100 dark:border-yellow-900/40"
                      : solicitacao.status ===
                        "APROVADO"
                        ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/40"
                        : solicitacao.status ===
                          "CANCELADO"
                          ? "bg-gray-50 dark:bg-gray-950/30 text-gray-700 dark:text-gray-400 border-gray-100 dark:border-gray-900/40"
                          : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-100 dark:border-red-900/40"
                      }`}
                  >
                    {solicitacao.status}
                  </span>
                </div>

                {solicitacao.tipo === "DELETE" ? (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Solicita a exclusão da notícia{" "}
                      <strong>
                        &ldquo;
                        {solicitacao.titulo ?? "sem título"}
                        &rdquo;
                      </strong>
                      .
                    </p>

                    {solicitacao.conteudo && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                        {solicitacao.conteudo}
                      </p>
                    )}

                    <CategoriasTags categorias={solicitacao.categorias} />
                    {renderizarImagem(solicitacao)}
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3 items-start">
                    {renderizarImagem(solicitacao)}

                    <div className="space-y-1 min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white break-words">
                        {solicitacao.titulo}
                      </h4>

                      <CategoriasTags categorias={solicitacao.categorias} />
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed break-words whitespace-pre-wrap">
                        {solicitacao.conteudo}
                      </p>
                    </div>
                  </div>
                )}

                {solicitacao.status ===
                  "RECUSADO" &&
                  solicitacao.motivoRecusa && (
                    <p className="mt-3 text-[11px] text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20 rounded-lg px-3 py-2 border border-red-100 dark:border-red-900/30">
                      Motivo da recusa:{" "}
                      {solicitacao.motivoRecusa}
                    </p>
                  )}

                {solicitacao.status !==
                  "PENDENTE" &&
                  solicitacao.revisorNome && (
                    <p className="mt-2 text-[10px] text-gray-400">
                      Revisado por{" "}
                      {solicitacao.revisorNome} em{" "}
                      {new Date(
                        solicitacao.updatedAt,
                      ).toLocaleString("pt-BR")}
                    </p>
                  )}

                {solicitacao.status ===
                  "PENDENTE" && (
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-neutral-800/60">
                      {podeRevisar && (
                        <>
                          <Button
                            type="button"
                            onClick={() =>
                              revisar(
                                solicitacao.id,
                                "aprovar",
                              )
                            }
                            size="sm"
                            className="rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white gap-1.5"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Aprovar
                          </Button>

                          <Button
                            type="button"
                            onClick={() =>
                              revisar(
                                solicitacao.id,
                                "recusar",
                              )
                            }
                            size="sm"
                            variant="outline"
                            className="rounded-xl text-xs font-semibold text-red-600 border-red-200 hover:bg-red-50 gap-1.5"
                          >
                            <X className="w-3.5 h-3.5" />
                            Recusar
                          </Button>
                        </>
                      )}

                      {podeCancelar && (
                        <Button
                          type="button"
                          onClick={() =>
                            cancelar(
                              solicitacao.id,
                            )
                          }
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