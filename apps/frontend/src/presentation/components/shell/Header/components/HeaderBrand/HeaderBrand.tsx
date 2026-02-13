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

import styles from './HeaderBrand.module.scss'

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
      <Link to={ROUTES.HOME} className={cn(styles.brand, className)}>
        <div className={styles.logoWrapper}>
          <OptimizedImage
            src={Logo}
            alt="Oman Education AI Logo"
            className={styles.logo}
            loading="eager"
            width={40}
            height={40}
            objectFit="contain"
          />
        </div>

        {showText && (
          <div className={styles.textContainer}>
            <h1 className={styles.title}>Oman Education AI</h1>
            <p className={styles.subtitle}>نظام التعليم الذكي</p>
          </div>
        )}

        {showFlag && (
          <div className={styles.flagWrapper} title="سلطنة عمان">
            <OptimizedImage
              src={FlagOfOman}
              alt="علم سلطنة عمان"
              className={styles.flag}
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
