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
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-text-primary">وصول سريع</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProtectedComponent requiredPermissions={['lessons.view']}>
          <Card
            className="group cursor-pointer hover:shadow-lg transition-all duration-300"
            onClick={onNavigateToLessons}
            role="button"
            tabIndex={0}
            onKeyDown={onShortcut(ROUTES.LESSONS)}
          >
            <div className="flex flex-col gap-4 p-4">
              <div className="p-3 w-fit rounded-xl bg-primary-500/10 text-primary-500 group-hover:bg-primary-500 group-hover:text-white transition-colors">
                <PlayCircle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-primary group-hover:text-primary-500 transition-colors">دروس تفاعلية</h3>
                <p className="text-sm text-text-secondary">شروحات فيديو وخرائط ذهنية</p>
              </div>
            </div>
          </Card>
        </ProtectedComponent>

        {canAccessCloudStorage && (
          <ProtectedComponent requiredPermissions={['storage.view']}>
            <Card
              className="group cursor-pointer hover:shadow-lg transition-all duration-300"
              onClick={onNavigateToStorage}
              role="button"
              tabIndex={0}
              onKeyDown={onShortcut(ROUTES.STORAGE)}
            >
              <div className="flex flex-col gap-4 p-4">
                <div className="p-3 w-fit rounded-xl bg-secondary-500/10 text-secondary-500 group-hover:bg-secondary-500 group-hover:text-white transition-colors">
                  <Cloud size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-primary group-hover:text-secondary-500 transition-colors">ملفاتي</h3>
                  <p className="text-sm text-text-secondary">إدارة الملفات والمشاريع</p>
                </div>
              </div>
            </Card>
          </ProtectedComponent>
        )}

        <Card className="opacity-75 border-dashed border-border-secondary">
          <div className="flex flex-col gap-4 p-4 grayscale">
            <div className="p-3 w-fit rounded-xl bg-bg-tertiary text-text-tertiary">
              <FileText size={24} />
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-text-secondary">المشاريع</h3>
                <p className="text-sm text-text-tertiary">مساعد ذكي للمشاريع</p>
              </div>
              <span className="px-2 py-1 text-xs font-medium bg-bg-tertiary text-text-tertiary rounded-full">قريباً</span>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}
