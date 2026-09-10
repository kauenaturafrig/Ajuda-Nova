"use client";

import {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import Layout from "../../components/Layout";
import Link from "next/link";
import Image from "next/image";
import AnimatedDarkModeToggle from "../../components/AnimatedDarkModeToggle";
import {
  Link2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Newspaper,
  Megaphone,
  CalendarDays,
} from "lucide-react";

/* ---------- Tipos ---------- */

type Sistema = {
  url: string;
  name: string;
  description: string;
  badge?: string;
  icon: string;
  hoverBorder: string;
  badgeStyle?: string;
};

type Noticia = {
  id: number;
  titulo: string;
  conteudo: string;
  imagem: string | null | undefined;
  createdAt: Date;
  updatedAt?: Date | null;
} | null;

type Recado = {
  id: number;
  titulo: string;
  conteudo: string;
  imagem?: string | null;
  unidadeId: number;
  unidade: {
    id: number;
    nome: string;
  };
  unidades: Array<{
    id: number;
    unidadeId: number;
    unidade: {
      id: number;
      nome: string;
    };
  }>;
  createdAt: Date;
  updatedAt?: Date | null;
} | null;

type Evento = {
  id: number;
  titulo: string;
  descricao: string | null;
  data: Date;
  unidadeId: number;
  unidade: {
    id: number;
    nome: string;
  };
} | null;

type Props = {
  ultimaNoticia: Noticia;
  ultimoRecado: Recado;
  proximoEvento: Evento;
  unidadeId: number | null;
};

/* ---------- Dados estáticos ---------- */

const sistemas: Sistema[] = [
  {
    url: "https://helpdesk.naturafrig.com.br/",
    name: "Chamados TI",
    description: "Abra e acompanhe seus chamados de TI",
    badge: "Novo",
    icon: "/assets/images/logos/logo-help-ok - Copia.png",
    hoverBorder:
      "hover:border-orange-500/50 hover:shadow-orange-500/10",
    badgeStyle:
      "bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
  },
  {
    url: "http://172.16.10.4:8220/webapp/",
    name: "PROTHEUS",
    description: "Acesse o sistema TOTVS Protheus",
    icon: "/assets/images/logos/protheus.png",
    hoverBorder:
      "hover:border-blue-600/50 hover:shadow-blue-600/10",
  },
  {
    url: "http://172.16.10.4:7017/login",
    name: "Smartview",
    description: "Painéis e indicadores em tempo real",
    icon: "/assets/images/logos/smartview.png",
    hoverBorder:
      "hover:border-purple-500/50 hover:shadow-purple-500/10",
  },
  {
    url: "http://172.16.8.5:6969/",
    name: "Busca PROTHEUS",
    description: "Pesquise por informações no Protheus",
    icon: "/assets/images/icons/icons8-magnifying-glass-96.png",
    hoverBorder:
      "hover:border-sky-500/50 hover:shadow-sky-500/10",
  },
  {
    url: "https://platform.senior.com.br/",
    name: "SeniorX",
    description: "Sistema de gestão Senior",
    icon: "/assets/images/logos/logo-senior.png",
    hoverBorder:
      "hover:border-emerald-500/50 hover:shadow-emerald-500/10",
  },
  {
    url: "https://webmail.naturafrig.com.br/",
    name: "Webmail",
    description: "Acesse seu e-mail corporativo",
    icon: "/assets/images/logos/webmail-logo.svg",
    hoverBorder:
      "hover:border-neutral-400/50 hover:shadow-neutral-400/10",
  },
  {
    url: "https://172.16.30.13:4010/",
    name: "Chat Corporativo",
    description:
      "Comunique-se com seus colegas em tempo real",
    icon: "/assets/images/logos/chat-corporativo.png",
    hoverBorder:
      "hover:border-orange-500/50 hover:shadow-orange-500/10",
  },
  {
    url: "http://172.16.8.5:4100/",
    name: "Controle de Vouchers",
    description: "Gerencie os vouchers",
    icon: "/assets/images/logos/ubiquiti-unifi.png",
    hoverBorder:
      "hover:border-slate-400/50 hover:shadow-slate-400/10",
  },
];

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
    iconBg:
      "bg-gradient-to-br from-amber-500 to-amber-700",
  },
  {
    href: "/emails",
    name: "Emails",
    icon: <Mail size={18} />,
    iconBg:
      "bg-gradient-to-br from-sky-500 to-sky-700",
  },
  {
    href: "/noticias",
    name: "Notícias",
    icon: <Newspaper size={18} />,
    iconBg:
      "bg-gradient-to-br from-blue-500 to-indigo-600",
  },
  {
    href: "/recados",
    name: "Recados",
    icon: <Megaphone size={18} />,
    iconBg:
      "bg-gradient-to-br from-orange-500 to-red-600",
  },
];

