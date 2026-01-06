import Layout from "../../components/Layout";
import Link from "next/link";
import Image from "next/image";

export default function Tanuresoft() {
  return (
    <Layout>
      <div className="max-w-[90%] mx-auto mt-9 pt-2">
        <div className="flex items-center mt-3 mb-7">
          <h1 className="font-bold text-5xl dark:text-white pr-4">
            Tanuresoft
          </h1>
          <Image
            src={"/assets/images/icons/icons8-cmd-preto.png"}
            alt="Logo CMD"
            width={50}
            height={50}
            className="mr-5 dark:invert"
          />
        </div>
        <p className="mb-3 text-2xl dark:text-white">Programas de CMD</p>
        <section className="max-w-[90%] mx-auto">
          <Link
            href={"/tanuresoft/desossa"}
            className="flex items-center border-l-4 border-green-700 mb-3 space-x-2 dark:text-white hover:text-white p-2 rounded text-2xl hover:animate-gradient-pulse-left hover:bg-gradient-to-r hover:from-green-600 hover:to-green-900 hover:bg-[length:400%_400%]"
          >
            <span>Desossa</span>
          </Link>
          <Link
            href={"/tanuresoft/frigo"}
            className="flex items-center border-l-4 border-green-700 mb-3 space-x-2 dark:text-white hover:text-white p-2 rounded text-2xl hover:animate-gradient-pulse-left hover:bg-gradient-to-r hover:from-green-600 hover:to-green-900 hover:bg-[length:400%_400%]"
          >
            <span>Frigo</span>
          </Link>
          <Link
            href={"/tanuresoft/matanca"}
            className="flex items-center border-l-4 border-green-700 mb-3 space-x-2 dark:text-white hover:text-white p-2 rounded text-2xl hover:animate-gradient-pulse-left hover:bg-gradient-to-r hover:from-green-600 hover:to-green-900 hover:bg-[length:400%_400%]"
          >
            <span>Matanca</span>
          </Link>
          <Link
            href={"/tanuresoft/pesagem"}
            className="flex items-center border-l-4 border-green-700 mb-3 space-x-2 dark:text-white hover:text-white p-2 rounded text-2xl hover:animate-gradient-pulse-left hover:bg-gradient-to-r hover:from-green-600 hover:to-green-900 hover:bg-[length:400%_400%]"
          >
            <span>Pesagem</span>
          </Link>
        </section>
        <p className="mb-3 mt-8 text-2xl dark:text-white">
          Programas executados no Windows
        </p>
        <section className="max-w-[90%] mx-auto">
          <Link
            href={"/tanuresoft/localizar-programas"}
            className="flex items-center border-l-4 border-red-700 dark:text-white hover:text-white p-2 rounded text-2xl hover:animate-gradient-pulse-left hover:bg-gradient-to-r hover:from-red-600 hover:to-red-900 hover:bg-[length:400%_400%]"
          >
            <div>
              <p>Como localizar os programas:</p>
              <ul className="ml-5">
                <li>MatWin</li>
                <li>FrigoWin</li>
                <li>AlmoxWin</li>
                <li>BancoWin</li>
                <li>PortWin</li>
              </ul>
            </div>
          </Link>
          <section className="hidden">
            <Link
              href={"/tanuresoft/desossa"}
              className="flex items-center border-l-4 border-blue-700 mb-3 space-x-2 dark:text-white hover:text-white hover:bg-blue-700 p-2 rounded text-2xl"
            >
              <span>MatWin</span>
            </Link>
            <Link
              href={"/tanuresoft/frigo"}
              className="flex items-center border-l-4 border-blue-700 mb-3 space-x-2 dark:text-white hover:text-white hover:bg-blue-700 p-2 rounded text-2xl"
            >
              <span>FrigoWin</span>
            </Link>
            <Link
              href={"/tanuresoft/matanca"}
              className="flex items-center border-l-4 border-blue-700 mb-3 space-x-2 dark:text-white hover:text-white hover:bg-blue-700 p-2 rounded text-2xl"
            >
              <span>AlmoxWin</span>
            </Link>
            <Link
              href={"/tanuresoft/pesagem"}
              className="flex items-center border-l-4 border-blue-700 mb-3 space-x-2 dark:text-white hover:text-white hover:bg-blue-700 p-2 rounded text-2xl"
            >
              <span>BancoWin</span>
            </Link>
            <Link
              href={"/tanuresoft/pesagem"}
              className="flex items-center border-l-4 border-blue-700 mb-3 space-x-2 dark:text-white hover:text-white hover:bg-blue-700 p-2 rounded text-2xl"
            >
              <span>PortWin</span>
            </Link>
          </section>
        </section>
        <p className="mb-3 mt-8 text-2xl dark:text-white">
          Como CONFIGURAR e ATUALIZAR o CMD - Promp de Comando para os programas
          do Tanure
        </p>
        <section className="max-w-[90%] mx-auto">
          <Link
            href={"/windows-page/cmd-page"}
            className="flex items-center border-l-4 border-yellow-500 mb-3 space-x-2 dark:text-white hover:text-white p-2 rounded text-2xl hover:animate-gradient-pulse-left hover:bg-gradient-to-r hover:from-yellow-400 hover:to-yellow-800 hover:bg-[length:400%_400%]"
          >
            <span>CMD</span>
          </Link>
        </section>
      </div>
    </Layout>
  );
}
