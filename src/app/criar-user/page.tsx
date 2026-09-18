// src/app/criar-user/page.tsx
import { prisma } from "../../lib/prisma";
import { SignupForm } from "./_components/signup-form";
import { UserPlus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CriarUserPage() {
  const unidades = await prisma.unidade.findMany({
    select: { id: true, nome: true },
    orderBy: { nome: "asc" },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/50 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-neutral-800/80 dark:bg-neutral-900/40 sm:p-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-green-500/10 text-green-600 dark:text-green-400">
              <UserPlus size={18} />
            </span>

            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Criar Novo Usuário
            </h1>
          </div>

          <p className="pl-10 text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
            Preencha as credenciais essenciais e defina as permissões operacionais do colaborador.
          </p>
        </div>

        <SignupForm unidades={unidades} />
      </div>
    </div>
  );
}