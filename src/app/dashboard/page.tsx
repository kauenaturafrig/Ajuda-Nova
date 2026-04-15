export const dynamic = 'force-dynamic';
import Layout from "../../components/Layout";
import Link from "next/link";
import Image from "next/image";
import AnimatedDarkModeToggle from "../../components/AnimatedDarkModeToggle";
import { prisma } from "@/src/lib/prisma";
import { headers } from "next/headers";
import { getUnidadeByIp } from "../../lib/getUnidadeByIp";
import { Newspaper, Bell } from "lucide-react";

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
  const h = await headers();
  const ip = h.get('x-forwarded-for') ?? h.get('x-real-ip');
  const unidadeId = getUnidadeByIp(ip);

  const [totalNoticias, totalRecados, ultimaNoticia, ultimoRecado] = await Promise.all([
    prisma.noticia.count(),
    unidadeId ? prisma.recado.count({ where: { unidadeId } }) : 0,
    // ✅ ÚLTIMA NOTÍCIA (com imagem)
    prisma.noticia.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { id: true, titulo: true, conteudo: true, imagem: true, createdAt: true }
    }),
    // ✅ ÚLTIMO RECADO (unidade atual)
    unidadeId ? prisma.recado.findFirst({
      where: { unidadeId },
      orderBy: { createdAt: 'desc' },
      include: { unidade: { select: { nome: true } } }
    }) : null
  ]);

  return { totalNoticias, totalRecados, unidadeId, ultimaNoticia, ultimoRecado };
}

