import React from 'react';
import { Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export interface ThemeToggleProps {
  variant?: 'button' | 'dropdown' | 'icon';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'icon',
  className = ''
}) => {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();

  if (variant === 'button') {
    return (
      <div className={`flex items-center p-1 bg-stone-100 dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 ${className}`}>
        <button
          onClick={() => setTheme('light')}
          className={`p-1.5 rounded-xl transition ${
            theme === 'light'
              ? 'bg-white dark:bg-stone-900 text-amber-500 shadow-sm'
              : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'
          }`}
          title="Light Mode"
        >
          <Sun className="w-4 h-4" />
        </button>

        <button
          onClick={() => setTheme('dark')}
          className={`p-1.5 rounded-xl transition ${
            theme === 'dark'
              ? 'bg-white dark:bg-stone-900 text-blue-400 shadow-sm'
              : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'
          }`}
          title="Dark Mode"
        >
          <Moon className="w-4 h-4" />
        </button>

        <button
          onClick={() => setTheme('system')}
          className={`p-1.5 rounded-xl transition ${
            theme === 'system'
              ? 'bg-white dark:bg-stone-900 text-emerald-500 shadow-sm'
              : 'text-stone-400 hover:text-stone-700 dark:hover:text-stone-300'
          }`}
          title="System Sync"
        >
          <Laptop className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition relative flex items-center justify-center ${className}`}
      title={`Switch to ${resolvedTheme === 'light' ? 'Dark' : 'Light'} Mode`}
      aria-label="Toggle theme"
    >
      {resolvedTheme === 'light' ? (
        <Moon className="w-4 h-4 text-stone-700 transition hover:rotate-12" />
      ) : (
        <Sun className="w-4 h-4 text-amber-400 transition hover:rotate-45" />
      )}
    </button>
  );
};
