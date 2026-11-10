// src/app/admin/authenticated/usuarios/usuarios-client.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoadingOverlay } from "../../../../components/ui/loading-overlay";
import { UsuarioRow, roleOptions } from "./usuario-row";
import type { AppUserRole, Usuario } from "@/src/types/user";
import {
  ArrowLeft,
  Users,
  UserPlus,
  Search,
  X,
  Shield,
  ShieldCheck,
  Building,
  Globe,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

type Unidade = {
  id: number;
  nome: string;
};

interface Props {
  usuarios: Usuario[];
  unidades: Unidade[];
}

export function UsuariosClient({ usuarios: usuariosIniciais, unidades }: Props) {
  const router = useRouter();

  const [usuarios, setUsuarios] = useState<Usuario[]>(usuariosIniciais);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroRole, setFiltroRole] = useState<AppUserRole | "all">("all");
  const [filtroUnidade, setFiltroUnidade] = useState<string>("all"); // "all" | "global" | id
  const [toast, setToast] = useState<{ tipo: "ok" | "erro"; msg: string } | null>(null);

  // Mantém a lista em sincronia se o servidor mandar dados novos (router.refresh)
  useEffect(() => setUsuarios(usuariosIniciais), [usuariosIniciais]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const notify = (tipo: "ok" | "erro", msg: string) => setToast({ tipo, msg });

  const stats = useMemo(
    () => ({
      total: usuarios.length,
      owners: usuarios.filter((u) => u.roles.includes("OWNER")).length,
      comUnidade: usuarios.filter((u) => u.unidadeId !== null).length,
      globais: usuarios.filter((u) => u.unidadeId === null).length,
    }),
    [usuarios],
  );

  const usuariosFiltrados = useMemo(() => {
    const termo = searchTerm.trim().toLowerCase();

    return usuarios.filter((u) => {
      if (filtroRole !== "all" && !u.roles.includes(filtroRole)) return false;

      if (filtroUnidade === "global" && u.unidadeId !== null) return false;
      if (
        filtroUnidade !== "all" &&
        filtroUnidade !== "global" &&
        u.unidadeId !== Number(filtroUnidade)
      ) {
        return false;
      }

      if (!termo) return true;
      return (
        (u.name?.toLowerCase() || "").includes(termo) ||
        u.email.toLowerCase().includes(termo) ||
        (u.unidade?.nome.toLowerCase() || "").includes(termo)
      );
    });
  }, [usuarios, searchTerm, filtroRole, filtroUnidade]);

  const filtrosAtivos = !!searchTerm || filtroRole !== "all" || filtroUnidade !== "all";

  const limparFiltros = () => {
    setSearchTerm("");
    setFiltroRole("all");
    setFiltroUnidade("all");
  };

  return (
    <>
      <LoadingOverlay show={loading} text="Processando..." />

      <div className="mx-auto w-full max-w-[90rem] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Voltar"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-500 shadow-sm transition-colors hover:text-gray-900 dark:border-neutral-800 dark:bg-neutral-900/40 dark:hover:text-white"
            >
              <ArrowLeft size={18} />
            </button>
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600 shadow-sm dark:bg-red-900/30 dark:text-red-400">
              <Users size={28} />
            </span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Controle de Usuários
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Gerencie níveis de acesso, unidades de operação e credenciais.
              </p>
            </div>
          </div>

          <Link
            href="/admin/authenticated/criar-user"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-sm font-semibold text-white shadow-md shadow-red-500/10 transition-colors hover:bg-red-700"
          >
            <UserPlus size={16} />
            Criar novo usuário
          </Link>
        </header>

        {/* Resumo */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { icon: Users, label: "Usuários", value: stats.total, tone: "bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-gray-300" },
            { icon: ShieldCheck, label: "Owners", value: stats.owners, tone: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400" },
            { icon: Building, label: "Vinculados a unidade", value: stats.comUnidade, tone: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" },
            { icon: Globe, label: "Acesso global", value: stats.globais, tone: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
          ].map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-[#111a2d]"
            >
              <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${s.tone}`}>
                <s.icon size={20} />
              </span>
              <div>
                <p className="text-2xl font-bold leading-none text-gray-900 dark:text-white">{s.value}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-[#111a2d] sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome, e-mail ou unidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-9 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-white"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  aria-label="Limpar busca"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 dark:border-neutral-700 dark:bg-neutral-900">
              <Shield size={15} className="shrink-0 text-gray-400" />
              <select
                value={filtroRole}
                onChange={(e) => setFiltroRole(e.target.value as AppUserRole | "all")}
                className="h-11 cursor-pointer bg-transparent pr-1 text-sm text-gray-900 focus:outline-none dark:text-white"
              >
                <option value="all">Todos os perfis</option>
                {roleOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 dark:border-neutral-700 dark:bg-neutral-900">
              <Building size={15} className="shrink-0 text-gray-400" />
              <select
                value={filtroUnidade}
                onChange={(e) => setFiltroUnidade(e.target.value)}
                className="h-11 cursor-pointer bg-transparent pr-1 text-sm text-gray-900 focus:outline-none dark:text-white"
              >
                <option value="all">Todas as unidades</option>
                <option value="global">Acesso global (sem unidade)</option>
                {unidades.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nome}
                  </option>
                ))}
              </select>
            </div>

            {filtrosAtivos && (
              <button
                type="button"
                onClick={limparFiltros}
                className="h-11 rounded-xl px-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20"
              >
                Limpar
              </button>
            )}
          </div>
        </section>

        {/* Lista */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Contas ativas</h2>
            <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 dark:bg-neutral-800 dark:text-gray-300">
              {usuariosFiltrados.length} de {usuarios.length}
            </span>
          </div>

          {usuariosFiltrados.length > 0 ? (
            <div className="flex flex-col gap-3">
              {usuariosFiltrados.map((u) => (
                <UsuarioRow
                  key={u.id}
                  usuario={u}
                  unidades={unidades}
                  setGlobalLoading={setLoading}
                  notify={notify}
                  onUpdated={(novo) =>
                    setUsuarios((lista) => lista.map((x) => (x.id === novo.id ? novo : x)))
                  }
                  onDeleted={(id) => {
                    setUsuarios((lista) => lista.filter((x) => x.id !== id));
                    router.refresh();
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center dark:border-neutral-800 dark:bg-[#111a2d]">
              <Users size={28} className="mx-auto mb-3 text-gray-300 dark:text-neutral-600" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {usuarios.length === 0
                  ? "Nenhum usuário cadastrado."
                  : "Nenhum usuário encontrado para os filtros atuais."}
              </p>
            </div>
          )}
        </section>
      </div>

      {toast && (
        <div
          role="status"
          className={`fixed bottom-6 right-6 z-[120] flex max-w-sm items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-xl ${
            toast.tipo === "ok" ? "bg-emerald-600" : "bg-red-600"
          }`}
        >
          {toast.tipo === "ok" ? (
            <CheckCircle2 size={16} className="shrink-0" />
          ) : (
            <AlertCircle size={16} className="shrink-0" />
          )}
          {toast.msg}
        </div>
      )}
    </>
  );
}