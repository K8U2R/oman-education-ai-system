import React from 'react'
import { Mail, Shield as ShieldIcon, User as UserIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/presentation/components/common'

import styles from './AccountInfo.module.scss'

interface AccountInfoProps {
  email: string
  role: string
  isActive: boolean
  isVerified: boolean
}

/**
 * AccountInfo - المكون المسؤول عن عرض معلومات الحساب التقنية و
 */
export const AccountInfo: React.FC<AccountInfoProps> = ({ email, role, isActive, isVerified }) => {
  const { t } = useTranslation()

  const getRoleLabel = (role: string) => {
    // Assuming backend passes raw role strings like 'admin', 'student'
    // We map them to translations if possible, or fallback to raw
    // Ideally add role keys to translation file, but using raw for now combined with existing common keys if any?
    // Actually, Phase 2 keys didn't strictly include all roles, but let's try to be generic or use English fallback if key missing
    // For now, let's keep it simple or use a map if keys existed. 
    // Wait, common.json keys I added didn't have specific roles map. 
    // I'll stick to a simple mapping here but wrapping in t if I had keys.
    // Given the constraints, I will leave the roles as mapped in the component but try to translate them if keys exist, 
    // otherwise just use the map. The map currently returns Arabic.
    // Ideally: t(`roles.${role}`)

    const roles: Record<string, string> = {
      admin: 'مدير',
      developer: 'مطور',
      teacher: 'معلم',
      student: 'طالب',
      parent: 'ولي أمر',
      moderator: 'مشرف',
    }
    return roles[role] || role
  }

  return (
    <Card className={styles.card}>
      <h3 className={styles.title}>{t('profile.account_info')}</h3>
      <div className={styles.grid}>
        <div className={styles.item}>
          <div className={styles.icon}>
            <Mail className="w-5 h-5" />
          </div>
          <div className={styles.content}>
            <label className={styles.label}>{t('profile.email')}</label>
            <p className={styles.value}>{email}</p>
          </div>
        </div>

        <div className={styles.item}>
          <div className={styles.icon}>
            <ShieldIcon className="w-5 h-5" />
          </div>
          <div className={styles.content}>
            <label className={styles.label}>{t('profile.role')}</label>
            <p className={styles.value}>{getRoleLabel(role)}</p>
          </div>
        </div>

        <div className={styles.item}>
          <div className={styles.icon}>
            <UserIcon className="w-5 h-5" />
          </div>
          <div className={styles.content}>
            <label className={styles.label}>{t('profile.status')}</label>
            <p className={styles.value}>
              <span
                className={`${styles.statusBadge} ${isActive ? styles.statusActive : styles.statusInactive}`}
              >
                {isActive ? t('profile.active') : t('profile.inactive')}
              </span>
              <span> • </span>
              <span
                className={`${styles.statusBadge} ${isVerified ? styles.statusActive : styles.statusInactive}`}
              >
                {isVerified ? t('profile.verified') : t('profile.not_verified')}
              </span>
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
