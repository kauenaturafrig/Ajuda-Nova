// src/app/admin/authenticated/minha-senha/page.tsx
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../../../../lib/auth";
import { ChangePasswordForm } from "./_components/change-password-form";

export default async function MinhaSenhaPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Alterar minha senha</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Informe sua senha atual e escolha uma nova senha.
          </p>
        </div>

        <ChangePasswordForm />
      </div>
    </div>
  );
}
