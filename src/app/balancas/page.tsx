import Layout from "../../../components/Layout";
import Link from "next/link";
import Image from "next/image";

export default function Balancas() {
  return (
    <Layout>
      <div className="max-w-[90%] mx-auto mt-9 pt-2">
        <div className="flex items-center mt-3 mb-7">
          <h1 className="font-bold text-5xl dark:text-white pr-4">Balanças</h1>
          <Image
            src={"/assets/images/icons/icons8-scales-preto.png"}
            alt="Logo Scale"
            width={50}
            height={50}
            className="mr-5 dark:invert"
          />
        </div>
        <p className="mb-8 text-2xl dark:text-white ">
          Qual indicador você procura?
        </p>
        <section className="max-w-[90%] mx-auto">
          <Link
            href={"/balancas/alfa"}
            className="flex items-center space-x-2 mb-5 pl-5 border-l-4 border-green-700 hover:text-white hover:bg-green-700 p-2 rounded text-2xl hover:animate-gradient-pulse-left hover:bg-gradient-to-r hover:from-green-600 hover:to-green-900 hover:bg-[length:400%_400%]"
          >
            <Image
              src={"/assets/images/balancas/alfa/indicador-3104c.png"}
              alt="Logo Alfa"
              width={200}
              height={200}
              className="mr-5"
            />
            <span className="dark:text-white">Alfa</span>
          </Link>
          <Link
            href={"/balancas/sp2500"}
            className="flex items-center space-x-2 mb-5 pl-5 border-l-4 border-green-700 hover:text-white dark:hover:text-gray-100 hover:bg-green-700 p-2 rounded hover:animate-gradient-pulse-left hover:bg-gradient-to-r hover:from-green-600 hover:to-green-900 hover:bg-[length:400%_400%] text-2xl"
          >
            <Image
              src={"/assets/images/balancas/sp2500/sp2500.png"}
              alt="Logo EPM"
              width={200}
              height={200}
              className="mr-5"
            />
            <span className="dark:text-white">SP2500</span>
          </Link>
          <Link
            href={"/balancas/wt3000"}
            className="flex items-center space-x-2 mb-5 pl-5 border-l-4 border-green-700 hover:text-white dark:hover:text-gray-100 hover:bg-green-700 p-2 rounded text-2xl hover:animate-gradient-pulse-left hover:bg-gradient-to-r hover:from-green-600 hover:to-green-900 hover:bg-[length:400%_400%]"
          >
            <Image
              src={"/assets/images/balancas/wt3000/wt3000.jpg"}
              alt="Logo WT"
              width={200}
              height={200}
              className="mr-5"
            />
            <span className="dark:text-white">WT3000</span>
          </Link>
        </section>
      </div>
    </Layout>
  );
}
