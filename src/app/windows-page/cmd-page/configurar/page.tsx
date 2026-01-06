import Layout from "../../../../components/Layout";
import Image from "next/image";
import Link from "next/link";

export default function CMDconfig() {
  return (
    <Layout>
      <Link href="/windows-page/cmd-page/">
        <span className="text-blue-600 dark:text-blue-400 hover:underline font-semibold text-3xl ml-5">
          ← Voltar
        </span>
      </Link>
      <div className="container mx-auto p-6 max-w-4xl bg-white shadow-lg rounded-lg my-8">
        <h1 className="text-4xl font-extrabold text-blue-800 mb-6 border-b-4 border-blue-200 pb-2">
          Ajuste de tamanho da janela
        </h1>

        <section className="mb-8">
          <ol className="list-decimal list-inside text-lg text-gray-700 ml-4 space-y-3">
            <li>Pesquise por “CMD” no menu iniciar:</li>
            <div className="flex justify-center">
              <Image
                src={"/assets/images/cmd-imgs/cmd-config/cmd-1.png"}
                alt="CMD CONFIG"
                width={500}
                height={500}
              />
            </div>
            <li>
              Quando iniciar, clicar com o botão esquerdo na janela e ir para
              “Propriedades”:
            </li>
            <div className="flex justify-center">
              <Image
                src={"/assets/images/cmd-imgs/cmd-config/cmd-2.png"}
                alt="CMD CONFIG"
                width={1000}
                height={500}
              />
            </div>
            <li>
              Na aba “Fonte” Ajustar o tamanho para 24 e a fonte para Lucida
              Console
            </li>
            <div className="flex justify-center">
              <Image
                src={"/assets/images/cmd-imgs/cmd-config/cmd-3.png"}
                alt="CMD CONFIG"
                width={1000}
                height={500}
              />
            </div>
            <li>
              Na aba “Layout” ajustar Largura em 80 e Altura em 25 e marcar as
              caixas de seleção assim como na imagem abaixo.
            </li>
            <div className="flex justify-center">
              <Image
                src={"/assets/images/cmd-imgs/cmd-config/cmd-4.png"}
                alt="CMD CONFIG"
                width={1000}
                height={500}
              />
            </div>
            <li>Clicar em ok e abrir novamente o terminal.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Observação Importante
          </h2>
          <p className="text-lg leading-relaxed bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md">
            Se a janela não estiver no modo de visualização igual ao desse
            manual, vá até a seção
            <Link href={"/windows-page/cmd-page/atualizar"}>
              <strong className="text-blue-400">
                {" "}
                [Atualização do Sistema TANURESOFT]
              </strong>
            </Link>
          </p>
          <p className="text-lg mt-5 leading-relaxed bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md">
            Importante lembrar de só fixar o CMD na barra de tarefas após
            concluir esses passos.
          </p>
        </section>
      </div>
    </Layout>
  );
}
