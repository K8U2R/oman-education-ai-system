/**
 * Learning Paths Management Page - صفحة إدارة المسارات التعليمية
 *
 * صفحة لإدارة المسارات التعليمية (إنشاء، تعديل، حذف)
 * تم تحديثها لاستخدام المكونات والهوكس الموحدة
 */

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Network, Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Card, Input, DeleteConfirmModal, LoadingWrapper } from '../../components/common'
import { AdminPageWrapper } from '../../components/admin'
import { DataTable, type DataTableColumn } from '../../components/data'
import { ProtectedButton } from '../../components/auth'
import { createLearningPathsColumns } from './constants/learningPathsColumns'
import { useDataFetcher, useSearch } from '@/application/hooks'
import { useModal } from '@/application/shared/hooks'
import { handleError } from '@/utils/errorHandler'
import { apiClient } from '@/infrastructure/services/api'
import { API_ENDPOINTS } from '@/domain/constants'
import { PageHeader } from '../components'
import type { LearningPath, Subject, GradeLevel } from '@/application/types/content.types'

const LearningPathsManagementPage: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  // استخدام hooks موحدة لجلب البيانات
  const {
    data: paths = [],
    loading: pathsLoading,
    setData: setPaths,
  } = useDataFetcher<LearningPath>(API_ENDPOINTS.CONTENT.LEARNING_PATHS)

  const { data: subjects = [] } = useDataFetcher<Subject>(API_ENDPOINTS.CONTENT.SUBJECTS)
  const { data: gradeLevels = [] } = useDataFetcher<GradeLevel>(API_ENDPOINTS.CONTENT.GRADE_LEVELS)

  // استخدام hook موحد للبحث
  // Ensure paths is always an array before passing to useSearch
  const safePaths = Array.isArray(paths) ? paths : []
  const {
    searchTerm,
    setSearchTerm,
    filteredData: filteredPaths = [],
  } = useSearch<LearningPath>(safePaths, {
    searchFields: ['name'],
  })

  // استخدام hook موحد للـ modal
  const deleteModal = useModal<LearningPath>()

  const handleDelete = async () => {
    if (!deleteModal.selectedData) return

    const deletedPath = deleteModal.selectedData
    const previousPaths = [...paths]

    // Optimistic update - تحديث UI فوراً
    setPaths(paths.filter(p => p.id !== deletedPath.id))
    deleteModal.close()

    try {
      await apiClient.delete(API_ENDPOINTS.CONTENT.LEARNING_PATH(deletedPath.id))
    } catch (error) {
      // Rollback في حالة الفشل
      setPaths(previousPaths)
      handleError(error, {
        message: t('content_management.learning_paths.delete_error'),
        context: 'LearningPathsManagementPage',
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
      createLearningPathsColumns({
        getSubjectName,
        getGradeLevelName,
        navigate,
        onDelete: path => deleteModal.open(path),
        t, // Pass translation function
      }),
    [getSubjectName, getGradeLevelName, navigate, deleteModal, t]
  )

  return (
    <AdminPageWrapper
      requiredPermissions={['lessons.view']}
      loadingMessage={t('loading')} // Simplified loading message
    >
      <div className="learning-paths-management-page">
        <PageHeader
          title={t('content_management.learning_paths.title')}
          description={t('content_management.learning_paths.description')}
          icon={<Network />}
        />

        <div className="learning-paths-management-page__toolbar">
          <div className="learning-paths-management-page__search">
            <Input
              placeholder={t('content_management.learning_paths.search_placeholder')}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <ProtectedButton
            variant="primary"
            onClick={() => navigate('/content/learning-paths/new')}
            leftIcon={<Plus />}
            requiredPermissions={['lessons.create', 'lessons.manage']}
          >
            {t('content_management.learning_paths.add_new')}
          </ProtectedButton>
        </div>

        <LoadingWrapper isLoading={pathsLoading} message={t('loading')}>
          <Card className="learning-paths-management-page__table-card">
            <DataTable
              data={filteredPaths as unknown as Record<string, unknown>[]}
              columns={columns as unknown as DataTableColumn<Record<string, unknown>>[]}
              searchable={false}
              pagination
              pageSize={10}
              emptyMessage={t('content_management.learning_paths.empty')}
            />
          </Card>
        </LoadingWrapper>

        <DeleteConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.close}
          onConfirm={handleDelete}
          itemTitle={deleteModal.selectedData?.name || ''}
          itemType={t('content_management.learning_paths.item_type')}
        />
      </div>
    </AdminPageWrapper>
  )
}

export default LearningPathsManagementPage