/* ---------- Helpers ---------- */

function getNoticiaImagemUrl(
  noticia: NonNullable<Noticia>,
) {
  if (!noticia.imagem) {
    return "";
  }

  const version = noticia.updatedAt
    ? new Date(noticia.updatedAt).getTime()
    : new Date(noticia.createdAt).getTime();

  return `/admin/api/uploads/noticias/${noticia.imagem}?v=${version}`;
}

function getRecadoImagemUrl(
  recado: NonNullable<Recado>,
) {
  if (!recado.imagem) {
    return "";
  }

  const version = recado.updatedAt
    ? new Date(recado.updatedAt).getTime()
    : new Date(recado.createdAt).getTime();

  return `/admin/api/uploads/recados/${recado.imagem}?v=${version}`;
}

/**
 * Saudação baseada no horário. Renderiza um texto neutro no servidor
 * e só troca para "Bom dia / Boa tarde / Boa noite" após o mount,
 * evitando qualquer mismatch de hidratação.
 */
function useSaudacao() {
  const [saudacao, setSaudacao] = useState("Olá");

  useEffect(() => {
    const hora = new Date().getHours();

    if (hora < 12) {
      setSaudacao("Bom dia");
    } else if (hora < 18) {
      setSaudacao("Boa tarde");
    } else {
      setSaudacao("Boa noite");
    }
  }, []);

  return saudacao;
}

/* ---------- Carrossel ---------- */

type Slide = {
  key: string;
  label: string;
  labelStyle: string;
  title: string;
  excerpt: string;
  date: Date;
  image: string;
  href: string;
};

type HeroCarouselProps = {
  ultimaNoticia: Noticia;
  ultimoRecado: Recado;
};

