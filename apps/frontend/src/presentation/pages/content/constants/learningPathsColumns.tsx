/**
 * Learning Paths Table Columns - أعمدة جدول المسارات التعليمية
 *
 * تعريفات أعمدة جدول المسارات التعليمية لإعادة الاستخدام
 */

import React from 'react'
import { Edit, Trash2, Eye } from 'lucide-react'
import { Button } from '../../../components/common'
import type { DataTableColumn } from '../../../components/data'
import { ProtectedButton } from '../../../components/auth'
import type { LearningPath } from '@/application/types/content.types'

export interface CreateLearningPathsColumnsOptions {
  /**
   * دالة الحصول على اسم المادة
   */
  getSubjectName: (subjectId: string) => string

  /**
   * دالة الحصول على اسم المستوى
   */
  getGradeLevelName: (gradeLevelId: string) => string

  /**
   * دالة التنقل
   */
  navigate: (path: string) => void

  /**
   * دالة فتح modal الحذف
   */
  onDelete: (path: LearningPath) => void
}

/**
 * إنشاء أعمدة جدول المسارات التعليمية
 *
 * @param options - خيارات إنشاء الأعمدة
 * @returns أعمدة الجدول
 */
export function createLearningPathsColumns(
  options: CreateLearningPathsColumnsOptions
): DataTableColumn<LearningPath>[] {
  const { getSubjectName, getGradeLevelName, navigate, onDelete } = options

  return [
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
            onClick={() => onDelete(row)}
            leftIcon={<Trash2 />}
            requiredPermissions={['lessons.delete', 'lessons.manage']}
          >
            حذف
          </ProtectedButton>
        </div>
      ),
    },
  ]
}
