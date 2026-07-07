"use client";

import { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Shield, Mail, Building, KeyRound, Trash2, Save, User } from "lucide-react";

type UserRole = "OWNER" | "ADMIN" | "MESSAGEONLY" | "NEWSONLY" | "MESSAGENEWS";

type Usuario = {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  unidadeId: number | null;
};

type Unidade = {
  id: number;
  nome: string;
};

type Props = {
  usuario: Usuario;
  unidades: Unidade[];
  setGlobalLoading: (v: boolean) => void;
};

export function UsuarioRow({ usuario, unidades, setGlobalLoading }: Props) {
  const [name, setName] = useState(usuario.name ?? "");
  const [role, setRole] = useState<UserRole>(usuario.role);
  const [unidadeId, setUnidadeId] = useState<string>(
    usuario.unidadeId ? String(usuario.unidadeId) : ""
  );
  
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function salvar() {
    setSaving(true);
    setGlobalLoading(true);
    try {
      await fetch("/admin/api/usuarios", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: usuario.id,
          name,
          role,
          unidadeId: unidadeId ? Number(unidadeId) : null,
        }),
      });
    } finally { // ◄ Corrigido aqui
      setSaving(false);
      setGlobalLoading(false);
    }
  }

  async function resetSenha() {
    const novaSenha = window.prompt(
      `Nova senha para ${usuario.email} (deixe em branco para cancelar):`
    );
    if (!novaSenha) return;

    setResetting(true);
    setGlobalLoading(true);
    try {
      await fetch("/admin/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reset-senha",
          userId: usuario.id,
          newPassword: novaSenha,
        }),
      });
      alert("Senha redefinida com sucesso.");
    } finally { // ◄ Corrigido aqui
      setResetting(false);
      setGlobalLoading(false);
    }
  }

  async function deletar() {
    if (!window.confirm(`Tem certeza que deseja excluir permanentemente ${usuario.email}?`)) {
      return;
    }

    setDeleting(true);
    setGlobalLoading(true);
    try {
      const res = await fetch(`/admin/api/usuarios?id=${usuario.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(`Erro ao excluir usuário: ${err.error ?? res.status}`);
        return;
      }
      window.location.reload();
    } finally { // ◄ Corrigido aqui
      setDeleting(false);
      setGlobalLoading(false);
    }
  }

  return (
    <div className="p-5 bg-white dark:bg-neutral-900/40 rounded-2xl border border-gray-100 dark:border-neutral-800/80 flex flex-col gap-4 transition-all hover:shadow-sm">
      
      {/* Dados do Usuário - Inputs de Texto empilhados */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Coluna Esquerda: Nome e Email */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 dark:text-gray-500 flex items-center gap-1.5 uppercase tracking-wider">
              <User className="w-3.5 h-3.5 text-red-500/70" /> Nome Completo
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Sem nome cadastrado"
              className="rounded-xl h-10 border-gray-200 dark:border-neutral-800 text-xs bg-white dark:bg-neutral-900"
            />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 flex items-center gap-1.5 uppercase tracking-wider">
              <Mail className="w-3.5 h-3.5 text-red-500/70" /> Endereço de Email
            </span>
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 px-1 truncate py-1.5">
              {usuario.email}
            </p>
          </div>
        </div>

        {/* Coluna Direita: Perfil e Unidade */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 dark:text-gray-500 flex items-center gap-1.5 uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5 text-red-500/70" /> Perfil de Acesso
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="flex h-10 w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-xs text-gray-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 transition-all"
            >
              <option value="OWNER">Owner (Acesso Total)</option>
              <option value="ADMIN">Admin</option>
              <option value="MESSAGEONLY">Recados Unidade</option>
              <option value="NEWSONLY">Apenas Notícias</option>
              <option value="MESSAGENEWS">Notícias + Recados Multi</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 dark:text-gray-500 flex items-center gap-1.5 uppercase tracking-wider">
              <Building className="w-3.5 h-3.5 text-red-500/70" /> Unidade Operacional
            </label>
            <select
              value={unidadeId}
              onChange={(e) => setUnidadeId(e.target.value)}
              className="flex h-10 w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-xs text-gray-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 transition-all"
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

      </div>

      {/* Barra Inferior Interna do Card: Botões de Ação */}
      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-gray-100 dark:border-neutral-800/50 pt-3.5 mt-1">
        <Button
          size="sm"
          variant="outline"
          onClick={resetSenha}
          disabled={resetting}
          className="h-8 rounded-lg text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20 border-amber-200/60 dark:border-amber-900/40 gap-1.5"
        >
          <KeyRound className="w-3.5 h-3.5" />
          {resetting ? "Redefinindo..." : "Resetar Senha"}
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={deletar}
          disabled={deleting}
          className="h-8 rounded-lg text-[11px] font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          {deleting ? "Removendo..." : "Excluir"}
        </Button>

        <Button
          size="sm"
          onClick={salvar}
          disabled={saving}
          className="h-8 rounded-lg text-[11px] font-semibold bg-gray-900 dark:bg-neutral-800 hover:bg-gray-800 text-white gap-1.5 px-4"
        >
          <Save className="w-3.5 h-3.5" />
          {saving ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>

    </div>
  );
}