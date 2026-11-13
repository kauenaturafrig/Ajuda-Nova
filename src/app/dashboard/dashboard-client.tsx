"use client";

import {
  useState,
  useEffect,
  useMemo,
  useRef,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, Bell, ArrowRight } from "lucide-react";
import { categoriaCores } from "@/src/lib/categoria-cor";

/* ---------- Tipos ---------- */

type NoticiaItem = {
  id: number;
  titulo: string;
  conteudo: string;
  imagem?: string | null;
  createdAt: Date | string;
  updatedAt?: Date | string | null;
  categorias: CategoriaItem[];
};

type CategoriaItem = {
  id: number;
  nome: string;
  slug: string;
  cor?: string | null;
};

type RecadoItem = {
  id: number;
  titulo: string;
  conteudo: string;
  imagem?: string | null;
  createdAt: Date | string;
  updatedAt?: Date | string | null;
  categorias: CategoriaItem[];
  unidade: { id: number; nome: string };
};

type EventoItem = {
  id: number;
  titulo: string;
  descricao?: string | null;
  data: Date | string;
  unidade: { id: number; nome: string };
};

/** Opcional: alimenta o card de Ramais e a busca global. */
type RamalItem = {
  id: number;
  nome: string;
  setor?: string | null;
  numero: string;
};

/** Opcional: alimenta o card de aniversariantes (mes de 1 a 12). */
type AniversarianteItem = {
  id: number;
  nome: string;
  setor?: string | null;
  dia: number;
  mes: number;
};

type Props = {
  noticias: NoticiaItem[];
  recados: RecadoItem[];
  recadosNovos: number;
  eventos: EventoItem[];
  ramais?: RamalItem[];
  aniversariantes?: AniversarianteItem[];
  unidadeId: number | null;
};

/* ---------- Dados estáticos ---------- */

type Sistema = {
  name: string;
  subtitle: string;
  initials: string;
  color: string;
  url: string;
  icon?: string;
};

const sistemas: Sistema[] = [
  {
    name: "Protheus",
    subtitle: "ERP",
    initials: "P",
    color: "bg-blue-700",
    url: "http://172.16.10.4:8220/webapp/",
    icon: "/assets/images/logos/protheus.png",
  },
  {
    name: "Chamados",
    subtitle: "Suporte TI",
    initials: "CH",
    color: "bg-emerald-600",
    url: "https://helpdesk.naturafrig.com.br/",
    icon: "/assets/images/logos/logo-help-ok - Copia.png",
  },
  {
    name: "Smartview",
    subtitle: "Relatórios",
    initials: "SV",
    color: "bg-purple-600",
    url: "http://172.16.10.4:7017/login",
    icon: "/assets/images/logos/smartview.png",
  },
  {
    name: "Webmail",
    subtitle: "E-mail",
    initials: "WM",
    color: "bg-teal-600",
    url: "https://webmail.naturafrig.com.br/",
    icon: "/assets/images/logos/webmail-logo.svg",
  },
  {
    name: "SeniorX",
    subtitle: "RH e ponto",
    initials: "SX",
    color: "bg-red-600",
    url: "https://platform.senior.com.br/",
    icon: "/assets/images/logos/logo-senior.png",
  },
  {
    name: "Chat Corporativo",
    subtitle: "Chat",
    initials: "CC",
    color: "bg-amber-600",
    url: "https://chatcorporativo.naturafrig.com.br/",
    icon: "/assets/images/logos/chat-corporativo.png",
  },
];

const paginas = [
  { label: "Links úteis", hint: "Todos os sistemas", href: "/links-uteis" },
  { label: "Ramais", hint: "Contatos internos", href: "/ramais" },
  { label: "Emails", hint: "Endereços corporativos", href: "/emails" },
  { label: "Notícias", hint: "Novidades da empresa", href: "/noticias" },
  { label: "Recados", hint: "Avisos por unidade", href: "/recados" },
  { label: "Agenda", hint: "Eventos", href: "/agenda" },
];

const manuais = [
  { label: "Leitores", href: "/leitores" },
  { label: "Balanças", href: "/balancas" },
  { label: "Tanuresoft", href: "/tanuresoft" },
  { label: "Impressora Zebra", href: "/impressoras-termicas" },
  { label: "Windows", href: "/windows-page" },
];

/* ---------- Helpers ---------- */

