"use client";

import Layout from "../../components/Layout";
import Link from "next/link";
import Image from "next/image";
import AnimatedDarkModeToggle from "../../components/AnimatedDarkModeToggle";
import {
  Link2,
  ArrowRight,
  Phone,
  Mail,
  Newspaper,
  Megaphone,
} from "lucide-react";

type Sistema = {
  url: string;
  name: string;
  description: string;
  badge?: string;
  icon: string;
  hoverBorder: string;
  badgeStyle?: string;
};

const sistemas: Sistema[] = [
  {
    url: "https://helpdesk.naturafrig.com.br/",
    name: "Chamados TI",
    description: "Abra e acompanhe seus chamados de TI",
    badge: "Novo",
    icon: "/assets/images/logos/logo-help-ok - Copia.png",
    hoverBorder: "hover:border-orange-500/50 hover:shadow-orange-500/10",
    badgeStyle: "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
  },
  {
    url: "http://172.16.10.4:8220/webapp/",
    name: "PROTHEUS",
    description: "Acesse o sistema TOTVS Protheus",
    icon: "/assets/images/logos/protheus.png",
    hoverBorder: "hover:border-blue-600/50 hover:shadow-blue-600/10",
  },
  {
    url: "http://172.16.10.4:7017/login",
    name: "Smartview",
    description: "Painéis e indicadores em tempo real",
    icon: "/assets/images/logos/smartview.png",
    hoverBorder: "hover:border-purple-500/50 hover:shadow-purple-500/10",
  },
  {
    url: "http://172.16.8.5:6969/",
    name: "Busca PROTHEUS",
    description: "Pesquise por informações no Protheus",
    icon: "/assets/images/icons/icons8-magnifying-glass-96.png",
    hoverBorder: "hover:border-sky-500/50 hover:shadow-sky-500/10",
  },
  {
    url: "https://platform.senior.com.br/",
    name: "SeniorX",
    description: "Sistema de gestão Senior",
    icon: "/assets/images/logos/logo-senior.png",
    hoverBorder: "hover:border-emerald-500/50 hover:shadow-emerald-500/10",
  },
  {
    url: "https://webmail.naturafrig.com.br/",
    name: "Webmail",
    description: "Acesse seu e-mail corporativo",
    icon: "/assets/images/logos/webmail-logo.svg",
    hoverBorder: "hover:border-neutral-400/50 hover:shadow-neutral-400/10",
  },
];

const userName = "Seja bem vindo(a)"; // Substitua pelo nome do usuário, se disponível

type QuickLink = {
  href: string;
  name: string;
  icon: React.ReactNode;
  iconBg: string;
};

const quickLinks: QuickLink[] = [
  {
    href: "/ramais",
    name: "Ramais",
    icon: <Phone size={18} />,
    iconBg: "bg-gradient-to-br from-amber-500 to-amber-700",
  },
  {
    href: "/emails",
    name: "Emails",
    icon: <Mail size={18} />,
    iconBg: "bg-gradient-to-br from-sky-500 to-sky-700",
  },
  {
    href: "/noticias",
    name: "Notícias",
    icon: <Newspaper size={18} />,
    iconBg: "bg-gradient-to-br from-blue-500 to-indigo-600",
  },
  {
    href: "/recados",
    name: "Recados",
    icon: <Megaphone size={18} />,
    iconBg: "bg-gradient-to-br from-orange-500 to-red-600",
  },
];

export default function DashboardPage() {
  const openInNewTab = (url: string) => {
    const newTab = window.open(url, "_blank", "noopener,noreferrer");
    newTab?.focus();
  };

  return (
    <Layout>
      <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Header Superior */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-gray-100 dark:border-neutral-800/60">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                Olá, {userName}! 
                {/* <span className="animate-pulse"> */}
                <span className="">
                  👋
                </span>
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base mt-1">
                Acesse rapidamente todos os sistemas essenciais da empresa
              </p>
            </div>

            <div className="flex items-center gap-3 bg-zinc-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl px-4 py-2 shadow-sm">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Tema
              </span>
              <AnimatedDarkModeToggle />
            </div>
          </div>

          {/* Título da seção de Sistemas */}
          <div className="flex items-center gap-3 mb-6">
            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
              <Link2 size={16} />
            </span>
            <div>
              <h2 className="font-bold text-lg text-gray-900 dark:text-white">
                Sistemas Corporativos
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Tudo que você precisa em um só lugar
              </p>
            </div>
          </div>

          {/* Grid de Sistemas Futurista */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {sistemas.map((sistema) => (
              <div
                key={sistema.url}
                onClick={() => openInNewTab(sistema.url)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") openInNewTab(sistema.url);
                }}
                className={`group relative flex items-center gap-4 bg-white dark:bg-neutral-900/40 rounded-2xl border border-gray-100 dark:border-neutral-800/80 shadow-sm p-4 cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg ${sistema.hoverBorder}`}
              >
                {/* Container do Logo - Aumentado e com fundo de alto contraste */}
                <div className="relative w-20 h-20 shrink-0 bg-zinc-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl p-2.5 flex items-center justify-center overflow-hidden transition-all duration-300 shadow-inner group-hover:bg-white dark:group-hover:bg-neutral-750">
                  <div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-300">
                    <Image
                      src={sistema.icon}
                      alt={sistema.name}
                      fill
                      className="object-contain filter dark:brightness-110"
                    />
                  </div>
                </div>

                {/* Textos */}
                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-base truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {sistema.name}
                    </h3>
                    {sistema.badge && (
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${sistema.badgeStyle}`}>
                        {sistema.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5 line-clamp-2 leading-relaxed">
                    {sistema.description}
                  </p>
                </div>

                {/* Mini botão de link */}
                <span className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7 rounded-lg bg-zinc-50 dark:bg-neutral-950 border border-gray-100 dark:border-neutral-800 text-gray-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 group-hover:bg-blue-500 group-hover:text-white group-hover:border-blue-500">
                  <ArrowRight size={12} />
                </span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100 dark:bg-neutral-800/60 my-8" />

          {/* Grid de Acesso Rápido com gradientes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-3.5 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm p-3.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
              >
                <span className={`flex items-center justify-center w-9 h-9 shrink-0 rounded-xl text-white shadow-md ${item.iconBg}`}>
                  {item.icon}
                </span>
                <span className="font-semibold text-gray-800 dark:text-neutral-200 text-sm group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                  {item.name}
                </span>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </Layout>
  );
}