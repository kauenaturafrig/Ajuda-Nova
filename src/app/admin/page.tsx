// src/app/admin/page.tsx
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "../../lib/auth";
import { LoginForm } from "./_components/login-form";
import Layout from "@/src/components/Layout";

export default async function Home() {
  // se já tiver sessão, manda para /admin/authenticated
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    redirect("/admin/authenticated");
  }

  return (
    <Layout>
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Entre com suas credenciais para acessar sua conta
            </p>
          </div>

          <LoginForm />
          
          <div className="text-center text-sm">
            <p>
              Não tem uma conta?{" "}
              <Link
                href="/admin/signup"
                className="font-medium text-primary hover:underline"
              >
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
