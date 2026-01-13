"use client";

import Layout from "../../../../components/Layout";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../../../../components/ui/button";
import { useRouter } from "next/navigation";

export default function CMDupdate() {
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
          Atualização do Sistema TANURESOFT
        </h1>

        <p className="pb-5">
          Encontramos aqui essa solução para atualizar na nova versão dos
          sistemas Frigo, Desossa, Matanca e Pesagem, fica registrado e listado
          abaixo.
        </p>

        <section className="mb-8">
          <ol className="list-decimal list-inside text-lg text-gray-700 ml-4 space-y-3">
            <li>
              Abra o CMD e digite as teclas F: depois aperte a tecla Enter, após
              isso digite a palavra Atualiza e aperte a tecla Enter:
            </li>
            <div className="flex justify-center">
              <Image
                src={"/assets/images/cmd-imgs/cmd-update/cmd-1.png"}
                alt="CMD UPDATE"
                width={500}
                height={500}
              />
            </div>
            <li>
              Logo após vai abrir uma tela igual abaixo, siga as instruções, e
              aperte a tecla Enter.
            </li>
            <div className="flex justify-center">
              <Image
                src={"/assets/images/cmd-imgs/cmd-update/cmd-2.png"}
                alt="CMD UPDATE"
                width={500}
                height={500}
              />
            </div>
            <li>
              Após esse passo, ele vai carregar todos os arquivos de atualização
              fechar o terminal CMD e abrir os sistemas.
            </li>
          </ol>
        </section>
      </div>
    </Layout>
  );
}
