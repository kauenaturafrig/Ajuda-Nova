"use client";

import Layout from "../../components/Layout";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowLeft, Phone, Edit } from "lucide-react";
import MapaBrasil from "../../components/MapaBrasil";

export default function Ramais() {
  const router = useRouter();

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-4">
        {/* Topo: Botão Voltar Padronizado */}
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="mb-6 gap-2 text-gray-600 dark:text-gray-300 transition-all duration-300"
        >
          <ArrowLeft size={16} />
          Voltar
        </Button>

        {/* Header com Ícone Embalado, Título e Ação Admin */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <span className="flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-100 dark:bg-neutral-800 shrink-0 shadow-sm p-2.5">
              <Image
                src="/assets/images/icons/icons8-phone-preto.png"
                alt="Ícone Ramais"
                width={28}
                height={28}
                className="dark:invert object-contain"
              />
            </span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Lista de Ramais
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-0.5">
                Consulte os ramais internos navegando pelo mapa ou pelo menu de unidades
              </p>
            </div>
          </div>

          {/* Botão de Edição Padronizado */}
          <Link href="/admin" passHref>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-all duration-300">
              <Edit size={16} />
              Editar ramais
            </Button>
          </Link>
        </div>

        {/* Container do Mapa e Menu Unificado (Mesmo estilo da página de e-mails) */}
        <section className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-3xl p-6 shadow-sm">
          <MapaBrasil basePath="/ramais" />
        </section>
      </div>
    </Layout>
  );
}