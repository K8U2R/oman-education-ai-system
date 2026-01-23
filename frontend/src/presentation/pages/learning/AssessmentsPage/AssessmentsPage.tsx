/**
 * Assessments Page - صفحة التقييمات
 *
 * صفحة عرض جميع التقييمات المتاحة
 */

import React from 'react'
import { Plus, FileText } from 'lucide-react'
import { PageHeader, LoadingState, ErrorState, EmptyState } from '../../components'
import { useAssessmentsPageLogic } from './hooks/useAssessmentsPageLogic'
import { AssessmentCard } from './components/AssessmentCard'
import { AssessmentFilters } from './components/AssessmentFilters'
// StatCard removed


export const AssessmentsPage: React.FC = () => {
  const {
    assessments,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    typeFilter,
    setTypeFilter,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    totalPages,
    handleAssessmentClick,
    handleNewAssessment,
  } = useAssessmentsPageLogic()

  if (isLoading && assessments.length === 0) {
    return <LoadingState fullScreen message="جارٍ تحميل التقييمات..." />
  }

  if (error && assessments.length === 0) {
    return (
      <ErrorState
        title="فشل تحميل التقييمات"
        message={error}
        onRetry={() => window.location.reload()}
      />
    )
  }

  return (
    <div className="assessments-page">
      <PageHeader
        title="التقييمات"
        description="استكشف جميع التقييمات المتاحة"
        icon={<FileText />}
        actions={
          <button className="btn btn-primary" onClick={handleNewAssessment}>
            <Plus />
            تقييم جديد
          </button>
        }
      />

      {/* Stats - Placeholder if needed, logic needs to be moved to hook if active */}
      {/* 
      <div className="assessments-page__stats">
          <StatCard label="إجمالي التقييمات" value={0} />
          <StatCard label="المنشورة" value={0} />
          <StatCard label="إجمالي التسليمات" value={0} />
          <StatCard label="متوسط الدرجات" value="0%" />
      </div>
      */}

      <AssessmentFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {assessments.length === 0 ? (
        <EmptyState
          icon={<FileText />}
          title="لا توجد تقييمات"
          description={
            searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
              ? 'لا توجد تقييمات تطابق معايير البحث'
              : 'لم يتم إنشاء أي تقييمات بعد'
          }
        />
      ) : (
        <>
          <div className="assessments-page__list">
            {assessments.map(assessment => (
              <AssessmentCard
                key={assessment.id}
                assessment={assessment}
                onClick={handleAssessmentClick}
              />
            ))}
          </div>

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
