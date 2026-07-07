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
  Repeat,
  Lightbulb,
  Hash,
  Globe,
} from "lucide-react";

const secoes = [
  {
    id: "restaurar",
    numero: 1,
    titulo: "Restaurar de fábrica",
    descricao:
      'Se você precisa "dar um reset", restaurar de fábrica, escaneie esse código.',
    icon: <RotateCcw size={20} />,
    corIcone:
      "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    imagem: "/assets/images/leitores/VOYAGER-1472G/leitor1.png",
  },
  {
    id: "enter",
    numero: 2,
    titulo: "ENTER automático",
    descricao:
      "Se você precisa habilitar o ENTER, escaneie esse código. Depois escaneie o próximo código para funcionar corretamente.",
    icon: <CornerDownLeft size={20} />,
    corIcone:
      "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    imagem: "/assets/images/leitores/VOYAGER-1472G/leitor2.png",
    imagemExtra: "/assets/images/leitores/VOYAGER-1472G/leitor3.png",
  },
  {
    id: "leitura-continua",
    numero: 3,
    titulo: "Leitura Contínua",
    descricao:
      "Se você precisa colocar na Leitura Contínua (quando não quiser ficar bipando na mão), escaneie esse código.",
    icon: <Repeat size={20} />,
    corIcone:
      "bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    imagem: "/assets/images/leitores/VOYAGER-1472G/leitor4.png",
  },
  {
    id: "desligar-led",
    numero: 4,
    titulo: "Desligar LED Leitura Contínua",
    descricao:
      "Se você precisa desligar o LED da Leitura Contínua, escaneie esse código.",
    icon: <Lightbulb size={20} />,
    corIcone:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    imagem: "/assets/images/leitores/VOYAGER-1472G/leitor5.png",
  },
  {
    id: "upc-ean",
    numero: 5,
    titulo: "Converter UPC para EAN-13",
    descricao:
      "Se você precisa converter para o formato de leitura EAN-13, escaneie esse código.",
    icon: <Hash size={20} />,
    corIcone:
      "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    imagem: "/assets/images/leitores/VOYAGER-1472G/leitor6.png",
  },
  {
    id: "usa-br",
    numero: 6,
    titulo: "Converter padrão USA (EUA) para BR",
    descricao:
      "Se você precisa converter para o padrão BR, escaneie esse código.",
    icon: <Globe size={20} />,
    corIcone:
      "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
    imagem: "/assets/images/leitores/VOYAGER-1472G/leitor7.png",
  },
  {
    id: "usb-hid",
    numero: 7,
    titulo: "USB HID",
    descricao:
      "Se você precisa habilitar o USB HID, escaneie esse código.",
    icon: <Hash size={20} />,
    corIcone:
      "bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400",
    imagem: "/assets/images/leitores/VOYAGER-1472G/leitor9.png",
  },
  {
    id: "usb-hid-tablet",
    numero: 8,
    titulo: "Entrada USB HID de código no Tablet",
    descricao:
      "Se você precisa habilitar a entrada USB HID de código no Tablet, escaneie esse código.",
    icon: <ScanLine size={20} />,
    corIcone:
      "bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
    imagem: "/assets/images/leitores/VOYAGER-1472G/leitor8.png",
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
              Voyager 1472G
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

              {secao.imagemExtra && (
                <>
                  <p className="text-gray-700 dark:text-gray-300 mt-6 leading-relaxed">
                    Depois escaneie esse código para funcionar corretamente:
                  </p>
                  <div className="flex justify-center bg-gray-50 dark:bg-neutral-800/60 rounded-xl p-6">
                    <Image
                      src={secao.imagemExtra}
                      alt={`Código de barras secundário - ${secao.titulo}`}
                      width={420}
                      height={420}
                      className="object-contain"
                    />
                  </div>
                </>
              )}
            </section>
          ))}
        </div>
      </div>
    </Layout>
  );
}