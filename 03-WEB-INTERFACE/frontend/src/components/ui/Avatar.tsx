import React from 'react';
import { User } from 'lucide-react';
import { clsx } from 'clsx';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'circle' | 'square';
  status?: 'online' | 'offline' | 'away';
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = 'md',
  variant = 'circle',
  status,
  className,
  ...props
}) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const statusSizes = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
  };

  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-500',
    away: 'bg-yellow-500',
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={clsx('relative inline-flex items-center justify-center', className)}
      {...props}
    >
      <div
        className={clsx(
          'bg-ide-accent/20 text-ide-accent flex items-center justify-center font-medium overflow-hidden',
          sizes[size],
          variant === 'circle' ? 'rounded-full' : 'rounded-md'
        )}
      >
        {src ? (
          <img
            src={src}
            alt={alt || name}
            className={clsx(
              'w-full h-full object-cover',
              variant === 'circle' ? 'rounded-full' : 'rounded-md'
            )}
          />
        ) : name ? (
          getInitials(name)
        ) : (
          <User className={clsx('text-ide-accent', size === 'sm' ? 'w-4 h-4' : 'w-6 h-6')} />
        )}
      </div>
      {status && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 border-2 border-ide-surface rounded-full',
            statusSizes[size],
            statusColors[status]
          )}
        />
      )}
    </div>
  );
};

export default Avatar;

