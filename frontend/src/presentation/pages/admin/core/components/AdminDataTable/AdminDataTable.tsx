/**
 * AdminDataTable Component - Data Table Wrapper
 *
 * Wrapper موحد للجداول في صفحات Admin
 * يوفر loading state و error handling موحد
 */

import React from 'react'
import { DataTable } from '@/presentation/components/data'
import { LoadingState, ErrorState } from '@/presentation/pages/components'
import type { DataTableColumn } from '@/presentation/components/data'


export interface AdminDataTableProps<T> {
  /**
   * البيانات
   */
  data: T[]

  /**
   * الأعمدة
   */
  columns: DataTableColumn<T>[]

  /**
   * حالة التحميل
   */
  loading?: boolean

  /**
   * الخطأ (إن وجد)
   */
  error?: string | null

  /**
   * هل الجدول قابل للبحث؟
   */
  searchable?: boolean

  /**
   * هل الجدول قابل للتصفية؟
   */
  filterable?: boolean

  /**
   * هل الجدول قابل للترقيم؟
   */
  pagination?: boolean

  /**
   * حجم الصفحة
   */
  pageSize?: number

  /**
   * دالة النقر على الصف
   */
  onRowClick?: (row: T) => void

  /**
   * إجراءات إضافية للصف
   */
  actions?: (row: T) => React.ReactNode

  /**
   * className إضافي
   */
  className?: string
}

/**
 * AdminDataTable Component
 *
 * Wrapper موحد للجداول
 *
 * @example
 * ```tsx
 * <AdminDataTable
 *   data={users}
 *   columns={userColumns}
 *   loading={loading}
 *   error={error}
 *   searchable
 *   pagination
 *   onRowClick={(user) => navigate(`/users/${user.id}`)}
 * />
 * ```
 */
export function AdminDataTable<T>({
  data,
  columns,
  loading = false,
  error = null,
  searchable = false,
  filterable = false,
  pagination = false,
  pageSize = 20,
  onRowClick,
  actions,
  className = '',
}: AdminDataTableProps<T>) {
  // حالة التحميل
  if (loading) {
    return (
      <div className={`admin-data-table ${className}`}>
        <LoadingState message="جاري تحميل البيانات..." />
      </div>
    )
  }

  // حالة الخطأ
  if (error) {
    return (
      <div className={`admin-data-table ${className}`}>
        <ErrorState message={error} />
      </div>
    )
  }

  // حالة فارغة
  if (data.length === 0) {
    return (
      <div className={`admin-data-table ${className}`}>
        <ErrorState title="لا توجد بيانات" message="لا توجد بيانات لعرضها" />
      </div>
    )
  }

  // البيانات موجودة
  return (
    <div className={`admin-data-table ${className}`}>
      <DataTable
        data={data}
        columns={columns}
        searchable={searchable}
        filterable={filterable}
        pagination={pagination}
        pageSize={pageSize}
        onRowClick={onRowClick}
        actions={actions}
      />
    </div>
  )
}
