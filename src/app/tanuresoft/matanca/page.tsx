"use client";

import Layout from "../../../components/Layout";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { useRouter } from "next/navigation";

export default function Matanca() {
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
      <div className="container mx-auto p-6 max-w-4xl bg-white shadow-lg rounded-lg my-8">
        <h1 className="text-4xl font-extrabold text-blue-800 mb-6 border-b-4 border-blue-200 pb-2">
          Matanca
        </h1>

        <section className="mb-8">
          <p className="text-lg text-gray-700 leading-relaxed">
            Tutorial para acesso ao sistema matanca através do CMD ou Prompt de
            comando:
          </p>
        </section>

        <section className="mb-8">
          <ol className="list-decimal list-inside text-lg text-gray-700 ml-4 space-y-3">
            <li>Pesquise por “CMD” no menu iniciar:</li>
            <div className="flex justify-center">
              <Image
                src={"/assets/images/tanuresoft/matanca/matanca-1.png"}
                alt="CMD MATANCA"
                width={500}
                height={500}
              />
            </div>
            <li>Quando iniciar, digite F: e aperte a tecla ENTER:</li>
            <div className="flex justify-center">
              <Image
                src={"/assets/images/tanuresoft/matanca/matanca-2.png"}
                alt="CMD MATANCA"
                width={500}
                height={500}
              />
            </div>
            <li>
              Digite o nome do programa desejado, no caso MATANCA e aperte
              ENTER:
            </li>
            <div className="flex justify-center">
              <Image
                src={"/assets/images/tanuresoft/matanca/matanca-3.png"}
                alt="CMD MATANCA"
                width={500}
                height={500}
              />
            </div>
            <li>Aguarde o programa carregar e digite seu usuário e senha:</li>
            <div className="flex justify-center">
              <Image
                src={"/assets/images/tanuresoft/matanca/matanca-4.png"}
                alt="CMD MATANCA"
                width={500}
                height={500}
              />
            </div>
          </ol>
        </section>
      </div>
    </Layout>
  );
}
