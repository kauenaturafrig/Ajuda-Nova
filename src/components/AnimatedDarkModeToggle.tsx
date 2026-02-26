"use client";

import { useTheme } from "./themeContext";
import Image from "next/image";

const AnimatedDarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useTheme(); // ✅ SÓ 1x

  return (
    <div className="flex items-center space-x-3 text-lg font-medium">
      <button
        onClick={toggleDarkMode}
        className={`
          relative w-24 h-12 rounded-full p-1 flex items-center
          transition-all duration-500 ease-in-out shadow-lg
          focus:outline-none focus:ring-4 focus:ring-offset-2 
          focus:ring-blue-400/50 active:scale-[0.98]
          
          ${isDarkMode
            ? 'bg-gray-800 border-2 border-gray-600 shadow-gray-900/50'
            : 'bg-gray-100 border-2 border-gray-300 shadow-lg shadow-gray-200/50'
          }
        `}
        aria-label={isDarkMode ? "Modo claro" : "Modo escuro"}
      >
        {/* Thumb PERFEITO */}
        <div
          className={`
            w-10 h-10 rounded-full shadow-xl backdrop-blur-md
            flex items-center justify-center transition-all duration-500 ease-out
            
            ${isDarkMode
                ? 'bg-gradient-to-r from-gray-200 via-gray-300 to-white translate-x-[2.8rem] shadow-white/50'
                : 'bg-gradient-to-r from-white via-gray-100 to-gray-200 shadow-lg'
              }
            `}
          >
          {isDarkMode ? (
            <Image
              src="/assets/images/modo-claro.png"
              alt="☀️ Claro"
              width={20}
              height={20}
            />
          ) : (
            <Image
              src="/assets/images/modo-escuro.png"
              alt="🌙 Escuro"
              width={20}
              height={20}
            />
          )}
        </div>
      </button>
    </div>
  );
};

export default AnimatedDarkModeToggle;