function HeroCarousel({
  ultimaNoticia,
  ultimoRecado,
}: HeroCarouselProps) {
  const slides: Slide[] = useMemo(() => {
    const items: Slide[] = [];

    if (ultimaNoticia) {
      items.push({
        key: `noticia-${ultimaNoticia.id}`,
        label: "Última notícia",
        labelStyle: "bg-blue-600/90 text-white",
        title: ultimaNoticia.titulo,
        excerpt: ultimaNoticia.conteudo,
        date: new Date(ultimaNoticia.createdAt),
        image: getNoticiaImagemUrl(ultimaNoticia),
        href: `/noticias#${ultimaNoticia.id}`,
      });
    }

    if (ultimoRecado) {
      items.push({
        key: `recado-${ultimoRecado.id}`,
        label: "Último recado",
        labelStyle: "bg-orange-600/90 text-white",
        title: ultimoRecado.titulo,
        excerpt: ultimoRecado.conteudo,
        date: new Date(ultimoRecado.createdAt),
        image: getRecadoImagemUrl(ultimoRecado),
        href: `/recados#${ultimoRecado.id}`,
      });
    }

    return items;
  }, [ultimaNoticia, ultimoRecado]);

  const [index, setIndex] = useState(0);
  const [transitionEnabled, setTransitionEnabled] =
    useState(true);

  const hasMultipleSlides = slides.length > 1;

  const loopSlides = hasMultipleSlides
    ? [...slides, slides[0]]
    : slides;

  const next = useCallback(() => {
    if (!hasMultipleSlides) {
      return;
    }

    setIndex((currentIndex) => currentIndex + 1);
  }, [hasMultipleSlides]);

  const prev = useCallback(() => {
    if (!hasMultipleSlides) {
      return;
    }

    setIndex((currentIndex) => {
      if (currentIndex === 0) {
        return slides.length - 1;
      }

      return currentIndex - 1;
    });
  }, [hasMultipleSlides, slides.length]);

  useEffect(() => {
    if (!hasMultipleSlides) {
      return;
    }

    const timer = window.setInterval(next, 5500);

    return () => window.clearInterval(timer);
  }, [hasMultipleSlides, next]);

  function handleTransitionEnd() {
    if (index !== slides.length) {
      return;
    }

    setTransitionEnabled(false);
    setIndex(0);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTransitionEnabled(true);
      });
    });
  }

  if (slides.length === 0) {
    return null;
  }

  const displayedIndex =
    index >= slides.length ? 0 : index;

  return (
    <div className="group relative mb-8 overflow-hidden rounded-3xl border border-gray-100 shadow-lg shadow-gray-200/60 dark:border-neutral-800 dark:shadow-none">
      <div
        className={`flex ${
          transitionEnabled
            ? "transition-transform duration-[450ms] ease-in-out"
            : ""
        }`}
        style={{
          transform: `translateX(-${index * 100}%)`,
        }}
        onTransitionEnd={handleTransitionEnd}
      >
        {loopSlides.map((slide, slideIndex) => (
          <div
            key={`${slide.key}-${slideIndex}`}
            className="relative min-w-full shrink-0"
          >
            <Link
              href={slide.href}
              className="relative block h-64 w-full sm:h-72"
            >
              {slide.image ? (
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  priority={slideIndex === displayedIndex}
                  className="object-cover"
                  sizes="100vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900" />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/5" />

              <div className="relative z-10 flex h-full flex-col justify-end p-6 sm:p-9">
                <span
                  className={`mb-3 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm ${slide.labelStyle}`}
                >
                  {slide.label}
                </span>

                <h3 className="mb-1.5 line-clamp-2 max-w-2xl text-2xl font-bold leading-tight text-white sm:text-3xl">
                  {slide.title}
                </h3>

                <p className="line-clamp-1 max-w-xl text-sm text-white/75 sm:text-base">
                  {slide.excerpt}
                </p>

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-xs text-white/60">
                    {slide.date.toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                    })}
                  </span>

                  <span className="flex items-center gap-1.5 text-sm font-medium text-white">
                    Ver mais <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {hasMultipleSlides && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Anterior"
            className="absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-all hover:bg-black/60 group-hover:opacity-100"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            type="button"
            onClick={next}
            aria-label="Próximo"
            className="absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white opacity-0 transition-all hover:bg-black/60 group-hover:opacity-100"
          >
            <ChevronRight size={18} />
          </button>

          <div className="absolute bottom-4 right-6 z-20 flex items-center gap-1.5">
            {slides.map((slide, slideIndex) => (
              <button
                key={slide.key}
                type="button"
                aria-label={`Ir para slide ${slideIndex + 1}`}
                onClick={() => {
                  setTransitionEnabled(true);
                  setIndex(slideIndex);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  slideIndex === displayedIndex
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- Evento próximo ---------- */

function UpcomingEvent({
  evento,
}: {
  evento: Evento;
}) {
  if (!evento) {
    return null;
  }

  const dataEvento = new Date(evento.data);
  const agora = new Date();

  const mesmoDia =
    dataEvento.toLocaleDateString("pt-BR") ===
    agora.toLocaleDateString("pt-BR");

  const dataFormatada = dataEvento.toLocaleDateString(
    "pt-BR",
    {
      weekday: "long",
      day: "2-digit",
      month: "long",
    },
  );

  const horaFormatada = dataEvento.toLocaleTimeString(
    "pt-BR",
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  return (
    <section className="mb-8 overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-emerald-50/40 shadow-sm dark:border-emerald-900/50 dark:from-emerald-950/30 dark:to-neutral-900/40">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
          <CalendarDays size={22} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              {mesmoDia
                ? "Evento de hoje"
                : "Próximo evento"}
            </span>

            <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-bold text-white">
              {horaFormatada}
            </span>
          </div>

          <h2 className="truncate text-lg font-bold text-gray-900 dark:text-white">
            {evento.titulo}
          </h2>

          {evento.descricao && (
            <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
              {evento.descricao}
            </p>
          )}

          <p className="mt-2 text-xs font-medium capitalize text-emerald-700/80 dark:text-emerald-400/80">
            {dataFormatada} · {evento.unidade.nome}
          </p>
        </div>

        <div className="hidden shrink-0 rounded-xl border border-emerald-200 bg-white/70 px-4 py-3 text-center dark:border-emerald-900/50 dark:bg-neutral-900/40 sm:block">
          <span className="block text-[10px] font-semibold text-gray-400">
            Unidade
          </span>

          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {evento.unidade.nome}
          </span>
        </div>
      </div>
    </section>
  );
}

/* ---------- Página ---------- */

export default function DashboardPage({
  ultimaNoticia,
  ultimoRecado,
  proximoEvento,
  unidadeId,
}: Props) {
  const saudacao = useSaudacao();

  const openInNewTab = (url: string) => {
    const newTab = window.open(
      url,
      "_blank",
      "noopener,noreferrer",
    );

    newTab?.focus();
  };

  return (
    <Layout>
      <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}

          <div className="mb-8 flex flex-col items-start justify-between gap-4 border-b border-gray-100 pb-6 dark:border-neutral-800/60 sm:flex-row sm:items-center">
            <div>
              <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                {saudacao}! <span>👋</span>
              </h1>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 sm:text-base">
                Tudo o que você precisa da empresa, em um só lugar
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-zinc-50 px-4 py-2 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                Tema
              </span>

              <AnimatedDarkModeToggle />
            </div>
          </div>

          {/* Carrossel */}

          <HeroCarousel
            ultimaNoticia={ultimaNoticia}
            ultimoRecado={ultimoRecado}
          />

          {/* Evento mais próximo */}

          <UpcomingEvent evento={proximoEvento} />

          {/* Acesso rápido */}

          <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {quickLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white shadow-md ${item.iconBg}`}
                >
                  {item.icon}
                </span>

                <span className="text-sm font-semibold text-gray-800 transition-colors group-hover:text-gray-900 dark:text-neutral-200 dark:group-hover:text-white">
                  {item.name}
                </span>
              </Link>
            ))}
          </div>

          {/* Título dos sistemas */}

          <div className="mb-6 flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400">
              <Link2 size={16} />
            </span>

            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Sistemas corporativos
              </h2>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Acesse rapidamente os sistemas essenciais da empresa
              </p>
            </div>
          </div>

          {/* Grid de sistemas */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sistemas.map((sistema) => (
              <div
                key={sistema.url}
                onClick={() =>
                  openInNewTab(sistema.url)
                }
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" ||
                    event.key === " "
                  ) {
                    openInNewTab(sistema.url);
                  }
                }}
                className={`group relative flex cursor-pointer items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg dark:border-neutral-800/80 dark:bg-neutral-900/40 ${sistema.hoverBorder}`}
              >
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-zinc-50 p-2.5 dark:border-neutral-700 dark:bg-neutral-800">
                  <div className="relative h-full w-full transform transition-transform duration-300 group-hover:scale-105">
                    <Image
                      src={sistema.icon}
                      alt={sistema.name}
                      fill
                      className="object-contain dark:brightness-110"
                    />
                  </div>
                </div>

                <div className="min-w-0 flex-1 pr-6">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-base font-semibold text-gray-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
                      {sistema.name}
                    </h3>

                    {sistema.badge && (
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${sistema.badgeStyle}`}
                      >
                        {sistema.badge}
                      </span>
                    )}
                  </div>

                  <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-gray-400 dark:text-gray-500">
                    {sistema.description}
                  </p>
                </div>

                <span className="absolute right-4 top-1/2 flex h-7 w-7 -translate-x-2 -translate-y-1/2 items-center justify-center rounded-lg border border-gray-100 bg-zinc-50 text-gray-400 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white group-hover:opacity-100 dark:border-neutral-800 dark:bg-neutral-950">
                  <ArrowRight size={12} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}