export default async function Dashboard() {
  const { totalNoticias, totalRecados, unidadeId, ultimaNoticia, ultimoRecado } = await getDashboardData();

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

        {/* ✅ NOVO: SEÇÃO ÚLTIMAS NOTÍCIAS + RECADOS */}
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* 🔥 ÚLTIMA NOTÍCIA */}
            <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl p-10 hover:shadow-3xl transition-all duration-300 h-72">
              <div className="flex items-center justify-between mb-8"> {/* ✅ mb-8 */}
                <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-900 dark:text-white">
                  {/* <Newspaper className="w-7 h-7 text-blue-600" /> */}
                  <Image
                    src={"/assets/images/icons/icons8-news-preto.png"}
                    alt={"Noticias"}
                    width={30}
                    height={30}
                    className="object-cover hover:scale-110 transition-transform duration-300"
                  />
                  Últimas Notícias
                </h2>
                <Link href="/noticias" className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  Ver todas <span>→</span>
                </Link>
              </div>

              {ultimaNoticia ? (
                <Link href={`/noticias#${ultimaNoticia.id}`} className="block hover:scale-[1.02] transition-transform duration-200">
                  <div className="flex gap-6"> {/* ✅ gap-6 */}
                    {ultimaNoticia.imagem && (
                      <div className="w-32 h-32 flex-shrink-0 rounded-3xl overflow-hidden bg-gray-200 shadow-lg"> {/* ✅ w-32 h-32 */}
                        <Image
                          src={`/uploads/noticias/${ultimaNoticia.imagem}`}
                          alt={ultimaNoticia.titulo}
                          width={128}
                          height={128}
                          className="object-cover hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-2xl text-gray-900 dark:text-white line-clamp-2 mb-4 leading-tight"> {/* ✅ text-2xl + mb-4 */}
                        {ultimaNoticia.titulo}
                      </h3>
                      <p className="text-lg text-gray-600 dark:text-gray-300 line-clamp-4 leading-relaxed"> {/* ✅ text-lg + line-clamp-4 */}
                        {ultimaNoticia.conteudo}
                      </p>
                      <p className="text-sm text-gray-500 mt-4 flex items-center gap-2"> {/* ✅ text-sm + mt-4 */}
                        📰 {new Date(ultimaNoticia.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center h-full"> {/* ✅ py-16 */}
                  <Newspaper className="w-16 h-16 text-gray-400 mb-4 opacity-40" />
                  <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">Nenhuma notícia publicada ainda.</p>
                </div>
              )}
            </div>

            {/* 🔥 ÚLTIMO RECADO  */}
            <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl p-10 hover:shadow-3xl transition-all duration-300 h-72">
              <div className="flex items-center justify-between mb-8"> {/* ✅ mb-8 */}
                <h2 className="text-2xl font-bold flex items-center gap-3 text-gray-900 dark:text-white">
                  {/* <Bell className="w-7 h-7 text-orange-600" /> */}
                  <Image
                    src={"/assets/images/icons/icons8-megaphone-preto.png"}
                    alt={"Recados"}
                    width={30}
                    height={30}
                    className="object-cover hover:scale-110 transition-transform duration-300"
                  />
                  Recados
                </h2>
                <Link href="/recados" className="text-sm font-medium text-orange-600 hover:text-orange-700 flex items-center gap-1">
                  Ver todos <span>→</span>
                </Link>
              </div>

              {ultimoRecado ? (
                <Link href={`/recados#${ultimoRecado.id}`} className="block hover:scale-[1.02] transition-transform duration-200">
                  <div className="flex gap-6"> {/* ✅ gap-6 */}
                    {ultimoRecado.imagem && (
                      <div className="w-32 h-32 flex-shrink-0 rounded-3xl overflow-hidden bg-gray-200 shadow-lg"> {/* ✅ w-32 h-32 */}
                        <Image
                          src={`/uploads/recados/${ultimoRecado.imagem}`}
                          alt={ultimoRecado.titulo}
                          width={128}
                          height={128}
                          className="object-cover hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-2xl text-gray-900 dark:text-white line-clamp-2 mb-4 leading-tight"> {/* ✅ text-2xl + mb-4 */}
                        {ultimoRecado.titulo}
                      </h3>
                      <p className="text-lg text-gray-600 dark:text-gray-300 line-clamp-4 leading-relaxed"> {/* ✅ text-lg + line-clamp-4 */}
                        {ultimoRecado.conteudo}
                      </p>
                      <p className="text-sm text-gray-500 mt-4 flex items-center gap-2"> {/* ✅ text-sm + mt-4 */}
                        📍 {ultimoRecado.unidade.nome} • {new Date(ultimoRecado.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center h-full"> {/* ✅ py-16 */}
                  <Bell className="w-16 h-16 text-gray-400 mb-4 opacity-40" />
                  <p className="text-lg text-gray-500 dark:text-gray-400 font-medium">Nenhum recado publicado ainda.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ✅ 5 BOTÕES (igual antes) */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="
            grid gap-8 lg:gap-10
            grid-cols-1 sm:grid-cols-2 
            lg:grid-cols-3 xl:grid-cols-5
          ">
            {dashboardItems.map((item, index) => {
              let countBadge = null;
              // if (item.title.includes('Notícias')) countBadge = totalNoticias;
              // if (item.title.includes('Recados')) countBadge = totalRecados;

              return (
                <Link key={item.href} href={item.href} className="group relative w-full h-[220px] lg:h-[260px] flex flex-col items-center justify-center rounded-3xl p-8 text-center shadow-xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:-translate-y-2 overflow-hidden focus:outline-none">
                  {/* ✅ SÓ GRADIENTE - SEM VIDRO */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-95 group-hover:opacity-100 transition-all duration-500`} />

                  {/* ✅ REMOVIDO: backdrop-blur, overlays, bordas brancas */}

                  {item.icon && (
                    <div className="relative w-20 h-20 lg:w-28 lg:h-28 mb-6 z-10 transform group-hover:scale-110 transition-transform duration-300">
                      <Image src={item.icon} alt={item.title} fill className="object-contain drop-shadow-lg" />
                    </div>
                  )}
                  <span className="relative z-10 text-xl lg:text-2xl font-bold leading-tight tracking-tight break-words px-4 bg-gradient-to-r from-white/95 to-white/80 bg-clip-text text-transparent drop-shadow-lg">
                    {item.title.split('\\n')[0]}
                  </span>
                  {/* {countBadge !== null && (
                    <div className="absolute -top-3 -right-3 bg-white/95 dark:bg-black/95 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-20 border">
                      {countBadge}
                    </div>
                  )} */}
                  {/* ✅ EFEITOS DECORATIVOS mantidos */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/30 rounded-2xl blur-xl group-hover:scale-150 transition-all duration-700 opacity-0 group-hover:opacity-100" />
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-32 h-32 bg-white/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
}