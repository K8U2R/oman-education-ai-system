/**
 * Lessons Management Page - صفحة إدارة الدروس
 *
 * صفحة لإدارة الدروس (إنشاء، تعديل، حذف)
 * تم تحديثها لاستخدام المكونات والهوكس الموحدة
 */

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Plus, Search } from 'lucide-react'
import { Card, Input, DeleteConfirmModal, LoadingWrapper } from '../../components/common'
import { AdminPageWrapper } from '../../components/admin'
import { DataTable, type DataTableColumn } from '../../components/data'
import { ProtectedButton } from '../../components/auth'
import { createLessonsColumns } from './constants/lessonsColumns'
import { useDataFetcher, useSearch } from '@/application/hooks'
import { useModal } from '@/application/shared/hooks'
import { handleError } from '@/utils/errorHandler'
import { apiClient } from '@/infrastructure/services/api'
import { API_ENDPOINTS } from '@/domain/constants'
import { PageHeader } from '../components'
import type { Lesson, Subject, GradeLevel } from '@/application/types/content.types'

const LessonsManagementPage: React.FC = () => {
  const navigate = useNavigate()

  // استخدام hooks موحدة لجلب البيانات
  const {
    data: lessons,
    loading: lessonsLoading,
    setData: setLessons,
  } = useDataFetcher<Lesson>(API_ENDPOINTS.CONTENT.LESSONS)

  const { data: subjects = [] } = useDataFetcher<Subject>(API_ENDPOINTS.CONTENT.SUBJECTS)
  const { data: gradeLevels = [] } = useDataFetcher<GradeLevel>(API_ENDPOINTS.CONTENT.GRADE_LEVELS)

  // استخدام hook موحد للبحث
  const {
    searchTerm,
    setSearchTerm,
    filteredData: filteredLessons,
  } = useSearch<Lesson>(lessons, {
    searchFields: ['title'],
  })

  // استخدام hook موحد للـ modal
  const deleteModal = useModal<Lesson>()

  const handleDelete = async () => {
    if (!deleteModal.selectedData) return

    try {
      await apiClient.delete(API_ENDPOINTS.CONTENT.LESSON(deleteModal.selectedData.id))
      setLessons(lessons.filter(l => l.id !== deleteModal.selectedData!.id))
      deleteModal.close()
    } catch (error) {
      handleError(error, {
        message: 'فشل حذف الدرس',
        context: 'LessonsManagementPage',
      })
    }
  }

  const getSubjectName = React.useCallback(
    (subjectId: string) => {
      return subjects.find(s => s.id === subjectId)?.name || subjectId
    },
    [subjects]
  )

  const getGradeLevelName = React.useCallback(
    (gradeLevelId: string) => {
      return gradeLevels.find(g => g.id === gradeLevelId)?.name || gradeLevelId
    },
    [gradeLevels]
  )

  // استخدام columns من constants
  const columns = React.useMemo(
    () =>
      createLessonsColumns({
        getSubjectName,
        getGradeLevelName,
        navigate,
        onDelete: lesson => deleteModal.open(lesson),
      }),
    [getSubjectName, getGradeLevelName, navigate, deleteModal]
  )

  return (
    <AdminPageWrapper
      requiredPermissions={['lessons.view', 'lessons.manage']}
      loadingMessage="جاري تحميل الدروس..."
    >
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
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
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

        <LoadingWrapper isLoading={lessonsLoading} message="جاري تحميل الدروس...">
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
        </LoadingWrapper>

        <DeleteConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.close}
          onConfirm={handleDelete}
          itemTitle={deleteModal.selectedData?.title || ''}
          itemType="درس"
        />
      </div>
    </AdminPageWrapper>
  )
}

export default LessonsManagementPage
