import Layout from '@/components/Layout'
import Image from 'next/image'
import Link from 'next/link'

export default function Alfa() {
  return (
    <Layout>
      <Link href="/balancas">
        <span className="text-blue-600 dark:text-blue-400 hover:underline font-semibold text-3xl ml-5">← Voltar</span>
      </Link>
      <div className="container mx-auto p-6 max-w-4xl bg-white shadow-lg rounded-lg my-8">
        <h1 className="text-4xl font-extrabold text-blue-800 mb-6 border-b-4 border-blue-200 pb-2">
          Função Tara (TARA) - Indicadores de Pesagem Alfa 3100D/DS
        </h1>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">O que é a Função Tara?</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            A função <span className="font-semibold text-blue-700">Tara</span> é utilizada para descontar o peso de recipientes ou embalagens,
            permitindo que a balança indique apenas o peso líquido do material contido. Essencial para medições precisas.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Configurando a Tara Manual (Modo Editável)</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Para configurar manualmente o valor da tara no indicador Alfa 3104D, siga os passos gerais abaixo:
          </p>
          <ol className="list-decimal list-inside text-lg text-gray-700 ml-4 space-y-3">
            <li>
              Clique no botão <code className="bg-gray-200 text-purple-700 px-2 py-1 rounded-md font-mono">TARA</code>.
            </li>
            <div className='flex justify-center'>
              <Image
                src={'/assets/images/balancas/alfa/alfa-3104c-tara-manual-1.png'}
                alt="Logo Alfa"
                width={500}
                height={500}
              />
            </div>
            <li>
              Para digitar os números, navegue para o lado direito com a tecla “→ TARA” e com o botão “← ZERO“ aumenta o número, se caso passar, continue clicando na mesma tecla até voltar.
            </li>
            <li>
              No final, só clicar na tecla <code className="bg-gray-200 text-purple-700 px-2 py-1 rounded-md font-mono">CONFIG</code> e pronto.
            </li>
            <div className='flex justify-center'>
              <Image
                src={'/assets/images/balancas/alfa/alfa-3104c-tara-manual-2.png'}
                alt="Logo Alfa"
                width={500}
                height={500}
              />
            </div>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Modos de Tara Disponíveis</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            O indicador Alfa 3104D oferece diversos modos de operação para a função Tara. Para a operação de tara manual, os modos mais relevantes são:
          </p>
          <ul className="list-disc list-inside text-lg text-gray-700 ml-4 space-y-2">
            <li>
              <span className="font-medium text-green-700">"Editável" (E)</span>: Permite a inserção manual do valor da tara.
            </li>
            <li>
              <span className="font-medium text-green-700">"Editável, salvando valor de TARA" (Eg)</span>: Permite a inserção manual e armazena o valor para futuras pesagens.
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Ativação da Função Tara</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            A função Tara pode ser ativada de três maneiras distintas, dependendo do contexto de uso:
          </p>
          <ol className="list-decimal list-inside text-lg text-gray-700 ml-4 space-y-2">
            <li>
              Pressionando a tecla <code className="bg-gray-200 text-purple-700 px-2 py-1 rounded-md font-mono">&lt;TARA&gt;</code>:
              A forma mais comum e direta de ativar a função.
            </li>
            <li>
              Via comando <code className="bg-gray-200 text-purple-700 px-2 py-1 rounded-md font-mono">TARA REMOTO</code>:
              Utilizado em sistemas de automação para ativação externa.
            </li>
            <li>
              Via protocolo de comunicação:
              Para integração com sistemas de software ou outros dispositivos através da interface serial.
            </li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Observação Importante</h2>
          <p className="text-lg leading-relaxed bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-md">
            O manual indica que, através da função de TARA, é possível obter a indicação de peso <span className="font-bold">LÍQUIDO negativo</span>
            caso haja remoção de material após a tara.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Para Mais Detalhes</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Para informações específicas sobre as teclas de navegação, o processo exato de seleção do modo de tara editável,
            e outras funcionalidades avançadas, é altamente recomendável consultar as seções "Funções das Teclas" e "Configuração e Operação"
            do <span className="font-semibold text-blue-700">Manual do Usuário da Balança Alfa 3104D</span>.
          </p>
        </section>
      </div>
    </Layout>
  )
}