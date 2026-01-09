// src/app/admin/authenticated/usuarios/usuarios-client.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "../../../../components/ui/button";
import { LoadingOverlay } from "../../../../components/ui/loading-overlay";
import { UsuarioRow } from "./usuario-row";

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
  usuarios: Usuario[];
  unidades: Unidade[];
};

export function UsuariosClient({ usuarios, unidades }: Props) {
  const [loading, setLoading] = useState(false);

  return (
    <div className="container mx-auto min-h-screen py-10 space-y-6">
      <LoadingOverlay show={loading} text="Processando..." />

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
          <UsuarioRow
            key={u.id}
            usuario={u}
            unidades={unidades}
            setGlobalLoading={setLoading}
          />
        ))}
      </div>
    </div>
  );
}
