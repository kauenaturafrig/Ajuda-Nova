import Layout from "../../../components/Layout";
import Image from "next/image";
import Link from "next/link";

export default function UpdateWin() {
  return (
    <Layout>
      <Link href="/windows-page">
        <span className="text-blue-600 dark:text-blue-400 hover:underline font-semibold text-3xl ml-5">
          ← Voltar
        </span>
      </Link>
      <div className="container mx-auto p-6 max-w-4xl bg-white shadow-lg rounded-lg my-8">
        <h1 className="text-4xl font-extrabold text-blue-800 mb-6 border-b-4 border-blue-200 pb-2">
          Atualização do Windows e Programas
        </h1>

        <section className="mb-8">
          <ol className="list-decimal list-inside text-lg text-gray-700 ml-4 space-y-3">
            <li>
              Verifique o ícone de atualização do Windows na janela, se estiver
              com o símbolo conforme imagem abaixo clique com o botão direito em
              cima,
            </li>
            <div className="flex justify-center">
              <Image
                src={"/assets/images/windows-images/update-1.png"}
                alt="UPDATE WINDOWS"
                width={500}
                height={500}
              />
            </div>
            <li>
              Ou clique no botão “INICIAR” do Windows conforme a seta vermelha
              indica,
            </li>
            <div className="flex justify-center">
              <Image
                src={"/assets/images/windows-images/update-2.png"}
                alt="UPDATE WINDOWS"
                width={500}
                height={500}
              />
            </div>
            <li>
              Após digite na barra de pesquisa a palavra “UPDATE” ou
              “ATUALIZAÇÃO”, depois clique em “VERIFICAR SE HÁ ATUALIZAÇÕES”,
              depois clique em “ABRIR”.
            </li>
            <div className="flex justify-center">
              <Image
                src={"/assets/images/windows-images/update-3.png"}
                alt="UPDATE WINDOWS"
                width={500}
                height={500}
              />
            </div>
            <li>
              Logo em seguida vai abrir uma janela conforme imagem abaixo,
              clique em “VERIFICAR SE HÁ ATUALIZAÇÕES”,
            </li>
            <div className="flex justify-center">
              <Image
                src={"/assets/images/windows-images/update-4.png"}
                alt="UPDATE WINDOWS"
                width={1000}
                height={500}
              />
            </div>
            <li>
              Se tiver atualizações disponíveis vai aparecer a atualização igual
              na imagem abaixo, depois clica em “INSTALAR”,
            </li>
            <div className="flex justify-center">
              <Image
                src={"/assets/images/windows-images/update-5.png"}
                alt="UPDATE WINDOWS"
                width={1000}
                height={500}
              />
            </div>
            <li>
              Quando estiver instalando vai aparecer igual pagina abaixo,
              mostrará a porcentagem da instalação,
            </li>
            <div className="flex justify-center">
              <Image
                src={"/assets/images/windows-images/update-6.png"}
                alt="UPDATE WINDOWS"
                width={1000}
                height={500}
              />
            </div>
            <li>
              Quando finalizar de instalar pode ser que apareça solicitação de
              “Reiniciar”, finalize e salve todos os documentos e programas que
              você estava utilizando, após fazer esse passo clique no botão para
              reiniciar, aguarde o Windows reiniciar e pronto seu computador
              esta atualizado.
            </li>
          </ol>
        </section>
      </div>
    </Layout>
  );
}
