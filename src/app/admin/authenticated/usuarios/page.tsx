// src/app/admin/authenticated/usuarios/page.tsx
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";

export default async function UsuariosPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/admin/signin");

  // apenas OWNER pode gerenciar usuários
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!dbUser || dbUser.role !== "OWNER") {
    redirect("/admin/authenticated");
  }

  const [usuarios, unidades] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: { unidade: true },
    }),
    prisma.unidade.findMany({
      orderBy: { nome: "asc" },
    }),
  ]);

  return (
    <div className="container mx-auto min-h-screen py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-1">Usuários</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie perfis, unidades e senha dos usuários.
          </p>
        </div>
        <Link href="/admin/authenticated/criar-user">
          <Button>Criar novo usuário</Button>
        </Link>
      </div>

      <div className="space-y-2">
        {usuarios.map((u) => (
          <UsuarioRow key={u.id} usuario={u} unidades={unidades} />
        ))}
      </div>
    </div>
  );
}

/**
 * Componente Client para edição inline e reset de senha
 */
"use client";

import { useState } from "react";

type Usuario = Awaited<
  ReturnType<typeof prisma.user.findMany>
>[number];

type Unidade = Awaited<
  ReturnType<typeof prisma.unidade.findMany>
>[number];

function UsuarioRow({ usuario, unidades }: { usuario: Usuario; unidades: Unidade[] }) {
  const [name, setName] = useState(usuario.name ?? "");
  const [role, setRole] = useState<"OWNER" | "ADMIN">(usuario.role as any);
  const [unidadeId, setUnidadeId] = useState<string>(
    usuario.unidadeId ? String(usuario.unidadeId) : ""
  );
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);

  async function salvar() {
    setSaving(true);
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
    setSaving(false);
  }

  async function resetSenha() {
    const novaSenha = window.prompt(
      `Nova senha para ${usuario.email} (deixe em branco para cancelar):`
    );
    if (!novaSenha) return;

    setResetting(true);
    await fetch("/admin/api/usuarios/reset-senha", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: usuario.id,
        newPassword: novaSenha,
      }),
    });
    setResetting(false);
    alert("Senha redefinida.");
  }

  return (
    <div className="grid grid-cols-5 gap-2 items-center border p-2 rounded">
      <div>
        <div className="text-xs text-muted-foreground">Nome</div>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-8"
        />
      </div>

      <div>
        <div className="text-xs text-muted-foreground">Email</div>
        <div className="text-sm truncate">{usuario.email}</div>
      </div>

      <div>
        <div className="text-xs text-muted-foreground">Perfil</div>
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
        <div className="text-xs text-muted-foreground">Unidade</div>
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
        <Button size="sm" variant="outline" onClick={salvar} disabled={saving}>
          {saving ? "Salvando..." : "Salvar"}
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={resetSenha}
          disabled={resetting}
        >
          {resetting ? "Resetando..." : "Resetar senha"}
        </Button>
      </div>
    </div>
  );
}
