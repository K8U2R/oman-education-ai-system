import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import Button from '@/components/ui/Button';

interface ThemeToggleProps {
  className?: string;
  variant?: 'icon' | 'button';
}

/**
 * مكون تبديل الثيم (Light/Dark Mode)
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  variant = 'icon',
}) => {
  const { toggleTheme, isDark } = useTheme();

  if (variant === 'button') {
    return (
      <Button
        variant="ghost"
        onClick={toggleTheme}
        className={`flex items-center gap-2 ${className}`}
        aria-label={isDark ? 'تبديل إلى الوضع الفاتح' : 'تبديل إلى الوضع الداكن'}
      >
        {isDark ? (
          <>
            <Sun className="w-4 h-4" />
            <span className="hidden sm:inline">فاتح</span>
          </>
        ) : (
          <>
            <Moon className="w-4 h-4" />
            <span className="hidden sm:inline">داكن</span>
          </>
        )}
      </Button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`
        p-2 rounded-lg
        bg-ide-surface/60 hover:bg-ide-surface
        border border-ide-border/30 hover:border-ide-border/60
        transition-all duration-200
        backdrop-blur-sm
        shadow-sm hover:shadow-md
        hover:scale-105
        active:scale-95
        ${className}
      `}
      aria-label={isDark ? 'تبديل إلى الوضع الفاتح' : 'تبديل إلى الوضع الداكن'}
      title={isDark ? 'الوضع الفاتح' : 'الوضع الداكن'}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-ide-text transition-transform duration-200 hover:rotate-180" />
      ) : (
        <Moon className="w-5 h-5 text-ide-text transition-transform duration-200 hover:rotate-12" />
      )}
    </button>
  );
};

export default ThemeToggle;

