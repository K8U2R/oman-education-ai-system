/**
 * Project Form Page - صفحة نموذج المشروع
 *
 * صفحة لإنشاء أو تعديل مشروع تعليمي
 */

import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Save, X, FolderKanban } from 'lucide-react'
import { Card, Button, Input } from '../../components/common'
import { projectService } from '@/application/features/projects/services/project.service'
import { PageHeader, LoadingState } from '../components'
import { ROUTES } from '@/domain/constants'
import type {
  CreateProjectRequest,
  UpdateProjectRequest,
  ProjectType,
  ProjectStatus,
} from '@/application/features/projects/services/project.service'
import './ProjectFormPage.scss'

interface ProjectFormData {
  title: string
  description: string
  type: ProjectType
  status: ProjectStatus
  subject: string
  grade_level: string
  due_date: string
  requirements: string[]
}

const ProjectFormPage: React.FC = () => {
  const navigate = useNavigate()
  const { projectId } = useParams<{ projectId: string }>()
  const isEdit = Boolean(projectId)

  const [loading, setLoading] = useState(false)
  const [loadingProject, setLoadingProject] = useState(false)
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    type: 'educational',
    status: 'draft',
    subject: '',
    grade_level: '',
    due_date: '',
    requirements: [],
  })
  const [requirementsInput, setRequirementsInput] = useState('')

  const loadProject = useCallback(
    async (id: string) => {
      try {
        setLoadingProject(true)
        const project = await projectService.getProject(id)
        const dueDate =
          project.due_date != null ? new Date(project.due_date).toISOString().split('T')[0] : ''
        setFormData({
          title: project.title || '',
          description: project.description || '',
          type: project.type,
          status: project.status,
          subject: project.subject || '',
          grade_level: project.grade_level || '',
          due_date: dueDate as string,
          requirements: [],
        })
        setRequirementsInput('')
      } catch (error) {
        console.error('Failed to load project:', error)
        alert('فشل تحميل المشروع')
        navigate(ROUTES.PROJECTS)
      } finally {
        setLoadingProject(false)
      }
    },
    [navigate]
  )

  useEffect(() => {
    if (isEdit && projectId) {
      loadProject(projectId)
    }
  }, [isEdit, projectId, loadProject])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const requirements = requirementsInput
        .split(',')
        .map(req => req.trim())
        .filter(req => req.length > 0)

      if (isEdit && projectId) {
        const updateRequest: UpdateProjectRequest = {
          title: formData.title,
          description: formData.description || undefined,
          type: formData.type,
          status: formData.status,
          subject: formData.subject || undefined,
          grade_level: formData.grade_level || undefined,
          due_date: formData.due_date || undefined,
          requirements: requirements.length > 0 ? requirements : undefined,
        }
        await projectService.updateProject(projectId, updateRequest)
        navigate(ROUTES.PROJECT_DETAIL(projectId))
      } else {
        const createRequest: CreateProjectRequest = {
          title: formData.title,
          description: formData.description || undefined,
          type: formData.type,
          subject: formData.subject || undefined,
          grade_level: formData.grade_level || undefined,
          due_date: formData.due_date || undefined,
          requirements: requirements.length > 0 ? requirements : undefined,
        }
        const project = await projectService.createProject(createRequest)
        navigate(ROUTES.PROJECT_DETAIL(project.id))
      }
    } catch (error) {
      console.error('Failed to save project:', error)
      alert('فشل حفظ المشروع')
    } finally {
      setLoading(false)
    }
  }

  if (loadingProject) {
    return <LoadingState fullScreen message="جاري تحميل المشروع..." />
  }

  return (
    <div className="project-form-page">
      <PageHeader
        title={isEdit ? 'تعديل المشروع' : 'إضافة مشروع جديد'}
        description={isEdit ? 'تعديل معلومات المشروع' : 'إنشاء مشروع تعليمي جديد'}
        icon={<FolderKanban />}
      />

      <Card className="project-form-page__form-card">
        <form onSubmit={handleSubmit} className="project-form-page__form">
          <div className="project-form-page__row">
            <div className="project-form-page__field">
              <label className="project-form-page__label">العنوان *</label>
              <Input
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="عنوان المشروع"
              />
            </div>

            <div className="project-form-page__field">
              <label className="project-form-page__label">النوع *</label>
              <select
                className="project-form-page__select"
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value as ProjectType })}
                required
              >
                <option value="educational">تعليمي</option>
                <option value="research">بحثي</option>
                <option value="assignment">واجب</option>
                <option value="presentation">عرض تقديمي</option>
              </select>
            </div>
          </div>

          {isEdit && (
            <div className="project-form-page__row">
              <div className="project-form-page__field">
                <label className="project-form-page__label">الحالة</label>
                <select
                  className="project-form-page__select"
                  value={formData.status}
                  onChange={e =>
                    setFormData({ ...formData, status: e.target.value as ProjectStatus })
                  }
                >
                  <option value="draft">مسودة</option>
                  <option value="in_progress">قيد التقدم</option>
                  <option value="completed">مكتمل</option>
                  <option value="archived">مؤرشف</option>
                </select>
              </div>
            </div>
          )}

          <div className="project-form-page__field">
            <label className="project-form-page__label">الوصف</label>
            <textarea
              className="project-form-page__textarea"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              rows={6}
              placeholder="وصف المشروع..."
            />
          </div>

          <div className="project-form-page__row">
            <div className="project-form-page__field">
              <label className="project-form-page__label">المادة</label>
              <Input
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                placeholder="اسم المادة"
              />
            </div>

            <div className="project-form-page__field">
              <label className="project-form-page__label">المستوى</label>
              <Input
                value={formData.grade_level}
                onChange={e => setFormData({ ...formData, grade_level: e.target.value })}
                placeholder="المستوى الدراسي"
              />
            </div>

            <div className="project-form-page__field">
              <label className="project-form-page__label">تاريخ الاستحقاق</label>
              <Input
                type="date"
                value={formData.due_date}
                onChange={e => setFormData({ ...formData, due_date: e.target.value })}
              />
            </div>
          </div>

          <div className="project-form-page__field">
            <label className="project-form-page__label">المتطلبات (مفصولة بفواصل)</label>
            <Input
              value={requirementsInput}
              onChange={e => setRequirementsInput(e.target.value)}
              placeholder="متطلب1, متطلب2, متطلب3"
            />
          </div>

          <div className="project-form-page__actions">
            <Button variant="secondary" onClick={() => navigate(ROUTES.PROJECTS)} leftIcon={<X />}>
              إلغاء
            </Button>
            <Button variant="primary" type="submit" isLoading={loading} leftIcon={<Save />}>
              حفظ
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default ProjectFormPage
