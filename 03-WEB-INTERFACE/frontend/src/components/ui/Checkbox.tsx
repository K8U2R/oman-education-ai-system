import React from 'react';
import { clsx } from 'clsx';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  error,
  className,
  ...props
}) => {
  return (
    <div className="w-full">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          className={clsx(
            'w-4 h-4 rounded border-ide-border bg-ide-bg text-ide-accent focus:ring-2 focus:ring-ide-accent',
            error && 'border-red-500',
            className
          )}
          {...props}
        />
        {label && (
          <span className={clsx('text-sm', error ? 'text-red-400' : 'text-ide-text')}>
            {label}
          </span>
        )}
      </label>
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Checkbox;

