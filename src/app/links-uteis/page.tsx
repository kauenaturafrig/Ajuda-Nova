import Layout from "../../components/Layout";
import Image from "next/image";
import Link from "next/link";

export default function LinksUtil() {
  return (
    <Layout>
      <div className="max-w-[90%] mx-auto mt-9 pt-2">
        <div className="flex items-center mt-3 mb-7">
          <h1 className="font-bold text-5xl dark:text-white pr-4">Links</h1>
          <Image
            src={"/assets/images/icons/icons8-link-preto.png"}
            alt="Logo Link"
            width={50}
            height={50}
            className="mr-5 dark:invert"
          />
        </div>
        <p className="mb-8 text-2xl dark:text-white">O que você busca?</p>
        <section className="max-w-[90%] mx-auto">
          <Link
            href={"http://172.16.10.4:8220/webapp/"}
            className="flex items-center border-l-4 border-green-700 mb-5 space-x-2 dark:text-white hover:text-white hover:bg-green-700 p-2 rounded text-2xl"
          >
            <Image
              src={"/assets/images/logos/protheus.png"}
              alt="Logo Protheus"
              width={100}
              height={100}
              className="mr-5"
            />
            <span>PROTHEUS</span>
          </Link>
          <Link
            href={"http://172.16.10.4:7017/login"}
            className="flex items-center border-l-4 border-green-700 mb-5 space-x-2 dark:text-white hover:text-white hover:bg-green-700 p-2 rounded text-2xl"
          >
            <Image
              src={"/assets/images/logos/smartview.png"}
              alt="Logo Smartview"
              width={100}
              height={100}
              className="mr-5 dark:invert"
            />
            <span>Smartview</span>
          </Link>
          <Link
            href={"https://helpdesk.naturafrig.com.br/"}
            className="flex items-center border-l-4 border-green-700 mb-5 space-x-2 dark:text-white hover:text-white hover:bg-green-700 p-2 rounded text-2xl"
          >
            <Image
              src={"/assets/images/logos/glpi.png"}
              alt="Logo GLPI"
              width={100}
              height={100}
              className="mr-5 dark:invert"
            />
            <span>Chamados TI Nova Andradina</span>
          </Link>
          <Link
            href={"https://suporte.naturafrig.com.br/"}
            className="flex items-center border-l-4 border-green-700 mb-5 space-x-2 dark:text-white hover:text-white hover:bg-green-700 p-2 rounded text-2xl"
          >
            <Image
              src={"/assets/images/logos/helpdesk.png"}
              alt="Logo Helpdesk"
              width={50}
              height={50}
              className="mr-9"
            />
            <span>Chamados Tanuresoft, Protheus, TI Pirapó</span>
          </Link>
          <Link
            href={"https://webmail.naturafrig.com.br/"}
            className="flex items-center border-l-4 border-green-700 mb-5 space-x-2 dark:text-white hover:text-white hover:bg-green-700 p-2 rounded text-2xl"
          >
            <Image
              src={"/assets/images/logos/webmail-logo.svg"}
              alt="Logo Webmail"
              width={100}
              height={100}
              className="mr-5"
            />
            <span>Webmail</span>
          </Link>
          <Link
            href={"https://assinatura.naturafrig.com.br/"}
            className="flex items-center border-l-4 border-green-700 mb-5 space-x-2 dark:text-white hover:text-white hover:bg-green-700 p-2 rounded text-2xl"
          >
            <Image
              src={"/assets/images/logos/assinatura.png"}
              alt="Logo Assinatura"
              width={50}
              height={50}
              className="mr-5 dark:invert"
            />
            <span>Assinatura digital para email</span>
          </Link>
        </section>
      </div>
    </Layout>
  );
}
