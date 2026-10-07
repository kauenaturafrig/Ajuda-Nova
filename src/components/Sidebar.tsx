"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  Link as Link1,
  Phone,
  Mail,
  Newspaper,
  Megaphone,
  Calendar,
  TableOfContents,
  ScanLine,
  Scale,
  Terminal,
  Printer,
  Monitor,
  ShieldUser,
  type LucideIcon
} from 'lucide-react';

export default function Sidebar() {
  const [openSubmenu, setOpenSubmenu] = useState(false);

  const menuItems: { label: string; path: string; icon: LucideIcon }[] = [
    { label: 'Início', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Sistemas', path: '/links-uteis', icon: Link1 },
    { label: 'Ramais', path: '/ramais', icon: Phone },
    { label: 'Emails', path: '/emails', icon: Mail },
    { label: 'Notícias', path: '/noticias', icon: Newspaper },
    { label: 'Recados', path: '/recados', icon: Megaphone },
    { label: 'Agenda', path: '/agenda', icon: Calendar },
  ];

  const submenuItems: { label: string; path: string; icon: LucideIcon }[] = [
    { label: 'Leitores', path: '/leitores', icon: ScanLine },
    { label: 'Balanças', path: '/balancas', icon: Scale },
    { label: 'Tanuresoft', path: '/tanuresoft', icon: Terminal },
    { label: 'Impressora Zebra', path: '/impressoras-termicas', icon: Printer },
    { label: 'Windows', path: '/windows-page', icon: Monitor },
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
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              href={item.path}
              className="hover:bg-yellow-500 rounded flex items-center my-1 hover:p-2 transition-all duration-200 mx-2.5"
            >
              {/* Ícone centralizado quando minimizado, alinhado à esquerda quando expandido */}
              <div className="flex items-center justify-center w-10 shrink-0 group-hover:justify-start">
                <span className="flex items-center justify-center w-6 h-6">
                  <Icon size={20} />
                </span>
              </div>

              {/* Legenda só aparece quando expandido */}
              <span className="font-normal text-xs sm:text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Submenu */}
        <div className="relative">
          <button
            onClick={() => setOpenSubmenu(!openSubmenu)}
            className="w-full hover:bg-yellow-500 rounded flex items-center my-1 hover:p-2 transition-all duration-200 mx-2.5"
          >
            {/* Ícone centralizado quando minimizado, alinhado à esquerda quando expandido */}
            <div className="flex items-center justify-center w-10 shrink-0 group-hover:justify-start">
              <span className="flex items-center justify-center w-6 h-6">
                <TableOfContents size={20} />
              </span>
            </div>

            <span className="font-normal text-xs sm:text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              Manuais
            </span>
          </button>

          <div className={`overflow-hidden transition-all duration-300 ${openSubmenu ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} mx-3`}>
            {submenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className="hover:bg-yellow-400 bg-opacity-20 rounded flex items-center my-1 hover:p-2 ml-2 text-xs sm:text-sm transition-all duration-200"
                >
                  {/* Ícone centralizado quando minimizado, alinhado à esquerda quando expandido */}
                  <div className="flex items-center justify-center w-10 shrink-0 group-hover:justify-start">
                    <span className="flex items-center justify-center w-6 h-6">
                      <Icon size={20} />
                    </span>
                  </div>

                  <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <Link
          key={"/admin"}
          href={"/admin"}
          className="hover:bg-yellow-500 rounded flex items-center my-1 hover:p-2 transition-all duration-200 mx-2.5"
        >
          {/* Ícone centralizado quando minimizado, alinhado à esquerda quando expandido */}
          <div className="flex items-center justify-center w-10 shrink-0 group-hover:justify-start">
            <span className="flex items-center justify-center w-6 h-6">
              <ShieldUser size={20} />
            </span>
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