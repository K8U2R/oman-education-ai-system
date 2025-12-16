import React from 'react';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  error,
  helperText,
  options,
  placeholder,
  className,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-2 text-ide-text">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          className={clsx(
            'w-full px-4 py-2.5 pr-10 rounded-md bg-ide-bg border text-ide-text appearance-none focus:outline-none focus:ring-2 transition-colors',
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-ide-border focus:ring-ide-accent',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-ide-text-secondary pointer-events-none" />
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

export default Select;