const DIA_MS = 86_400_000;
const NOVO_DIAS = 3; // recado "novo" = criado nos últimos 3 dias (igual ao page.tsx)

const card =
  "min-w-0 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm 2xl:p-4 dark:border-neutral-800 dark:bg-[#111a2d]";

const hideScrollbar =
  "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

function normalize(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function shortDate(d: Date) {
  const mes = d
    .toLocaleDateString("pt-BR", { month: "short" })
    .replace(".", "");
  return `${String(d.getDate()).padStart(2, "0")} ${mes}`;
}

function formatTime(d: Date) {
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function relativeDate(d: Date, now: Date) {
  const diff = Math.round((startOfDay(now) - startOfDay(d)) / DIA_MS);
  if (diff === 0) return `Hoje, ${formatTime(d)}`;
  if (diff === 1) return "Ontem";
  return shortDate(d);
}

function iniciais(nome: string) {
  const p = nome.trim().split(/\s+/);
  const first = p[0]?.[0] ?? "";
  const last = p.length > 1 ? p[p.length - 1][0] : "";
  return (first + last).toUpperCase();
}

function noticiaImagemUrl(n: NoticiaItem) {
  if (!n.imagem) return "";
  const version = new Date(n.updatedAt ?? n.createdAt).getTime();
  return `/admin/api/uploads/noticias/${n.imagem}?v=${version}`;
}

function recadoImagemUrl(r: RecadoItem) {
  if (!r.imagem) return "";
  const version = new Date(r.updatedAt ?? r.createdAt).getTime();
  return `/admin/api/uploads/recados/${r.imagem}?v=${version}`;
}

function CategoriasTags({ categorias }: { categorias: CategoriaItem[] }) {
  if (categorias.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {categorias.map((categoria) => {
        const cores = categoriaCores(categoria.cor);
        return (
          <span
            key={categoria.id}
            className="rounded-md px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide"
            style={{ backgroundColor: cores.soft, color: cores.solid }}
          >
            {categoria.nome}
          </span>
        );
      })}
    </div>
  );
}

/** Só devolve a data/hora atual depois do mount (evita mismatch de hidratação). */
function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
  }, []);
  return now;
}

/* ---------- Ícone do sistema ---------- */

function SistemaIcon({ sistema }: { sistema: Sistema }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const showImage = !!sistema.icon && failedSrc !== sistema.icon;

  return (
    <span
      aria-hidden="true"
      className={[
        "flex h-11 w-11 shrink-0 items-center justify-center",
        "overflow-hidden rounded-lg shadow-sm",
        "transition-transform duration-300",
        "group-hover:scale-105",
        showImage
          ? "border border-gray-100 bg-white"
          : `${sistema.color} text-white`,
      ].join(" ")}
    >
      {showImage ? (
        <Image
          src={sistema.icon!}
          alt=""
          width={44}
          height={44}
          sizes="44px"
          className="h-full w-full object-contain p-1.5"
          onError={() => {
            setFailedSrc(sistema.icon ?? null);
          }}
        />
      ) : (
        <span className="text-sm font-bold">{sistema.initials}</span>
      )}
    </span>
  );
}

/* ---------- Peças pequenas ---------- */

function SectionHeader({
  title,
  href,
  linkLabel,
}: {
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-3 flex shrink-0 items-center justify-between gap-3">
      <h2 className="text-base font-bold text-gray-900 dark:text-white">
        {title}
      </h2>

      {href && (
        <Link
          href={href}
          className="group inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-emerald-600 transition-colors duration-200 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
        >
          {linkLabel}
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <p className="rounded-xl border border-dashed border-gray-200 py-8 text-center text-sm text-gray-400 dark:border-neutral-800 dark:text-gray-500">
      {text}
    </p>
  );
}

function ListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-12 animate-pulse rounded-xl bg-gray-100 dark:bg-neutral-800"
        />
      ))}
    </div>
  );
}

/* ---------- Busca global (Ctrl K) ---------- */

type SearchItem = {
  key: string;
  label: string;
  hint: string;
  kind: string;
  href: string;
  external?: boolean;
};

