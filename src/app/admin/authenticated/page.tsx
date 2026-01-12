// src/app/admin/authenticated/page.tsx
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { ButtonSignOut } from "./_components/button-signout";
import Layout from "@/src/components/Layout";

export default async function Authenticated() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/admin");
  }

  // carrega o usuário completo do Prisma, incluindo role/unidade
  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, unidadeId: true },
  });

  if (!dbUser) {
    redirect("/admin");
  }

  const isOwner = dbUser.role === "OWNER";

  return (
    <Layout>
      <div className="container mx-auto min-h-screen flex flex-col gap-8 py-10 w-[90%]">
        <div>
          <div className="flex justify-between mb-6">
            <h1 className="font-bold text-5xl dark:text-white pr-4 mb-2">Área administrativa</h1>
            <div className="flex">
              <div className="mr-5">
                <p className="text-sm text-muted-foreground dark:text-white">
                  <strong>Usuário logado:</strong>{" "}
                  <span>{session.user.name}</span>{" "}
                  ({isOwner ? "Owner" : "Admin"})
                </p>
                <p className="text-sm text-muted-foreground mb-4 dark:text-white">
                  <strong>Email:</strong> {session.user.email}
                </p>
              </div>
              <ButtonSignOut />
            </div>
          </div>
        </div>
        <nav className="grid gap-4 md:grid-cols-3">
          <Link
            href="/admin/authenticated/ramais"
            className="group h-[250px] rounded-lg border bg-yellow-600 text-white 
               transition-transform duration-200 hover:scale-105 hover:shadow-lg"
          >
            <div className="flex h-full flex-col items-center justify-center text-center px-4">
              <img
                src="/assets/images/icons/icons8-phone-branco.png"
                alt="Ramais"
                className="w-[90px] h-[90px] mb-3 transition-transform duration-200 group-hover:scale-110"
              />
              <h2 className="font-semibold text-3xl mb-2">Ramais</h2>
              <p className="text-sm opacity-90">
                Ver e editar ramais da sua unidade.
              </p>
            </div>
          </Link>

          <Link
            href="/admin/authenticated/emails"
            className="group h-[250px] rounded-lg border bg-purple-600 text-white 
               transition-transform duration-200 hover:scale-105 hover:shadow-lg"
          >
            <div className="flex h-full flex-col items-center justify-center text-center px-4">
              <img
                src="/assets/images/icons/icons8-mail-branco.png"
                alt="E-mails"
                className="w-[90px] h-[90px] mb-3 transition-transform duration-200 group-hover:scale-110"
              />
              <h2 className="font-semibold text-3xl mb-2">E-mails</h2>
              <p className="text-sm opacity-90">
                Gerenciar lista de e-mails corporativos.
              </p>
            </div>
          </Link>

          <Link
            href="/admin/authenticated/minha-senha"
            className="group h-[250px] rounded-lg border bg-green-600 text-white 
               transition-transform duration-200 hover:scale-105 hover:shadow-lg"
          >
            <div className="flex h-full flex-col items-center justify-center text-center px-4">
              <img
                src="/assets/images/icons/icons8-password-branco.png"
                alt="Minha senha"
                className="w-[90px] h-[90px] mb-3 transition-transform duration-200 group-hover:scale-110"
              />
              <h2 className="font-semibold text-3xl mb-2">Minha senha</h2>
              <p className="text-sm opacity-90">
                Alterar sua senha.
              </p>
            </div>
          </Link>

          {isOwner && (
            <Link
              href="/admin/authenticated/criar-user"
              className="group h-[250px] rounded-lg border bg-black text-white 
                 transition-transform duration-200 hover:scale-105 hover:shadow-lg"
            >
              <div className="flex h-full flex-col items-center justify-center text-center px-4">
                <img
                  src="/assets/images/icons/icons8-user-plus-branco.png"
                  alt="Criar usuário"
                  className="w-[90px] h-[90px] mb-3 transition-transform duration-200 group-hover:scale-110"
                />
                <h2 className="font-semibold text-3xl mb-2">Criar usuário</h2>
                <p className="text-sm opacity-90">
                  Cadastrar novos usuários e definir unidade e perfil.
                </p>
              </div>
            </Link>
          )}

          {isOwner && (
            <Link
              href="/admin/authenticated/usuarios"
              className="group h-[250px] rounded-lg border bg-red-600 text-white 
                 transition-transform duration-200 hover:scale-105 hover:shadow-lg"
            >
              <div className="flex h-full flex-col items-center justify-center text-center px-4">
                <img
                  src="/assets/images/icons/icons8-users-branco.png"
                  alt="Gerenciar usuários"
                  className="w-[90px] h-[90px] mb-3 transition-transform duration-200 group-hover:scale-110"
                />
                <h2 className="font-semibold text-3xl mb-2">Gerenciar Usuários</h2>
                <p className="text-sm opacity-90">
                  Gerenciar usuários e definir unidade e perfil.
                </p>
              </div>
            </Link>
          )}
        </nav>
      </div>
    </Layout>
  );
}
