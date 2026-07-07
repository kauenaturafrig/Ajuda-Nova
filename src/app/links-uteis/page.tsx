"use client";

import Layout from "../../components/Layout";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const sistemas = [
  {
    url: "https://helpdesk.naturafrig.com.br/",
    name: "Chamados TI",
    icon: "/assets/images/logos/logo-help-ok - Copia.png",
    color: "border-orange-500/20 hover:border-orange-500 group-hover:text-orange-500 hover:shadow-orange-500/10",
    badge: "bg-orange-500/10 text-orange-600 dark:text-orange-400"
  },
  {
    url: "http://172.16.10.4:8220/webapp/",
    name: "PROTHEUS",
    icon: "/assets/images/logos/protheus.png",
    color: "border-slate-500/20 hover:border-slate-400 group-hover:text-slate-400 hover:shadow-slate-500/10",
    badge: "bg-slate-500/10 text-slate-600 dark:text-slate-300"
  },
  {
    url: "http://172.16.10.4:7017/login",
    name: "Smartview",
    icon: "/assets/images/logos/smartview.png",
    color: "border-blue-500/20 hover:border-blue-500 group-hover:text-blue-500 hover:shadow-blue-500/10",
    badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400"
  },
  {
    url: "http://172.16.8.5:6969/",
    name: "Busca PROTHEUS",
    icon: "/assets/images/icons/icons8-magnifying-glass-96.png",
    color: "border-sky-500/20 hover:border-sky-500 group-hover:text-sky-500 hover:shadow-sky-500/10",
    badge: "bg-sky-500/10 text-sky-600 dark:text-sky-400"
  },
  {
    url: "https://platform.senior.com.br/",
    name: "SeniorX",
    icon: "/assets/images/logos/logo-senior.png",
    color: "border-emerald-500/20 hover:border-emerald-500 group-hover:text-emerald-500 hover:shadow-emerald-500/10",
    badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
  },
  {
    url: "https://webmail.naturafrig.com.br/",
    name: "Webmail",
    icon: "/assets/images/logos/webmail-logo.svg",
    color: "border-neutral-500/20 hover:border-neutral-400 group-hover:text-neutral-400 hover:shadow-neutral-500/5",
    badge: "bg-neutral-500/10 text-neutral-600 dark:text-neutral-300"
  },
];

export default function LinksUtil() {
  const openInNewTab = (url: string) => {
    const newTab = window.open(url, "_blank", "noopener,noreferrer");
    newTab?.focus();
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Header no mesmo alinhamento fino dos painéis anteriores */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-gray-100 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                Sistemas Naturafrig
              </h1>
              <Image
                src="/assets/images/icons/icons8-link-preto.png"
                alt="Logo Link"
                width={28}
                height={28}
                className="dark:invert opacity-80"
              />
            </div>
            <p className="text-base text-gray-500 dark:text-gray-400">
              Acesso corporativo unificado aos sistemas essenciais da empresa.
            </p>
          </div>
        </div>

        {/* Dashboard Grid Futurista e Clean */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sistemas.map(({ url, name, icon, color, badge }) => (
            <div
              key={url}
              onClick={() => openInNewTab(url)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  openInNewTab(url);
                }
              }}
              className={`
                group relative flex flex-col items-center justify-center h-48
                bg-white dark:bg-neutral-900 
                border rounded-3xl p-6 shadow-sm cursor-pointer
                transition-all duration-300 ease-out
                hover:-translate-y-1.5 hover:shadow-xl
                ${color}
              `}
            >
              {/* Badge indicadora discreta no topo superior direito */}
              <div className={`absolute top-4 right-4 flex items-center justify-center p-1.5 rounded-xl opacity-40 group-hover:opacity-100 transition-opacity duration-300 ${badge}`}>
                <ArrowUpRight size={14} />
              </div>

              {/* Logo Centralizado com efeito de flutuação */}
              <div className="relative w-36 h-16 mb-4 transform group-hover:scale-105 transition-transform duration-300">
                <Image
                  src={icon}
                  alt={name}
                  fill
                  className="object-contain filter dark:brightness-110 drop-shadow-sm"
                />
              </div>

              {/* Nome do Sistema em Texto Sólido e Clean */}
              <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200">
                {name}
              </h3>

              {/* Linha de brilho sutil no fundo interno do card */}
              <div className="absolute inset-x-12 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}