import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BookOpen,
  Cloud,
  FileText,
  GraduationCap,
  Users,
  Sparkles,
  ArrowRight,
  PlayCircle,
  LayoutDashboard,
} from 'lucide-react'

import { useAuth } from '@/application'
import { ROUTES } from '@/domain/constants/routes.constants'
import { Card, Button } from '../../components/common'
import { ProtectedComponent } from '../../components/auth'
import { PageHeader, LoadingState } from '../components'
import './DashboardPage.scss'

/**
 * DashboardPage - الصفحة الرئيسية (لوحة التحكم)
 *
 * تعرض تحية شخصية للمستخدم، وتوفر وصولاً سريعاً لأهم ميزات النظام:
 * - فهم الدروس
 * - التخزين السحابي
 * - وصول سريع وفئات المستخدمين المختلفة
 */
const DashboardPage: React.FC = () => {
  const navigate = useNavigate()
  const { user, isLoading, isAuthenticated } = useAuth()

  // إعادة توجيه المستخدم غير المصادق عليه إلى صفحة تسجيل الدخول
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(ROUTES.LOGIN, { replace: true })
    }
  }, [isLoading, isAuthenticated, navigate])

  // حالة التحميل
  if (isLoading) {
    return <LoadingState fullScreen message="جاري تحميل لوحة التحكم..." />
  }

  // في حالة عدم وجود مستخدم (مثلاً بعد إعادة التوجيه)
  if (!user) {
    return null
  }

  return (
    <div className="dashboard-page">
      {/* رأس الصفحة */}
      <PageHeader
        title="لوحة التحكم"
        description="مرحباً بك في نظام التعليم الذكي - مساعدك الشخصي للتعلم والفهم"
        icon={<LayoutDashboard size={28} />}
      />

      {/* الإجراءات الرئيسية */}
      <section className="dashboard-page__main-actions">
        <Card
          className="dashboard-page__main-card"
          onClick={() => navigate(ROUTES.LESSONS)}
          role="button"
          tabIndex={0}
          onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && navigate(ROUTES.LESSONS)}
        >
          <div className="dashboard-page__main-card-icon dashboard-page__main-card-icon--lessons">
            <BookOpen size={40} />
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

        <Card
          className="dashboard-page__main-card"
          onClick={() => navigate(ROUTES.STORAGE)}
          role="button"
          tabIndex={0}
          onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && navigate(ROUTES.STORAGE)}
        >
          <div className="dashboard-page__main-card-icon dashboard-page__main-card-icon--storage">
            <Cloud size={40} />
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
      </section>

      {/* قسم الوصول السريع */}
      <section className="dashboard-page__section">
        <h2 className="dashboard-page__section-title">وصول سريع</h2>
        <div className="dashboard-page__quick-access">
          <ProtectedComponent requiredPermissions={['lessons.view']}>
            <Card
              className="dashboard-page__quick-card"
              onClick={() => navigate(ROUTES.LESSONS)}
              role="button"
              tabIndex={0}
              onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && navigate(ROUTES.LESSONS)}
            >
              <PlayCircle size={32} className="dashboard-page__quick-icon" />
              <h3 className="dashboard-page__quick-title">دروس تفاعلية</h3>
              <p className="dashboard-page__quick-description">شروحات فيديو وخرائط ذهنية</p>
            </Card>
          </ProtectedComponent>

          <ProtectedComponent requiredPermissions={['storage.view']}>
            <Card
              className="dashboard-page__quick-card"
              onClick={() => navigate(ROUTES.STORAGE)}
              role="button"
              tabIndex={0}
              onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && navigate(ROUTES.STORAGE)}
            >
              <Cloud size={32} className="dashboard-page__quick-icon" />
              <h3 className="dashboard-page__quick-title">ملفاتي</h3>
              <p className="dashboard-page__quick-description">إدارة الملفات والمشاريع</p>
            </Card>
          </ProtectedComponent>

          <Card className="dashboard-page__quick-card dashboard-page__quick-card--coming-soon">
            <FileText size={32} className="dashboard-page__quick-icon" />
            <h3 className="dashboard-page__quick-title">المشاريع</h3>
            <p className="dashboard-page__quick-description">مساعد ذكي للمشاريع</p>
            <span className="dashboard-page__coming-soon">قريباً</span>
          </Card>
        </div>
      </section>

      {/* قسم فئات المستخدمين */}
      <section className="dashboard-page__section">
        <h2 className="dashboard-page__section-title">مصمم لجميع المستخدمين</h2>
        <div className="dashboard-page__user-types">
          <Card className="dashboard-page__user-type-card">
            <GraduationCap size={36} className="dashboard-page__user-type-icon" />
            <h3 className="dashboard-page__user-type-title">للطلاب</h3>
            <p className="dashboard-page__user-type-description">
              من الصف الأول إلى الثاني عشر - فهم أفضل للدروس
            </p>
          </Card>

          <Card className="dashboard-page__user-type-card">
            <Users size={36} className="dashboard-page__user-type-icon" />
            <h3 className="dashboard-page__user-type-title">للمعلمين</h3>
            <p className="dashboard-page__user-type-description">
              أدوات تعليمية متقدمة وموارد تفاعلية
            </p>
          </Card>

          <Card className="dashboard-page__user-type-card">
            <Sparkles size={36} className="dashboard-page__user-type-icon" />
            <h3 className="dashboard-page__user-type-title">للجامعات</h3>
            <p className="dashboard-page__user-type-description">
              حلول تعليمية متكاملة للتعليم العالي
            </p>
          </Card>
        </div>
      </section>
    </div>
  )
}

export default DashboardPage
