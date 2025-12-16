import React from 'react';
import { clsx } from 'clsx';

export type StatusVariant = 'success' | 'error' | 'warning' | 'info' | 'pending';

interface StatusProps {
  variant: StatusVariant;
  label: string;
  showDot?: boolean;
  className?: string;
}

const Status: React.FC<StatusProps> = ({ variant, label, showDot = true, className }) => {
  const variants = {
    success: {
      dot: 'bg-green-500',
      text: 'text-green-400',
      bg: 'bg-green-900/20',
      border: 'border-green-500/50',
    },
    error: {
      dot: 'bg-red-500',
      text: 'text-red-400',
      bg: 'bg-red-900/20',
      border: 'border-red-500/50',
    },
    warning: {
      dot: 'bg-yellow-500',
      text: 'text-yellow-400',
      bg: 'bg-yellow-900/20',
      border: 'border-yellow-500/50',
    },
    info: {
      dot: 'bg-blue-500',
      text: 'text-blue-400',
      bg: 'bg-blue-900/20',
      border: 'border-blue-500/50',
    },
    pending: {
      dot: 'bg-gray-500',
      text: 'text-gray-400',
      bg: 'bg-gray-900/20',
      border: 'border-gray-500/50',
    },
  };

  const variantStyles = variants[variant];

  return (
    <div
      className={clsx(
        'inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium',
        variantStyles.bg,
        variantStyles.border,
        variantStyles.text,
        className
      )}
    >
      {showDot && (
        <span
          className={clsx('w-2 h-2 rounded-full', variantStyles.dot)}
          aria-hidden="true"
        />
      )}
      <span>{label}</span>
    </div>
  );
};

export default Status;

