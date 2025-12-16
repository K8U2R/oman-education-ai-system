import React from 'react';
import { clsx } from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'elevated';
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  variant = 'default',
  className,
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-ide-surface border border-ide-border',
    outlined: 'bg-transparent border-2 border-ide-border',
    elevated: 'bg-ide-surface border border-ide-border shadow-lg',
  };

  return (
    <div
      className={clsx('rounded-lg p-6', variants[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;

