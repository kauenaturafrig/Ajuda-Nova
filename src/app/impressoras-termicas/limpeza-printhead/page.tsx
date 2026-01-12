"use client";

import Layout from "../../../components/Layout";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { useRouter } from "next/navigation";

export default function PrintHeadClean() {
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
          Limpeza de Cabeça de Impressão ZT-230/ZT-231/ZT411
        </h1>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Materiais Utilizados
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Álcool isopropílico 99.8% e algodão de limpeza hidrófilo.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Limpeza</h2>
          <ol className="list-decimal list-inside text-lg text-gray-700 ml-4 space-y-3">
            <li>
              Primeiro desligue a impressora no botão localizado atrás da
              impressora com esse símbolo conforme imagem abaixo:
            </li>
            <div className="flex justify-center">
              <Image
                src={
                  "/assets/images/impressoras-termicas/cabeca-impressao-1.png"
                }
                alt="Logo Alfa"
                width={200}
                height={500}
              />
            </div>
            <li>Segundo abra a tampa lateral</li>
            <div className="flex justify-center">
              <Image
                src={
                  "/assets/images/impressoras-termicas/cabeca-impressao-2.png"
                }
                alt="Logo Alfa"
                width={500}
                height={500}
              />
            </div>
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Observação Importante
              </h2>
              <p className="text-lg leading-relaxed bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md">
                O cabeçote de impressão pode estar quente causar queimaduras
                greves. Deixe o cabeçote de impressão esfriar
              </p>
            </section>
            <li>
              Terceiro levante a cabeça de impressão girando a alavanca de
              abertura do cabeçote,
            </li>
            <div className="flex justify-center">
              <Image
                src={
                  "/assets/images/impressoras-termicas/cabeca-impressao-3.png"
                }
                alt="Logo Alfa"
                width={500}
                height={500}
              />
            </div>
            <li>
              Umedeça o algodão com o álcool isopropílico e passe no local
              indicado pela seta vermelha na imagem, faça isso por pelo menos
              três vezes,
            </li>
            <div className="flex justify-center">
              <Image
                src={
                  "/assets/images/impressoras-termicas/cabeca-impressao-4.png"
                }
                alt="Logo Alfa"
                width={500}
                height={500}
              />
            </div>
            <li>
              Quarto passo coloque novamente a fita de etiqueta e o ribbon (se
              usado) no rolete deixando uma ponta da etiqueta com uns 8 cm para
              fora conforme imagem abaixo:
            </li>
            <div className="flex justify-center">
              <Image
                src={
                  "/assets/images/impressoras-termicas/cabeca-impressao-5.png"
                }
                alt="Logo Alfa"
                width={500}
                height={500}
              />
            </div>
            <li>Feche o cabeçote de impressão</li>
            <div className="flex justify-center">
              <Image
                src={
                  "/assets/images/impressoras-termicas/cabeca-impressao-6.png"
                }
                alt="Logo Alfa"
                width={500}
                height={500}
              />
            </div>
            <li>Feche a porta lateral</li>
            <div className="flex justify-center">
              <Image
                src={
                  "/assets/images/impressoras-termicas/cabeca-impressao-7.png"
                }
                alt="Logo Alfa"
                width={500}
                height={500}
              />
            </div>
            <li>
              E ligue novamente a impressora no botão atrás da impressora e
              aguarde iniciar a impressora. Pronto a impressora está limpa.
            </li>
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Observação Importante
              </h2>
              <p className="text-lg leading-relaxed bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md">
                A manutenção preventiva de rotina é uma parte crucial da
                operação normal da impressora. Ao cuidar bem da sua impressora,
                você pode minimizar os possíveis problemas que você pode ter com
                ela e ajudar a alcançar e manter seus padrões de qualidade de
                impressão. Sugerimos que seja limpa após cada troca de etiqueta
                ou ribbon.
              </p>
            </section>
          </ol>
        </section>
      </div>
    </Layout>
  );
}
