/**
 * useBreadcrumbs Hook - Hook لـ Breadcrumbs
 *
 * Custom Hook لإنشاء Breadcrumbs
 */

import { useLocation } from 'react-router-dom'
import { useMemo } from 'react'
import { generateBreadcrumbs } from '../utils/breadcrumbs'
import { routeMetadata } from '../index'
import { BreadcrumbItem } from '../types'

export const useBreadcrumbs = (): BreadcrumbItem[] => {
  const location = useLocation()

  return useMemo(() => {
    return generateBreadcrumbs(location.pathname, routeMetadata)
  }, [location.pathname])
}
