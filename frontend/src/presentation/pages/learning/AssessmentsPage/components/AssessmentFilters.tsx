import React from 'react'
import { Search, Filter } from 'lucide-react'
import {
  AssessmentType,
  AssessmentStatus,
} from '@/presentation/features/interactive-learning-canvas'

interface AssessmentFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  typeFilter: AssessmentType | 'all'
  onTypeFilterChange: (value: AssessmentType | 'all') => void
  statusFilter: AssessmentStatus | 'all'
  onStatusFilterChange: (value: AssessmentStatus | 'all') => void
}

export const AssessmentFilters: React.FC<AssessmentFiltersProps> = ({
  searchTerm,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  statusFilter,
  onStatusFilterChange,
}) => {
  return (
    <div className="assessments-page__filters">
      <div className="search-box">
        <Search />
        <input
          type="text"
          placeholder="ابحث عن تقييم..."
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
        />
      </div>
      <div className="filter-group">
        <Filter />
        <select
          value={typeFilter}
          onChange={e => onTypeFilterChange(e.target.value as AssessmentType | 'all')}
        >
          <option value="all">جميع الأنواع</option>
          <option value="quiz">اختبار</option>
          <option value="assignment">واجب</option>
          <option value="exam">امتحان</option>
          <option value="project">مشروع</option>
        </select>
        <select
          value={statusFilter}
          onChange={e => onStatusFilterChange(e.target.value as AssessmentStatus | 'all')}
        >
          <option value="all">جميع الحالات</option>
          <option value="published">منشور</option>
          <option value="draft">مسودة</option>
          <option value="archived">مؤرشف</option>
        </select>
      </div>
    </div>
  )
}
