"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "./themeContext";

type ThemeToggleProps = {
  expanded?: boolean;
};

export default function ThemeToggle({
  expanded = false,
}: ThemeToggleProps) {
  const { isDarkMode, toggleDarkMode } = useTheme();

  function select(mode: "light" | "dark") {
    const shouldBeDark = mode === "dark";

    if (shouldBeDark !== isDarkMode) {
      toggleDarkMode();
    }
  }

  const option = (active: boolean) =>
    [
      "flex h-8 min-w-0 flex-1 items-center justify-center",
      "gap-1.5 rounded-md text-xs font-medium",
      "transition-all duration-200",
      "focus-visible:outline-none focus-visible:ring-2",
      "focus-visible:ring-amber-400",
      active
        ? "bg-white/15 text-white shadow-sm"
        : "text-slate-400 hover:text-white",
    ].join(" ");

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={toggleDarkMode}
        aria-label={
          isDarkMode ? "Ativar tema claro" : "Ativar tema escuro"
        }
        title={
          isDarkMode ? "Ativar tema claro" : "Ativar tema escuro"
        }
        className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition-colors duration-200 hover:bg-white/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
      >
        {isDarkMode ? (
          <Moon
            aria-hidden="true"
            className="h-[1.125rem] w-[1.125rem]"
            strokeWidth={1.75}
          />
        ) : (
          <Sun
            aria-hidden="true"
            className="h-[1.125rem] w-[1.125rem]"
            strokeWidth={1.75}
          />
        )}
      </button>
    );
  }

  return (
    <div
      role="group"
      aria-label="Selecionar tema"
      className="mx-2 flex h-9 items-center rounded-lg bg-white/[0.06] p-0.5"
    >
      <button
        type="button"
        onClick={() => select("light")}
        aria-pressed={!isDarkMode}
        className={option(!isDarkMode)}
      >
        <Sun
          aria-hidden="true"
          className="h-3.5 w-3.5"
          strokeWidth={2}
        />
        Claro
      </button>

      <button
        type="button"
        onClick={() => select("dark")}
        aria-pressed={isDarkMode}
        className={option(isDarkMode)}
      >
        <Moon
          aria-hidden="true"
          className="h-3.5 w-3.5"
          strokeWidth={2}
        />
        Escuro
      </button>
    </div>
  );
}