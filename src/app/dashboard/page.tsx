export const dynamic = 'force-dynamic';
import Layout from "../../components/Layout";
import Link from "next/link";
import Image from "next/image";
import AnimatedDarkModeToggle from "../../components/AnimatedDarkModeToggle";
import { prisma } from "@/src/lib/prisma";
import { headers } from "next/headers";
import { getUnidadeByIp } from "../../lib/getUnidadeByIp"; // Crie este arquivo abaixo

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
    title: "Notícias",
    href: "/noticias",
    color: "bg-gradient-to-br from-blue-500 to-indigo-600",
    icon: "/assets/images/icons/icons8-news-branco.png",
  },
  {
    title: "Recados",
    href: "/recados", 
    color: "bg-gradient-to-br from-orange-500 to-red-600",
    icon: "/assets/images/icons/icons8-megaphone-branco.png",
  },
];

async function getDashboardData() {
  const h = await headers();  // ✅ AWAIT
  const ip = h.get('x-forwarded-for') ?? h.get('x-real-ip');
  const unidadeId = getUnidadeByIp(ip);
  
  const [totalNoticias, totalRecados] = await Promise.all([
    prisma.noticia.count(),
    unidadeId ? prisma.recado.count({ where: { unidadeId } }) : 0
  ]);
  
  return { totalNoticias, totalRecados, unidadeId };
}

export default async function Dashboard() {
  const { totalNoticias, totalRecados } = await getDashboardData();
  
  return (
    <Layout>
      <div className="min-h-screen pt-9 p-6">
        {/* HEADER igual */}
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

        {/* ✅ 5 BOTÕES (sem jornais) */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="
            grid gap-8 lg:gap-10
            grid-cols-1 sm:grid-cols-2 
            lg:grid-cols-3 xl:grid-cols-5
          ">
            {dashboardItems.map((item, index) => {
              let countBadge = null;
              if (item.title.includes('Notícias')) countBadge = totalNoticias;
              if (item.title.includes('Recados')) countBadge = totalRecados;
              
              return (
                <Link key={item.href} href={item.href} className="group relative w-full h-[220px] lg:h-[260px] flex flex-col items-center justify-center rounded-3xl p-8 text-center shadow-xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:-translate-y-2 overflow-hidden focus:outline-none focus:ring-4 focus:ring-white/30">
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-95 group-hover:opacity-100 transition-all duration-500`} />
                  <div className="absolute inset-0 bg-white/10 dark:bg-black/20 backdrop-blur-sm border border-white/20" />
                  {item.icon && (
                    <div className="relative w-20 h-20 lg:w-28 lg:h-28 mb-6 z-10 transform group-hover:scale-110 transition-transform duration-300">
                      <Image src={item.icon} alt={item.title} fill className="object-contain drop-shadow-lg" />
                    </div>
                  )}
                  <span className="relative z-10 text-xl lg:text-2xl font-bold leading-tight tracking-tight break-words px-4 bg-gradient-to-r from-white/90 to-white/70 bg-clip-text text-transparent drop-shadow-md">
                    {item.title.split('\n')[0]}
                  </span>
                  {countBadge !== null && (
                    <div className="absolute -top-3 -right-3 bg-white/90 dark:bg-black/90 text-xs font-bold px-2 py-1 rounded-full shadow-lg z-20">
                      {countBadge}
                    </div>
                  )}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/20 rounded-2xl blur-xl group-hover:scale-150 transition-all duration-700 opacity-0 group-hover:opacity-100" />
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-32 h-32 bg-white/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}
