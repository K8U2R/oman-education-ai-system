import React from 'react';
import { AlertCircle, CheckCircle, XCircle, Info, X } from 'lucide-react';
import { clsx } from 'clsx';

export type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  variant: AlertVariant;
  title?: string;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  variant,
  title,
  message,
  dismissible = false,
  onDismiss,
  className,
}) => {
  const variants = {
    success: {
      bg: 'bg-green-900/20',
      border: 'border-green-500/50',
      text: 'text-green-400',
      icon: CheckCircle,
    },
    error: {
      bg: 'bg-red-900/20',
      border: 'border-red-500/50',
      text: 'text-red-400',
      icon: XCircle,
    },
    warning: {
      bg: 'bg-yellow-900/20',
      border: 'border-yellow-500/50',
      text: 'text-yellow-400',
      icon: AlertCircle,
    },
    info: {
      bg: 'bg-blue-900/20',
      border: 'border-blue-500/50',
      text: 'text-blue-400',
      icon: Info,
    },
  };

  const variantStyles = variants[variant];
  const Icon = variantStyles.icon;

  return (
    <div
      className={clsx(
        'p-4 rounded-lg border flex items-start gap-3',
        variantStyles.bg,
        variantStyles.border,
        className
      )}
    >
      <Icon className={clsx('w-5 h-5 flex-shrink-0 mt-0.5', variantStyles.text)} />
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className={clsx('font-medium mb-1', variantStyles.text)}>{title}</h4>
        )}
        <p className={clsx('text-sm', variantStyles.text)}>{message}</p>
      </div>
      {dismissible && (
        <button
          onClick={onDismiss}
          className={clsx('flex-shrink-0 p-1 rounded hover:bg-black/20', variantStyles.text)}
          aria-label="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;

