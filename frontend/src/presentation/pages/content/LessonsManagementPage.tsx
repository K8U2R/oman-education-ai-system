/**
 * Lessons Management Page - صفحة إدارة الدروس
 *
 * صفحة لإدارة الدروس (إنشاء، تعديل، حذف)
 */

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Plus, Edit, Trash2, Eye, Search } from 'lucide-react'
import { Card, Button, Input, Modal } from '../../components/common'
import { DataTable, DataTableColumn } from '../../components/data'
import { ProtectedButton } from '../../components/auth'
import { apiClient } from '@/infrastructure/api'
import { API_ENDPOINTS } from '@/domain/constants'
import { PageHeader, LoadingState } from '../components'
import './LessonsManagementPage.scss'

interface Lesson {
  id: string
  title: string
  subject_id: string
  grade_level_id: string
  content?: string
  order: number
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced'
  tags?: string[]
  is_published: boolean
  created_at: string
  updated_at: string
}

interface Subject {
  id: string
  name: string
}

interface GradeLevel {
  id: string
  name: string
}

const LessonsManagementPage: React.FC = () => {
  const navigate = useNavigate()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [gradeLevels, setGradeLevels] = useState<GradeLevel[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [lessonsRes, subjectsRes, gradeLevelsRes] = await Promise.all([
        apiClient.get<{ success: boolean; data: Lesson[] }>(API_ENDPOINTS.CONTENT.LESSONS),
        apiClient.get<{ success: boolean; data: Subject[] }>(API_ENDPOINTS.CONTENT.SUBJECTS),
        apiClient.get<{ success: boolean; data: GradeLevel[] }>(API_ENDPOINTS.CONTENT.GRADE_LEVELS),
      ])

      if (lessonsRes.success) setLessons(lessonsRes.data || [])
      if (subjectsRes.success) setSubjects(subjectsRes.data || [])
      if (gradeLevelsRes.success) setGradeLevels(gradeLevelsRes.data || [])
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedLesson) return

    try {
      await apiClient.delete(API_ENDPOINTS.CONTENT.LESSON(selectedLesson.id))
      setLessons(lessons.filter(l => l.id !== selectedLesson.id))
      setDeleteModalOpen(false)
      setSelectedLesson(null)
    } catch (error) {
      console.error('Failed to delete lesson:', error)
    }
  }

  const getSubjectName = (subjectId: string) => {
    return subjects.find(s => s.id === subjectId)?.name || subjectId
  }

  const getGradeLevelName = (gradeLevelId: string) => {
    return gradeLevels.find(g => g.id === gradeLevelId)?.name || gradeLevelId
  }

  const filteredLessons = lessons.filter(lesson =>
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns: DataTableColumn<Lesson>[] = [
    {
      key: 'title',
      label: 'العنوان',
      sortable: true,
      render: (value, row): React.ReactNode => (
        <div className="lessons-management-page__title-cell">
          <strong>{value as string}</strong>
          {!row.is_published && <span className="lessons-management-page__draft-badge">مسودة</span>}
        </div>
      ),
    },
    {
      key: 'subject_id',
      label: 'المادة',
      render: (value): React.ReactNode => getSubjectName(value as string),
    },
    {
      key: 'grade_level_id',
      label: 'المستوى',
      render: (value): React.ReactNode => getGradeLevelName(value as string),
    },
    {
      key: 'difficulty_level',
      label: 'الصعوبة',
      render: (value): React.ReactNode => {
        const labels: Record<string, string> = {
          beginner: 'مبتدئ',
          intermediate: 'متوسط',
          advanced: 'متقدم',
        }
        return labels[value as string] || (value as string)
      },
    },
    {
      key: 'order',
      label: 'الترتيب',
      sortable: true,
    },
    {
      key: 'actions',
      label: 'الإجراءات',
      render: (_, row) => (
        <div className="lessons-management-page__actions">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/lessons/${row.id}`)}
            leftIcon={<Eye />}
          >
            عرض
          </Button>
          <ProtectedButton
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/content/lessons/${row.id}/edit`)}
            leftIcon={<Edit />}
            requiredPermissions={['lessons.update', 'lessons.manage']}
          >
            تعديل
          </ProtectedButton>
          <ProtectedButton
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedLesson(row)
              setDeleteModalOpen(true)
            }}
            leftIcon={<Trash2 />}
            requiredPermissions={['lessons.delete', 'lessons.manage']}
          >
            حذف
          </ProtectedButton>
        </div>
      ),
    },
  ]

  if (loading) {
    return <LoadingState fullScreen message="جاري تحميل الدروس..." />
  }

  return (
    <div className="lessons-management-page">
      <PageHeader
        title="إدارة الدروس"
        description="إنشاء وتعديل وإدارة الدروس التعليمية"
        icon={<BookOpen />}
      />

      <div className="lessons-management-page__toolbar">
        <div className="lessons-management-page__search">
          <Input
            placeholder="بحث في الدروس..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            leftIcon={<Search />}
          />
        </div>
        <ProtectedButton
          variant="primary"
          onClick={() => navigate('/content/lessons/new')}
          leftIcon={<Plus />}
          requiredPermissions={['lessons.create', 'lessons.manage']}
        >
          إضافة درس جديد
        </ProtectedButton>
      </div>

      <Card className="lessons-management-page__table-card">
        <DataTable
          data={filteredLessons as unknown as Record<string, unknown>[]}
          columns={columns as unknown as DataTableColumn<Record<string, unknown>>[]}
          searchable={false}
          pagination
          pageSize={10}
          emptyMessage="لا توجد دروس"
        />
      </Card>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setSelectedLesson(null)
        }}
        size="sm"
      >
        <div className="lessons-management-page__delete-modal">
          <h3>تأكيد الحذف</h3>
          <p>هل أنت متأكد من حذف الدرس "{selectedLesson?.title}"؟</p>
          <p className="lessons-management-page__delete-warning">لا يمكن التراجع عن هذا الإجراء.</p>
          <div className="lessons-management-page__delete-actions">
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              إلغاء
            </Button>
            <Button variant="primary" onClick={handleDelete}>
              حذف
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default LessonsManagementPage
