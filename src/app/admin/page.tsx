// src/app/admin/page.tsx
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../../lib/auth";
import { LoginForm } from "./_components/login-form";
import Layout from "@/src/components/Layout";
import { LockKeyhole } from "lucide-react";

export default async function Home() {
  // se já tiver sessão, manda para /admin/authenticated
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) {
    redirect("/admin/authenticated");
  }

  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-[400px] space-y-6 bg-white dark:bg-neutral-900/40 border border-gray-100 dark:border-neutral-800/80 rounded-2xl p-6 sm:p-8 shadow-sm">
          
          {/* Header do Login */}
          <div className="flex flex-col items-center text-center space-y-2">
            <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 mb-2">
              <LockKeyhole size={20} />
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Painel Administrativo
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-[280px]">
              Insira suas credenciais cadastradas para gerenciar a plataforma.
            </p>
          </div>

          {/* Formulário */}
          <LoginForm />
          
        </div>
      </div>
    </Layout>
  );
}