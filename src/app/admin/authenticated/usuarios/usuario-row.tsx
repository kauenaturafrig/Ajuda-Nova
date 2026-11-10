// src/app/admin/authenticated/usuarios/usuario-row.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Shield,
  Mail,
  Building,
  KeyRound,
  Trash2,
  Save,
  User,
  ChevronDown,
  Check,
  X,
  Eye,
  EyeOff,
  Copy,
  Wand2,
  AlertTriangle,
  Globe,
} from "lucide-react";
import type { AppUserRole, Usuario } from "@/src/types/user";

export const roleOptions: {
  value: AppUserRole;
  label: string;
  desc: string;
  badge: string;
}[] = [
  {
    value: "OWNER",
    label: "Owner",
    desc: "Acesso total ao sistema",
    badge: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/30",
  },
  {
    value: "ADMIN",
    label: "Admin",
    desc: "Administração geral",
    badge: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-500/30",
  },
  {
    value: "MESSAGEONLY",
    label: "Recados Unidade",
    desc: "Solicita recados da própria unidade",
    badge: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30",
  },
  {
    value: "NEWSONLY",
    label: "Apenas Notícias",
    desc: "Solicita notícias para aprovação",
    badge: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/30",
  },
  {
    value: "MESSAGENEWS",
    label: "Notícias + Recados Multi",
    desc: "Publica e revisa notícias e recados",
    badge: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-300 dark:border-indigo-500/30",
  },
  {
    value: "EVENTS",
    label: "Eventos",
    desc: "Gerencia a agenda de auditorias",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/30",
  },
  {
    value: "EXTENSION",
    label: "Ramais",
    desc: "Gerencia a lista de ramais",
    badge: "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-300 dark:border-cyan-500/30",
  },
  {
    value: "EMAIL",
    label: "Emails",
    desc: "Gerencia a lista de e-mails",
    badge: "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-500/10 dark:text-pink-300 dark:border-pink-500/30",
  },
];

const AVATAR_COLORS = [
  "bg-red-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-violet-500",
  "bg-cyan-500",
  "bg-pink-500",
  "bg-indigo-500",
];

function iniciais(nome: string | null, email: string) {
  const base = (nome?.trim() || email.split("@")[0]).split(/[\s._-]+/).filter(Boolean);
  const a = base[0]?.[0] ?? "?";
  const b = base.length > 1 ? base[base.length - 1][0] : "";
  return (a + b).toUpperCase();
}

function corAvatar(id: string) {
  let soma = 0;
  for (let i = 0; i < id.length; i++) soma += id.charCodeAt(i);
  return AVATAR_COLORS[soma % AVATAR_COLORS.length];
}

function gerarSenha() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  const bytes = new Uint32Array(12);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}

type Unidade = { id: number; nome: string };

type Props = {
  usuario: Usuario;
  unidades: Unidade[];
  setGlobalLoading: (value: boolean) => void;
  notify: (tipo: "ok" | "erro", msg: string) => void;
  onUpdated: (u: Usuario) => void;
  onDeleted: (id: string) => void;
};

