export const dynamic = 'force-dynamic';
import Layout from "../../components//Layout";
import Link from "next/link";
import Image from "next/image";
import AnimatedDarkModeToggle from "../../components//AnimatedDarkModeToggle";
import { prisma } from "@/src/lib/prisma";

type DashboardItem = {
  title: string;
  href: string;
  color: string;
  icon?: string;
};

const dashboardItems: DashboardItem[] = [
  {
    title: "Sistemas\nNaturafrig",
    href: "/links-uteis",
    color: "bg-gradient-to-br from-slate-600 to-slate-800",
    icon: "/assets/images/icons/icons8-link-branco.png",
  },
  {
    title: "Ramais",
    href: "/ramais",
    color: "bg-gradient-to-br from-amber-500 to-amber-700",
    icon: "/assets/images/icons/icons8-phone-branco.png",
  },
  {
    title: "Emails",
    href: "/emails",
    color: "bg-gradient-to-br from-sky-500 to-sky-700",
    icon: "/assets/images/icons/icons8-mail-branco.png",
  },
  {
    title: "Conexão\nNaturafrig",
    href: "/jornais",
    color: "bg-gradient-to-br from-emerald-500 to-emerald-700",
    icon: "/assets/images/icons/icons8-news-branco.png",
  },
];

async function UltimoJornal() {
  const jornais = await prisma.jornal.findMany({
    orderBy: { dataLancamento: "desc" },
    take: 1
  });

  const ultimoJornal = jornais[0];

  if (!ultimoJornal || !ultimoJornal.imagem) {
    return (
      <div className="w-full max-w-2xl mx-auto h-64 lg:h-72 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center shadow-xl">
        <div className="text-center p-8">
          <span className="text-5xl opacity-50 mb-4">📄</span>
          <p className="text-xl font-medium text-gray-500 dark:text-gray-400">Aguardando primeira edição</p>
        </div>
      </div>
    );
  }

  return (
    <a
      href={ultimoJornal.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block w-full mx-auto h-64 lg:h-72 xl:h-80 rounded-3xl shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all duration-500 cursor-pointer overflow-hidden"
    >
      {/* BACKGROUND GRADIENT */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent z-20" />

      {/* CONTAINER CROP TOTAL */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={`/uploads/jornais/${ultimoJornal.imagem}`}
            alt={ultimoJornal.titulo}
            className="absolute inset-0 w-full h-full object-cover scale-[1.4] -translate-y-[25%] group-hover:scale-[1.5] transition-transform duration-700"
            loading="eager"
          />
        </div>
      </div>

      {/* ✅ TÍTULO FIXO NO TOPO */}
      <div className="absolute top-6 left-6 right-6 z-40 pointer-events-none">
        <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold bg-white/95 dark:bg-black/95 text-gray-900 dark:text-white px-6 py-3 rounded-2xl backdrop-blur-xl shadow-2xl border border-white/50 tracking-tight w-[390px]">
          Conexão Naturafrig
        </h2>
      </div>

      {/* ✅ TEXTO embaixo (título do jornal + data) */}
      <div className="absolute bottom-6 left-6 right-6 z-30 pointer-events-none">
        <h3 className="text-xl lg:text-2xl xl:text-3xl font-bold text-white drop-shadow-2xl leading-tight mb-2 line-clamp-2">
          {ultimoJornal.titulo}
        </h3>
        <div className="flex items-center gap-3 text-white/90 text-sm lg:text-base font-medium">
          <span>📅 {new Date(ultimoJornal.dataLancamento).toLocaleDateString('pt-BR')}</span>
          <span className="ml-auto px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-auto">
            ↗️ Abrir
          </span>
        </div>
      </div>
    </a>
  );
}

export default async function Dashboard() { // ✅ async page
  return (
    <Layout>
      <div className="min-h-screen pt-9 p-6">
        {/* ✅ HEADER com mais espaço embaixo */}
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-0 pb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent leading-tight">
              Bem vindo!
            </h1>
            <div className="flex items-center gap-3 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/30 shadow-lg">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tema</span>
              <AnimatedDarkModeToggle />
            </div>
          </div>
        </div>

        {/* ✅ CARROSSEL com margin top */}
        <div className="max-w-7xl mx-auto mb-12 px-6">
          <UltimoJornal />
        </div>

        {/* ✅ Botões com espaçamento adequado */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="
            grid gap-8 lg:gap-10
            grid-cols-1 sm:grid-cols-2 
            lg:grid-cols-2 xl:grid-cols-2
          ">
            {dashboardItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="
                  group relative w-full h-[220px] lg:h-[260px]
                  flex flex-col items-center justify-center
                  rounded-3xl p-8 text-center shadow-xl
                  transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:-translate-y-2
                  overflow-hidden
                  focus:outline-none focus:ring-4 focus:ring-white/30
                "
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-95 group-hover:opacity-100 transition-all duration-500`} />
                <div className="absolute inset-0 bg-white/10 dark:bg-black/20 backdrop-blur-sm border border-white/20" />
                {item.icon && (
                  <div className="relative w-20 h-20 lg:w-28 lg:h-28 mb-6 z-10 transform group-hover:scale-110 transition-transform duration-300">
                    <Image
                      src={item.icon}
                      alt={item.title}
                      fill
                      className="object-contain drop-shadow-lg"
                    />
                  </div>
                )}
                <span className="relative z-10 text-xl lg:text-2xl font-bold leading-tight tracking-tight break-words px-4 bg-gradient-to-r from-white/90 to-white/70 bg-clip-text text-transparent drop-shadow-md">
                  {item.title}
                </span>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/20 rounded-2xl blur-xl group-hover:scale-150 transition-all duration-700 opacity-0 group-hover:opacity-100" />
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-32 h-32 bg-white/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
