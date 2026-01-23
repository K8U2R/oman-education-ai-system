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
  ({ showText = true, showFlag = true, size = 'md', className }) => {
    const brandClasses = React.useMemo(
      () => cn('header-brand', size && `header-brand--${size}`, className),
      [size, className]
    )

    return (
      <Link to={ROUTES.HOME} className={brandClasses}>
        <div className="header-brand__icon">
          <OptimizedImage
            src={Logo}
            alt="Oman Education AI Logo"
            className="header-brand__image"
            loading="eager"
            width={40}
            height={40}
            objectFit="contain"
          />
        </div>

        {showText && (
          <div className="header-brand__text">
            <h1 className="header-brand__title">Oman Education AI</h1>
            <p className="header-brand__subtitle">نظام التعليم الذكي</p>
          </div>
        )}

        {showFlag && (
          <div className="header-brand__flag" title="سلطنة عمان">
            <OptimizedImage
              src={FlagOfOman}
              alt="علم سلطنة عمان"
              className="header-brand__flag-image"
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
