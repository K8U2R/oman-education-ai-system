/**
 * Avatar Component - مكون صورة المستخدم
 *
 * مكون صورة المستخدم قابلة لإعادة الاستخدام
 */

import React from 'react'
import { User } from 'lucide-react'
import { cn } from '../../utils/classNames'
import { OptimizedImage } from '../../../common/OptimizedImage/OptimizedImage'

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface AvatarProps {
  src?: string
  alt?: string
  name?: string
  size?: AvatarSize
  className?: string
  onClick?: () => void
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = 'md',
  className = '',
  onClick,
}) => {
  const getInitials = (name: string): string => {
    const parts = name.trim().split(/\s+/).filter(Boolean)
    if (parts.length >= 2) {
      const firstChar = parts[0]?.[0]
      const lastChar = parts[parts.length - 1]?.[0]
      if (firstChar && lastChar) {
        return (firstChar + lastChar).toUpperCase()
      }
    }
    return name.substring(0, 2).toUpperCase()
  }

  const displayName = name || alt || 'User'

  return (
    <div
      className={cn('avatar', `avatar--${size}`, onClick && 'avatar--clickable', className)}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={e => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onClick()
        }
      }}
    >
      {src ? (
        <OptimizedImage
          src={src}
          alt={alt || displayName}
          className="avatar__image"
          loading="lazy"
          objectFit="cover"
          fallback="/logo.png"
        />
      ) : (
        <div className="avatar__fallback">
          {name ? (
            <span className="avatar__initials">{getInitials(name)}</span>
          ) : (
            <User className="avatar__icon" />
          )}
        </div>
      )}
    </div>
  )
}
