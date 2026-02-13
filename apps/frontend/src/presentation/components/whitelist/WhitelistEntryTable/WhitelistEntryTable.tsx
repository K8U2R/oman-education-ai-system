import React from 'react'
import { Edit, Trash2, Power, PowerOff, Shield, ShieldCheck, ShieldAlert } from 'lucide-react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()

  const getPermissionLevelBadge = (level: string) => {
    const badges = {
      developer: { icon: Shield, label: t('admin.whitelist.levels.developer'), color: 'blue' },
      admin: { icon: ShieldCheck, label: t('admin.whitelist.levels.admin'), color: 'purple' },
      super_admin: { icon: ShieldAlert, label: t('admin.whitelist.levels.super_admin'), color: 'red' },
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
    if (!dateString) return t('admin.whitelist.table.never_expires')
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
      label: t('admin.whitelist.table.email'),
      render: (_, entry) => (
        <div className="whitelist-entry-table__email">
          <strong>{entry.email}</strong>
          {entry.is_permanent && (
            <span className="whitelist-entry-table__permanent-badge">{t('admin.whitelist.table.permanent')}</span>
          )}
        </div>
      ),
    },
    {
      key: 'permission_level',
      label: t('admin.whitelist.table.level'),
      render: (_, entry) => getPermissionLevelBadge(entry.permission_level),
    },
    {
      key: 'permissions',
      label: t('admin.whitelist.table.permissions_count'),
      render: (_, entry) => (
        <span className="whitelist-entry-table__permissions-count">
          {entry.permissions.length} {t('admin.whitelist.table.permission_unit')}
        </span>
      ),
    },
    {
      key: 'expires_at',
      label: t('admin.whitelist.table.expires_at'),
      render: (_, entry) => (
        <span
          className={`whitelist-entry-table__expires ${entry.expires_at && new Date(entry.expires_at) < new Date()
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
      label: t('admin.whitelist.table.status'),
      render: (_, entry) => (
        <span
          className={`whitelist-entry-table__status ${entry.is_active
              ? 'whitelist-entry-table__status--active'
              : 'whitelist-entry-table__status--inactive'
            }`}
        >
          {entry.is_active ? t('admin.whitelist.filters.active') : t('admin.whitelist.filters.inactive')}
        </span>
      ),
    },
    {
      key: 'actions',
      label: t('admin.whitelist.table.actions'),
      render: (_, entry) => (
        <div className="whitelist-entry-table__actions">
          {onEdit && (
            <Button variant="ghost" size="sm" onClick={() => onEdit(entry)} title={t('admin.whitelist.actions.edit')}>
              <Edit size={16} />
            </Button>
          )}
          {entry.is_active
            ? onDeactivate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeactivate(entry)}
                title={t('admin.whitelist.actions.deactivate')}
                disabled={entry.is_permanent}
              >
                <PowerOff size={16} />
              </Button>
            )
            : onActivate && (
              <Button variant="ghost" size="sm" onClick={() => onActivate(entry)} title={t('admin.whitelist.actions.activate')}>
                <Power size={16} />
              </Button>
            )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(entry)}
              title={t('admin.whitelist.actions.delete')}
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
        <div className="whitelist-entry-table__loading">{t('loading')}...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`whitelist-entry-table ${className}`}>
        <div className="whitelist-entry-table__error">
          <span>{t('error')}: {error.message}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`whitelist-entry-table ${className}`}>
      <DataTable
        data={entries as unknown as Record<string, unknown>[]}
        columns={columns as unknown as DataTableColumn<Record<string, unknown>>[]}
        emptyMessage={t('common.no_data')}
      />
    </div>
  )
}
