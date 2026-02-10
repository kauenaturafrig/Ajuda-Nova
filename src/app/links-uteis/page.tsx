"use client";

import Layout from "../../components/Layout";
import Image from "next/image";
// ❌ Remova: import Link from "next/link";

const sistemas = [
  {
    url: "https://helpdesk.naturafrig.com.br/",
    name: "Chamados TI",
    icon: "/assets/images/logos/logo-help-ok - Copia.png",
    width: 100,
    height: 100,
    className: "mr-5"
  },
  {
    url: "http://172.16.10.4:8220/webapp/",
    name: "PROTHEUS",
    icon: "/assets/images/logos/protheus.png",
    width: 100,
    height: 100,
    className: "mr-5"
  },
  {
    url: "http://172.16.8.5:6969/",
    name: "Sistema de Busca de Itens PROTHEUS",
    icon: "/assets/images/icons/icons8-magnifying-glass-96.png",
    width: 50,
    height: 50,
    className: "ml-7 mr-10"
  },
  {
    url: "http://172.16.10.4:7017/login",
    name: "Smartview",
    icon: "/assets/images/logos/smartview.png",
    width: 100,
    height: 100,
    className: "mr-5 dark:invert"
  },
  {
    url: "https://platform.senior.com.br/",
    name: "SeniorX",
    icon: "/assets/images/logos/logo-senior.png",
    width: 100,
    height: 100,
    className: "mr-5"
  },
  {
    url: "https://webmail.naturafrig.com.br/",
    name: "Webmail",
    icon: "/assets/images/logos/webmail-logo.svg",
    width: 100,
    height: 100,
    className: "mr-5"
  }
];

export default function LinksUtil() {
  const openInNewTab = (url: string) => {
    const newTab = window.open(url, "_blank", "noopener,noreferrer");
    newTab?.focus(); // ✅ Foco automático na nova aba
  };

  return (
    <Layout>
      <div className="max-w-[90%] mx-auto mt-9 pt-2">
        <div className="flex items-center mt-3 mb-7">
          <h1 className="font-bold text-5xl dark:text-white pr-4">Sistemas Naturafrig</h1>
          <Image
            src={"/assets/images/icons/icons8-link-preto.png"}
            alt="Logo Link"
            width={50}
            height={50}
            className="mr-5 dark:invert"
          />
        </div>
        <p className="mb-8 text-2xl dark:text-white">O que você busca?</p>
        <section className="max-w-[90%] mx-auto space-y-4">
          {sistemas.map(({ url, name, icon, width, height, className }) => (
            <div
              key={url}
              className="flex items-center border-l-4 border-green-700 space-x-2 dark:text-white hover:text-white hover:bg-green-700 p-2 rounded text-2xl cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:-translate-x-1 group h-16"
              onClick={() => openInNewTab(url)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  openInNewTab(url);
                }
              }}
            >
              <Image
                src={icon}
                alt={`${name} Logo`}
                width={width}
                height={height}
                className={`group-hover:scale-110 transition-all duration-300 ${className}`}
              />
              <span className="font-semibold group-hover:underline flex-1">{name}</span>
              <span className="text-green-400 text-sm opacity-0 group-hover:opacity-100 transition-all duration-300 ml-2">
                ↗️ Nova aba
              </span>
            </div>
          ))}
        </section>
      </div>
    </Layout>
  );
}
