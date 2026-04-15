// src/app/admin/authenticated/emails/page.tsx
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import Layout from "../../../../components/Layout";
import EmailsClient from "./emails-client";

export default async function EmailsPage() {
  const sessionUser = await auth.api.getSession({ headers: await headers() });
  if (!sessionUser) redirect("/admin");

  const dbUser = await prisma.user.findUnique({
    where: { id: sessionUser.user.id },
    select: { role: true, unidadeId: true },
  });

  // 🚫 BLOQUEIA NEWSONLY, MESSAGEONLY e MESSAGENEWS - comparação string simples
  if (!dbUser || dbUser.role === "NEWSONLY" || dbUser.role === "MESSAGEONLY" || dbUser.role === "MESSAGENEWS") {
    redirect("/admin/authenticated");
  }

  return (
    <Layout>
      <EmailsClient/>
    </Layout>
  )
  
}
