/**
 * BottomNav Component - القائمة السفلية
 * 
 * ✅ Sovereign Layout Component
 * ✅ Conditionally rendered (Home only)
 * ✅ Fluid Styling
 */

import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Home, BookOpen, User, Settings } from 'lucide-react'
import { ROUTES } from '@/domain/constants/routes.constants'
import { encryptRoute } from '@/domain/utils/encryption.util'
import styles from './BottomNav.module.scss'

export const BottomNav: React.FC = () => {
    const location = useLocation()

    // Condition: Only show on Home page (or add other routes as needed)
    // currently restricted to ROUTES.HOME as per requirements
    if (location.pathname !== ROUTES.HOME && location.pathname !== '/') {
        return null
    }

    const navItems = [
        { icon: Home, label: 'الرئيسية', path: encryptRoute(ROUTES.HOME) },
        { icon: BookOpen, label: 'دروسي', path: encryptRoute('/lessons') }, // Assuming this route
        { icon: User, label: 'حسابي', path: encryptRoute('/profile') },
        { icon: Settings, label: 'الإعدادات', path: encryptRoute('/settings') },
    ]

    return (
        <nav className={styles.nav}>
            {navItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                        `${styles.item} ${isActive ? styles.active : ''}`
                    }
                >
                    <item.icon className={styles.icon} />
                    <span className={styles.label}>{item.label}</span>
                </NavLink>
            ))}
        </nav>
    )
}
