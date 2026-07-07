"use client";

import Layout from "../../../components/Layout";
import Image from "next/image";
import { Button } from "../../../components/ui/button";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ScanLine,
  RotateCcw,
  CornerDownLeft,
  Landmark,
  QrCode,
  Hash,
} from "lucide-react";

const secoes = [
  {
    id: "restaurar",
    numero: 1,
    titulo: "Restaurar de fábrica",
    descricao:
      'Se você precisa "dar um reset", restaurar de fábrica, escaneie esse código.',
    icon: <RotateCcw size={20} />,
    corIcone: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    imagem: "/assets/images/leitores/ZEBRA-DS2278/leitor1.png",
  },
  {
    id: "enter",
    numero: 2,
    titulo: "ENTER automático",
    descricao:
      "Se você precisa adicionar o ENTER AUTOMÁTICO, escaneie esse código.",
    icon: <CornerDownLeft size={20} />,
    corIcone: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    imagem: "/assets/images/leitores/ZEBRA-DS2278/leitor2.png",
  },
  {
    id: "boleto",
    numero: 3,
    titulo: "Código de Barras Boleto",
    descricao:
      "Se você precisa ler um código de barras de um boleto de pagamento, escaneie esse código.",
    icon: <Landmark size={20} />,
    corIcone:
      "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    imagem: "/assets/images/leitores/ZEBRA-DS2278/leitor3.png",
  },
  {
    id: "pix",
    numero: 4,
    titulo: "PIX",
    descricao: "Se você precisa ler um código PIX, escaneie esse código.",
    icon: <QrCode size={20} />,
    corIcone:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    imagem: "/assets/images/leitores/ZEBRA-DS2278/leitor4.png",
  },
  {
    id: "zero-esquerda",
    numero: 5,
    titulo: "Emular o zero à esquerda",
    descricao:
      "Se você precisa emular o ZERO À ESQUERDA, escaneie esse código.",
    icon: <Hash size={20} />,
    corIcone:
      "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    imagem: "/assets/images/leitores/ZEBRA-DS2278/leitor5.png",
  },
];

export default function PrintHeadClean() {
  const router = useRouter();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-4">
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
            <ScanLine size={28} />
          </span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Zebra DS2278
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Escaneie os códigos abaixo para configurar o leitor rapidamente
            </p>
          </div>
        </div>

        {/* Índice rápido */}
        <div className="flex flex-wrap gap-2 mb-8">
          {secoes.map((secao) => (
            <a
              key={secao.id}
              href={`#${secao.id}`}
              className="flex items-center gap-1.5 text-xs font-medium bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-gray-600 dark:text-gray-300 rounded-full px-3 py-1.5 shadow-sm hover:border-blue-300 hover:text-blue-600 transition-colors"
            >
              {secao.icon}
              {secao.titulo}
            </a>
          ))}
        </div>

        {/* Seções */}
        <div className="space-y-6">
          {secoes.map((secao) => (
            <section
              key={secao.id}
              id={secao.id}
              className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm p-6 sm:p-8 scroll-mt-6"
            >
              <div className="flex items-start gap-4 mb-5">
                <span
                  className={`flex items-center justify-center w-11 h-11 rounded-xl shrink-0 ${secao.corIcone}`}
                >
                  {secao.icon}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-400">
                      {String(secao.numero).padStart(2, "0")}
                    </span>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {secao.titulo}
                    </h2>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                    {secao.descricao}
                  </p>
                </div>
              </div>

              <div className="flex justify-center bg-gray-50 dark:bg-neutral-800/60 rounded-xl p-6">
                <Image
                  src={secao.imagem}
                  alt={`Código de barras - ${secao.titulo}`}
                  width={420}
                  height={420}
                  className="object-contain"
                />
              </div>
            </section>
          ))}
        </div>
      </div>
    </Layout>
  );
}