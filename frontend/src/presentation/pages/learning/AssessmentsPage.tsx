/**
 * Assessments Page - صفحة التقييمات
 *
 * صفحة عرض جميع التقييمات المتاحة
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Plus, Search, Filter } from 'lucide-react'
import { useAssessments } from '@/application'
import { ROUTES } from '@/domain/constants/routes.constants'
import { PageHeader, LoadingState, ErrorState, EmptyState } from '../components'
import type {
  AssessmentType,
  AssessmentStatus,
} from '@/application/features/learning/services/assessment.service'
import './AssessmentsPage.scss'

const AssessmentsPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<AssessmentType | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<AssessmentStatus | 'all'>('all')

  const { assessments, stats, isLoading, error, loadAssessments, page, totalPages, setPage } =
    useAssessments({
      type: typeFilter !== 'all' ? typeFilter : undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined,
    })

  const filteredAssessments = assessments.filter(assessment => {
    if (searchQuery) {
      return (
        assessment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        assessment.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return true
  })

  const getTypeLabel = (type: AssessmentType): string => {
    const labels: Record<AssessmentType, string> = {
      quiz: 'اختبار',
      assignment: 'واجب',
      exam: 'امتحان',
      project: 'مشروع',
    }
    return labels[type]
  }

  const getStatusLabel = (status: AssessmentStatus): string => {
    const labels: Record<AssessmentStatus, string> = {
      draft: 'مسودة',
      published: 'منشور',
      archived: 'مؤرشف',
    }
    return labels[status]
  }

  const handleAssessmentClick = (assessmentId: string) => {
    navigate(ROUTES.ASSESSMENT_DETAIL(assessmentId))
  }

  if (isLoading && assessments.length === 0) {
    return <LoadingState fullScreen message="جارٍ تحميل التقييمات..." />
  }

  if (error && assessments.length === 0) {
    return <ErrorState title="فشل تحميل التقييمات" message={error} onRetry={loadAssessments} />
  }

  return (
    <div className="assessments-page">
      <PageHeader
        title="التقييمات"
        description="استكشف جميع التقييمات المتاحة"
        icon={<FileText />}
        actions={
          <button className="btn btn-primary" onClick={() => navigate(ROUTES.ASSESSMENT_NEW)}>
            <Plus />
            تقييم جديد
          </button>
        }
      />

      {/* Stats */}
      {stats && (
        <div className="assessments-page__stats">
          <div className="stat-card">
            <div className="stat-card__value">{stats.total_assessments}</div>
            <div className="stat-card__label">إجمالي التقييمات</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__value">{stats.published_assessments}</div>
            <div className="stat-card__label">منشورة</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__value">{stats.total_submissions}</div>
            <div className="stat-card__label">إجمالي التقديمات</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__value">{stats.average_score.toFixed(1)}%</div>
            <div className="stat-card__label">متوسط الدرجات</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="assessments-page__filters">
        <div className="search-box">
          <Search />
          <input
            type="text"
            placeholder="ابحث عن تقييم..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <Filter />
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value as AssessmentType | 'all')}
          >
            <option value="all">جميع الأنواع</option>
            <option value="quiz">اختبار</option>
            <option value="assignment">واجب</option>
            <option value="exam">امتحان</option>
            <option value="project">مشروع</option>
          </select>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as AssessmentStatus | 'all')}
          >
            <option value="all">جميع الحالات</option>
            <option value="published">منشور</option>
            <option value="draft">مسودة</option>
            <option value="archived">مؤرشف</option>
          </select>
        </div>
      </div>

      {/* Assessments List */}
      {filteredAssessments.length === 0 ? (
        <EmptyState
          icon={<FileText />}
          title="لا توجد تقييمات"
          description={
            searchQuery || typeFilter !== 'all' || statusFilter !== 'all'
              ? 'لا توجد تقييمات تطابق معايير البحث'
              : 'لم يتم إنشاء أي تقييمات بعد'
          }
        />
      ) : (
        <>
          <div className="assessments-page__list">
            {filteredAssessments.map(assessment => (
              <div
                key={assessment.id}
                className="assessment-card"
                onClick={() => handleAssessmentClick(assessment.id)}
              >
                <div className="assessment-card__header">
                  <h3 className="assessment-card__title">{assessment.title}</h3>
                  <div className="assessment-card__badges">
                    <span className={`badge badge--${assessment.type}`}>
                      {getTypeLabel(assessment.type)}
                    </span>
                    <span className={`badge badge--${assessment.status}`}>
                      {getStatusLabel(assessment.status)}
                    </span>
                  </div>
                </div>
                {assessment.description && (
                  <p className="assessment-card__description">{assessment.description}</p>
                )}
                <div className="assessment-card__footer">
                  <div className="assessment-card__meta">
                    <span>{assessment.total_points} نقطة</span>
                    {assessment.time_limit && <span>{assessment.time_limit} دقيقة</span>}
                    {assessment.due_date && (
                      <span>
                        الموعد النهائي: {new Date(assessment.due_date).toLocaleDateString('ar-SA')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="assessments-page__pagination">
              <button
                className="btn btn-secondary"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                السابق
              </button>
              <span className="pagination-info">
                صفحة {page} من {totalPages}
              </span>
              <button
                className="btn btn-secondary"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                التالي
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default AssessmentsPage
