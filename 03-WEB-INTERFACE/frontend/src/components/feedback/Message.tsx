import React from 'react';
import { clsx } from 'clsx';

export type MessageVariant = 'success' | 'error' | 'warning' | 'info' | 'default';

interface MessageProps {
  variant?: MessageVariant;
  message: string;
  className?: string;
}

const Message: React.FC<MessageProps> = ({ variant = 'default', message, className }) => {
  const variants = {
    success: 'bg-green-900/20 text-green-400 border-green-500/50',
    error: 'bg-red-900/20 text-red-400 border-red-500/50',
    warning: 'bg-yellow-900/20 text-yellow-400 border-yellow-500/50',
    info: 'bg-blue-900/20 text-blue-400 border-blue-500/50',
    default: 'bg-ide-surface text-ide-text border-ide-border',
  };

  return (
    <div
      className={clsx(
        'p-3 rounded-md border text-sm',
        variants[variant],
        className
      )}
    >
      {message}
    </div>
  );
};

export default Message;

