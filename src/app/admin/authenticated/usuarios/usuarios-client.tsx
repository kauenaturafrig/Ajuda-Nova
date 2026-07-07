// src/app/admin/authenticated/usuarios/usuarios-client.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { LoadingOverlay } from "../../../../components/ui/loading-overlay";
import { UsuarioRow } from "./usuario-row";
import { Usuario } from "@/src/types/usuario"; 
import { ArrowLeft, Users, UserPlus, Search } from "lucide-react";

type Unidade = {
  id: number;
  nome: string;
};

interface Props {
  usuarios: Usuario[];
  unidades: Unidade[];
}

export function UsuariosClient({ usuarios, unidades }: Props) {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  // Filtragem dinâmica por nome ou e-mail
  const usuariosFiltrados = usuarios.filter((u) => {
    const nomeFiltro = u.name?.toLowerCase() || "";
    const emailFiltro = u.email.toLowerCase();
    const termo = searchTerm.toLowerCase();
    
    return nomeFiltro.includes(termo) || emailFiltro.includes(termo);
  });

  return (
    <>
      <LoadingOverlay show={loading} text="Processando..." />

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        
        {/* Topbar / Header Administrativo */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 dark:border-neutral-800/60 pb-6">
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
                <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 shrink-0">
                  <Users size={18} />
                </span>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Controle de Usuários
                </h1>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 pl-12">
              Gerencie níveis de acesso, atribua unidades de operação e redefina credenciais.
            </p>
          </div>

          <div className="pl-12 sm:pl-0 shrink-0">
            <Link href="/admin/authenticated/criar-user">
              <Button className="h-10 gap-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/10 transition-all">
                <UserPlus className="w-4 h-4" />
                Criar Novo Usuário
              </Button>
            </Link>
          </div>
        </div>

        {/* Barra de Pesquisa */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <Input
            type="text"
            placeholder="Buscar usuário por nome ou e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11 rounded-xl border-gray-200 dark:border-neutral-800 text-sm bg-white dark:bg-neutral-900/40 focus-visible:ring-red-500/50"
          />
        </div>

        {/* Feed de Usuários Cadastrados */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-3 rounded-full bg-red-500" />
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Contas Ativas
              </h3>
            </div>
            <span className="text-xs text-gray-500 font-medium">
              Exibindo {usuariosFiltrados.length} de {usuarios.length}
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {usuariosFiltrados.length > 0 ? (
              usuariosFiltrados.map((u) => (
                <UsuarioRow
                  key={u.id}
                  usuario={u}
                  unidades={unidades}
                  setGlobalLoading={setLoading}
                />
              ))
            ) : (
              <div className="text-center py-12 border border-dashed border-gray-200 dark:border-neutral-800 rounded-2xl text-gray-400 text-sm">
                Nenhum usuário encontrado para a busca atual.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}