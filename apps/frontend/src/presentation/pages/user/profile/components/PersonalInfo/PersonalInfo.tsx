import React from 'react'
import { User as UserIcon, Calendar } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/presentation/components/common'

import styles from './PersonalInfo.module.scss'

interface PersonalInfoProps {
  firstName?: string
  lastName?: string
  username?: string
  formattedCreatedAt: string
}

/**
 * PersonalInfo - المكون المسؤول عن عرض المعلومات الشخصية للمستخدم
 */
export const PersonalInfo: React.FC<PersonalInfoProps> = ({
  firstName,
  lastName,
  username,
  formattedCreatedAt,
}) => {
  const { t } = useTranslation()

  return (
    <Card className={styles.card}>
      <h3 className={styles.title}>{t('profile.personal_info')}</h3>
      <div className={styles.grid}>
        {firstName && (
          <div className={styles.item}>
            <div className={styles.icon}>
              <UserIcon className="w-5 h-5" />
            </div>
            <div className={styles.content}>
              <label className={styles.label}>{t('auth.first_name_label')}</label>
              <p className={styles.value}>{firstName}</p>
            </div>
          </div>
        )}

        {lastName && (
          <div className={styles.item}>
            <div className={styles.icon}>
              <UserIcon className="w-5 h-5" />
            </div>
            <div className={styles.content}>
              <label className={styles.label}>{t('auth.last_name_label')}</label>
              <p className={styles.value}>{lastName}</p>
            </div>
          </div>
        )}

        {username && (
          <div className={styles.item}>
            <div className={styles.icon}>
              <UserIcon className="w-5 h-5" />
            </div>
            <div className={styles.content}>
              <label className={styles.label}>{t('auth.username_label')}</label>
              <p className={styles.value}>{username}</p>
            </div>
          </div>
        )}

        <div className={styles.item}>
          <div className={styles.icon}>
            <Calendar className="w-5 h-5" />
          </div>
          <div className={styles.content}>
            <label className={styles.label}>{t('profile.member_since')}</label>
            <p className={styles.value}>{formattedCreatedAt}</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
