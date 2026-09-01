// src/app/admin/authenticated/usuarios/page.tsx
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import Layout from "@/src/components/Layout";
import { UsuariosClient } from "./usuarios-client";
import type {
  AppUserRole,
  Usuario,
} from "@/src/types/user";

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

  // ✅ REMOVIDO: Promise.all duplicado e variável não usada
  const [usuariosRaw, unidades] = await Promise.all([
    prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        unidade: true,
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    }),
    prisma.unidade.findMany({
      orderBy: { nome: "asc" },
    }),
  ]);

  const usuarios: Usuario[] = usuariosRaw.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    roles: u.userRoles.map(
      (assignment) => assignment.role.name as AppUserRole,
    ),
    unidadeId: u.unidadeId,
    unidade: u.unidade,
  }));

  return (
    <Layout>
      <UsuariosClient usuarios={usuarios} unidades={unidades} />
    </Layout>
  );
}