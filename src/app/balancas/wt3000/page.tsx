import Layout from "../../components/Layout";
import Image from "next/image";
import Link from "next/link";

export default function WT3000() {
  return (
    <Layout>
      <Link href="/balancas">
        <span className="text-blue-600 dark:text-blue-400 hover:underline font-semibold text-3xl ml-5">
          ← Voltar
        </span>
      </Link>
      <div className="container mx-auto p-6 max-w-4xl bg-white shadow-lg rounded-lg my-8">
        <h1 className="text-4xl font-extrabold text-blue-800 mb-6 border-b-4 border-blue-200 pb-2">
          Tara manual na balança Weightech WT3000
        </h1>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Função de Tara Manual
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            A função de tara manual é utilizada para descontar o peso de
            recipientes em geral, permitindo que o usuário insira o valor do
            peso que será descontado, sem a necessidade de pesar o recipiente
            vazio.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Passos para configurar a tara manual:
          </h2>
          <ol className="list-decimal list-inside text-lg text-gray-700 ml-4 space-y-2">
            <li>
              Com a balança sem carga aplicada (plataforma vazia), pressione a
              tecla{" "}
              <code className="bg-gray-200 text-purple-700 px-2 py-1 rounded-md font-mono">
                &lt;TARA&gt;
              </code>
              .
            </li>
            <div className="flex justify-center">
              <Image
                src={"/assets/images/balancas/wt3000/wt3000-tara-manual-1.png"}
                alt="Logo WT"
                width={500}
                height={500}
              />
            </div>
            <li>O display mostrará "pt__" (pré-tara).</li>
            <li>
              Digite o valor da tara desejada utilizando as teclas de navegação
              (setas para cima/baixo e para os lados, conforme o modelo da
              balança e as indicações do manual).
            </li>
            <li>
              Após digitar o valor da tara, pressione a tecla [ENTER] (ou a
              tecla de confirmação, conforme o manual) para confirmar.
            </li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Para limpar o valor de tara manual:
          </h2>
          <ul className="list-item list-disc text-lg text-gray-700 ml-4 space-y-2">
            <li>
              Pressione a tecla{" "}
              <code className="bg-gray-200 text-purple-700 px-2 py-1 rounded-md font-mono">
                &lt;TARA&gt;
              </code>{" "}
              com a plataforma vazia.
            </li>
            <li>
              Alternativamente, insira um valor nulo de tara (0) e confirme com
              a plataforma sem peso aplicado.
            </li>
          </ul>
        </section>
      </div>
    </Layout>
  );
}
