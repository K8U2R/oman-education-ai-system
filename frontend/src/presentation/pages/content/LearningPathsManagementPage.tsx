/**
 * Learning Paths Management Page - صفحة إدارة المسارات التعليمية
 *
 * صفحة لإدارة المسارات التعليمية (إنشاء، تعديل، حذف)
 */

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Network, Plus, Edit, Trash2, Eye } from 'lucide-react'
import { Card, Button, Input } from '../../components/common'
import { DataTable, DataTableColumn } from '../../components/data'
import { ProtectedButton } from '../../components/auth'
import { apiClient } from '@/infrastructure/api'
import { API_ENDPOINTS } from '@/domain/constants'
import { PageHeader, LoadingState } from '../components'
import './LearningPathsManagementPage.scss'

interface LearningPath {
  id: string
  name: string
  description?: string
  subject_id: string
  grade_level_id: string
  lessons: string[]
  order: number
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

const LearningPathsManagementPage: React.FC = () => {
  const navigate = useNavigate()
  const [paths, setPaths] = useState<LearningPath[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [gradeLevels, setGradeLevels] = useState<GradeLevel[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [pathsRes, subjectsRes, gradeLevelsRes] = await Promise.all([
        apiClient.get<{ success: boolean; data: LearningPath[] }>(
          API_ENDPOINTS.CONTENT.LEARNING_PATHS
        ),
        apiClient.get<{ success: boolean; data: Subject[] }>(API_ENDPOINTS.CONTENT.SUBJECTS),
        apiClient.get<{ success: boolean; data: GradeLevel[] }>(API_ENDPOINTS.CONTENT.GRADE_LEVELS),
      ])

      if (pathsRes.success) setPaths(pathsRes.data || [])
      if (subjectsRes.success) setSubjects(subjectsRes.data || [])
      if (gradeLevelsRes.success) setGradeLevels(gradeLevelsRes.data || [])
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (pathId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المسار التعليمي؟')) return

    try {
      await apiClient.delete(API_ENDPOINTS.CONTENT.LEARNING_PATH(pathId))
      setPaths(paths.filter(p => p.id !== pathId))
    } catch (error) {
      console.error('Failed to delete learning path:', error)
    }
  }

  const getSubjectName = (subjectId: string) => {
    return subjects.find(s => s.id === subjectId)?.name || subjectId
  }

  const getGradeLevelName = (gradeLevelId: string) => {
    return gradeLevels.find(g => g.id === gradeLevelId)?.name || gradeLevelId
  }

  const filteredPaths = paths.filter(path =>
    path.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const columns: DataTableColumn<LearningPath>[] = [
    {
      key: 'name',
      label: 'الاسم',
      sortable: true,
      render: (value, row): React.ReactNode => (
        <div className="learning-paths-management-page__name-cell">
          <strong>{value as string}</strong>
          {!row.is_published && (
            <span className="learning-paths-management-page__draft-badge">مسودة</span>
          )}
        </div>
      ),
    },
    {
      key: 'description',
      label: 'الوصف',
      render: (value): React.ReactNode => (value as string) || '-',
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
      key: 'lessons',
      label: 'عدد الدروس',
      render: value => (Array.isArray(value) ? value.length : 0),
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
        <div className="learning-paths-management-page__actions">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/content/learning-paths/${row.id}`)}
            leftIcon={<Eye />}
          >
            عرض
          </Button>
          <ProtectedButton
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/content/learning-paths/${row.id}/edit`)}
            leftIcon={<Edit />}
            requiredPermissions={['lessons.update', 'lessons.manage']}
          >
            تعديل
          </ProtectedButton>
          <ProtectedButton
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row.id)}
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
    return <LoadingState fullScreen message="جاري تحميل المسارات التعليمية..." />
  }

  return (
    <div className="learning-paths-management-page">
      <PageHeader
        title="إدارة المسارات التعليمية"
        description="إنشاء وتعديل وإدارة المسارات التعليمية"
        icon={<Network />}
      />

      <div className="learning-paths-management-page__toolbar">
        <div className="learning-paths-management-page__search">
          <Input
            placeholder="بحث في المسارات..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <ProtectedButton
          variant="primary"
          onClick={() => navigate('/content/learning-paths/new')}
          leftIcon={<Plus />}
          requiredPermissions={['lessons.create', 'lessons.manage']}
        >
          إضافة مسار جديد
        </ProtectedButton>
      </div>

      <Card className="learning-paths-management-page__table-card">
        <DataTable
          data={filteredPaths as unknown as Record<string, unknown>[]}
          columns={columns as unknown as DataTableColumn<Record<string, unknown>>[]}
          searchable={false}
          pagination
          pageSize={10}
          emptyMessage="لا توجد مسارات تعليمية"
        />
      </Card>
    </div>
  )
}

export default LearningPathsManagementPage
