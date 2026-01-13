import Layout from "../../components/Layout";
import Image from "next/image";
import Link from "next/link";
import MapaBrasil from "../../components/MapaBrasil";

export default function Emails() {
  return (
    <Layout>
      <div className="max-w-[90%] mx-auto mt-9 pt-2">
        <div className="flex items-center mt-3 mb-7">
          <h1 className="font-bold text-5xl dark:text-white pr-4">Emails</h1>
          <Image
            src={"/assets/images/icons/icons8-mail-preto.png"}
            alt="Icon phone"
            width={50}
            height={50}
            className="mr-5 dark:invert"
          />
          <Link
            href="/admin"
            className="ml-auto rounded bg-blue-500 px-4 py-2 text-white hover:scale-110"
          >
            Editar emails
          </Link>
        </div>
        <section className="max-w-[90%] mx-auto">
          <MapaBrasil  basePath="/emails" />
        </section>
        <div></div>
      </div>
    </Layout>
  );
}
