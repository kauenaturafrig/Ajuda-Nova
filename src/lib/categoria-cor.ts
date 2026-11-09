// src/lib/categoria-cor.ts
// Converte o campo `cor` da Categoria ("#ef4444", "#f00", "red", "emerald"...)
// em cores prontas para usar com style={{ ... }} (o Tailwind não aceita classes dinâmicas).

const NOMES: Record<string, string> = {
  red: "#ef4444",
  orange: "#f97316",
  amber: "#f59e0b",
  yellow: "#eab308",
  lime: "#84cc16",
  green: "#22c55e",
  emerald: "#10b981",
  teal: "#14b8a6",
  cyan: "#06b6d4",
  sky: "#0ea5e9",
  blue: "#3b82f6",
  indigo: "#6366f1",
  violet: "#8b5cf6",
  purple: "#a855f7",
  fuchsia: "#d946ef",
  pink: "#ec4899",
  rose: "#f43f5e",
  slate: "#64748b",
  gray: "#6b7280",
  zinc: "#71717a",
  neutral: "#737373",
  stone: "#78716c",
};

const PADRAO = "#64748b";

export function normalizarCor(cor?: string | null): string {
  if (!cor) return PADRAO;

  const v = cor.trim().toLowerCase();
  if (NOMES[v]) return NOMES[v];

  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/.exec(v);
  if (!m) return PADRAO;

  let hex = m[1];
  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  }

  return `#${hex}`;
}

export function categoriaCores(cor?: string | null) {
  const solid = normalizarCor(cor);
  return {
    solid, // texto, pontinho, faixa
    soft: `${solid}1f`, // fundo suave
    border: `${solid}40`, // borda suave
  };
}