function GlobalSearch({ ramais }: { ramais: RamalItem[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const items = useMemo<SearchItem[]>(
    () => [
      ...sistemas
        .filter((s) => !!s.url && s.url !== "-" && !s.url.startsWith("-/"))
        .map((s) => ({
          key: `s-${s.name}`,
          label: s.name,
          hint: s.subtitle,
          kind: "Sistema",
          href: s.url,
          external: !s.url.startsWith("/"),
        })),
      ...paginas.map((p) => ({
        key: `p-${p.href}`,
        label: p.label,
        hint: p.hint,
        kind: "Página",
        href: p.href,
      })),
      ...manuais.map((m) => ({
        key: `m-${m.href}`,
        label: m.label,
        hint: "Manual",
        kind: "Manual",
        href: m.href,
      })),
      ...ramais.map((r) => ({
        key: `r-${r.id}`,
        label: r.nome,
        hint: `${r.setor ? `${r.setor} · ` : ""}${r.numero}`,
        kind: "Ramal",
        href: `/ramais?busca=${encodeURIComponent(r.nome)}`,
      })),
    ],
    [ramais],
  );

  const results = useMemo<SearchItem[]>(() => {
    const raw = term.trim();
    const t = normalize(raw);
    if (!t) return [];

    const found = items
      .filter((i) => normalize(`${i.label} ${i.hint} ${i.kind}`).includes(t))
      .slice(0, 6);

    found.push({
      key: "fallback",
      label: `Buscar “${raw}” nos ramais`,
      hint: "",
      kind: "Ramais",
      href: `/ramais?busca=${encodeURIComponent(raw)}`,
    });

    return found;
  }, [items, term]);

  useEffect(() => {
    function onKey(e: globalThis.KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
    }

    function onClickOutside(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClickOutside);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, []);

  function go(item: SearchItem) {
    setOpen(false);
    setTerm("");

    if (item.external) {
      window.open(item.href, "_blank", "noopener,noreferrer");
    } else {
      router.push(item.href);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  }

  const showList = open && results.length > 0;

  return (
    <div ref={boxRef} className="relative w-full max-w-xl">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-[1.0625rem] w-[1.0625rem] -translate-y-1/2 text-gray-400" />

      <input
        ref={inputRef}
        value={term}
        onChange={(e) => {
          setTerm(e.target.value);
          setActive(0);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        role="combobox"
        aria-expanded={showList}
        aria-controls="busca-global"
        aria-autocomplete="list"
        placeholder="Buscar ramal, pessoa, sistema ou manual..."
        className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-11 pr-20 text-sm text-gray-900 shadow-sm transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300 focus:border-emerald-500/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 dark:border-neutral-800 dark:bg-neutral-500/60 dark:text-white dark:hover:border-neutral-700"
      />

      <kbd className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-[0.6875rem] font-semibold text-gray-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-gray-400 sm:block">
        Ctrl K
      </kbd>

      {showList && (
        <ul
          id="busca-global"
          role="listbox"
          className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-gray-100 bg-white p-1.5 shadow-xl shadow-gray-200/60 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none"
        >
          {results.map((item, i) => (
            <li key={item.key} role="option" aria-selected={i === active}>
              <button
                type="button"
                onClick={() => go(item)}
                onMouseEnter={() => setActive(i)}
                className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-colors duration-150 ${
                  i === active ? "bg-emerald-50 dark:bg-emerald-500/10" : ""
                }`}
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-gray-900 dark:text-white">
                    {item.label}
                  </span>
                  {item.hint && (
                    <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                      {item.hint}
                    </span>
                  )}
                </span>

                <span className="shrink-0 rounded-md bg-gray-100 px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wide text-gray-500 dark:bg-neutral-800 dark:text-gray-400">
                  {item.kind}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------- Barra superior ---------- */

function TopBar({
  now,
  recadosNovos,
  ramais,
}: {
  now: Date | null;
  recadosNovos: number;
  ramais: RamalItem[];
}) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-4">
      <GlobalSearch ramais={ramais} />

      <div className="flex shrink-0 items-center gap-3">
        <p
          suppressHydrationWarning
          className="hidden text-sm text-gray-500 first-letter:uppercase dark:text-gray-400 lg:block"
        >
          {now
            ? now.toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : ""}
        </p>

        <Link
          href="/recados"
          aria-label="Recados"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition-all duration-200 hover:border-gray-300 hover:text-gray-900 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-500/60 dark:text-gray-300 dark:hover:text-white"
        >
          <Bell className="h-[1.125rem] w-[1.125rem]" />
          {recadosNovos > 0 && (
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-neutral-900" />
          )}
        </Link>
      </div>
    </div>
  );
}

/* ---------- Saudação ---------- */

function Greeting({
  now,
  eventos,
  recadosNovos,
  temUnidade,
}: {
  now: Date | null;
  eventos: EventoItem[];
  recadosNovos: number;
  temUnidade: boolean;
}) {
  const saudacao = !now
    ? "Olá"
    : now.getHours() < 12
      ? "Bom dia"
      : now.getHours() < 18
        ? "Boa tarde"
        : "Boa noite";

  const hoje = now ? startOfDay(now) : 0;
  const eventosHoje = now
    ? eventos.filter((e) => startOfDay(new Date(e.data)) === hoje).length
    : 0;

  const strong = "font-semibold text-gray-900 dark:text-white";

  return (
    <section className="shrink-0">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white 2xl:text-3xl">
        {saudacao}!
      </h1>

      <p className="mt-1 min-h-6 text-sm text-gray-500 dark:text-gray-400 sm:text-base">
        {now && (
          <>
            Você tem{" "}
            {temUnidade && (
              <>
                <strong className={strong}>
                  {recadosNovos === 0
                    ? "nenhum recado novo"
                    : `${recadosNovos} ${recadosNovos === 1 ? "recado novo" : "recados novos"}`}
                </strong>{" "}
                da sua unidade e{" "}
              </>
            )}
            <strong className={strong}>
              {eventosHoje === 0
                ? "nenhum evento"
                : `${eventosHoje} ${eventosHoje === 1 ? "evento" : "eventos"}`}
            </strong>{" "}
            hoje.
          </>
        )}
      </p>
    </section>
  );
}

/* ---------- Acesso rápido aos sistemas ---------- */

function SistemasCard() {
  const tile =
    "group flex min-w-0 items-center gap-3 rounded-xl border border-gray-100 bg-white p-2.5 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-gray-200 hover:bg-gray-50/60 hover:shadow-md hover:shadow-gray-200/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-neutral-800 dark:bg-[#111a2d] dark:hover:border-neutral-700 dark:hover:bg-neutral-500/60 dark:hover:shadow-none";

  return (
    <section className={`${card} shrink-0`}>
      <SectionHeader
        title="Acesso rápido aos sistemas"
        href="/links-uteis"
        linkLabel="Ver todos os links"
      />

      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6">
        {sistemas.map((sistema) => {
          const content = (
            <>
              <SistemaIcon sistema={sistema} />

              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-gray-900 dark:text-white">
                  {sistema.name}
                </span>

                <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                  {sistema.subtitle}
                </span>
              </span>
            </>
          );

          const semUrl =
            !sistema.url || sistema.url === "-" || sistema.url.startsWith("-/");

          if (semUrl) {
            return (
              <button
                key={sistema.name}
                type="button"
                disabled
                title="Endereço do sistema ainda não configurado"
                aria-label={`${sistema.name}: endereço ainda não configurado`}
                className={`${tile} cursor-not-allowed text-left opacity-60`}
              >
                {content}
              </button>
            );
          }

          if (sistema.url.startsWith("/")) {
            return (
              <Link
                key={sistema.name}
                href={sistema.url}
                title={sistema.name}
                className={tile}
              >
                {content}
              </Link>
            );
          }

          return (
            <a
              key={sistema.name}
              href={sistema.url}
              target="_blank"
              rel="noopener noreferrer"
              title={`${sistema.name} — abrir em nova aba`}
              className={tile}
            >
              {content}
            </a>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- Notícias ---------- */

function NoticiasCard({ noticias }: { noticias: NoticiaItem[] }) {
  const [destaque, ...outras] = noticias;

  return (
    <section
      className={`${card} flex min-h-0 flex-col overflow-hidden lg:col-span-3`}
    >
      <SectionHeader title="Notícias" href="/noticias" linkLabel="Ver todas" />

      {!destaque ? (
        <EmptyState text="Nenhuma notícia publicada ainda." />
      ) : (
        <div className="grid min-h-0 flex-1 gap-5 md:grid-cols-2 md:grid-rows-[minmax(0,1fr)]">
          <Link
            href={`/noticias#${destaque.id}`}
            className="group relative block aspect-[16/9] overflow-hidden rounded-2xl bg-emerald-900 md:aspect-auto"
          >
            {destaque.imagem ? (
              <Image
                src={noticiaImagemUrl(destaque)}
                alt={destaque.titulo}
                fill
                sizes="(min-width: 1024px) 28vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
            ) : (
              <div
                className="absolute inset-0 bg-gradient-to-br from-emerald-800 to-teal-950"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(135deg, rgba(255,255,255,0.05) 0 16px, transparent 16px 32px)",
                }}
              />
            )}
          </Link>

          <div className="flex min-h-0 min-w-0 flex-col overflow-hidden">
            <Link href={`/noticias#${destaque.id}`} className="group block">
              <span className="mb-2 inline-block rounded-md bg-emerald-100 px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                Destaque
              </span>

              <h3 className="line-clamp-2 text-lg font-bold leading-snug text-gray-900 transition-colors duration-200 group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400 2xl:line-clamp-3 2xl:text-xl">
                {destaque.titulo}
              </h3>

              <div className="mt-2">
                <CategoriasTags categorias={destaque.categorias ?? []} />
              </div>

              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-500 dark:text-gray-400 2xl:line-clamp-3">
                {destaque.conteudo}
              </p>
            </Link>

            <p
              suppressHydrationWarning
              className="mt-2 text-xs text-gray-500 dark:text-gray-400"
            >
              {new Date(destaque.createdAt).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>

            {/* Só aparece em telas mais altas, para não cortar nada */}
            {outras.length > 0 && (
              <ul className="mt-auto hidden flex-col gap-1 border-t border-gray-100 pt-3 dark:border-neutral-800 [@media(min-height:880px)]:flex">
                {outras.map((n) => (
                  <li key={n.id}>
                    <Link
                      href={`/noticias#${n.id}`}
                      className="group -mx-2 flex gap-3 rounded-lg px-2 py-2 transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-neutral-800/60"
                    >
                      <span
                        suppressHydrationWarning
                        className="w-12 shrink-0 pt-0.5 text-xs text-gray-400 dark:text-gray-500"
                      >
                        {shortDate(new Date(n.createdAt))}
                      </span>
                      <div className="min-w-0 flex-1">
                        <span className="line-clamp-2 text-sm font-medium text-gray-800 transition-colors duration-200 group-hover:text-emerald-700 dark:text-gray-200 dark:group-hover:text-emerald-400">
                        {n.titulo}
                        </span>
                        {(n.categorias ?? []).length > 0 && (
                          <div className="mt-1">
                            <CategoriasTags categorias={n.categorias} />
                          </div>
                        )}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

/* ---------- Recados da unidade ---------- */

function RecadosCard({
  recados,
  now,
  temUnidade,
}: {
  recados: RecadoItem[];
  now: Date | null;
  temUnidade: boolean;
}) {
  return (
    <section
      className={`${card} flex min-h-0 flex-col overflow-hidden lg:col-span-2`}
    >
      <SectionHeader
        title="Recados da unidade"
        href="/recados"
        linkLabel="Ver todos"
      />

      {recados.length === 0 ? (
        <EmptyState
          text={
            temUnidade
              ? "Nenhum recado para a sua unidade."
              : "Não foi possível identificar a sua unidade."
          }
        />
      ) : (
        <ul
          className={`min-h-0 flex-1 divide-y divide-gray-100 overflow-y-auto dark:divide-neutral-800 ${hideScrollbar}`}
        >
          {recados.map((r) => {
            const d = new Date(r.createdAt);
            const novo =
              !!now && now.getTime() - d.getTime() <= NOVO_DIAS * DIA_MS;

            return (
              <li key={r.id}>
                <Link
                  href={`/recados#${r.id}`}
                  className="group -mx-3 flex items-start gap-3 rounded-xl px-3 py-3 transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-neutral-500/60"
                >
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      {novo && (
                        <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                          Novo
                        </span>
                      )}
                      <span suppressHydrationWarning>
                        {now ? relativeDate(d, now) : ""}
                      </span>
                      <span>· {r.unidade.nome}</span>
                    </div>

                    <h3 className="line-clamp-1 text-sm font-bold text-gray-900 transition-colors duration-200 group-hover:text-emerald-700 dark:text-white dark:group-hover:text-emerald-400">
                      {r.titulo}
                    </h3>

                    {(r.categorias ?? []).length > 0 && (
                      <div className="mt-1.5">
                        <CategoriasTags categorias={r.categorias} />
                      </div>
                    )}

                    <p className="mt-0.5 line-clamp-1 text-sm text-gray-500 dark:text-gray-400 2xl:line-clamp-2">
                      {r.conteudo}
                    </p>
                  </div>

                  {r.imagem && (
                    <span className="relative mt-1 h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800">
                      <Image
                        src={recadoImagemUrl(r)}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

/* ---------- Agenda ---------- */

function AgendaCard({
  eventos,
  now,
}: {
  eventos: EventoItem[];
  now: Date | null;
}) {
  const proximos = useMemo(() => {
    if (!now) return [];
    const hoje = startOfDay(now);

    return eventos
      .filter((e) => new Date(e.data).getTime() >= hoje)
      .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
      .slice(0, 3);
  }, [eventos, now]);

  return (
    <section className={`${card} min-w-0`}>
      <SectionHeader title="Agenda" href="/agenda" linkLabel="Agenda completa" />

      {!now ? (
        <ListSkeleton />
      ) : proximos.length === 0 ? (
        <EmptyState text="Nenhum evento agendado." />
      ) : (
        <ul className="flex flex-col gap-0.5">
          {proximos.map((ev) => {
            const d = new Date(ev.data);
            const hoje = startOfDay(d) === startOfDay(now);
            const diaTodo = d.getHours() === 0 && d.getMinutes() === 0;
            const semana = d
              .toLocaleDateString("pt-BR", { weekday: "short" })
              .replace(".", "")
              .toUpperCase();

            return (
              <li key={ev.id}>
                <Link
                  href="/agenda"
                  className="group -mx-2 flex items-center gap-3 rounded-xl px-2 py-1.5 transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-neutral-500/60"
                >
                  <span
                    className={`flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105 ${
                      hoje
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                        : "border border-gray-200 text-gray-700 dark:border-neutral-700 dark:text-gray-200"
                    }`}
                  >
                    <span
                      className={`text-[0.625rem] font-bold uppercase tracking-wide ${
                        hoje ? "text-white/80" : "text-gray-400"
                      }`}
                    >
                      {hoje ? "Hoje" : semana}
                    </span>
                    <span className="text-lg font-bold leading-none">
                      {d.getDate()}
                    </span>
                  </span>

                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-gray-900 dark:text-white">
                      {ev.titulo}
                    </span>
                    <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                      {diaTodo ? "Dia todo" : formatTime(d)} · {ev.unidade.nome}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

/* ---------- Ramais ---------- */

function RamaisCard({
  ramais,
  temUnidade,
}: {
  ramais: RamalItem[];
  temUnidade: boolean;
}) {
  const router = useRouter();
  const [term, setTerm] = useState("");

  const lista = useMemo(() => {
    const t = normalize(term.trim());
    return ramais
      .filter(
        (r) =>
          !t ||
          normalize(`${r.nome} ${r.setor ?? ""} ${r.numero}`).includes(t),
      )
      .slice(0, 3);
  }, [ramais, term]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const t = term.trim();
    router.push(t ? `/ramais?busca=${encodeURIComponent(t)}` : "/ramais");
  }

  return (
    <section className={`${card} min-w-0`}>
      <SectionHeader
        title="Ramais da unidade"
        href="/ramais"
        linkLabel="Lista completa"
      />

      <form onSubmit={onSubmit} className="relative mb-2">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Nome, setor ou número"
          className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 transition-all duration-200 placeholder:text-gray-400 hover:border-gray-300 focus:border-emerald-500/50 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 dark:border-neutral-800 dark:bg-neutral-500/60 dark:text-white dark:hover:border-neutral-700"
        />
      </form>

      {ramais.length === 0 ? (
        <p className="py-6 text-center text-xs text-gray-400 dark:text-gray-500">
          {temUnidade
            ? "Nenhum ramal cadastrado para a sua unidade."
            : "Não foi possível identificar a sua unidade."}
        </p>
      ) : lista.length === 0 ? (
        <p className="py-6 text-center text-xs text-gray-400 dark:text-gray-500">
          Nenhum ramal encontrado.
        </p>
      ) : (
        <ul className="divide-y divide-dashed divide-gray-200 dark:divide-neutral-800">
          {lista.map((r) => (
            <li key={r.id}>
              <Link
                href={`/ramais?busca=${encodeURIComponent(r.nome)}`}
                className="group -mx-2 flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-neutral-500/60"
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-gray-900 dark:text-white">
                    {r.nome}
                  </span>
                  {r.setor && (
                    <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                      {r.setor}
                    </span>
                  )}
                </span>

                <span className="shrink-0 rounded-lg bg-gray-100 px-2.5 py-1 font-mono text-xs text-gray-600 transition-colors duration-200 group-hover:bg-emerald-100 group-hover:text-emerald-700 dark:bg-neutral-800 dark:text-gray-300 dark:group-hover:bg-emerald-500/10 dark:group-hover:text-emerald-400">
                  {r.numero}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/* ---------- Aniversariantes ---------- */

function AniversariantesCard({
  aniversariantes,
  now,
}: {
  aniversariantes: AniversarianteItem[];
  now: Date | null;
}) {
  const proximos = useMemo(() => {
    if (!now) return [];
    const hoje = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return aniversariantes
      .map((a) => {
        let data = new Date(now.getFullYear(), a.mes - 1, a.dia);
        if (data < hoje) {
          data = new Date(now.getFullYear() + 1, a.mes - 1, a.dia);
        }
        return { ...a, data, eHoje: data.getTime() === hoje.getTime() };
      })
      .sort((a, b) => a.data.getTime() - b.data.getTime())
      .slice(0, 3);
  }, [aniversariantes, now]);

  return (
    <section className={`${card} min-w-0`}>
      <SectionHeader title="Próximos aniversários" />

      {!now ? (
        <ListSkeleton />
      ) : (
        <ul className="flex flex-col gap-0.5">
          {proximos.map((a) => (
            <li
              key={a.id}
              className="group -mx-2 flex items-center gap-3 rounded-xl px-2 py-1.5 transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-neutral-800/60"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-800 transition-transform duration-300 group-hover:scale-105 dark:bg-amber-500/15 dark:text-amber-300">
                {iniciais(a.nome)}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-gray-900 dark:text-white">
                  {a.nome}
                </span>
                {a.setor && (
                  <span className="block truncate text-xs text-gray-500 dark:text-gray-400">
                    {a.setor}
                  </span>
                )}
              </span>

              <span
                className={`shrink-0 text-sm ${
                  a.eHoje
                    ? "font-semibold text-emerald-600 dark:text-emerald-400"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {a.eHoje
                  ? "Hoje"
                  : `${String(a.dia).padStart(2, "0")}/${String(a.mes).padStart(2, "0")}`}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/* ---------- Página ---------- */

export default function DashboardPage({
  noticias,
  recados,
  recadosNovos,
  eventos,
  ramais = [],
  aniversariantes = [],
  unidadeId,
}: Props) {
  const now = useNow();
  const temUnidade = unidadeId !== null;
  const temAniversariantes = aniversariantes.length > 0;

  return (
    // Em telas grandes ocupa exatamente a altura da janela (sem scroll).
    // Se a janela for muito baixa, a página rola normalmente em vez de cortar.
    <div className="flex min-h-dvh flex-col px-4 py-4 sm:px-6 lg:h-dvh lg:min-h-0 lg:px-8 lg:py-2">
      <div className="mx-auto flex min-h-0 w-full flex-1 flex-col gap-3">
        <TopBar now={now} recadosNovos={recadosNovos} ramais={ramais} />

        <Greeting
          now={now}
          eventos={eventos}
          recadosNovos={recadosNovos}
          temUnidade={temUnidade}
        />

        <SistemasCard />

        {/* Notícias + recados: usam todo o espaço que sobrar na altura */}
        <div className="grid min-h-[16rem] flex-1 grid-cols-1 gap-3 lg:min-h-0 lg:grid-cols-5 lg:grid-rows-[minmax(0,1fr)]">
          <NoticiasCard noticias={noticias} />
          <RecadosCard recados={recados} now={now} temUnidade={temUnidade} />
        </div>

        <div
          className={`grid shrink-0 grid-cols-1 gap-3 ${
            temAniversariantes ? "lg:grid-cols-3" : "lg:grid-cols-2"
          }`}
        >
          <AgendaCard eventos={eventos} now={now} />
          <RamaisCard ramais={ramais} temUnidade={temUnidade} />
          {temAniversariantes && (
            <AniversariantesCard aniversariantes={aniversariantes} now={now} />
          )}
        </div>
      </div>
    </div>
  );
}