export const dynamic = "force-dynamic";
export const revalidate = 0;

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import Layout from "@/src/components/Layout";
import NoticiasClient from "./noticias-client";
import type { AppUserRole } from "@/src/types/user";

export default async function GerenciarNoticiasPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) redirect("/admin");

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, unidadeId: true },
  });

  if (!dbUser) {
    redirect("/admin/authenticated");
  }

  const allowedRoles: AppUserRole[] = ["OWNER", "NEWSONLY", "MESSAGENEWS"];
  if (!allowedRoles.includes(dbUser.role as AppUserRole)) {
    redirect("/admin/authenticated");
  }

  const noticias = await prisma.noticia.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <Layout>
      <NoticiasClient
        initialNoticias={noticias as any[]}
        userRole={dbUser.role as "OWNER" | "NEWSONLY" | "MESSAGENEWS"}
        userUnidadeId={dbUser.unidadeId || null}
      />
    </Layout>
  );
}