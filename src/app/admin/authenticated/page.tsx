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
            className="block rounded border bg-yellow-600 p-4 hover:bg-muted transition h-[100px]"
          >
            <div className="align-middle w-full h-full pt-2">
              <h2 className="font-semibold mb-1 text-white">Ramais</h2>
              <p className="text-sm text-muted-foreground text-white">
                Ver e editar ramais da sua unidade.
              </p>
            </div>
          </Link>
          <Link
            href="/admin/authenticated/emails"
            className="block rounded border bg-purple-600 p-4 hover:bg-muted transition h-[100px]"
          >
            <div className="align-middle w-full h-full pt-2">
              <h2 className="font-semibold mb-1 text-white">E-mails</h2>
              <p className="text-sm text-muted-foreground text-white">
                Gerenciar lista de e-mails corporativos.
              </p>
            </div>
          </Link>
          <Link
            href="/admin/authenticated/minha-senha"
            className="block rounded border bg-green-600 p-4 hover:bg-muted transition h-[100px]"
          >
            <div className="align-middle w-full h-full pt-2">
              <h2 className="font-semibold mb-1 text-white">Minha Senha</h2>
              <p className="text-sm text-muted-foreground text-white">
                Alterar sua senha.
              </p>
            </div>
          </Link>
          {isOwner && (
            <Link
              href="/admin/authenticated/criar-user"
              className="block rounded border bg-black p-4 hover:bg-muted transition h-[100px]"
            >
              <div className="align-middle w-full h-full">
                <h2 className="font-semibold mb-1 text-white">Criar usuário</h2>
                <p className="text-sm text-muted-foreground text-white">
                  Cadastrar novos usuários e definir unidade e perfil.
                </p>
              </div>
            </Link>
          )}
          {isOwner && (
            <Link
              href="/admin/authenticated/usuarios"
              className="block rounded border bg-red-600 p-4 hover:bg-muted transition h-[100px]"
            >
              <div className="align-middle w-full h-full pt-2">
                <h2 className="font-semibold mb-1 text-white">Gerenciar Usuários</h2>
                <p className="text-sm text-muted-foreground text-white">
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
