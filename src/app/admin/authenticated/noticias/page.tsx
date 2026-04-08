// src/app/admin/authenticated/noticias/page.tsx
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import Layout from "@/src/components/Layout";
import NoticiasClient from "./noticias-client";
import type { AppUserRole } from "@/src/types/user";

export default async function GerenciarNoticiasPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/admin");

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, unidadeId: true },
  });

  // ✅ Permite OWNER, ADMIN, NEWSONLY, MESSAGENEWS
  const allowedRoles: AppUserRole[] = ["OWNER", "ADMIN", "NEWSONLY", "MESSAGENEWS"];
  if (!dbUser || !allowedRoles.includes(dbUser.role)) {
    redirect("/admin/authenticated");
  }

  const noticias = await prisma.noticia.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <Layout>
      <NoticiasClient
        initialNoticias={noticias}
        userRole={dbUser.role as AppUserRole}
        userUnidadeId={dbUser.unidadeId || null}
      />
    </Layout>
  );
}