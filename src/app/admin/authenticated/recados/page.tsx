// src/app/admin/authenticated/recados/page.tsx
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import Layout from "@/src/components/Layout";
import RecadosClient from "./recados-client";
import type { AppUserRole, Recado, Unidade } from "@/src/types/user";

export default async function GerenciarRecadosPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/admin");

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, unidadeId: true },
  });

  // 🚫 BLOQUEIA NEWSONLY - comparação string simples
  if (!dbUser || dbUser.role === "NEWSONLY") {
    redirect("/admin/authenticated");
  }

  const [recadosRaw, unidades] = await Promise.all([
    prisma.recado.findMany({
      orderBy: { createdAt: "desc" },
      include: { unidade: { select: { nome: true } } }
    }),
    prisma.unidade.findMany({
      orderBy: { nome: "asc" }
    }),
  ]);

  // ✅ Transforma para interface Recado
  const recados = recadosRaw.map(recado => ({
    id: recado.id,
    titulo: recado.titulo,
    conteudo: recado.conteudo,
    imagem: recado.imagem || undefined,
    unidadeId: recado.unidadeId,
    unidade: recado.unidade!,
    createdAt: recado.createdAt
  }));

  return (
    <Layout>
      <RecadosClient
        initialRecados={recados}
        initialUnidades={unidades}
        userRole={dbUser.role as AppUserRole} // ✅ TypeScript infere automaticamente
        userUnidadeId={dbUser.unidadeId || null}
      />
    </Layout>
  );
}