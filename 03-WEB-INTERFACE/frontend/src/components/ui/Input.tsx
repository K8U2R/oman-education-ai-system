import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'rows'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  multiline?: boolean;
  rows?: number;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  multiline,
  rows = 3,
  className,
  ...props
}) => {
  const inputClasses = clsx(
    'w-full px-4 py-2.5 rounded-md bg-ide-bg border text-ide-text focus:outline-none focus:ring-2 transition-colors',
    leftIcon && 'pr-10',
    rightIcon && 'pl-10',
    error
      ? 'border-red-500 focus:ring-red-500'
      : 'border-ide-border focus:ring-ide-accent',
    className
  );

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-2 text-ide-text">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && !multiline && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-ide-text-secondary">
            {leftIcon}
          </div>
        )}
        {multiline ? (
          <textarea
            rows={rows}
            className={inputClasses}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            className={inputClasses}
            {...props}
          />
        )}
        {rightIcon && !multiline && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-ide-text-secondary">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-ide-text-secondary">{helperText}</p>
      )}
    </div>
  );
};

export default Input;

