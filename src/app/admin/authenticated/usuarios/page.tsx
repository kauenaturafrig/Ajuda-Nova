// src/app/admin/authenticated/usuarios/page.tsx
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import Layout from "@/src/components/Layout";
import { UsuariosClient } from "./usuarios-client";
import { Usuario } from "@/src/types/usuario";

// type Usuario = {
//   id: string;
//   name: string | null;
//   email: string;
//   role: string;
//   unidadeId: number | null;
//   unidade: { id: number; nome: string } | null;
// };

export default async function UsuariosPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/admin");

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!dbUser || dbUser.role !== "OWNER") {
    redirect("/admin/authenticated");
  }

  // ✅ REMOVIDO: Promise.all duplicado e variável não usada
  const [usuariosRaw, unidades] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: { unidade: true },
    }),
    prisma.unidade.findMany({
      orderBy: { nome: "asc" },
    }),
  ]);

  const usuarios: Usuario[] = usuariosRaw.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    unidadeId: u.unidadeId,
    unidade: u.unidade,
  }));

  return (
    <Layout>
      <UsuariosClient usuarios={usuarios} unidades={unidades} />
    </Layout>
  );
}