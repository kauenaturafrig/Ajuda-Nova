// src/app/admin/authenticated/page.tsx
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../../../lib/auth";
import { ButtonSignOut } from "./_components/button-signout";

export default async function Authenticated() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/admin/signin");
  }

  const isOwner = session.user.role === "OWNER";

  return (
    <div className="container mx-auto min-h-screen flex flex-col gap-8 py-10">
      <div>
        <h1 className="text-2xl font-bold mb-2">Área administrativa</h1>
        <p className="text-sm text-muted-foreground">
          Usuário logado:{" "}
          <span className="font-semibold">{session.user.name}</span> (
          {isOwner ? "Owner" : "Admin"})
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Email: {session.user.email}
        </p>
        <ButtonSignOut />
      </div>

      <nav className="grid gap-4 md:grid-cols-3">
        <Link
          href="/admin/authenticated/ramais"
          className="block rounded border p-4 hover:bg-muted transition"
        >
          <h2 className="font-semibold mb-1">Ramais</h2>
          <p className="text-sm text-muted-foreground">
            Ver e editar ramais da sua unidade.
          </p>
        </Link>

        <Link
          href="/admin/authenticated/emails"
          className="block rounded border p-4 hover:bg-muted transition"
        >
          <h2 className="font-semibold mb-1">E-mails</h2>
          <p className="text-sm text-muted-foreground">
            Gerenciar lista de e-mails corporativos.
          </p>
        </Link>

        {isOwner && (
          <Link
            href="/admin/authenticated/criar-user"
            className="block rounded border p-4 hover:bg-muted transition"
          >
            <h2 className="font-semibold mb-1">Criar usuário</h2>
            <p className="text-sm text-muted-foreground">
              Cadastrar novos usuários e definir unidade e perfil.
            </p>
          </Link>
        )}
      </nav>
    </div>
  );
}
