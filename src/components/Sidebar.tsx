"use client";

import Link from 'next/link';
import Image from 'next/image';

export default function Sidebar() {
  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: '/assets/images/icons/icons8-dashboard-branco.png' },
    { label: 'Links', path: '/links-uteis', icon: '/assets/images/icons/icons8-link-branco.png' },
    { label: 'Ramais', path: '/ramais', icon: '/assets/images/icons/icons8-phone-branco.png' },
    { label: 'Emails', path: '/emails', icon: '/assets/images/icons/icons8-mail-branco.png' },
    { label: 'Leitores', path: '/leitores', icon: '/assets/images/icons/icons8-barcode-reader-branco.png' },
    { label: 'Balanças', path: '/balancas', icon: '/assets/images/icons/icons8-scales-branco.png' },
    { label: 'Tanuresoft', path: '/tanuresoft', icon: '/assets/images/icons/icons8-cmd-branco.png' },
    { label: 'Impressora Zebra', path: '/impressoras-termicas', icon: '/assets/images/icons/icons8-print-branco.png' },
    { label: 'Windows', path: '/windows-page', icon: '/assets/images/icons/icons8-windows-branco.png' },
  ]

  return (
    <aside className="h-screen overflow-y-auto fixed top-0 left-0 w-64 bg-blue-900 text-white p-4 space-y-4
          min-h-screen
          bg-gradient-to-b
          from-blue-700
          to-green-700
          bg-[length:400%_400%]
          animate-gradient-pulse
          items-center
          justify-center
          font-bold
    ">
      <div>
        <Image
          src={'/assets/images/logo-naturafrig.png'}
          width={150}
          height={150}
          alt="Picture of the author"
          className='mb-6 mx-auto'
        />
        <div className='w-[100%] flex justify-center'>
          <h2 className="text-xl font-bold mb-5">Manuais de Ajuda</h2>
        </div>
        <div className='mb-16'>
          {menuItems.map((item) => (
            <Link key={item.path} href={item.path} className="hover:bg-yellow-500 p-1 rounded flex items-center my-2">
              <Image
                src={item.icon}
                alt={item.label}
                width={30}
                height={30}
                className='mr-3'
              />
              {item.label}
            </Link>
          ))}
        </div>
        <footer className='left-8 bottom-10'>
          <div className='flex justify-center items-center mx-auto'>
            <p className='mt-9 font-light'>TI - Nova Andradina 2025</p>
          </div>
          <div className='flex justify-center items-center mx-auto'>
            <p className='font-light'>Feito por Kaue 💻</p>
          </div>
        </footer>
      </div>
    </aside>
  )
}
