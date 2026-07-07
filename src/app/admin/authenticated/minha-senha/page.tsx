// src/app/admin/authenticated/minha-senha/page.tsx
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../../../../lib/auth";
import { ChangePasswordForm } from "./_components/change-password-form";
import { KeyRound } from "lucide-react";

export default async function MinhaSenhaPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/50 dark:bg-neutral-950 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900/40 border border-gray-100 dark:border-neutral-800/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Header Interno do Card */}
        <div className="space-y-2 text-center flex flex-col items-center">
          <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-500/10 text-gray-600 dark:text-gray-400 mb-1">
            <KeyRound size={20} />
          </span>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Alterar Minha Senha
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-[280px]">
            Informe sua credencial atual para validar a operação e escolha uma nova chave de acesso.
          </p>
        </div>

        <ChangePasswordForm />
      </div>
    </div>
  );
}