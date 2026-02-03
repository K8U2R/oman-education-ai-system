/**
 * HeaderBrand Component - مكون Brand للـ Header
 *
 * مكون لعرض Logo و Brand Name و Flag
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/domain/constants/routes.constants'
import { OptimizedImage } from '../../../../common'
import type { HeaderBrandProps } from '../../types'
import { cn } from '../../../../common/utils/classNames'
import Logo from '/logo.png'
import FlagOfOman from '/Flag_of_Oman.svg.png'

/**
 * HeaderBrand Component
 *
 * @example
 * ```tsx
 * <HeaderBrand showText showFlag size="md" />
 * ```
 */
export const HeaderBrand: React.FC<HeaderBrandProps> = React.memo(
  ({ showText = true, showFlag = true, className }) => {
    // brandClasses removed as it was unused and referenced imports that were removed.

    return (
      <Link to={ROUTES.HOME} className={cn('flex items-center gap-3', className)}>
        <div className="relative">
          <OptimizedImage
            src={Logo}
            alt="Oman Education AI Logo"
            className="w-10 h-10 object-contain"
            loading="eager"
            width={40}
            height={40}
            objectFit="contain"
          />
        </div>

        {showText && (
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-text-primary leading-tight">Oman Education AI</h1>
            <p className="text-xs text-text-secondary">نظام التعليم الذكي</p>
          </div>
        )}

        {showFlag && (
          <div className="ml-2 pt-1" title="سلطنة عمان">
            <OptimizedImage
              src={FlagOfOman}
              alt="علم سلطنة عمان"
              className="w-6 h-4 object-contain shadow-sm rounded-sm"
              loading="lazy"
              width={24}
              height={16}
              objectFit="contain"
            />
          </div>
        )}
      </Link>
    )
  }
)

HeaderBrand.displayName = 'HeaderBrand'
