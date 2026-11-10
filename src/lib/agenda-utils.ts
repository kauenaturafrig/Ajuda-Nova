// src/lib/agenda-utils.ts
// Helpers compartilhados pela agenda pública e pela agenda admin.
// Tudo aqui trabalha no fuso LOCAL (evita o bug de toISOString() virar o dia em UTC).

const UNIT_COLORS = [
  "#10b981", // emerald
  "#3b82f6", // blue
  "#f59e0b", // amber
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f97316", // orange
  "#84cc16", // lime
];

/** Cor estável por unidade (mesma unidade = mesma cor nas duas telas). */
export function unidadeCor(id: number) {
  const solid = UNIT_COLORS[Math.abs(id) % UNIT_COLORS.length];
  return { solid, soft: `${solid}1f`, border: `${solid}40` };
}

const pad = (n: number) => String(n).padStart(2, "0");

/** "2026-11-09" no fuso local. */
export function dayKey(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function mesmoDia(a: Date, b: Date) {
  return dayKey(a) === dayKey(b);
}

/** Valor para <input type="date"> no fuso local. */
export function toInputDate(d: Date) {
  return dayKey(d);
}

/** Valor para <input type="time"> no fuso local. */
export function toInputTime(d: Date) {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function formatHora(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDataHora(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

/** "Hoje", "Amanhã", "Ontem" ou "segunda-feira, 09 de novembro". */
export function rotuloDia(d: Date, now: Date) {
  const diff = Math.round(
    (startOfDay(d).getTime() - startOfDay(now).getTime()) / 86400000,
  );
  if (diff === 0) return "Hoje";
  if (diff === 1) return "Amanhã";
  if (diff === -1) return "Ontem";
  return d.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
}

export type EventoTone = "live" | "soon" | "past" | "future";

export function statusDoEvento(dataISO: string, now: Date) {
  const data = new Date(dataISO);

  if (mesmoDia(data, now)) {
    return { label: "Hoje", tone: "live" as EventoTone };
  }

  if (data.getTime() < now.getTime()) {
    return { label: "Concluído", tone: "past" as EventoTone };
  }

  const diff = Math.round(
    (startOfDay(data).getTime() - startOfDay(now).getTime()) / 86400000,
  );

  if (diff === 1) return { label: "Amanhã", tone: "soon" as EventoTone };
  if (diff <= 7) return { label: `Em ${diff} dias`, tone: "soon" as EventoTone };
  return { label: null, tone: "future" as EventoTone };
}

export const BADGE_TONE: Record<EventoTone, string> = {
  live: "bg-emerald-500 text-white",
  soon: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  past: "bg-gray-100 text-gray-500 dark:bg-neutral-800 dark:text-gray-400",
  future: "bg-gray-100 text-gray-500 dark:bg-neutral-800 dark:text-gray-400",
};