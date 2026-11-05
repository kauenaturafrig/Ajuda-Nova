"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({
  children,
}: ThemeProviderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Carrega a preferência salva.
  useEffect(() => {
    let initialDarkMode = false;

    try {
      initialDarkMode =
        window.localStorage.getItem("theme") === "dark";
    } catch {
      initialDarkMode = false;
    }

    setIsDarkMode(initialDarkMode);
    setMounted(true);
  }, []);

  // Aplica e persiste o tema.
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    root.classList.toggle("dark", isDarkMode);
    root.style.colorScheme = isDarkMode ? "dark" : "light";

    try {
      window.localStorage.setItem(
        "theme",
        isDarkMode ? "dark" : "light",
      );
    } catch {
      // O tema continua funcionando sem armazenamento local.
    }
  }, [isDarkMode, mounted]);

  // Sincroniza mudanças realizadas em outras abas.
  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key === "theme") {
        setIsDarkMode(event.newValue === "dark");
      }

      if (event.key === null) {
        setIsDarkMode(false);
      }
    }

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode((previous) => !previous);
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
      }}
    >
      {!mounted ? (
        <div
          role="status"
          aria-label="Carregando interface"
          className="min-h-screen animate-pulse bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800"
        >
          <span className="sr-only">
            Carregando interface...
          </span>
        </div>
      ) : (
        children
      )}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error(
      "useTheme deve ser usado dentro de um ThemeProvider",
    );
  }

  return context;
}