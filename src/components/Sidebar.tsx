"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import ThemeToggle from "./Themetoggle";
import {
  House,
  LayoutGrid,
  Phone,
  Mail,
  FileText,
  Megaphone,
  Calendar,
  Book,
  CircleHelp,
  ChevronDown,
  ScanLine,
  Scale,
  Terminal,
  Printer,
  Monitor,
  Shield,
  type LucideIcon,
} from "lucide-react";

/* ---------- Dados ---------- */

type NavEntry = {
  label: string;
  path: string;
  icon: LucideIcon;
  external?: boolean;
};

const principal: NavEntry[] = [
  { label: "Início", path: "/dashboard", icon: House },
  { label: "Sistemas", path: "/links-uteis", icon: LayoutGrid },
  { label: "Ramais", path: "/ramais", icon: Phone },
  { label: "E-mails", path: "/emails", icon: Mail },
];

const comunicacao: NavEntry[] = [
  { label: "Notícias", path: "/noticias", icon: FileText },
  { label: "Recados", path: "/recados", icon: Megaphone },
  { label: "Agenda", path: "/agenda", icon: Calendar },
];

const manuais: NavEntry[] = [
  { label: "Leitores", path: "/leitores", icon: ScanLine },
  { label: "Balanças", path: "/balancas", icon: Scale },
  { label: "Tanuresoft", path: "/tanuresoft", icon: Terminal },
  {
    label: "Impressora Zebra",
    path: "/impressoras-termicas",
    icon: Printer,
  },
  { label: "Windows", path: "/windows-page", icon: Monitor },
];

// Substitua "-" pela URL real do sistema de chamados.
const abrirChamado: NavEntry = {
  label: "Abrir chamado",
  path: "https://helpdesk.naturafrig.com.br",
  icon: CircleHelp,
  external: true,
};

const admin: NavEntry = {
  label: "Administração",
  path: "/admin",
  icon: Shield,
};

/* ---------- Helpers ---------- */

function isActive(pathname: string, path: string) {
  if (path === "/dashboard") {
    return (
      pathname === "/" ||
      pathname === "/dashboard" ||
      pathname.startsWith("/dashboard/")
    );
  }

  return pathname === path || pathname.startsWith(`${path}/`);
}

/* ---------- Peças ---------- */

function SectionLabel({
  title,
  expanded,
}: {
  title: string;
  expanded: boolean;
}) {
  return (
    <div className="relative mb-1 mt-5 h-4">
      {expanded ? (
        <span className="absolute inset-0 flex items-center whitespace-nowrap px-[1.125rem] text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-slate-400/80">
          {title}
        </span>
      ) : (
        <span
          aria-hidden="true"
          className="absolute inset-x-3 top-1/2 h-px bg-white/10"
        />
      )}
    </div>
  );
}

