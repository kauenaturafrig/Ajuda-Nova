import { useTheme } from './themeContext';
import Image from 'next/image';

const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-md bg-gray-400 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
    >
      {isDarkMode ? <p>Modo Claro</p> : <p>Modo Escuro</p>}
      {isDarkMode ? 
        <Image 
          src={'/assets/images/modo-claro.png'}
          alt='Modo claro'
          width={40}
          height={40}
          className='dark:invert'
        /> : 
        <Image 
          src={'/assets/images/modo-escuro.png'}
          alt='Modo escuro'
          width={20}
          height={20}
        />
      }
    </button>
  );
};

export default DarkModeToggle;