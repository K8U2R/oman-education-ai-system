import React from 'react'
import { BookOpen, Cloud, ArrowRight } from 'lucide-react'
import { Card, Button } from '@/presentation/components/common'
import { ROUTES } from '@/domain/constants/routes.constants'

interface MainActionsProps {
  canAccessCloudStorage: boolean
  onNavigateToLessons: () => void
  onNavigateToStorage: () => void
  onShortcut: (route: string) => (e: React.KeyboardEvent) => void
}

/**
 * MainActions - المكون المسؤول عن عرض البطاقات الرئيسية في لوحة التحكم
 */
export const MainActions: React.FC<MainActionsProps> = ({
  canAccessCloudStorage,
  onNavigateToLessons,
  onNavigateToStorage,
  onShortcut,
}) => {
  return (
    <section className="dashboard-page__main-actions">
      <Card
        className="dashboard-page__main-card"
        onClick={onNavigateToLessons}
        role="button"
        tabIndex={0}
        onKeyDown={onShortcut(ROUTES.LESSONS)}
      >
        <div className="dashboard-page__main-card-icon dashboard-page__main-card-icon--lessons">
          <BookOpen />
        </div>
        <h2 className="dashboard-page__main-card-title">فهم الدروس</h2>
        <p className="dashboard-page__main-card-description">
          استكشف الدروس من جميع المراحل الدراسية وافهمها بمساعدة الذكاء الاصطناعي
        </p>
        <Button variant="primary" size="md" className="dashboard-page__main-card-button">
          ابدأ التعلم
          <ArrowRight size={20} className="mr-2" />
        </Button>
      </Card>

      {canAccessCloudStorage && (
        <Card
          className="dashboard-page__main-card"
          onClick={onNavigateToStorage}
          role="button"
          tabIndex={0}
          onKeyDown={onShortcut(ROUTES.STORAGE)}
        >
          <div className="dashboard-page__main-card-icon dashboard-page__main-card-icon--storage">
            <Cloud />
          </div>
          <h2 className="dashboard-page__main-card-title">التخزين السحابي</h2>
          <p className="dashboard-page__main-card-description">
            اربط حسابك بخدمات التخزين السحابي وأدر ملفاتك ومشاريعك بسهولة
          </p>
          <Button variant="primary" size="md" className="dashboard-page__main-card-button">
            فتح التخزين
            <ArrowRight size={20} className="mr-2" />
          </Button>
        </Card>
      )}
    </section>
  )
}
