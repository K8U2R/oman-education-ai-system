/**
 * Projects Page - صفحة المشاريع
 *
 * صفحة عرض جميع المشاريع التعليمية
 */

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FolderKanban, Plus, Search, Filter } from 'lucide-react'
import { useProjects } from '@/application'
import { PageHeader, LoadingState, ErrorState, EmptyState } from '../components'
import type { ProjectType, ProjectStatus } from '@/features/project-management-dashboard'


const ProjectsPage: React.FC = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<ProjectType | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all')

  const { projects, isLoading, error, loadProjects, page, totalPages, setPage } = useProjects({
    type: typeFilter !== 'all' ? typeFilter : undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  })

  const filteredProjects = projects.filter(project => {
    if (searchQuery) {
      return (
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    return true
  })

  const getTypeLabel = (type: ProjectType): string => {
    const labels: Record<ProjectType, string> = {
      educational: 'تعليمي',
      research: 'بحثي',
      assignment: 'واجب',
      presentation: 'عرض تقديمي',
    }
    return labels[type]
  }

  const getStatusLabel = (status: ProjectStatus): string => {
    const labels: Record<ProjectStatus, string> = {
      draft: 'مسودة',
      in_progress: 'قيد التنفيذ',
      completed: 'مكتمل',
      archived: 'مؤرشف',
    }
    return labels[status]
  }

  const handleProjectClick = (projectId: string) => {
    navigate(`/projects/${projectId}`)
  }

  if (isLoading && projects.length === 0) {
    return <LoadingState fullScreen message="جارٍ تحميل المشاريع..." />
  }

  if (error && projects.length === 0) {
    return <ErrorState title="فشل تحميل المشاريع" message={error} onRetry={loadProjects} />
  }

  return (
    <div className="projects-page">
      <PageHeader
        title="المشاريع التعليمية"
        description="استكشف جميع المشاريع التعليمية المتاحة"
        icon={<FolderKanban />}
        actions={
          <button className="btn btn-primary" onClick={() => navigate('/projects/new')}>
            <Plus />
            مشروع جديد
          </button>
        }
      />

      {/* Filters */}
      <div className="projects-page__filters">
        <div className="search-box">
          <Search />
          <input
            type="text"
            placeholder="ابحث عن مشروع..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <Filter />
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value as ProjectType | 'all')}
          >
            <option value="all">جميع الأنواع</option>
            <option value="educational">تعليمي</option>
            <option value="research">بحثي</option>
            <option value="assignment">واجب</option>
            <option value="presentation">عرض تقديمي</option>
          </select>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as ProjectStatus | 'all')}
          >
            <option value="all">جميع الحالات</option>
            <option value="draft">مسودة</option>
            <option value="in_progress">قيد التنفيذ</option>
            <option value="completed">مكتمل</option>
            <option value="archived">مؤرشف</option>
          </select>
        </div>
      </div>

      {/* Projects List */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={<FolderKanban />}
          title="لا توجد مشاريع"
          description={
            searchQuery || typeFilter !== 'all' || statusFilter !== 'all'
              ? 'لا توجد مشاريع تطابق معايير البحث'
              : 'لم يتم إنشاء أي مشاريع بعد'
          }
        />
      ) : (
        <>
          <div className="projects-page__list">
            {filteredProjects.map(project => (
              <div
                key={project.id}
                className="project-card"
                onClick={() => handleProjectClick(project.id)}
              >
                <div className="project-card__header">
                  <h3 className="project-card__title">{project.title}</h3>
                  <div className="project-card__badges">
                    <span className={`badge badge--${project.type}`}>
                      {getTypeLabel(project.type)}
                    </span>
                    <span className={`badge badge--${project.status}`}>
                      {getStatusLabel(project.status)}
                    </span>
                  </div>
                </div>
                {project.description && (
                  <p className="project-card__description">{project.description}</p>
                )}
                <div className="project-card__footer">
                  <div className="project-card__meta">
                    {project.subject && <span>{project.subject}</span>}
                    {project.grade_level && <span>{project.grade_level}</span>}
                    {project.progress !== undefined && <span>{project.progress}% مكتمل</span>}
                    {project.due_date && (
                      <span>
                        الموعد النهائي: {new Date(project.due_date).toLocaleDateString('ar-SA')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="projects-page__pagination">
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

export default ProjectsPage
