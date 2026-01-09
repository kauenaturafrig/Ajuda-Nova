// src/app/admin/authenticated/usuarios/page.tsx
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import Layout from "@/src/components/Layout";
import { UsuariosClient } from "./usuarios-client";

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

  const [usuarios, unidades] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: { unidade: true },
    }),
    prisma.unidade.findMany({
      orderBy: { nome: "asc" },
    }),
  ]);

  return (
    <Layout>
      <UsuariosClient usuarios={usuarios} unidades={unidades} />
    </Layout>
  );
}
