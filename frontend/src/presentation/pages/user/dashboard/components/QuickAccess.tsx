import React from 'react'
import { PlayCircle, Cloud, FileText } from 'lucide-react'
import { Card } from '@/presentation/components/common'
import { ProtectedComponent } from '@/presentation/components/auth'
import { ROUTES } from '@/domain/constants/routes.constants'

interface QuickAccessProps {
  canAccessCloudStorage: boolean
  onNavigateToLessons: () => void
  onNavigateToStorage: () => void
  onShortcut: (route: string) => (e: React.KeyboardEvent) => void
}

/**
 * QuickAccess - قسم الوصول السريع للميزات في لوحة التحكم
 */
export const QuickAccess: React.FC<QuickAccessProps> = ({
  canAccessCloudStorage,
  onNavigateToLessons,
  onNavigateToStorage,
  onShortcut,
}) => {
  return (
    <section className="dashboard-page__section">
      <h2 className="dashboard-page__section-title">وصول سريع</h2>
      <div className="dashboard-page__quick-access">
        <ProtectedComponent requiredPermissions={['lessons.view']}>
          <Card
            className="dashboard-page__quick-card"
            onClick={onNavigateToLessons}
            role="button"
            tabIndex={0}
            onKeyDown={onShortcut(ROUTES.LESSONS)}
          >
            <PlayCircle className="dashboard-page__quick-icon" />
            <h3 className="dashboard-page__quick-title">دروس تفاعلية</h3>
            <p className="dashboard-page__quick-description">شروحات فيديو وخرائط ذهنية</p>
          </Card>
        </ProtectedComponent>

        {canAccessCloudStorage && (
          <ProtectedComponent requiredPermissions={['storage.view']}>
            <Card
              className="dashboard-page__quick-card"
              onClick={onNavigateToStorage}
              role="button"
              tabIndex={0}
              onKeyDown={onShortcut(ROUTES.STORAGE)}
            >
              <Cloud className="dashboard-page__quick-icon" />
              <h3 className="dashboard-page__quick-title">ملفاتي</h3>
              <p className="dashboard-page__quick-description">إدارة الملفات والمشاريع</p>
            </Card>
          </ProtectedComponent>
        )}

        <Card className="dashboard-page__quick-card dashboard-page__quick-card--coming-soon">
          <FileText className="dashboard-page__quick-icon" />
          <h3 className="dashboard-page__quick-title">المشاريع</h3>
          <p className="dashboard-page__quick-description">مساعد ذكي للمشاريع</p>
          <span className="dashboard-page__coming-soon">قريباً</span>
        </Card>
      </div>
    </section>
  )
}
