"use client"

import Layout from "../../../components/Layout";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { useRouter } from "next/navigation";

export default function SP2500() {
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
          Configuração de Tara da Balança EPM SP2500
        </h1>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            No SP-2500 existem duas maneiras de colocar um valor de tara:
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Tara Automática:
          </p>
          <ol className="list-decimal list-inside text-lg text-gray-700 ml-4 space-y-2">
            <li>
              <span className="font-medium">
                Coloque sobre a balança o peso a ser descontado
                carretilha/gancheira
              </span>
              .
            </li>
            <li>
              <span className="font-medium">Digite a tecla TARA.</span>
            </li>
            <div className="flex justify-center">
              <Image
                src={
                  "/assets/images/balancas/sp2500/sp2500-tara-automatica.png"
                }
                alt="Logo SP2500"
                width={500}
                height={500}
              />
            </div>
            <li>
              <span className="font-medium">
                A balança é zerada e o LED de TARA é aceso, indicando que existe
                um valor de tara sendo descontado do peso.
              </span>
            </li>
          </ol>

          <p className="text-lg text-gray-700 leading-relaxed mb-4 mt-4">
            Tara Manual:
          </p>
          <ol className="list-decimal list-inside text-lg text-gray-700 ml-4 space-y-2">
            <li>
              <span className="font-medium">
                Digite as teclas “Função” e “8 - Manual”.
              </span>
              .
            </li>
            <div className="flex justify-center">
              <Image
                src={"/assets/images/balancas/sp2500/sp2500-tara-manual-1.png"}
                alt="Logo SP2500"
                width={500}
                height={500}
              />
            </div>
            <li>
              <span className="font-medium">
                Digite o peso desejado, lembre-se de colocar o ponto/vírgula, se
                precisar.
              </span>
            </li>
            <li>
              <span className="font-medium">
                Clique no botão “Aceita” e pronto, a tara está configurada.
              </span>
            </li>
            <div className="flex justify-center">
              <Image
                src={"/assets/images/balancas/sp2500/sp2500-tara-manual-2.png"}
                alt="Logo SP2500"
                width={500}
                height={500}
              />
            </div>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Observação Importante
          </h2>
          <p className="text-lg leading-relaxed bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md">
            O valor da tara está limitado ao fundo de escala da balança.
          </p>
          <p className="text-lg leading-relaxed bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md mt-1">
            Dependendo da configuração do equipamento, as teclas de tara podem
            estar desabilitadas. Consulte o manual completo para mais detalhes
            sobre as configurações avançadas.
          </p>
        </section>
      </div>
    </Layout>
  );
}
