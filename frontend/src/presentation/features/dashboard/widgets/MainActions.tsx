import React from 'react'
import { BookOpen, Cloud } from 'lucide-react'
import { ROUTES } from '@/domain/constants/routes.constants'
import { QuickActionCard } from '@/presentation/components/dashboard'

interface MainActionsProps {
  canAccessCloudStorage: boolean
  onNavigateToLessons: () => void
  onNavigateToStorage: () => void
  onShortcut: (route: string) => (e: React.KeyboardEvent) => void
}

/**
 * MainActions - المكون المسؤول عن عرض البطاقات الرئيسية في لوحة التحكم
 * التحديث: تم إعادة الهيكلة باستخدام Atomic Widgets.
 */
export const MainActions: React.FC<MainActionsProps> = ({
  canAccessCloudStorage,
  onNavigateToLessons,
  onNavigateToStorage,
  onShortcut,
}) => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div onKeyDown={onShortcut(ROUTES.LESSONS)}>
        <QuickActionCard
          title="فهم الدروس"
          description="استكشف الدروس من جميع المراحل الدراسية وافهمها بمساعدة الذكاء الاصطناعي."
          icon={<BookOpen />}
          onClick={onNavigateToLessons}
        />
      </div>

      {canAccessCloudStorage && (
        <div onKeyDown={onShortcut(ROUTES.STORAGE)}>
          <QuickActionCard
            title="التخزين السحابي"
            description="اربط حسابك بخدمات التخزين السحابي وأدر ملفاتك ومشاريعك بسهولة."
            icon={<Cloud />}
            onClick={onNavigateToStorage}
          />
        </div>
      )}
    </section>
  )
}
