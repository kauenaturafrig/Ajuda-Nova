import { useTheme } from "./themeContext";
import Image from "next/image";

const AnimatedDarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <div className="flex items-center space-x-3 text-lg font-medium">
      <button
        onClick={toggleDarkMode}
        className={`
          relative w-24 h-10 rounded-full flex items-center
          transition-colors duration-500
          ${isDarkMode ? 'bg-gray-700' : 'bg-gray-400'}
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
          bg-gradient-to-r
          from-gray-50
          to-gray-900
          bg-[length:400%_400%]
          animate-gradient-pulse-left
        `}
      >
        {/* Este div é o botão circular que se move */}
        <div
          className={`
            absolute left-1 w-8 h-8 rounded-full shadow-md
            transform transition-transform duration-300
            flex items-center justify-center
            ${isDarkMode ? 'translate-x-[3.5rem]' : 'translate-x-0'}
            ${isDarkMode ? 'bg-gray-900' : 'bg-white'}
          `}
        >
          {isDarkMode ? (
            <Image
                src={'/assets/images/modo-escuro.png'}
                alt="Modo Escuro"
                width={20}
                height={20}
                className="dark:invert"
            />
          ) : (
            <Image
                src={'/assets/images/modo-claro.png'}
                alt="Modo Claro"
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