export function UsuarioRow({
  usuario,
  unidades,
  setGlobalLoading,
  notify,
  onUpdated,
  onDeleted,
}: Props) {
  const [aberto, setAberto] = useState(false);
  const [name, setName] = useState(usuario.name ?? "");
  const [roles, setRoles] = useState<AppUserRole[]>(usuario.roles);
  const [unidadeId, setUnidadeId] = useState<string>(
    usuario.unidadeId !== null ? String(usuario.unidadeId) : "",
  );

  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [modal, setModal] = useState<"senha" | "excluir" | null>(null);
  const [novaSenha, setNovaSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const ocupado = saving || resetting || deleting;
  const isOwnerSelected = roles.includes("OWNER");

  const dirty =
    name.trim() !== (usuario.name ?? "").trim() ||
    unidadeId !== (usuario.unidadeId !== null ? String(usuario.unidadeId) : "") ||
    roles.length !== usuario.roles.length ||
    roles.some((r) => !usuario.roles.includes(r));

  useEffect(() => {
    if (!modal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !ocupado) setModal(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [modal, ocupado]);

  function toggleRole(role: AppUserRole) {
    setRoles((atual) => {
      // Marcar OWNER desmarca todas as outras
      if (role === "OWNER" && !atual.includes("OWNER")) return ["OWNER"];
      // Desmarcar OWNER
      if (role === "OWNER") return atual.filter((r) => r !== role);
      // Com OWNER marcado, ignora as demais
      if (atual.includes("OWNER")) return atual;
      return atual.includes(role) ? atual.filter((r) => r !== role) : [...atual, role];
    });
  }

  function descartar() {
    setName(usuario.name ?? "");
    setRoles(usuario.roles);
    setUnidadeId(usuario.unidadeId !== null ? String(usuario.unidadeId) : "");
  }

  async function salvar() {
    if (roles.length === 0) {
      notify("erro", "Selecione pelo menos um perfil de acesso.");
      return;
    }

    setSaving(true);
    setGlobalLoading(true);

    try {
      const res = await fetch("/admin/api/usuarios", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: usuario.id,
          name,
          roles,
          unidadeId: unidadeId ? Number(unidadeId) : null,
        }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        notify("erro", `Erro ao salvar usuário: ${error.error ?? res.status}`);
        return;
      }

      const novaUnidade = unidadeId
        ? unidades.find((u) => u.id === Number(unidadeId)) ?? null
        : null;

      onUpdated({
        ...usuario,
        name: name.trim(),
        roles,
        unidadeId: unidadeId ? Number(unidadeId) : null,
        unidade: novaUnidade,
      });
      notify("ok", "Usuário atualizado com sucesso.");
    } catch {
      notify("erro", "Erro de conexão ao salvar o usuário.");
    } finally {
      setSaving(false);
      setGlobalLoading(false);
    }
  }

  async function resetSenha() {
    if (!novaSenha.trim()) return;

    setResetting(true);
    setGlobalLoading(true);

    try {
      const res = await fetch("/admin/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reset-senha",
          userId: usuario.id,
          newPassword: novaSenha,
        }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        notify("erro", `Erro ao redefinir senha: ${error.error ?? res.status}`);
        return;
      }

      notify("ok", `Senha de ${usuario.email} redefinida.`);
      setModal(null);
      setNovaSenha("");
      setMostrarSenha(false);
    } catch {
      notify("erro", "Erro de conexão ao redefinir a senha.");
    } finally {
      setResetting(false);
      setGlobalLoading(false);
    }
  }

  async function deletar() {
    setDeleting(true);
    setGlobalLoading(true);

    try {
      const res = await fetch(`/admin/api/usuarios?id=${usuario.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        notify("erro", `Erro ao excluir usuário: ${error.error ?? res.status}`);
        return;
      }

      setModal(null);
      onDeleted(usuario.id);
      notify("ok", "Usuário excluído.");
    } catch {
      notify("erro", "Erro de conexão ao excluir o usuário.");
    } finally {
      setDeleting(false);
      setGlobalLoading(false);
    }
  }

  const rolesVisiveis = roleOptions.filter((o) => usuario.roles.includes(o.value));

  return (
    <div
      className={`rounded-2xl border bg-white transition-all dark:bg-neutral-900/40 ${
        aberto
          ? "border-gray-200 shadow-md dark:border-neutral-700"
          : "border-gray-100 shadow-sm hover:shadow-md dark:border-neutral-800/80"
      }`}
    >
      {/* Cabeçalho (sempre visível) */}
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        className="flex w-full items-center gap-4 p-4 text-left sm:p-5"
      >
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${corAvatar(usuario.id)}`}
        >
          {iniciais(usuario.name, usuario.email)}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-gray-900 dark:text-white">
            {usuario.name || "Sem nome cadastrado"}
          </span>
          <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
            {usuario.email}
          </span>

          <span className="mt-2 flex flex-wrap items-center gap-1.5">
            {rolesVisiveis.length === 0 ? (
              <span className="rounded-full border border-dashed border-gray-300 px-2 py-0.5 text-[0.6875rem] text-gray-400 dark:border-neutral-700">
                Sem perfil
              </span>
            ) : (
              rolesVisiveis.map((o) => (
                <span
                  key={o.value}
                  className={`rounded-full border px-2 py-0.5 text-[0.6875rem] font-semibold ${o.badge}`}
                >
                  {o.label}
                </span>
              ))
            )}
          </span>
        </span>

        <span className="hidden shrink-0 items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 dark:bg-neutral-800 dark:text-gray-300 md:flex">
          {usuario.unidade ? (
            <>
              <Building size={13} className="text-gray-400" />
              {usuario.unidade.nome}
            </>
          ) : (
            <>
              <Globe size={13} className="text-gray-400" />
              Global
            </>
          )}
        </span>

        <ChevronDown
          size={18}
          className={`shrink-0 text-gray-400 transition-transform duration-200 ${aberto ? "rotate-180" : ""}`}
        />
      </button>

      {/* Edição */}
      {aberto && (
        <div className="space-y-5 border-t border-gray-100 p-4 dark:border-neutral-800 sm:p-5">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
            {/* Dados */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[0.6875rem] font-bold uppercase tracking-wider text-gray-400">
                  <User size={13} className="text-red-500/70" />
                  Nome completo
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sem nome cadastrado"
                  disabled={ocupado}
                  className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/40 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <span className="flex items-center gap-1.5 text-[0.6875rem] font-bold uppercase tracking-wider text-gray-400">
                  <Mail size={13} className="text-red-500/70" />
                  E-mail
                </span>
                <p className="truncate rounded-xl bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-700 dark:bg-neutral-800/60 dark:text-gray-300">
                  {usuario.email}
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-[0.6875rem] font-bold uppercase tracking-wider text-gray-400">
                  <Building size={13} className="text-red-500/70" />
                  Unidade operacional
                </label>
                <select
                  value={unidadeId}
                  onChange={(e) => setUnidadeId(e.target.value)}
                  disabled={ocupado}
                  className="h-10 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500/40 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
                >
                  <option value="">Nenhuma unidade vinculada (Global)</option>
                  {unidades.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Perfis */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-[0.6875rem] font-bold uppercase tracking-wider text-gray-400">
                <Shield size={13} className="text-red-500/70" />
                Perfis de acesso
              </label>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {roleOptions.map((o) => {
                  const marcado = roles.includes(o.value);
                  const bloqueado = isOwnerSelected && o.value !== "OWNER";

                  return (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => toggleRole(o.value)}
                      disabled={ocupado || bloqueado}
                      aria-pressed={marcado}
                      className={`flex items-start gap-3 rounded-xl border p-3 text-left transition-colors ${
                        marcado
                          ? "border-red-300 bg-red-50/60 dark:border-red-500/40 dark:bg-red-500/10"
                          : "border-gray-200 hover:bg-gray-50 dark:border-neutral-800 dark:hover:bg-neutral-800/60"
                      } ${bloqueado ? "cursor-not-allowed opacity-40" : ""}`}
                    >
                      <span
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                          marcado
                            ? "border-red-600 bg-red-600 text-white"
                            : "border-gray-300 dark:border-neutral-600"
                        }`}
                      >
                        {marcado && <Check size={11} strokeWidth={3} />}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-gray-800 dark:text-gray-100">
                          {o.label}
                        </span>
                        <span className="block text-xs text-gray-500 dark:text-gray-400">
                          {o.desc}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {isOwnerSelected && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Owner já inclui todos os acessos; os outros perfis ficam bloqueados.
                </p>
              )}
              {roles.length === 0 && (
                <p className="text-xs font-medium text-red-500">
                  Selecione pelo menos um perfil de acesso.
                </p>
              )}
            </div>
          </div>

          {/* Ações */}
          <div className="flex flex-col gap-3 border-t border-gray-100 pt-4 dark:border-neutral-800/60 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setModal("senha")}
                disabled={ocupado}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-amber-200 px-3 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-50 disabled:opacity-50 dark:border-amber-900/40 dark:text-amber-400 dark:hover:bg-amber-950/20"
              >
                <KeyRound size={14} />
                Resetar senha
              </button>
              <button
                type="button"
                onClick={() => setModal("excluir")}
                disabled={ocupado}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950/20"
              >
                <Trash2 size={14} />
                Excluir
              </button>
            </div>

            <div className="flex items-center gap-2">
              {dirty && (
                <>
                  <span className="hidden text-xs text-amber-600 dark:text-amber-400 sm:inline">
                    Alterações não salvas
                  </span>
                  <button
                    type="button"
                    onClick={descartar}
                    disabled={ocupado}
                    className="h-9 rounded-lg px-3 text-xs font-semibold text-gray-500 transition-colors hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-neutral-800"
                  >
                    Descartar
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={salvar}
                disabled={ocupado || !dirty}
                className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-gray-900 px-4 text-xs font-semibold text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
              >
                <Save size={14} />
                {saving ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: resetar senha */}
      {modal === "senha" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
            onClick={() => !ocupado && setModal(null)}
          />
          <div className="relative w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400">
                  <KeyRound size={20} />
                </span>
                <div className="min-w-0">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">Redefinir senha</h4>
                  <p className="truncate text-sm text-gray-500 dark:text-gray-400">{usuario.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModal(null)}
                aria-label="Fechar"
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800"
              >
                <X size={16} />
              </button>
            </div>

            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Nova senha</label>
            <div className="relative mt-2">
              <input
                autoFocus
                type={mostrarSenha ? "text" : "password"}
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                placeholder="Digite ou gere uma senha"
                className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-3 pr-11 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500/50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
              />
              <button
                type="button"
                onClick={() => setMostrarSenha((v) => !v)}
                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                {mostrarSenha ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setNovaSenha(gerarSenha());
                  setMostrarSenha(true);
                }}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-gray-100 px-3 text-xs font-semibold text-gray-700 hover:bg-gray-200 dark:bg-neutral-800 dark:text-gray-300 dark:hover:bg-neutral-700"
              >
                <Wand2 size={13} />
                Gerar senha
              </button>
              <button
                type="button"
                disabled={!novaSenha}
                onClick={() => {
                  navigator.clipboard?.writeText(novaSenha).then(
                    () => notify("ok", "Senha copiada."),
                    () => notify("erro", "Não foi possível copiar."),
                  );
                }}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-gray-100 px-3 text-xs font-semibold text-gray-700 hover:bg-gray-200 disabled:opacity-40 dark:bg-neutral-800 dark:text-gray-300 dark:hover:bg-neutral-700"
              >
                <Copy size={13} />
                Copiar
              </button>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setModal(null)}
                disabled={ocupado}
                className="h-10 rounded-xl bg-gray-100 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-200 disabled:opacity-50 dark:bg-neutral-800 dark:text-gray-300 dark:hover:bg-neutral-700"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={resetSenha}
                disabled={ocupado || !novaSenha.trim()}
                className="h-10 rounded-xl bg-amber-600 px-4 text-sm font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
              >
                {resetting ? "Redefinindo..." : "Redefinir senha"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: excluir */}
      {modal === "excluir" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="alertdialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
            onClick={() => !ocupado && setModal(null)}
          />
          <div className="relative w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
                <AlertTriangle size={20} />
              </span>
              <div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">Excluir usuário?</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">A exclusão é permanente.</p>
              </div>
            </div>

            <p className="mb-6 rounded-xl bg-gray-50 p-3 text-sm text-gray-700 dark:bg-neutral-800 dark:text-gray-200">
              <span className="font-semibold">{usuario.name || "Sem nome cadastrado"}</span>
              <span className="block text-xs text-gray-500 dark:text-gray-400">{usuario.email}</span>
            </p>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setModal(null)}
                disabled={ocupado}
                className="h-10 rounded-xl bg-gray-100 px-4 text-sm font-semibold text-gray-700 hover:bg-gray-200 disabled:opacity-50 dark:bg-neutral-800 dark:text-gray-300 dark:hover:bg-neutral-700"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={deletar}
                disabled={ocupado}
                className="h-10 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? "Excluindo..." : "Excluir usuário"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}