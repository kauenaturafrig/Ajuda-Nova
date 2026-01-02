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
                    VOYAGER 1472G
                </h1>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Restaurar de fábrica</h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        Se você precisa "dar um reset", restaurar de fábrica, escaneie esse código
                    </p>
                    <div className='flex justify-center'>
                        <Image
                            src={'/assets/images/leitores/VOYAGER-1472G/leitor1.png'}
                            alt="voyager1472g"
                            width={500}
                            height={500}
                        />
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">ENTER automático</h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        Se você precisa habilitar o ENTER, escaneie esse código
                    </p>
                    <div className='flex justify-center'>
                        <Image
                            src={'/assets/images/leitores/VOYAGER-1472G/leitor2.png'}
                            alt="voyager1472g"
                            width={500}
                            height={500}
                        />
                    </div>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        Depois escaneie esse código para funcionar corretamente:
                    </p>
                    <div className='flex justify-center'>
                        <Image
                            src={'/assets/images/leitores/VOYAGER-1472G/leitor3.png'}
                            alt="voyager1472g"
                            width={500}
                            height={500}
                        />
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Leitura Contínua</h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        Se você precisa colocar na "Leitura Contínua" (Quando não quiser ficar bipando na mão),escaneie esse código
                    </p>
                    <div className='flex justify-center'>
                        <Image
                            src={'/assets/images/leitores/VOYAGER-1472G/leitor4.png'}
                            alt="voyager1472g"
                            width={500}
                            height={500}
                        />
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Desligar LED Leitura Contínua</h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        Se você precisa desligar o LED da Leitura Contínua, escaneie esse código
                    </p>
                    <div className='flex justify-center'>
                        <Image
                            src={'/assets/images/leitores/VOYAGER-1472G/leitor5.png'}
                            alt="voyager1472g"
                            width={500}
                            height={500}
                        />
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Converter UPC para EAN-13</h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        Se você precisa converter para o formato de leitura EAN-13, escaneie esse código
                    </p>
                    <div className='flex justify-center'>
                        <Image
                            src={'/assets/images/leitores/VOYAGER-1472G/leitor6.png'}
                            alt="voyager1472g"
                            width={500}
                            height={500}
                        />
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Converter padrão USA (EUA) para BR</h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        Se você precisa converter para o padrão BR, escaneie esse código
                    </p>
                    <div className='flex justify-center'>
                        <Image
                            src={'/assets/images/leitores/VOYAGER-1472G/leitor7.png'}
                            alt="voyager1472g"
                            width={500}
                            height={500}
                        />
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">USB HID</h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        Se você precisa habilitar o USB HID, escaneie esse código
                    </p>
                    <div className='flex justify-center'>
                        <Image
                            src={'/assets/images/leitores/VOYAGER-1472G/leitor9.png'}
                            alt="voyager1472g"
                            width={500}
                            height={500}
                        />
                    </div>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Entrada USB HID de código no Tablet</h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        Se você precisa habilitar a entrada USB HID de código no Tablet, escaneie esse código
                    </p>
                    <div className='flex justify-center'>
                        <Image
                            src={'/assets/images/leitores/VOYAGER-1472G/leitor8.png'}
                            alt="voyager1472g"
                            width={500}
                            height={500}
                        />
                    </div>
                </section>
            </div>
        </Layout>
    )
}