"use client";

import Layout from "../../../components/Layout";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { useRouter } from "next/navigation";

export default function LocatePrograms() {
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
          Localizando aplicativos dos Sistemas TANURESOFT
        </h1>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Observação Importante
          </h2>
          <p className="text-lg leading-relaxed bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md">
            Sempre atualize os programas usando o F:atualiza no CMD (Prompt de
            comando){" "}
            <Link
              href="/windows-page/cmd-page/atualizar/"
              className="text-blue-500"
            >
              CLIQUE AQUI PARA MAIS DETALHES
            </Link>
          </p>
        </section>

        <section className="mb-8">
          <ol className="list-decimal list-inside text-lg text-gray-700 ml-4 space-y-3">
            <li>
              Entrar na pasta de arquivos com o nome Este Computador, logo em
              seguida procure por Disco Local (C:) e clique com o botão esquerdo
              do mouse para abrir.
            </li>
            <div className="flex justify-center">
              <Image
                src={"/assets/images/tanuresoft/localizar-programas/l-p-1.png"}
                alt="Explorer Localization"
                width={1000}
                height={500}
                className="mb-4"
              />
            </div>
            <li>
              Após clicar em “Disco Local (C:)” e pesquisar por: “TANURESOFT” e
              clicar com botão esquerdo mouse para abrir.
            </li>
            <div className="flex justify-center">
              <Image
                src={"/assets/images/tanuresoft/localizar-programas/l-p-2.png"}
                alt="Explorer Localization"
                width={1000}
                height={500}
                className="mb-4"
              />
            </div>
            <li>
              Após abrir o local do arquivo “TANURESOFT” encontrará pastas com
              nome de cada sistema que precisar.
            </li>
            <li>
              Selecionar a pasta que deseja obter o sistema e clicar com o botão
              esquerdo e abrir a pasta e clicar no ícone do sistema.
            </li>
            <div className="flex justify-center">
              <Image
                src={"/assets/images/tanuresoft/localizar-programas/l-p-3.png"}
                alt="Explorer Localization"
                width={1000}
                height={500}
                className="mb-4"
              />
            </div>
            <li>
              Após esse passo, clicar com o botão esquerdo do mouse selecionar
              “Enviar Para”, depois selecionar “Área de trabalho (criar
              atalho)”, essa função cria um ícone do sistema na Área de trabalho
              do Computador (Tela Inicial). Após isso só fechar a pasta e abrir
              o sistema.
            </li>
          </ol>
        </section>
      </div>
    </Layout>
  );
}
