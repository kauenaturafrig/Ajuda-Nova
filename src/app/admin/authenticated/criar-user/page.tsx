// src/app/admin/authenticated/criar-user/page.tsx
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import { SignupForm } from "./_components/signup-form";
import { UserPlus } from "lucide-react";

export default async function CriarUserPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/admin");

  const dbUser = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      userRoles: {
        select: {
          role: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  const isOwner = dbUser?.userRoles.some(
    (assignment) => assignment.role.name === "OWNER",
  );

  if (!isOwner) {
    redirect("/admin/authenticated");
  }

  const unidades = await prisma.unidade.findMany({
    select: { id: true, nome: true },
    orderBy: { nome: "asc" },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/50 dark:bg-neutral-950 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-lg bg-white dark:bg-neutral-900/40 border border-gray-100 dark:border-neutral-800/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">

        {/* Header Interno do Card */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400">
              <UserPlus size={18} />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Criar Novo Usuário
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 pl-10">
            Preencha as credenciais essenciais e defina as permissões operacionais do colaborador.
          </p>
        </div>

        {/* Formulário de Cadastro */}
        <SignupForm unidades={unidades} />
      </div>
    </div>
  );
}