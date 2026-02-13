import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Input, Button } from '../../common'
import type {
  WhitelistEntry,
  WhitelistEntryFormData,
  PermissionLevel,
} from '@/application/features/whitelist'
import { Permission } from '@/domain/types/auth.types'

export interface WhitelistEntryFormProps {
  entry?: WhitelistEntry | null
  onSubmit: (data: WhitelistEntryFormData) => Promise<void>
  onCancel: () => void
  loading?: boolean
  allPermissions?: Permission[]
}

/**
 * Whitelist Entry Form - نموذج إدخال القائمة البيضاء
 */
export const WhitelistEntryForm: React.FC<WhitelistEntryFormProps> = ({
  entry,
  onSubmit,
  onCancel,
  loading = false,
  allPermissions = [],
}) => {
  const { t } = useTranslation()
  const [formData, setFormData] = useState<WhitelistEntryFormData>({
    email: entry?.email || '',
    permission_level: entry?.permission_level || 'developer',
    permissions: entry?.permissions || [],
    expires_at: entry?.expires_at || null,
    is_permanent: entry?.is_permanent || false,
    notes: entry?.notes || null,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (entry) {
      setFormData({
        email: entry.email,
        permission_level: entry.permission_level,
        permissions: entry.permissions,
        expires_at: entry.expires_at,
        is_permanent: entry.is_permanent,
        notes: entry.notes,
      })
    }
  }, [entry])

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = t('admin.whitelist.validation.email_required')
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('admin.whitelist.validation.email_invalid')
    }

    if (formData.permissions.length === 0) {
      newErrors.permissions = t('admin.whitelist.validation.permissions_required')
    }

    if (formData.expires_at && new Date(formData.expires_at) < new Date()) {
      newErrors.expires_at = t('admin.whitelist.validation.future_date')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Failed to submit form:', error)
    }
  }

  const togglePermission = (permission: Permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission],
    }))
  }

  const permissionLevels: { value: PermissionLevel; label: string }[] = [
    { value: 'developer', label: t('admin.whitelist.levels.developer') },
    { value: 'admin', label: t('admin.whitelist.levels.admin') },
    { value: 'super_admin', label: t('admin.whitelist.levels.super_admin') },
  ]

  return (
    <form className="whitelist-entry-form" onSubmit={handleSubmit}>
      <div className="whitelist-entry-form__group">
        <label className="whitelist-entry-form__label">
          {t('admin.whitelist.form.email_label')} <span className="whitelist-entry-form__required">*</span>
        </label>
        <Input
          type="email"
          value={formData.email}
          onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
          placeholder={t('admin.whitelist.form.email_placeholder')}
          disabled={!!entry || loading}
          error={errors.email}
        />
      </div>

      <div className="whitelist-entry-form__group">
        <label className="whitelist-entry-form__label">
          {t('admin.whitelist.form.level_label')} <span className="whitelist-entry-form__required">*</span>
        </label>
        <select
          className="whitelist-entry-form__select"
          value={formData.permission_level}
          onChange={e =>
            setFormData(prev => ({
              ...prev,
              permission_level: e.target.value as PermissionLevel,
            }))
          }
          disabled={loading || (entry?.is_permanent && entry.permission_level === 'super_admin')}
        >
          {permissionLevels.map(level => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>
      </div>

      <div className="whitelist-entry-form__group">
        <label className="whitelist-entry-form__label">
          {t('admin.whitelist.form.permissions_label')} <span className="whitelist-entry-form__required">*</span>
        </label>
        <div className="whitelist-entry-form__permissions">
          {allPermissions.map(permission => (
            <label key={permission} className="whitelist-entry-form__permission-checkbox">
              <input
                type="checkbox"
                checked={formData.permissions.includes(permission)}
                onChange={() => togglePermission(permission)}
                disabled={loading}
              />
              <span>{permission}</span>
            </label>
          ))}
        </div>
        {errors.permissions && (
          <span className="whitelist-entry-form__error">{errors.permissions}</span>
        )}
      </div>

      <div className="whitelist-entry-form__group">
        <label className="whitelist-entry-form__label">{t('admin.whitelist.form.expires_at_label')}</label>
        <Input
          type="datetime-local"
          value={
            formData.expires_at ? new Date(formData.expires_at).toISOString().slice(0, 16) : ''
          }
          onChange={e =>
            setFormData(prev => ({
              ...prev,
              expires_at: e.target.value ? new Date(e.target.value).toISOString() : null,
            }))
          }
          disabled={loading || formData.is_permanent}
          error={errors.expires_at}
        />
      </div>

      <div className="whitelist-entry-form__group">
        <label className="whitelist-entry-form__checkbox-label">
          <input
            type="checkbox"
            checked={formData.is_permanent}
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                is_permanent: e.target.checked,
                expires_at: e.target.checked ? null : prev.expires_at,
              }))
            }
            disabled={loading || (entry?.is_permanent && entry.permission_level === 'super_admin')}
          />
          <span>{t('admin.whitelist.form.permanent_label')}</span>
        </label>
      </div>

      <div className="whitelist-entry-form__group">
        <label className="whitelist-entry-form__label">{t('admin.whitelist.form.notes_label')}</label>
        <textarea
          className="whitelist-entry-form__textarea"
          value={formData.notes || ''}
          onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value || null }))}
          placeholder={t('admin.whitelist.form.notes_placeholder')}
          disabled={loading}
          rows={3}
        />
      </div>

      <div className="whitelist-entry-form__actions">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={loading}>
          {t('admin.whitelist.form.cancel')}
        </Button>
        <Button type="submit" variant="primary" isLoading={loading}>
          {entry ? t('admin.whitelist.form.update') : t('admin.whitelist.form.create')}
        </Button>
      </div>
    </form>
  )
}
