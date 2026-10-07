"use client";

import Layout from "../../components/Layout";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../../components/ui/button";
import { useRouter } from "next/navigation";
import { Mail, Edit } from "lucide-react";
import MapaBrasil from "../../components/MapaBrasil";

export default function Emails() {
  const router = useRouter();

  return (
    <Layout>
      <div className="container max-w-6xl mx-auto py-8 px-4">
        {/* Header com Ícone Embalado, Título e Ação Admin */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <span className="flex items-center justify-center w-14 h-14 rounded-2xl shrink-0 shadow-sm bg-purple-50 dark:bg-purple-900/30 text-purple-400 dark:text-purple-400">
              <Mail size={30} />
            </span>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                E-mails Corporativos
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-0.5">
                Selecione uma unidade no menu ou interaja com o mapa para visualizar os contatos
              </p>
            </div>
          </div>

          {/* Botão de Edição Alinhado */}
          <Link href="/admin" passHref>
            <Button className="gap-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-sm transition-all duration-300">
              <Edit size={16} />
              Editar e-mails
            </Button>
          </Link>
        </div>

        {/* Container do Mapa e Menu Unificado */}
        <section className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-3xl p-6 shadow-sm">
          <MapaBrasil basePath="/emails" />
        </section>
      </div>
    </Layout>
  );
}