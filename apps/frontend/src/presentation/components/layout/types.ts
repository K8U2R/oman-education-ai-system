/**
 * Layout Components Types - أنواع مكونات التخطيط
 *
 * جميع Types و Interfaces لمكونات التخطيط
 */

import React from 'react'

/**
 * Navigation Item
 */
export interface NavigationItem {
  path: string
  label: string
  icon?: React.ComponentType<{ className?: string }>
  requiresAuth?: boolean
  badge?: number | string
}

/**
 * Notification Type (UI format)
 */
export type NotificationType =
  | 'message'
  | 'alert'
  | 'task'
  | 'test'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'assignment'
  | 'announcement'

/**
 * Notification (UI format)
 */
export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  time: string
  read: boolean
  actionUrl?: string
}

/**
 * Search Result Type
 */
export type SearchResultType = 'lesson' | 'student' | 'subject' | 'user' | 'file' | 'folder'

/**
 * Search Result
 */
export interface SearchResult {
  id: string
  type: SearchResultType
  title: string
  description?: string
  url: string
  icon?: React.ComponentType<{ className?: string }>
  metadata?: Record<string, unknown>
}

/**
 * Theme Mode
 */
export type ThemeMode = 'light' | 'dark' | 'system'

/**
 * Language
 */
export type Language = 'ar' | 'en'

/**
 * Layout Component Props Base
 */
export interface LayoutComponentProps {
  className?: string
  testId?: string
}
