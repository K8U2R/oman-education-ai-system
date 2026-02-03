/**
 * Project Detail Page - صفحة تفاصيل المشروع
 *
 * صفحة عرض تفاصيل مشروع تعليمي
 */

import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  FolderKanban,
  Edit,
  Trash2,
  ArrowLeft,
  CheckCircle2,
  Clock,
  FileText,
  Target,
} from 'lucide-react'
import { useProject } from '@/features/project-management-dashboard'
import { projectService } from '@/features/project-management-dashboard'
import { useConfirmDialog } from '@/application/shared/hooks'
import { loggingService } from '@/infrastructure/services'
import { Card, Button, ConfirmDialog } from '../../components/common'
import { ProtectedButton } from '../../components/auth'
import { PageHeader, LoadingState, ErrorState } from '../components'
import { ROUTES } from '@/domain/constants'
import type { ProjectType, ProjectStatus } from '@/features/project-management-dashboard'


const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const navigate = useNavigate()
  const { project, progress, isLoading, error, loadProject, loadProgress } = useProject(
    projectId || null
  )
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (projectId) {
      loadProject()
      loadProgress()
    }
  }, [projectId, loadProject, loadProgress])

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
      in_progress: 'قيد التقدم',
      completed: 'مكتمل',
      archived: 'مؤرشف',
    }
    return labels[status]
  }

  const getStatusIcon = (status: ProjectStatus) => {
    switch (status) {
      case 'completed':
        return (
          <CheckCircle2 className="project-detail__status-icon project-detail__status-icon--completed" />
        )
      case 'in_progress':
        return (
          <Clock className="project-detail__status-icon project-detail__status-icon--in-progress" />
        )
      case 'archived':
        return (
          <FileText className="project-detail__status-icon project-detail__status-icon--archived" />
        )
      default:
        return (
          <FileText className="project-detail__status-icon project-detail__status-icon--draft" />
        )
    }
  }

  const deleteConfirm = useConfirmDialog()

  const handleDelete = () => {
    if (!projectId) return

    deleteConfirm.open({
      title: 'تأكيد الحذف',
      message: `هل أنت متأكد من حذف المشروع "${project?.title || projectId}"؟ لا يمكن التراجع عن هذا الإجراء.`,
      variant: 'danger',
      confirmText: 'حذف',
      cancelText: 'إلغاء',
      onConfirm: async () => {
        try {
          setIsDeleting(true)
          await projectService.deleteProject(projectId)
          navigate(ROUTES.PROJECTS)
          deleteConfirm.close()
        } catch (err) {
          loggingService.error('Failed to delete project', err as Error)
          // TODO: Replace with toast notification
          alert('فشل حذف المشروع')
        } finally {
          setIsDeleting(false)
        }
      },
    })
  }

  const handleEdit = () => {
    if (projectId) {
      navigate(ROUTES.PROJECT_FORM(projectId))
    }
  }

  if (isLoading) {
    return <LoadingState fullScreen message="جارٍ تحميل المشروع..." />
  }

  if (error || !project) {
    return (
      <ErrorState
        title="فشل تحميل المشروع"
        message={error || 'المشروع غير موجود'}
        onRetry={loadProject}
      />
    )
  }

  return (
    <div className="project-detail">
      <PageHeader
        title={project.title}
        description={project.description || 'تفاصيل المشروع التعليمي'}
        icon={<FolderKanban />}
        actions={
          <div className="project-detail__actions">
            <Button
              variant="secondary"
              onClick={() => navigate(ROUTES.PROJECTS)}
              leftIcon={<ArrowLeft />}
            >
              العودة
            </Button>
            <ProtectedButton
              variant="primary"
              onClick={handleEdit}
              leftIcon={<Edit />}
              requiredPermissions={['lessons.update']}
            >
              تعديل
            </ProtectedButton>
            <ProtectedButton
              variant="danger"
              onClick={handleDelete}
              leftIcon={<Trash2 />}
              isLoading={isDeleting}
              requiredPermissions={['lessons.delete']}
            >
              حذف
            </ProtectedButton>
          </div>
        }
      />

      <div className="project-detail__content">
        {/* Project Info */}
        <Card className="project-detail__info-card">
          <div className="project-detail__header">
            <div className="project-detail__title-section">
              <h2 className="project-detail__title">{project.title}</h2>
              <div className="project-detail__meta">
                <span className="project-detail__type">{getTypeLabel(project.type)}</span>
                <span className="project-detail__divider">•</span>
                <span className="project-detail__status">
                  {getStatusIcon(project.status)}
                  {getStatusLabel(project.status)}
                </span>
              </div>
            </div>
          </div>

          {project.description && (
            <div className="project-detail__description">
              <p>{project.description}</p>
            </div>
          )}

          <div className="project-detail__details">
            {project.subject && (
              <div className="project-detail__detail-item">
                <span className="project-detail__detail-label">المادة:</span>
                <span className="project-detail__detail-value">{project.subject}</span>
              </div>
            )}

            {project.grade_level && (
              <div className="project-detail__detail-item">
                <span className="project-detail__detail-label">المستوى:</span>
                <span className="project-detail__detail-value">{project.grade_level}</span>
              </div>
            )}

            {project.due_date && (
              <div className="project-detail__detail-item">
                <span className="project-detail__detail-label">تاريخ الاستحقاق:</span>
                <span className="project-detail__detail-value">
                  {new Date(project.due_date).toLocaleDateString('ar-SA')}
                </span>
              </div>
            )}

            <div className="project-detail__detail-item">
              <span className="project-detail__detail-label">تاريخ الإنشاء:</span>
              <span className="project-detail__detail-value">
                {new Date(project.created_at).toLocaleDateString('ar-SA')}
              </span>
            </div>

            <div className="project-detail__detail-item">
              <span className="project-detail__detail-label">آخر تحديث:</span>
              <span className="project-detail__detail-value">
                {new Date(project.updated_at).toLocaleDateString('ar-SA')}
              </span>
            </div>
          </div>
        </Card>

        {/* Progress */}
        {progress && (
          <Card className="project-detail__progress-card">
            <div className="project-detail__progress-header">
              <Target className="project-detail__progress-icon" />
              <h3 className="project-detail__progress-title">تقدم المشروع</h3>
            </div>

            <div className="project-detail__progress-stats">
              <div className="project-detail__progress-stat">
                <span className="project-detail__progress-stat-label">المهام المكتملة</span>
                <span className="project-detail__progress-stat-value">
                  {progress.completed_tasks} / {progress.total_tasks}
                </span>
              </div>

              <div className="project-detail__progress-bar">
                <div
                  className="project-detail__progress-bar-fill"
                  style={{ width: `${progress.progress_percentage}%` }}
                />
              </div>

              <div className="project-detail__progress-percentage">
                {progress.progress_percentage}%
              </div>
            </div>

            {progress.milestones && progress.milestones.length > 0 && (
              <div className="project-detail__milestones">
                <h4 className="project-detail__milestones-title">المعالم</h4>
                <ul className="project-detail__milestones-list">
                  {progress.milestones.map(milestone => (
                    <li
                      key={milestone.id}
                      className={`project-detail__milestone ${milestone.completed ? 'project-detail__milestone--completed' : ''
                        }`}
                    >
                      <CheckCircle2
                        className={`project-detail__milestone-icon ${milestone.completed ? 'project-detail__milestone-icon--completed' : ''
                          }`}
                      />
                      <span className="project-detail__milestone-title">{milestone.title}</span>
                      {milestone.completed_at && (
                        <span className="project-detail__milestone-date">
                          {new Date(milestone.completed_at).toLocaleDateString('ar-SA')}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        )}

        {/* Project Progress (if available) */}
        {project.progress !== undefined && (
          <Card className="project-detail__progress-simple-card">
            <div className="project-detail__progress-simple">
              <span className="project-detail__progress-simple-label">التقدم الإجمالي</span>
              <div className="project-detail__progress-simple-bar">
                <div
                  className="project-detail__progress-simple-fill"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <span className="project-detail__progress-simple-value">{project.progress}%</span>
            </div>
          </Card>
        )}
      </div>

      {/* Delete Confirm Dialog */}
      {deleteConfirm.options && (
        <ConfirmDialog
          isOpen={deleteConfirm.isOpen}
          onClose={deleteConfirm.close}
          onConfirm={deleteConfirm.options.onConfirm}
          title={deleteConfirm.options.title}
          message={deleteConfirm.options.message}
          variant={deleteConfirm.options.variant || 'danger'}
          confirmText={deleteConfirm.options.confirmText}
          cancelText={deleteConfirm.options.cancelText}
          isLoading={isDeleting}
        />
      )}
    </div>
  )
}

export default ProjectDetailPage