function NavItem({
  item,
  active,
  expanded,
  badge,
  small = false,
  onNavigate,
}: {
  item: NavEntry;
  active: boolean;
  expanded: boolean;
  badge?: number;
  small?: boolean;
  onNavigate: () => void;
}) {
  const Icon = item.icon;
  const disabled = !item.path || item.path === "-";

  const className = [
    "relative flex min-h-10 w-full min-w-0 items-center rounded-lg",
    "py-2.5 text-left transition-colors duration-200",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-inset focus-visible:ring-amber-400",
    expanded
      ? "gap-3 px-[1.125rem]"
      : "justify-center px-0",
    small ? "text-[0.8125rem]" : "text-[0.9375rem]",
    active
      ? "bg-[#17336b] font-semibold text-white"
      : "font-medium text-slate-300 hover:bg-white/[0.06] hover:text-white",
    disabled ? "cursor-not-allowed opacity-50" : "",
  ].join(" ");

  const content = (
    <>
      {active && (
        <span
          aria-hidden="true"
          className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-amber-400"
        />
      )}

      <Icon
        aria-hidden="true"
        className={small ? "h-4 w-4 shrink-0" : "h-5 w-5 shrink-0"}
        strokeWidth={1.75}
      />

      {expanded && (
        <span className="min-w-0 flex-1 whitespace-nowrap">
          {item.label}
        </span>
      )}

      {!!badge && badge > 0 && (
        expanded ? (
          <span className="ml-auto min-w-5 shrink-0 rounded-full bg-red-600 px-1.5 py-0.5 text-center text-[0.6875rem] font-bold leading-none text-white">
            {badge > 99 ? "99+" : badge}
          </span>
        ) : (
          <span
            aria-hidden="true"
            className="absolute right-4 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#0d224f]"
          />
        )
      )}
    </>
  );

  const accessibleLabel =
    badge && badge > 0
      ? `${item.label}: ${badge} novos`
      : item.label;

  if (disabled) {
    return (
      <button
        type="button"
        disabled
        aria-label={`${item.label}: link ainda não configurado`}
        title="Link ainda não configurado"
        className={className}
      >
        {content}
      </button>
    );
  }

  if (item.external) {
    return (
      <a
        href={item.path}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={accessibleLabel}
        title={!expanded ? item.label : undefined}
        onClick={onNavigate}
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={item.path}
      aria-label={accessibleLabel}
      aria-current={active ? "page" : undefined}
      title={!expanded ? item.label : undefined}
      onClick={onNavigate}
      className={className}
    >
      {content}
    </Link>
  );
}

/* ---------- Sidebar ---------- */

export default function Sidebar({
  recadosNovos = 0,
}: {
  recadosNovos?: number;
}) {
  const pathname = usePathname() ?? "";

  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [manualsOverride, setManualsOverride] = useState<boolean | null>(
    null,
  );

  const expanded = hovered || focused;

  const manualAtivo = manuais.some((item) =>
    isActive(pathname, item.path),
  );

  const openManuais =
    expanded && (manualsOverride ?? manualAtivo);

  function resetManuais() {
    setManualsOverride(null);
  }

  function closeSidebar() {
    setHovered(false);
    setFocused(false);
    setManualsOverride(null);
  }

  return (
    <aside
      aria-label="Menu lateral"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);

        if (!focused) {
          resetManuais();
        }
      }}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        const nextTarget = event.relatedTarget;

        if (
          !nextTarget ||
          !event.currentTarget.contains(nextTarget as Node)
        ) {
          setFocused(false);

          if (!hovered) {
            resetManuais();
          }
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          closeSidebar();

          if (
            document.activeElement instanceof HTMLElement &&
            event.currentTarget.contains(document.activeElement)
          ) {
            document.activeElement.blur();
          }
        }
      }}
      className={[
        "fixed left-0 top-0 z-50 flex h-dvh flex-col",
        "overflow-y-auto overflow-x-hidden bg-[#0d224f]",
        "px-1 text-white shadow-xl",
        "transition-[width] duration-300 ease-out",
        "motion-reduce:transition-none",
        "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        expanded ? "w-64" : "w-20",
      ].join(" ")}
    >
      {/* Header */}
      <div
        className={[
          "flex min-h-20 shrink-0 items-center gap-3 px-2 pb-2 pt-4",
          expanded ? "justify-center" : "justify-start",
        ].join(" ")}
      >
        <Image
          src="/assets/images/logo-naturafrig.png"
          width={96}
          height={96}
          alt="Naturafrig"
          className={[
            "h-auto shrink-0 transition-[width] duration-300",
            expanded ? "w-28" : "w-14",
          ].join(" ")}
        />
      </div>

      {/* Navegação */}
      <nav aria-label="Navegação principal" className="flex-1">
        <SectionLabel title="Principal" expanded={expanded} />

        <ul className="space-y-0.5">
          {principal.map((item) => (
            <li key={item.path}>
              <NavItem
                item={item}
                active={isActive(pathname, item.path)}
                expanded={expanded}
                onNavigate={resetManuais}
              />
            </li>
          ))}
        </ul>

        <SectionLabel title="Comunicação" expanded={expanded} />

        <ul className="space-y-0.5">
          {comunicacao.map((item) => (
            <li key={item.path}>
              <NavItem
                item={item}
                active={isActive(pathname, item.path)}
                expanded={expanded}
                badge={
                  item.path === "/recados"
                    ? recadosNovos
                    : undefined
                }
                onNavigate={resetManuais}
              />
            </li>
          ))}
        </ul>

        <SectionLabel title="Suporte" expanded={expanded} />

        <ul className="space-y-0.5">
          <li>
            <button
              type="button"
              onClick={() => {
                setManualsOverride(!openManuais);
              }}
              aria-label="Manuais"
              aria-expanded={openManuais}
              aria-controls="submenu-manuais"
              title={!expanded ? "Manuais" : undefined}
              className={[
                "relative flex min-h-10 w-full items-center",
                "rounded-lg py-2.5 text-left text-[0.9375rem]",
                "transition-colors duration-200",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-inset focus-visible:ring-amber-400",
                expanded
                  ? "gap-3 px-[1.125rem]"
                  : "justify-center",
                manualAtivo
                  ? "bg-[#17336b] font-semibold text-white"
                  : "font-medium text-slate-300 hover:bg-white/[0.06] hover:text-white",
              ].join(" ")}
            >
              {manualAtivo && (
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-amber-400"
                />
              )}

              <Book
                aria-hidden="true"
                className="h-5 w-5 shrink-0"
                strokeWidth={1.75}
              />

              {expanded && (
                <>
                  <span className="whitespace-nowrap">
                    Manuais
                  </span>

                  <ChevronDown
                    aria-hidden="true"
                    className={[
                      "ml-auto h-4 w-4 shrink-0 text-slate-400",
                      "transition-transform duration-200",
                      openManuais ? "rotate-180" : "",
                    ].join(" ")}
                  />
                </>
              )}
            </button>

            <ul
              id="submenu-manuais"
              hidden={!openManuais}
              className="mt-1 space-y-0.5"
            >
              {manuais.map((item) => (
                <li key={item.path}>
                  <NavItem
                    item={item}
                    active={isActive(pathname, item.path)}
                    expanded={expanded}
                    small
                    onNavigate={resetManuais}
                  />
                </li>
              ))}
            </ul>
          </li>

          <li>
            <NavItem
              item={abrirChamado}
              active={false}
              expanded={expanded}
              onNavigate={resetManuais}
            />
          </li>
        </ul>
      </nav>

      {/* Rodapé */}
      <div className="shrink-0 pb-3 pt-3">
        <div className="mx-2 mb-3 h-px bg-white/10" />

        <div className="pb-2">
          <ThemeToggle expanded={expanded} />
        </div>

        <NavItem
          item={admin}
          active={isActive(pathname, admin.path)}
          expanded={expanded}
          onNavigate={resetManuais}
        />

        {expanded && (
          <footer className="mt-3 flex min-h-12 flex-col items-center justify-center whitespace-nowrap border-t border-white/10 pt-3 text-[0.6875rem] font-light text-slate-400">
            <p>TI - Naturafrig 2026</p>
            <p>Feito por Kaue 💻</p>
          </footer>
        )}
      </div>
    </aside>
  );
}