import React from 'react'
import { GraduationCap, Users, Sparkles } from 'lucide-react'
import { Card } from '@/presentation/components/common'

/**
 * UserTypes - قسم المعلومات المخصصة لمختلف فئات المستخدمين
 */
export const UserTypes: React.FC = () => {
  return (
    <section className="dashboard-page__section">
      <h2 className="dashboard-page__section-title">مصمم لجميع المستخدمين</h2>
      <div className="dashboard-page__user-types">
        <Card className="dashboard-page__user-type-card">
          <GraduationCap className="dashboard-page__user-type-icon" />
          <h3 className="dashboard-page__user-type-title">للطلاب</h3>
          <p className="dashboard-page__user-type-description">
            من الصف الأول إلى الثاني عشر - فهم أفضل للدروس
          </p>
        </Card>

        <Card className="dashboard-page__user-type-card">
          <Users className="dashboard-page__user-type-icon" />
          <h3 className="dashboard-page__user-type-title">للمعلمين</h3>
          <p className="dashboard-page__user-type-description">
            أدوات تعليمية متقدمة وموارد تفاعلية
          </p>
        </Card>

        <Card className="dashboard-page__user-type-card">
          <Sparkles className="dashboard-page__user-type-icon" />
          <h3 className="dashboard-page__user-type-title">للجامعات</h3>
          <p className="dashboard-page__user-type-description">
            حلول تعليمية متكاملة للتعليم العالي
          </p>
        </Card>
      </div>
    </section>
  )
}
