"use client";

import { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";

type Usuario = {
  id: string;
  name: string | null;
  email: string;
  role: "OWNER" | "ADMIN";
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
  const [role, setRole] = useState<"OWNER" | "ADMIN">(usuario.role);
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
    } finally {
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
      alert("Senha redefinida.");
    } finally {
      setResetting(false);
      setGlobalLoading(false);
    }
  }

  async function deletar() {
    if (!window.confirm(`Tem certeza que deseja excluir ${usuario.email}?`)) {
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
    } finally {
      setDeleting(false);
      setGlobalLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-5 gap-3 items-center border p-2 rounded border-black md:grid-cols-[1fr_2fr_1fr_1fr_auto]">
      <div>
        <div className="text-xs text-muted-foreground font-bold dark:text-white">Nome</div>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-8 dark:text-white"
        />
      </div>

      <div>
        <div className="text-xs text-muted-foreground font-bold dark:text-white">Email</div>
        <div className="text-sm truncate dark:text-white">{usuario.email}</div>
      </div>

      <div>
        <div className="text-xs text-muted-foreground font-bold dark:text-white">Perfil</div>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "OWNER" | "ADMIN")}
          className="border rounded px-2 py-1 text-sm w-full"
        >
          <option value="ADMIN">Admin</option>
          <option value="OWNER">Owner</option>
        </select>
      </div>

      <div>
        <div className="text-xs text-muted-foreground font-bold dark:text-white">Unidade</div>
        <select
          value={unidadeId}
          onChange={(e) => setUnidadeId(e.target.value)}
          className="border rounded px-2 py-1 text-sm w-full"
        >
          <option value="">Sem unidade</option>
          {unidades.map((u) => (
            <option key={u.id} value={u.id}>
              {u.nome}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 justify-end">
        <Button size="sm" variant="outline" onClick={salvar} disabled={saving} className="bg-blue-500 text-white">
          {saving ? "Salvando..." : "Salvar"}
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={resetSenha}
          disabled={resetting}
          className="bg-yellow-500"
        >
          {resetting ? "Resetando..." : "Resetar senha"}
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={deletar}
          disabled={deleting}
          className="bg-red-500"
        >
          {deleting ? "Excluindo..." : "Excluir"}
        </Button>
      </div>
    </div>
  );
}
