import Layout from "../../components/Layout";
import Image from "next/image";
import Link from "next/link";

export default function ImpressorasTermicas() {
  return (
    <Layout>
      <div className="max-w-[90%] mx-auto mt-9 pt-2">
        <div className="flex items-center mt-3 mb-7">
          <h1 className="font-bold text-5xl dark:text-white pr-4">
            Impressoras Zebra
          </h1>
          <Image
            src={"/assets/images/icons/icons8-print-preto.png"}
            alt="Logo Windows"
            width={50}
            height={50}
            className="mr-5 dark:invert"
          />
        </div>
        <p className="mb-8 text-2xl dark:text-white">O que você busca?</p>
        <section className="max-w-[90%] mx-auto">
          <Link
            href={"/impressoras-termicas/troca-ribbon-etq"}
            className="flex items-center border-l-4 border-green-700 mb-5 space-x-2 dark:text-white hover:text-white p-2 rounded text-2xl hover:animate-gradient-pulse-left hover:bg-gradient-to-r hover:from-green-600 hover:to-green-900 hover:bg-[length:400%_400%]"
          >
            <div className="justify-center">
              <Image
                src={"/assets/images/impressoras-termicas/zt230.png"}
                alt="zt230"
                width={200}
                height={200}
                className="mr-5"
              />
            </div>
            <span>Trocar Ribbon e Etiqueta ZT-230/ZT-231/ZT411</span>
          </Link>
          <Link
            href={"/impressoras-termicas/limpeza-printhead"}
            className="flex items-center border-l-4 border-green-700 mb-5 space-x-2 dark:text-white hover:text-white p-2 rounded text-2xl hover:animate-gradient-pulse-left hover:bg-gradient-to-r hover:from-green-600 hover:to-green-900 hover:bg-[length:400%_400%]"
          >
            <div className="justify-center">
              <Image
                src={
                  "/assets/images/impressoras-termicas/cabeca-impressao.webp"
                }
                alt="zt230"
                width={200}
                height={200}
                className="mr-5"
              />
            </div>
            <span>Limpar Cabeçote de Impressão ZT-230/ZT-231</span>
          </Link>
        </section>
      </div>
    </Layout>
  );
}
