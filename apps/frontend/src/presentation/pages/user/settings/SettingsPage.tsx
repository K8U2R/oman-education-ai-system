import React from 'react'
import { Settings as SettingsIcon } from 'lucide-react'
import { usePageAuth, usePageLoading } from '@/application/shared/hooks'
import { LoadingState } from '@/presentation/pages/components'
import { PageHeader } from '../../components'
import { SettingsContent } from './components/SettingsContent'
import styles from './SettingsPage.module.scss'

/**
 * SettingsPage - صفحة الإعدادات (Sovereign Wrapper)
 * < 100 Lines (Rule 13)
 */
const SettingsPage: React.FC = () => {
  const { canAccess, loadingState } = usePageAuth({
    requireAuth: true,
    autoRedirect: true,
  })

  const { isLoading } = usePageLoading({
    isLoading: !canAccess,
    message: 'جاري تحميل الإعدادات...',
  })

  if (isLoading || !canAccess || loadingState.shouldShowLoading) {
    return <LoadingState fullScreen message={loadingState.loadingMessage} />
  }

  return (
    <div className={styles.container}>
      <PageHeader
        title="الإعدادات"
        description="إدارة حسابك، تفضيلاتك، والمظهر العام للنظام"
        icon={<SettingsIcon size={28} />}
      />
      <SettingsContent />
    </div>
  )
}

export default SettingsPage
