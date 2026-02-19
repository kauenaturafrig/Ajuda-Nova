// src/app/admin/authenticated/jornais/page.tsx
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import Layout from "@/src/components/Layout";
import { JornaisClient } from "./jornais-client";

export default async function JornaisPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/admin");

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!dbUser || dbUser.role !== "OWNER") {
    redirect("/admin/authenticated");
  }

  const jornais = await prisma.jornal.findMany({
    orderBy: { dataLancamento: "desc" }
  });

  return (
    <Layout>
      <JornaisClient jornais={jornais} />
    </Layout>
  );
}
