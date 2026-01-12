"use client";

import Layout from "../../../components/Layout";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { useRouter } from "next/navigation";

export default function RibbonEtq() {
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
          Trocar Ribbon e Etiqueta ZT-230/ZT-231/ZT411
        </h1>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            1.1. Carregamento de Mídia e Ribbon
          </h2>
          <ol className="list-decimal list-inside text-lg text-gray-700 ml-4 space-y-3">
            <li>Levante a porta da mídia.</li>
            <div className="flex justify-center">
              <Image
                src={"/assets/images/impressoras-termicas/zt230-1.webp"}
                alt="Logo Alfa"
                width={500}
                height={500}
              />
            </div>
            <li>
              Gire a alavanca dourada do cabeçote de impressão para cima para
              abrir o cabeçote de impressão.
            </li>
            <div className="flex justify-center">
              <Image
                src={"/assets/images/impressoras-termicas/zt230-2.png"}
                alt="Logo Alfa"
                width={500}
                height={500}
              />
            </div>
            <li>Deslize a guia de mídia externa dourada para fora.</li>
            <div className="flex justify-center">
              <Image
                src={"/assets/images/impressoras-termicas/zt230-3.png"}
                alt="Logo Alfa"
                width={500}
                height={500}
              />
            </div>
            <li>Coloque o rolo de mídia no suporte.</li>
            <div className="flex justify-center">
              <Image
                src={"/assets/images/impressoras-termicas/zt230-4.png"}
                alt="Logo Alfa"
                width={500}
                height={500}
              />
            </div>
            <li>
              Empurre-o para trás, levante a guia de suprimento de mídia e
              deslize-a para dentro enquanto passa a mídia pela frente da
              impressora.
            </li>
            <div className="flex justify-center">
              <Image
                src={"/assets/images/impressoras-termicas/zt230-5.png"}
                alt="Logo Alfa"
                width={500}
                height={500}
              />
            </div>
            <li>
              Certifique-se de que ela passe por dentro do sensor de lacuna e
              sob a guia de mídia interna.
            </li>
            <li>
              Deslize a mídia sob o amortecedor cinza e o mecanismo de
              impressão.
            </li>
            <div className="flex justify-center">
              <Image
                src={"/assets/images/impressoras-termicas/zt230-6.png"}
                alt="Logo Alfa"
                width={500}
                height={500}
              />
            </div>
            <li>
              Deslize a guia de mídia externa dourada até que ela toque a borda
              da mídia.
            </li>
            <li>
              Coloque um núcleo de ribbon vazio no eixo de recolhimento do
              ribbon. Empurre o núcleo para trás o máximo que puder.
            </li>
            <div className="flex justify-center">
              <Image
                src={"/assets/images/impressoras-termicas/zt230-7.png"}
                alt="Logo Alfa"
                width={500}
                height={500}
              />
            </div>
            <li>
              Coloque o rolo de ribbon no eixo de suprimento do ribbon com a
              ponta solta rolando para baixo no lado direito. Empurre-o para
              trás o máximo que puder.
            </li>
            <li>
              Deslize o ribbon sob a guia preta do ribbon e sob o mecanismo de
              impressão.
            </li>
            <li>Enrole o ribbon sobre a parte superior do núcleo.</li>
            <div className="flex justify-center">
              <Image
                src={"/assets/images/impressoras-termicas/zt230-8.png"}
                alt="Logo Alfa"
                width={500}
                height={500}
              />
            </div>
            <li>
              Gire o eixo para a direita para remover qualquer folga do ribbon.
            </li>
            <li>
              Gire a alavanca dourada do cabeçote de impressão para baixo para
              fechar o cabeçote de impressão.
            </li>
            <div className="flex justify-center">
              <Image
                src={"/assets/images/impressoras-termicas/zt230-10.png"}
                alt="Logo Alfa"
                width={500}
                height={500}
              />
            </div>
            <li>Pressione o botão de pausa para calibrar a impressora.</li>
            <div className="flex justify-center">
              <Image
                src={"/assets/images/impressoras-termicas/zt230-9.png"}
                alt="Logo Alfa"
                width={500}
                height={500}
              />
            </div>
            <li>Feche a porta da mídia.</li>
            <div className="flex justify-center">
              <Image
                src={"/assets/images/impressoras-termicas/zt230-2.webp"}
                alt="Logo Alfa"
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
