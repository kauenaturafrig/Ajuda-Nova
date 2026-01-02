import Layout from '@/components/Layout'
import Image from 'next/image'
import Link from 'next/link'

export default function PrintHeadClean() {
  return (
    <Layout>
      <Link href="/leitores">
        <span className="text-blue-600 dark:text-blue-400 hover:underline font-semibold text-3xl ml-5">← Voltar</span>
      </Link>
      <div className="container mx-auto p-6 max-w-4xl bg-white shadow-lg rounded-lg my-8">
        <h1 className="text-4xl font-extrabold text-blue-800 mb-6 border-b-4 border-blue-200 pb-2">
          ZEBRA DS2278
        </h1>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Restaurar de fábrica</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Se você precisa "dar um reset", restaurar de fábrica, escaneie esse código
          </p>
          <div className='flex justify-center'>
              <Image
                src={'/assets/images/leitores/ZEBRA-DS2278/leitor1.png'}
                alt="zebrads2278"
                width={500}
                height={500}
              />
            </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">ENTER automático</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Se você precisa adicionar o ENTER AUTOMÁTICO, escaneie esse código
          </p>
          <div className='flex justify-center'>
              <Image
                src={'/assets/images/leitores/ZEBRA-DS2278/leitor2.png'}
                alt="zebrads2278"
                width={500}
                height={500}
              />
            </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Código de Barras Boleto</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Se você precisa ler um código de barras de um boleto de pagamento, restaurar de fábrica, escaneie esse código
          </p>
          <div className='flex justify-center'>
              <Image
                src={'/assets/images/leitores/ZEBRA-DS2278/leitor3.png'}
                alt="zebrads2278"
                width={500}
                height={500}
              />
            </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">PIX</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Se você precisa ler um código PIX, escaneie esse código
          </p>
          <div className='flex justify-center'>
              <Image
                src={'/assets/images/leitores/ZEBRA-DS2278/leitor4.png'}
                alt="zebrads2278"
                width={500}
                height={500}
              />
            </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Emular o zero à Esquerda</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Se você precisa emular o ZERO À ESQUERDA, escaneie esse código
          </p>
          <div className='flex justify-center'>
              <Image
                src={'/assets/images/leitores/ZEBRA-DS2278/leitor5.png'}
                alt="zebrads2278"
                width={500}
                height={500}
              />
            </div>
        </section>
      </div>
    </Layout>
  )
}