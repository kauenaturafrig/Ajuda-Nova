// src/app/admin/authenticated/recados/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;
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

  if (!dbUser || dbUser.role === "NEWSONLY") {
    redirect("/admin/authenticated");
  }

  const recadosWhere =
    dbUser.role === "OWNER" || dbUser.role === "MESSAGENEWS"
      ? {} // Vê tudo
      : { unidadeId: dbUser.unidadeId! }; // Só vê da sua unidade

  const [recadosRaw, unidades] = await Promise.all([
    prisma.recado.findMany({
      where: recadosWhere,
      orderBy: { createdAt: "desc" },
      include: {
        unidade: { select: { id: true, nome: true } },
        unidades: {
          include: {
            unidade: { select: { id: true, nome: true } }
          }
        }
      }
    }),
    prisma.unidade.findMany({
      orderBy: { nome: "asc" }
    }),
  ]);

  const recados = recadosRaw.map(recado => ({
    id: recado.id,
    titulo: recado.titulo,
    conteudo: recado.conteudo,
    imagem: recado.imagem || undefined,
    unidadeId: recado.unidadeId,
    unidade: recado.unidade,
    unidadeIds: recado.unidades.map(u => u.unidade.id), // ✅ Array de IDs
    createdAt: recado.createdAt
  }));

  return (
    <Layout>
      <RecadosClient
        initialRecados={recados}
        initialUnidades={unidades}
        userRole={dbUser.role as AppUserRole}
        userUnidadeId={dbUser.unidadeId || null}
      />
    </Layout>
  );
}
