"use client";

import Layout from "../../../components/Layout";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../../../components/ui/button";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Printer,
  Wrench,
  Info,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

export default function PrintHeadClean() {
  const router = useRouter();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-4">
        {/* Botão Voltar */}
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="mb-6 gap-2 text-gray-600 dark:text-gray-300"
        >
          <ArrowLeft size={16} />
          Voltar
        </Button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <span className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shrink-0">
            <Printer size={28} />
          </span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Limpeza de Cabeça de Impressão
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Impressoras Zebra ZT-230/ZT-231/ZT411
            </p>
          </div>
        </div>

        {/* Seções */}
        <div className="space-y-6">
          {/* Materiais Utilizados */}
          <section className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-5">
              <span className="flex items-center justify-center w-11 h-11 rounded-xl shrink-0 bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                <Wrench size={20} />
              </span>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Materiais Utilizados
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                  Álcool isopropílico 99.8% e algodão de limpeza hidrófilo.
                </p>
              </div>
            </div>
          </section>

          {/* Limpeza */}
          <section className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-5">
              <span className="flex items-center justify-center w-11 h-11 rounded-xl shrink-0 bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                <Printer size={20} />
              </span>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Limpeza
                </h2>
              </div>
            </div>

            <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li>
                Primeiro desligue a impressora no botão localizado atrás da
                impressora com esse símbolo conforme imagem abaixo:
              </li>
              <div className="flex justify-center bg-gray-50 dark:bg-neutral-800/60 rounded-xl p-6">
                <Image
                  src="/assets/images/impressoras-termicas/cabeca-impressao-1.png"
                  alt="Símbolo de desligar impressora"
                  width={200}
                  height={500}
                  className="object-contain"
                />
              </div>

              <li>Segundo abra a tampa lateral</li>
              <div className="flex justify-center bg-gray-50 dark:bg-neutral-800/60 rounded-xl p-6">
                <Image
                  src="/assets/images/impressoras-termicas/cabeca-impressao-2.png"
                  alt="Abrir tampa lateral"
                  width={500}
                  height={500}
                  className="object-contain"
                />
              </div>

              {/* Observação Importante - Cabeçote quente */}
              <div className="my-4">
                <div className="flex items-start gap-4">
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0 bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400">
                    <AlertTriangle size={18} />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Observação Importante
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md mt-1">
                      O cabeçote de impressão pode estar quente causar queimaduras
                      graves. Deixe o cabeçote de impressão esfriar.
                    </p>
                  </div>
                </div>
              </div>

              <li>
                Terceiro levante a cabeça de impressão girando a alavanca de
                abertura do cabeçote.
              </li>
              <div className="flex justify-center bg-gray-50 dark:bg-neutral-800/60 rounded-xl p-6">
                <Image
                  src="/assets/images/impressoras-termicas/cabeca-impressao-3.png"
                  alt="Levantar cabeça de impressão"
                  width={500}
                  height={500}
                  className="object-contain"
                />
              </div>

              <li>
                Umedeça o algodão com o álcool isopropílico e passe no local
                indicado pela imagem, faça isso por pelo menos três vezes.
              </li>
              <div className="flex justify-center bg-gray-50 dark:bg-neutral-800/60 rounded-xl p-6">
                <Image
                  src="/assets/images/impressoras-termicas/limpeza-cabecote-rolete1.svg"
                  alt="Local de limpeza no cabeçote"
                  width={500}
                  height={500}
                  className="object-contain"
                />
              </div>

              <li>
                Também passe o algodão enquanto gira manualmente o rolo de impressão.
              </li>
              <div className="flex justify-center bg-gray-50 dark:bg-neutral-800/60 rounded-xl p-6">
                <Image
                  src="/assets/images/impressoras-termicas/limpeza-cabecote-rolete2.svg"
                  alt="Limpeza enquanto gira rolo de impressão"
                  width={500}
                  height={500}
                  className="object-contain"
                />
              </div>

              <li>
                Coloque novamente a fita de etiqueta e o ribbon (se
                usado) no rolete deixando uma ponta da etiqueta com uns 8 cm para
                fora conforme imagem abaixo:
              </li>
              <div className="flex justify-center bg-gray-50 dark:bg-neutral-800/60 rounded-xl p-6">
                <Image
                  src="/assets/images/impressoras-termicas/cabeca-impressao-5.png"
                  alt="Colocar etiqueta e ribbon"
                  width={500}
                  height={500}
                  className="object-contain"
                />
              </div>

              <li>Feche o cabeçote de impressão</li>
              <div className="flex justify-center bg-gray-50 dark:bg-neutral-800/60 rounded-xl p-6">
                <Image
                  src="/assets/images/impressoras-termicas/cabeca-impressao-6.png"
                  alt="Fechar cabeçote de impressão"
                  width={500}
                  height={500}
                  className="object-contain"
                />
              </div>

              <li>Feche a porta lateral</li>
              <div className="flex justify-center bg-gray-50 dark:bg-neutral-800/60 rounded-xl p-6">
                <Image
                  src="/assets/images/impressoras-termicas/cabeca-impressao-7.png"
                  alt="Fechar porta lateral"
                  width={500}
                  height={500}
                  className="object-contain"
                />
              </div>

              <li>
                E ligue novamente a impressora no botão atrás da impressora e
                aguarde iniciar a impressora. Pronto, a impressora está limpa.
              </li>
            </ol>
          </section>

          {/* Observação Importante - Manutenção preventiva */}
          <section className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-5">
              <span className="flex items-center justify-center w-11 h-11 rounded-xl shrink-0 bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                <CheckCircle2 size={20} />
              </span>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Observação Importante
                </h2>
              </div>
            </div>

            <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md">
              A manutenção preventiva de rotina é uma parte crucial da
              operação normal da impressora. Ao cuidar bem da sua impressora,
              você pode minimizar os possíveis problemas que você pode ter com
              ela e ajudar a alcançar e manter seus padrões de qualidade de
              impressão. Sugerimos que seja limpa após cada troca de etiqueta
              ou ribbon.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}