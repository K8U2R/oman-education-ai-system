/**
 * Breadcrumbs Component
 * 
 * مكون مسار التنقل الذي يعرض موقع المستخدم الحالي
 * Sovereign Architecture: Self-contained styling via SCSS Modules
 */

import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronLeft, Home } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useBreadcrumbs } from '@/presentation/routing/hooks/useBreadcrumbs'
import { ROUTES } from '@/domain/constants/routes.constants'
import styles from './Breadcrumbs.module.scss'

export const Breadcrumbs: React.FC = () => {
    const { t } = useTranslation('common')
    const location = useLocation()
    const breadcrumbs = useBreadcrumbs()

    // Don't show breadcrumbs on home page
    if (location.pathname === ROUTES.HOME) {
        return null
    }

    // Don't show if only one breadcrumb (usually Home)
    if (breadcrumbs.length <= 1) {
        return null
    }

    return (
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
            <ol className={styles.list}>
                {breadcrumbs.map((item, index) => {
                    const isLast = index === breadcrumbs.length - 1
                    const Icon = item.icon || (index === 0 ? Home : undefined)

                    // Translate the label if it's a key (contains 'breadcrumbs.') or fallback
                    const label = item.label.startsWith('breadcrumbs.')
                        ? t(item.label)
                        : item.label

                    return (
                        <li key={item.path} className={styles.item}>
                            {isLast ? (
                                <span className={styles.current} aria-current="page">
                                    {Icon && <Icon className={styles.icon} />}
                                    <span className={styles.label}>{label}</span>
                                </span>
                            ) : (
                                <>
                                    <Link to={item.path} className={styles.link}>
                                        {Icon && <Icon className={styles.icon} />}
                                        <span className={styles.label}>{label}</span>
                                    </Link>
                                    <ChevronLeft className={styles.separator} />
                                </>
                            )}
                        </li>
                    )
                })}
            </ol>
        </nav>
    )
}
