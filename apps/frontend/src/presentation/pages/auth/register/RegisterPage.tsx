import React from 'react'
import { UserPlus } from 'lucide-react'
import { Card } from '../../../components/common'
import { RegisterForm } from '../../../components/auth/RegisterForm'
import { useTranslation } from 'react-i18next'

import styles from '../AuthLayout.module.scss'

const RegisterPage: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className={styles.title}>{t('auth.register_title')}</h1>
          <p className={styles.subtitle}>{t('auth.register_subtitle')}</p>
        </div>

        <div className={styles.formWrapper}>
          <RegisterForm />
        </div>
      </Card>
    </div>
  )
}

export default RegisterPage
