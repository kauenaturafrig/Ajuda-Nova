import Layout from "../../components/Layout";
import Image from "next/image";
import Link from "next/link";

export default function WindowsHelp() {
  return (
    <Layout>
      <div className="max-w-[90%] mx-auto mt-9 pt-2">
        <div className="flex items-center mt-3 mb-7">
          <h1 className="font-bold text-5xl dark:text-white pr-4">Windows</h1>
          <Image
            src={"/assets/images/icons/icons8-windows-preto.png"}
            alt="Logo Windows"
            width={50}
            height={50}
            className="mr-5 dark:invert"
          />
        </div>
        <p className="mb-8 text-2xl dark:text-white">O que você busca?</p>
        <section className="max-w-[90%] mx-auto dark:text-white">
          <Link
            href={"/windows-page/cmd-page"}
            className="flex items-center border-l-4 border-green-700 mb-5 space-x-2 hover:text-white hover:bg-green-700 p-2 rounded text-2xl"
          >
            <span>Como configurar o CMD - (Prompt de comando)</span>
          </Link>
          <Link
            href={"/windows-page/update"}
            className="flex items-center border-l-4 border-green-700 mb-5 space-x-2 hover:text-white hover:bg-green-700 p-2 rounded text-2xl"
          >
            <span>Como atualizar o Windows</span>
          </Link>
        </section>
      </div>
    </Layout>
  );
}
