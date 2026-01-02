import Layout from '@/components/Layout'
import Image from 'next/image'
import Link from 'next/link'

export default function ImpressorasTermicas() {
  return (
    <Layout>
            <div className='max-w-[90%] mx-auto mt-9 pt-2'>
        <div className='flex items-center mt-3 mb-7'>
            <h1 className="font-bold text-5xl dark:text-white pr-4">Leitores de código de barra</h1>
            <Image
                  src={'/assets/images/icons/icons8-barcode-reader-preto.png'}
                  alt="Logo Leitores"
                  width={50}
                  height={50}
                  className='mr-5 dark:invert'
              />
        </div>
        <p className='mb-8 text-2xl dark:text-white'>O que você busca?</p>
        <section className='max-w-[90%] mx-auto'>
          <Link href={'/leitores/zebra2278'} className="flex items-center border-l-4 border-green-700 mb-5 space-x-2 dark:text-white hover:text-white p-2 rounded text-2xl hover:animate-gradient-pulse-left hover:bg-gradient-to-r hover:from-green-600 hover:to-green-900 hover:bg-[length:400%_400%]">
          <div className='justify-center'>
            <Image
              src={'/assets/images/leitores/ZEBRA-DS2278.png'}
              alt="zebra2278"
              width={200}
              height={200}
              className='mr-5'
            />
          </div>
            <span>ZEBRA DS2278</span>
          </Link>
          <Link href={'/leitores/voyager1472g'} className="flex items-center border-l-4 border-green-700 mb-5 space-x-2 dark:text-white hover:text-white p-2 rounded text-2xl hover:animate-gradient-pulse-left hover:bg-gradient-to-r hover:from-green-600 hover:to-green-900 hover:bg-[length:400%_400%]">
          <div className='justify-center'>
            <Image
              src={'/assets/images/leitores/VOYAGER-1472G.png'}
              alt="voyager1472g"
              width={200}
              height={200}
              className='mr-5'
            />
          </div>
            <span>VOYAGER 1472G</span>
          </Link>
        </section>
      </div>
    </Layout>
  )
}
