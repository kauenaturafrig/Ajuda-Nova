"use client";

import Layout from "../../../components/Layout";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { useRouter } from "next/navigation";

export default function CMDHelp() {
  const router = useRouter();
  
  return (
    <Layout>
      <Button
        type="button"
        variant="outline"
        onClick={() => router.back()}
        className="bg-gray-500 text-white mb-5"
      >
        ← Voltar
      </Button>
      <div className="max-w-[90%] mx-auto mt-9 pt-2">
        <div className="flex items-center mt-3 mb-7">
          <h1 className="font-bold text-5xl pr-4 dark:text-white">CMD</h1>
          <Image
            src={"/assets/images/icons/icons8-cmd-preto.png"}
            alt="Logo CMD"
            width={50}
            height={50}
            className="mr-5 dark:invert"
          />
        </div>
        <p className="mb-8 text-2xl dark:text-white">O que você busca?</p>
        <section className="max-w-[90%] mx-auto">
          <Link
            href={"/windows-page/cmd-page/configurar"}
            className="flex items-center border-l-4 border-green-700 mb-5 space-x-2 dark:text-white hover:text-white hover:bg-green-700 p-2 rounded text-2xl"
          >
            <span>Como configurar o CMD - (Prompt de comando)</span>
          </Link>
          <Link
            href={"/windows-page/cmd-page/atualizar"}
            className="flex items-center border-l-4 border-green-700 mb-5 space-x-2 dark:text-white hover:text-white hover:bg-green-700 p-2 rounded text-2xl"
          >
            <span>
              Como atualizar os Programas executados no Windows "F:atualiza"
            </span>
          </Link>
        </section>
      </div>
    </Layout>
  );
}
