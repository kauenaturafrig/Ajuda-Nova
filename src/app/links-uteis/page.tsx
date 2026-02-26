"use client";

import Layout from "../../components/Layout";
import Image from "next/image";

const sistemas = [
  {
    url: "https://helpdesk.naturafrig.com.br/",
    name: "Chamados TI",
    icon: "/assets/images/logos/logo-help-ok - Copia.png",
    color: "bg-gradient-to-br from-sky-500 to-sky-700",
  },
  {
    url: "http://172.16.10.4:8220/webapp/",
    name: "PROTHEUS", 
    icon: "/assets/images/logos/protheus.png",
    color: "bg-gradient-to-br from-blue-600 to-blue-800",
  },
  {
    url: "http://172.16.10.4:7017/login",
    name: "Smartview",
    icon: "/assets/images/logos/smartview.png",
    color: "bg-gradient-to-br from-slate-600 to-slate-800",
  },
    {
    url: "http://172.16.8.5:6969/",
    name: "Busca PROTHEUS",
    icon: "/assets/images/icons/icons8-magnifying-glass-96.png",
    color: "bg-gradient-to-br from-orange-500 to-orange-700",
  },
  {
    url: "https://platform.senior.com.br/",
    name: "SeniorX",
    icon: "/assets/images/logos/logo-senior.png", 
    color: "bg-gradient-to-br from-emerald-500 to-emerald-700",
  },
  {
    url: "https://webmail.naturafrig.com.br/",
    name: "Webmail",
    icon: "/assets/images/logos/webmail-logo.svg",
    color: "bg-gradient-to-br from-black to-black",
  },
];

export default function LinksUtil() {
  const openInNewTab = (url: string) => {
    const newTab = window.open(url, "_blank", "noopener,noreferrer");
    newTab?.focus();
  };

  return (
    <Layout>
      <div className="min-h-screen pt-9 p-6">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-16">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
              Sistemas Naturafrig
            </h1>
            <Image
              src="/assets/images/icons/icons8-link-preto.png"
              alt="Logo Link"
              width={50}
              height={50}
              className="dark:invert"
            />
          </div>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl">
            Acesse rapidamente todos os sistemas essenciais da empresa
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sistemas.map(({ url, name, icon, color }) => (
              <div
                key={url}
                className="
                  group relative w-full h-[200px] lg:h-[220px] xl:h-[240px]
                  rounded-3xl p-8 text-center shadow-xl cursor-pointer
                  transition-all duration-500 hover:scale-[1.05] hover:shadow-2xl hover:-translate-y-3
                  overflow-hidden focus:outline-none focus:ring-4 focus:ring-white/30
                "
                onClick={() => openInNewTab(url)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    openInNewTab(url);
                  }
                }}
              >
                {/* Background */}
                <div className={`
                  absolute inset-0 ${color}
                  opacity-95 group-hover:opacity-100 group-hover:brightness-105
                  transition-all duration-500
                `} />
                
                {/* Glass overlay */}
                <div className="absolute inset-0 bg-white/15 dark:bg-black/25 backdrop-blur-sm border border-white/30" />

                {/* Logo */}
                <div className="relative w-20 h-20 lg:w-24 lg:h-24 xl:w-44 xl:h-28 mx-auto mb-6 z-10 transform group-hover:scale-110 transition-all duration-300">
                  <Image
                    src={icon}
                    alt={name}
                    fill
                    className="object-contain drop-shadow-2xl"
                  />
                </div>

                {/* Nome */}
                <h3 className="relative z-10 text-xl lg:text-2xl xl:text-3xl font-bold leading-tight tracking-tight bg-gradient-to-r from-white/95 to-white/80 bg-clip-text text-transparent drop-shadow-lg">
                  {name}
                </h3>

                {/* Indicador Nova Aba */}
                <div className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 border border-white/30">
                  ↗️ Nova aba
                </div>

                {/* Shine effect */}
                <div className="absolute -top-4 -right-4 w-20 h-20 lg:w-24 lg:h-24 bg-white/25 rounded-full blur-xl group-hover:scale-150 opacity-0 group-hover:opacity-100 transition-all duration-700" />
                
                {/* Glow bottom */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-32 bg-white/15 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
