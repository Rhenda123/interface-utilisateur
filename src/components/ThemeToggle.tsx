
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-yellow-400 dark:bg-yellow-600 hover:bg-yellow-500 dark:hover:bg-yellow-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-900" />
      ) : (
        <Sun className="h-5 w-5 sm:h-6 sm:w-6 text-gray-900" />
      )}
    </button>
  );
};

export default ThemeToggle;
