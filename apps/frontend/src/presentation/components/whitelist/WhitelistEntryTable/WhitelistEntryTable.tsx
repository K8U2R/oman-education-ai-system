/**
 * Whitelist Entry Table Component - جدول إدخالات القائمة البيضاء
 *
 * مكون متخصص لعرض إدخالات القائمة البيضاء
 */

import React from 'react'
import { Edit, Trash2, Power, PowerOff, Shield, ShieldCheck, ShieldAlert } from 'lucide-react'
import { DataTable, DataTableColumn } from '../../data'
import { Button } from '../../common'
import type { WhitelistEntry } from '@/application/features/whitelist'

export interface WhitelistEntryTableProps {
  entries: WhitelistEntry[]
  loading?: boolean
  error?: Error | null
  onEdit?: (entry: WhitelistEntry) => void
  onDelete?: (entry: WhitelistEntry) => void
  onActivate?: (entry: WhitelistEntry) => void
  onDeactivate?: (entry: WhitelistEntry) => void
  className?: string
}

/**
 * Whitelist Entry Table - جدول إدخالات القائمة البيضاء
 */
export const WhitelistEntryTable: React.FC<WhitelistEntryTableProps> = ({
  entries,
  loading = false,
  error = null,
  onEdit,
  onDelete,
  onActivate,
  onDeactivate,
  className = '',
}) => {
  const getPermissionLevelBadge = (level: string) => {
    const badges = {
      developer: { icon: Shield, label: 'مطور', color: 'blue' },
      admin: { icon: ShieldCheck, label: 'مسؤول', color: 'purple' },
      super_admin: { icon: ShieldAlert, label: 'مسؤول رئيسي', color: 'red' },
    }
    const badge = badges[level as keyof typeof badges] || badges.developer
    const Icon = badge.icon

    return (
      <span className={`whitelist-entry-table__badge whitelist-entry-table__badge--${badge.color}`}>
        <Icon size={14} />
        {badge.label}
      </span>
    )
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'لا ينتهي'
    const date = new Date(dateString)
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const columns: DataTableColumn<WhitelistEntry>[] = [
    {
      key: 'email',
      label: 'البريد الإلكتروني',
      render: (_, entry) => (
        <div className="whitelist-entry-table__email">
          <strong>{entry.email}</strong>
          {entry.is_permanent && (
            <span className="whitelist-entry-table__permanent-badge">دائم</span>
          )}
        </div>
      ),
    },
    {
      key: 'permission_level',
      label: 'مستوى ',
      render: (_, entry) => getPermissionLevelBadge(entry.permission_level),
    },
    {
      key: 'permissions',
      label: 'عدد ',
      render: (_, entry) => (
        <span className="whitelist-entry-table__permissions-count">
          {entry.permissions.length} صلاحية
        </span>
      ),
    },
    {
      key: 'expires_at',
      label: 'تاريخ الانتهاء',
      render: (_, entry) => (
        <span
          className={`whitelist-entry-table__expires ${
            entry.expires_at && new Date(entry.expires_at) < new Date()
              ? 'whitelist-entry-table__expires--expired'
              : ''
          }`}
        >
          {formatDate(entry.expires_at)}
        </span>
      ),
    },
    {
      key: 'is_active',
      label: 'الحالة',
      render: (_, entry) => (
        <span
          className={`whitelist-entry-table__status ${
            entry.is_active
              ? 'whitelist-entry-table__status--active'
              : 'whitelist-entry-table__status--inactive'
          }`}
        >
          {entry.is_active ? 'نشط' : 'معطل'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'الإجراءات',
      render: (_, entry) => (
        <div className="whitelist-entry-table__actions">
          {onEdit && (
            <Button variant="ghost" size="sm" onClick={() => onEdit(entry)} title="تعديل">
              <Edit size={16} />
            </Button>
          )}
          {entry.is_active
            ? onDeactivate && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeactivate(entry)}
                  title="تعطيل"
                  disabled={entry.is_permanent}
                >
                  <PowerOff size={16} />
                </Button>
              )
            : onActivate && (
                <Button variant="ghost" size="sm" onClick={() => onActivate(entry)} title="تفعيل">
                  <Power size={16} />
                </Button>
              )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(entry)}
              title="حذف"
              disabled={entry.is_permanent}
              className="whitelist-entry-table__delete-btn"
            >
              <Trash2 size={16} />
            </Button>
          )}
        </div>
      ),
    },
  ]

  if (loading && entries.length === 0) {
    return (
      <div className={`whitelist-entry-table ${className}`}>
        <div className="whitelist-entry-table__loading">جاري التحميل...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`whitelist-entry-table ${className}`}>
        <div className="whitelist-entry-table__error">
          <span>خطأ: {error.message}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`whitelist-entry-table ${className}`}>
      <DataTable
        data={entries as unknown as Record<string, unknown>[]}
        columns={columns as unknown as DataTableColumn<Record<string, unknown>>[]}
        emptyMessage="لا توجد إدخالات في القائمة البيضاء"
      />
    </div>
  )
}
