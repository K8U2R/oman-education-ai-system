/**
 * Lessons Table Columns - أعمدة جدول الدروس
 *
 * تعريفات أعمدة جدول الدروس لإعادة الاستخدام
 */

import React from 'react'
import { Edit, Trash2, Eye } from 'lucide-react'
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
  const { getSubjectName, getGradeLevelName, navigate, onDelete } = options

  return [
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
