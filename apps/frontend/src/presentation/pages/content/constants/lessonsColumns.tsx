/**
 * Lessons Table Columns - أعمدة جدول الدروس
 *
 * تعريفات أعمدة جدول الدروس لإعادة الاستخدام
 */

import React from 'react'
import { Edit, Trash2, Eye } from 'lucide-react'
import { TFunction } from 'i18next'
import { Button } from '../../../components/common'
import type { DataTableColumn } from '../../../components/data'
import { ProtectedButton } from '../../../components/auth'
import type { Lesson } from '@/application/types/content.types'

export interface CreateLessonsColumnsOptions {
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
  onDelete: (lesson: Lesson) => void

  /**
   * Translation function
   */
  t: TFunction
}

/**
 * إنشاء أعمدة جدول الدروس
 *
 * @param options - خيارات إنشاء الأعمدة
 * @returns أعمدة الجدول
 */
export function createLessonsColumns(
  options: CreateLessonsColumnsOptions
): DataTableColumn<Lesson>[] {
  const { getSubjectName, getGradeLevelName, navigate, onDelete, t } = options

  return [
    {
      key: 'title',
      label: t('content_management.lessons.table.title', 'العنوان'),
      sortable: true,
      render: (value, row): React.ReactNode => (
        <div className="lessons-management-page__title-cell">
          <strong>{value as string}</strong>
          {!row.is_published && <span className="lessons-management-page__draft-badge">{t('content_management.common.draft', 'مسودة')}</span>}
        </div>
      ),
    },
    {
      key: 'subject_id',
      label: t('content_management.lessons.table.subject', 'المادة'),
      render: (value): React.ReactNode => getSubjectName(value as string),
    },
    {
      key: 'grade_level_id',
      label: t('content_management.lessons.table.grade', 'المستوى'),
      render: (value): React.ReactNode => getGradeLevelName(value as string),
    },
    {
      key: 'difficulty_level',
      label: t('content_management.lessons.table.difficulty', 'الصعوبة'),
      render: (value): React.ReactNode => {
        const labels: Record<string, string> = {
          beginner: t('difficulty.beginner', 'مبتدئ'),
          intermediate: t('difficulty.intermediate', 'متوسط'),
          advanced: t('difficulty.advanced', 'متقدم'),
        }
        return labels[value as string] || (value as string)
      },
    },
    {
      key: 'order',
      label: t('content_management.lessons.table.order', 'الترتيب'),
      sortable: true,
    },
    {
      key: 'actions',
      label: t('content_management.common.actions', 'الإجراءات'),
      render: (_, row) => (
        <div className="lessons-management-page__actions">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/lessons/${row.id}`)}
            leftIcon={<Eye />}
          >
            {t('common.view', 'عرض')}
          </Button>
          <ProtectedButton
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/content/lessons/${row.id}/edit`)}
            leftIcon={<Edit />}
            requiredPermissions={['lessons.update', 'lessons.manage']}
          >
            {t('common.edit', 'تعديل')}
          </ProtectedButton>
          <ProtectedButton
            variant="ghost"
            size="sm"
            onClick={() => onDelete(row)}
            leftIcon={<Trash2 />}
            requiredPermissions={['lessons.delete', 'lessons.manage']}
          >
            {t('common.delete', 'حذف')}
          </ProtectedButton>
        </div>
      ),
    },
  ]
}
