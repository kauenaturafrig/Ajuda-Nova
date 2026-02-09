"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Sidebar() {
  const [openSubmenu, setOpenSubmenu] = useState(false);

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: '/assets/images/icons/icons8-dashboard-branco.png' },
    { label: 'Sistemas', path: '/links-uteis', icon: '/assets/images/icons/icons8-link-branco.png' },
    { label: 'Ramais', path: '/ramais', icon: '/assets/images/icons/icons8-phone-branco.png' },
    { label: 'Emails', path: '/emails', icon: '/assets/images/icons/icons8-mail-branco.png' },
  ];

  const submenuItems = [
    { label: 'Leitores', path: '/leitores', icon: '/assets/images/icons/icons8-barcode-reader-branco.png' },
    { label: 'Balanças', path: '/balancas', icon: '/assets/images/icons/icons8-scales-branco.png' },
    { label: 'Tanuresoft', path: '/tanuresoft', icon: '/assets/images/icons/icons8-cmd-branco.png' },
    { label: 'Impressora Zebra', path: '/impressoras-termicas', icon: '/assets/images/icons/icons8-print-branco.png' },
    { label: 'Windows', path: '/windows-page', icon: '/assets/images/icons/icons8-windows-branco.png' },
  ];

  return (
    <aside className="h-screen fixed top-0 left-0 w-64 bg-blue-900 text-white p-4 flex flex-col
      min-h-screen
      bg-gradient-to-b
      from-blue-700
      to-green-700
      bg-[length:400%_400%]
      animate-gradient-pulse
    ">
      {/* Header */}
      <div className="flex flex-col items-center mb-6 pt-4">
        <Image
          src={'/assets/images/logo-naturafrig.png'}
          width={200}
          height={200}
          alt="Naturafrig Logo"
          className='mb-6 mx-auto'
        />
      </div>

      {/* Menu Principal + Submenu */}
      <nav className="flex-1 space-y-2 mb-8 overflow-y-auto">
        {menuItems.map((item) => (
          <Link 
            key={item.path} 
            href={item.path} 
            className="hover:bg-yellow-500 p-2 rounded flex items-center my-1 transition-all duration-200"
          >
            <Image
              src={item.icon}
              alt={item.label}
              width={24}
              height={24}
              className='mr-3'
            />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}

        {/* Submenu com seta */}
        <div className="relative">
          <button
            onClick={() => setOpenSubmenu(!openSubmenu)}
            className="w-full hover:bg-yellow-500 p-2 rounded flex items-center my-1 justify-between transition-all duration-200 group"
          >
            <div className="flex items-center">
              <Image
                src="/assets/images/icons/icons8-manual-branco.png" // ícone pai do submenu
                alt="Configurações"
                width={24}
                height={24}
                className='mr-3'
              />
              <span className="font-medium">Manuais</span>
            </div>
            {/* Seta rotacionável */}
            <svg 
              className={`w-5 h-5 transition-transform duration-300 ${openSubmenu ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Itens do Submenu */}
          <div className={`overflow-hidden transition-all duration-300 ${openSubmenu ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            {submenuItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path} 
                className="hover:bg-yellow-400 bg-opacity-20 p-2 pl-12 rounded flex items-center my-1 ml-2 text-sm transition-all duration-200"
              >
                <Image
                  src={item.icon}
                  alt={item.label}
                  width={20}
                  height={20}
                  className='mr-2 flex-shrink-0'
                />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Footer FIXO no fundo da sidebar */}
      <footer className="mt-auto pt-4 pb-4 border-t border-blue-500/30">
        <div className="text-center space-y-1 text-xs font-light">
          <p>TI - Naturafrig 2026</p>
          <p>Feito por Kaue 💻</p>
        </div>
      </footer>
    </aside>
  );
}
