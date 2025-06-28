
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-yellow-400 dark:bg-yellow-600 hover:bg-yellow-500 dark:hover:bg-yellow-700 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 touch-manipulation border border-yellow-500/20"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-900" />
      ) : (
        <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-gray-900" />
      )}
    </button>
  );
};

export default ThemeToggle;
