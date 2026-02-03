/**
 * Common Components Types - أنواع المكونات المشتركة
 *
 * جميع Types و Interfaces للمكونات المشتركة
 */

import React from 'react'

/**
 * Button Variants
 */
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'success'
  | 'warning'

/**
 * Button Sizes
 */
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/**
 * Button Props
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
  children: React.ReactNode
}

/**
 * Card Variants
 */
export type CardVariant = 'default' | 'elevated' | 'outlined' | 'filled'

/**
 * Card Padding
 */
export type CardPadding = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/**
 * Card Props
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  className?: string
  variant?: CardVariant
  padding?: CardPadding
  onClick?: () => void
  hoverable?: boolean
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
}

/**
 * Input Variants
 */
export type InputVariant = 'default' | 'outlined' | 'filled' | 'underlined'

/**
 * Input Sizes
 */
export type InputSize = 'sm' | 'md' | 'lg'

/**
 * Input Props
 */
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: InputVariant
  size?: InputSize
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

/**
 * Component Base Props
 */
export interface BaseComponentProps {
  className?: string
  testId?: string
}

/**
 * Badge Variants
 */
export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'

/**
 * Badge Sizes
 */
export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg'

/**
 * Avatar Sizes
 */
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

/**
 * Progress Bar Variants
 */
export type ProgressBarVariant = 'default' | 'primary' | 'success' | 'warning' | 'error'

/**
 * Progress Bar Sizes
 */
export type ProgressBarSize = 'sm' | 'md' | 'lg'
