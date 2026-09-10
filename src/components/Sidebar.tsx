"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Sidebar() {
  const [openSubmenu, setOpenSubmenu] = useState(false);

  const menuItems = [
    { label: 'Início', path: '/dashboard', icon: '/assets/images/icons/icons8-dashboard-branco.png' },
    { label: 'Sistemas', path: '/links-uteis', icon: '/assets/images/icons/icons8-link-branco.png' },
    { label: 'Ramais', path: '/ramais', icon: '/assets/images/icons/icons8-phone-branco.png' },
    { label: 'Emails', path: '/emails', icon: '/assets/images/icons/icons8-mail-branco.png' },
    { label: 'Notícias', path: '/noticias', icon: '/assets/images/icons/icons8-news-branco.png' },
    { label: 'Recados', path: '/recados', icon: '/assets/images/icons/icons8-megaphone-branco.png' },
    { label: 'Agenda', path: '/agenda', icon: '/assets/images/icons/icons8-tear-off-calendar-branco.png' },
  ];

  const submenuItems = [
    { label: 'Leitores', path: '/leitores', icon: '/assets/images/icons/icons8-barcode-reader-branco.png' },
    { label: 'Balanças', path: '/balancas', icon: '/assets/images/icons/icons8-scales-branco.png' },
    { label: 'Tanuresoft', path: '/tanuresoft', icon: '/assets/images/icons/icons8-cmd-branco.png' },
    { label: 'Impressora Zebra', path: '/impressoras-termicas', icon: '/assets/images/icons/icons8-print-branco.png' },
    { label: 'Windows', path: '/windows-page', icon: '/assets/images/icons/icons8-windows-branco.png' },
  ];

  return (
    <aside
      className={`h-screen fixed top-0 left-0 z-50 bg-gradient-to-b from-blue-700 to-green-700 bg-[length:400%_400%] animate-gradient-pulse text-white flex flex-col transition-all duration-300
        w-20 hover:w-64 group px-2 hover:px-4 overflow-x-hidden overflow-y-auto
      `}
      onMouseEnter={() => setOpenSubmenu(openSubmenu)}
      onMouseLeave={() => setOpenSubmenu(false)}
    >
      {/* Header */}
      <div className="flex flex-col items-center mb-4 pt-3">
        <Image
          src='/assets/images/logo-naturafrig.png'
          width={60}
          height={60}
          alt="Naturafrig Logo"
          className='mb-2 mx-auto group-hover:w-40 group-hover:h-auto group-hover:mx-0 transition-all duration-300'
        />
      </div>

      {/* Menu Principal + Submenu */}
      <nav className="flex-1 space-y-3 mb-6 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className="hover:bg-yellow-500 rounded flex items-center my-1 transition-all duration-200 mx-2.5"
          >
            {/* Ícone centralizado quando minimizado, alinhado à esquerda quando expandido */}
            <div className="flex items-center justify-center w-10 shrink-0 group-hover:justify-start">
              <Image
                src={item.icon}
                alt={item.label}
                width={20}
                height={20}
              />
            </div>

            {/* Legenda só aparece quando expandido */}
            <span className="font-normal text-xs sm:text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              {item.label}
            </span>
          </Link>
        ))}

        {/* Submenu */}
        <div className="relative">
          <button
            onClick={() => setOpenSubmenu(!openSubmenu)}
            className="w-full hover:bg-yellow-500 rounded flex items-center my-1 transition-all duration-200 mx-2.5"
          >
            {/* Ícone centralizado quando minimizado, alinhado à esquerda quando expandido */}
            <div className="flex items-center justify-center w-10 shrink-0 group-hover:justify-start">
              <Image
                src="/assets/images/icons/icons8-manual-branco.png"
                alt="Configurações"
                width={20}
                height={20}
              />
            </div>

            <span className="font-normal text-xs sm:text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              Manuais
            </span>
          </button>

          <div className={`overflow-hidden transition-all duration-300 ${openSubmenu ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} mx-3`}>
            {submenuItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="hover:bg-yellow-400 bg-opacity-20 rounded flex items-center my-1 ml-2 text-xs sm:text-sm transition-all duration-200"
              >
                {/* Ícone centralizado quando minimizado, alinhado à esquerda quando expandido */}
                <div className="flex items-center justify-center w-10 shrink-0 group-hover:justify-start">
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={18}
                    height={18}
                  />
                </div>

                <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        <Link
          key={"/admin"}
          href={"/admin"}
          className="hover:bg-yellow-500 rounded flex items-center my-1 transition-all duration-200 mx-2.5"
        >
          {/* Ícone centralizado quando minimizado, alinhado à esquerda quando expandido */}
          <div className="flex items-center justify-center w-10 shrink-0 group-hover:justify-start">
            <Image
              src="/assets/images/icons/icons8-admin-branco.png"
              alt="Admin"
              width={20}
              height={20}
            />
          </div>

          <span className="font-normal text-xs sm:text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Admin
          </span>
        </Link>
      </nav>

      {/* Footer visível só quando expandido */}
      <footer className="mt-auto pt-3 pb-3 border-t border-blue-500/30 hidden group-hover:block">
        <div className="text-center space-y-1 text-xs font-light">
          <p className="text-[10px] sm:text-xs">TI - Naturafrig 2026</p>
          <p className="text-[10px] sm:text-xs">Feito por Kaue 💻</p>
        </div>
      </footer>
    </aside>
  );
}