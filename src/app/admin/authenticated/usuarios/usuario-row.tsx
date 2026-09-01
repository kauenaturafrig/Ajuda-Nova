"use client";

import { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import {
  Shield,
  Mail,
  Building,
  KeyRound,
  Trash2,
  Save,
  User,
} from "lucide-react";
import type {
  AppUserRole,
  Usuario,
} from "@/src/types/user";

const roleOptions: {
  value: AppUserRole;
  label: string;
}[] = [
  {
    value: "OWNER",
    label: "Owner (Acesso Total)",
  },
  {
    value: "ADMIN",
    label: "Admin",
  },
  {
    value: "MESSAGEONLY",
    label: "Recados Unidade",
  },
  {
    value: "NEWSONLY",
    label: "Apenas Notícias",
  },
  {
    value: "MESSAGENEWS",
    label: "Notícias + Recados Multi",
  },
  {
    value: "EVENTS",
    label: "Eventos",
  },
  {
    value: "EXTENSION",
    label: "Ramais",
  },
  {
    value: "EMAIL",
    label: "Emails",
  }
];

type Unidade = {
  id: number;
  nome: string;
};

type Props = {
  usuario: Usuario;
  unidades: Unidade[];
  setGlobalLoading: (value: boolean) => void;
};

export function UsuarioRow({
  usuario,
  unidades,
  setGlobalLoading,
}: Props) {
  const [name, setName] = useState(usuario.name ?? "");
  const [roles, setRoles] = useState<AppUserRole[]>(
    usuario.roles,
  );

  const [unidadeId, setUnidadeId] = useState<string>(
    usuario.unidadeId !== null
      ? String(usuario.unidadeId)
      : "",
  );

  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Verifica se OWNER está selecionado
  const isOwnerSelected = roles.includes("OWNER");

  function toggleRole(role: AppUserRole) {
    setRoles((currentRoles) => {
      // Se for marcar OWNER, desmarca todas as outras
      if (role === "OWNER" && !currentRoles.includes("OWNER")) {
        return ["OWNER"];
      }

      // Se for desmarcar OWNER, permite voltar ao estado anterior
      if (role === "OWNER" && currentRoles.includes("OWNER")) {
        return currentRoles.filter(
          (currentRole) => currentRole !== role,
        );
      }

      // Se OWNER já está marcado e tenta marcar outra role, ignora
      if (currentRoles.includes("OWNER") && role !== "OWNER") {
        return currentRoles;
      }

      // Comportamento normal para outras roles
      if (currentRoles.includes(role)) {
        return currentRoles.filter(
          (currentRole) => currentRole !== role,
        );
      }

      return [...currentRoles, role];
    });
  }

  async function salvar() {
    if (roles.length === 0) {
      alert("Selecione pelo menos uma role.");
      return;
    }

    setSaving(true);
    setGlobalLoading(true);

    try {
      const res = await fetch("/admin/api/usuarios", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: usuario.id,
          name,
          roles,
          unidadeId: unidadeId
            ? Number(unidadeId)
            : null,
        }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));

        alert(
          `Erro ao salvar usuário: ${
            error.error ?? res.status
          }`,
        );

        return;
      }

      alert("Usuário atualizado com sucesso.");
    } finally {
      setSaving(false);
      setGlobalLoading(false);
    }
  }

  async function resetSenha() {
    const novaSenha = window.prompt(
      `Nova senha para ${usuario.email} (deixe em branco para cancelar):`,
    );

    if (!novaSenha) {
      return;
    }

    setResetting(true);
    setGlobalLoading(true);

    try {
      const res = await fetch("/admin/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "reset-senha",
          userId: usuario.id,
          newPassword: novaSenha,
        }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));

        alert(
          `Erro ao redefinir senha: ${
            error.error ?? res.status
          }`,
        );

        return;
      }

      alert("Senha redefinida com sucesso.");
    } finally {
      setResetting(false);
      setGlobalLoading(false);
    }
  }

  async function deletar() {
    const confirmed = window.confirm(
      `Tem certeza que deseja excluir permanentemente ${usuario.email}?`,
    );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setGlobalLoading(true);

    try {
      const res = await fetch(
        `/admin/api/usuarios?id=${usuario.id}`,
        {
          method: "DELETE",
        },
      );

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));

        alert(
          `Erro ao excluir usuário: ${
            error.error ?? res.status
          }`,
        );

        return;
      }

      window.location.reload();
    } finally {
      setDeleting(false);
      setGlobalLoading(false);
    }
  }

  return (
    <div className="p-5 bg-white dark:bg-neutral-900/40 rounded-2xl border border-gray-100 dark:border-neutral-800/80 flex flex-col gap-4 transition-all hover:shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nome e e-mail */}
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 dark:text-gray-500 flex items-center gap-1.5 uppercase tracking-wider">
              <User className="w-3.5 h-3.5 text-red-500/70" />
              Nome Completo
            </label>

            <Input
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Sem nome cadastrado"
              className="rounded-xl h-10 border-gray-200 dark:border-neutral-800 text-xs bg-white dark:bg-neutral-900"
            />
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 flex items-center gap-1.5 uppercase tracking-wider">
              <Mail className="w-3.5 h-3.5 text-red-500/70" />
              Endereço de Email
            </span>

            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 px-1 truncate py-1.5">
              {usuario.email}
            </p>
          </div>
        </div>

        {/* Roles e unidade */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 dark:text-gray-500 flex items-center gap-1.5 uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5 text-red-500/70" />
              Perfis de Acesso
            </label>

            <div className="grid grid-cols-1 gap-2 rounded-xl border border-gray-200 dark:border-neutral-800 p-3">
              {roleOptions.map((option) => {
                const checked = roles.includes(option.value);
                const isDisabled = isOwnerSelected && option.value !== "OWNER";

                return (
                  <label
                    key={option.value}
                    className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs ${
                      isDisabled
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800"
                    } text-gray-700 dark:text-gray-300`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        toggleRole(option.value)
                      }
                      disabled={saving || deleting || resetting || isDisabled}
                      className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />

                    <span>{option.label}</span>
                  </label>
                );
              })}
            </div>

            {roles.length === 0 && (
              <p className="text-[11px] text-red-500">
                Selecione pelo menos uma role.
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-400 dark:text-gray-500 flex items-center gap-1.5 uppercase tracking-wider">
              <Building className="w-3.5 h-3.5 text-red-500/70" />
              Unidade Operacional
            </label>

            <select
              value={unidadeId}
              onChange={(event) =>
                setUnidadeId(event.target.value)
              }
              className="flex h-10 w-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-xs text-gray-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 transition-all"
            >
              <option value="">
                Nenhuma unidade vinculada (Global)
              </option>

              {unidades.map((unidade) => (
                <option
                  key={unidade.id}
                  value={unidade.id}
                >
                  {unidade.nome}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Ações */}
      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-gray-100 dark:border-neutral-800/50 pt-3.5 mt-1">
        <Button
          size="sm"
          variant="outline"
          onClick={resetSenha}
          disabled={resetting || saving || deleting}
          className="h-8 rounded-lg text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20 border-amber-200/60 dark:border-amber-900/40 gap-1.5"
        >
          <KeyRound className="w-3.5 h-3.5" />
          {resetting
            ? "Redefinindo..."
            : "Resetar Senha"}
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={deletar}
          disabled={deleting || saving || resetting}
          className="h-8 rounded-lg text-[11px] font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          {deleting ? "Removendo..." : "Excluir"}
        </Button>

        <Button
          size="sm"
          onClick={salvar}
          disabled={saving || deleting || resetting}
          className="h-8 rounded-lg text-[11px] font-semibold bg-gray-900 dark:bg-neutral-800 hover:bg-gray-800 text-white gap-1.5 px-4"
        >
          <Save className="w-3.5 h-3.5" />
          {saving
            ? "Salvando..."
            : "Salvar Alterações"}
        </Button>
      </div>
    </div>
  );
}