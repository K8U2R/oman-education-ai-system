import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Shield, Palette } from 'lucide-react'
import { Card } from '@/presentation/components/common'
import { ROUTES } from '@/domain/constants/routes.constants'
import ThemeSelector from './ThemeSelector/ThemeSelector'
import GeneralSettings from './GeneralSettings'
import LanguageSettings from './LanguageSettings'
import ChangePassword from './ChangePassword'
import { NotificationPreferences } from '@/presentation/components/layout/NotificationPreferences'
import styles from '../SettingsPage.module.scss'

export const SettingsContent: React.FC = () => {
    const navigate = useNavigate()
    const [isNotificationPrefsOpen, setIsNotificationPrefsOpen] = useState(false)

    return (
        <section className={styles.content}>
            <GeneralSettings />
            <ChangePassword />

            <Card className={styles.card}>
                <div className={styles.cardHeader}>
                    <Bell size={24} className={styles.cardIcon} />
                    <h3 className={styles.cardTitle}>الإشعارات</h3>
                </div>
                <div className={styles.cardContent}>
                    <button
                        className={styles.actionButton}
                        onClick={() => setIsNotificationPrefsOpen(true)}
                    >
                        إدارة تفضيلات الإشعارات
                    </button>
                </div>
            </Card>

            <Card className={styles.card}>
                <div className={styles.cardHeader}>
                    <Shield size={24} className={styles.cardIcon} />
                    <h3 className={styles.cardTitle}>الخصوصية</h3>
                </div>
                <div className={styles.cardContent}>
                    <button
                        className={styles.actionButton}
                        onClick={() => navigate(ROUTES.PRIVACY ?? '/privacy')}
                    >
                        عرض سياسة الخصوصية
                    </button>
                </div>
            </Card>

            <LanguageSettings />

            <Card className={styles.card}>
                <div className={styles.cardHeader}>
                    <Palette size={24} className={styles.cardIcon} />
                    <h3 className={styles.cardTitle}>المظهر</h3>
                </div>
                <div className={styles.cardContent}>
                    <ThemeSelector />
                </div>
            </Card>

            <NotificationPreferences
                isOpen={isNotificationPrefsOpen}
                onClose={() => setIsNotificationPrefsOpen(false)}
            />
        </section>
    )
}
