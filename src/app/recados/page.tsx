// src/app/recados/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { prisma } from "@/src/lib/prisma";
import { headers } from "next/headers";
import { getUnidadeByIp } from "@/src/lib/getUnidadeByIp";
import { Megaphone, ShieldAlert } from "lucide-react";
import RecadosClient from "./recados-client";

export default async function RecadosPage() {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for") ?? h.get("x-real-ip") ?? h.get("x-forwarded-host");
  const unidadeId = getUnidadeByIp(ip);

  if (!unidadeId) {
    return (
      <div className="mx-auto w-full max-w-[90rem] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto mt-10 max-w-md rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm dark:border-neutral-800 dark:bg-[#111a2d]">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
            <Megaphone className="h-[1.875rem] w-[1.875rem]" />
          </span>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Recados
          </h1>

          <div className="mt-5 flex items-center gap-3 rounded-xl bg-red-50 p-4 text-left dark:bg-red-500/10">
            <ShieldAlert className="h-5 w-5 shrink-0 text-red-500" />
            <div className="min-w-0 text-sm">
              <p className="font-semibold text-red-700 dark:text-red-400">
                Unidade não identificada
              </p>
              <p className="mt-0.5 truncate font-mono text-xs text-red-600/80 dark:text-red-300/80">
                IP: {ip || "N/A"}
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Acesso restrito à intranet.
          </p>
        </div>
      </div>
    );
  }

  const recadosData = await prisma.recado.findMany({
    where: {
      unidades: {
        some: { unidadeId },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      unidade: true,
      unidades: { include: { unidade: true } },
      categorias: {
        where: { ativo: true },
        orderBy: { ordem: "asc" },
        select: { id: true, nome: true, slug: true, cor: true },
      },
    },
  });

  return <RecadosClient initialRecados={recadosData} unidadeId={unidadeId} />;
}