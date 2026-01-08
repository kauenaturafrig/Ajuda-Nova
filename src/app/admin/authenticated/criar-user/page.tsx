// src/app/admin/authenticated/criar-user/page.tsx
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../../../../lib/auth";
import { SignupForm } from "./_components/signup-form";

export default async function CriarUserPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect("/admin/signin");
  }

  // aqui você pode checar se é OWNER
  if (session.user.role !== "OWNER") {
    redirect("/admin/authenticated");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Criar usuário</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Cadastre um novo usuário administrador ou owner.
          </p>
        </div>

        <SignupForm />
      </div>
    </div>
  );
}
