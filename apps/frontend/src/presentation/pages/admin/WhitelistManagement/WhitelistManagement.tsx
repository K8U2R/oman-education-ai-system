import React, { useEffect } from 'react'
import { Shield, Plus, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { PageHeader } from '@/presentation/pages/admin/components'
import { Card, Button, Modal, Input } from '@/presentation/components/common'
import { WhitelistEntryTable, WhitelistEntryForm } from '@/presentation/components/whitelist'
import { useWhitelist } from '@/application/features/whitelist'
import { useModal, useSearchFilter } from '@/application/shared/hooks'
import { AdminPageWrapper } from '@/presentation/components/admin'
import { handleError } from '@/utils/errorHandler'
import type { WhitelistEntry, WhitelistEntryFormData } from '@/application/features/whitelist'
import { Permission } from '@/domain/types/auth.types'
import styles from './WhitelistManagementPage.module.scss'

const WhitelistManagementPage: React.FC = () => {
  const { t } = useTranslation()
  const {
    entries,
    loading,
    error,
    refresh,
    createEntry,
    updateEntry,
    deleteEntry,
    activateEntry,
    deactivateEntry,
    clearError,
  } = useWhitelist({ autoFetch: true })

  const formModal = useModal<WhitelistEntry>()
  const deleteModal = useModal<WhitelistEntry>()

  const { searchTerm, filter, setSearchTerm, setFilter, filteredData } = useSearchFilter(entries, {
    searchFields: ['email', 'permission_level'] as (keyof WhitelistEntry)[],
    filterOptions: [
      { value: 'all', label: t('admin.whitelist.filters.all') },
      {
        value: 'active',
        label: t('admin.whitelist.filters.active'),
        filterFn: entry => (entry as unknown as WhitelistEntry).is_active,
      },
      {
        value: 'inactive',
        label: t('admin.whitelist.filters.inactive'),
        filterFn: entry => !(entry as unknown as WhitelistEntry).is_active,
      },
      {
        value: 'expired',
        label: t('admin.whitelist.filters.expired'),
        filterFn: entry => {
          const entryData = entry as unknown as WhitelistEntry
          return entryData.expires_at ? new Date(entryData.expires_at) < new Date() : false
        },
      },
    ],
  })

  // Get all permissions for the form
  const allPermissions: Permission[] = [
    'users.view',
    'users.create',
    'users.update',
    'users.delete',
    'users.manage',
    'lessons.view',
    'lessons.create',
    'lessons.update',
    'lessons.delete',
    'lessons.manage',
    'storage.view',
    'storage.upload',
    'storage.delete',
    'storage.manage',
    'notifications.view',
    'notifications.create',
    'notifications.manage',
    'system.view',
    'system.manage',
    'system.settings',
    'admin.dashboard',
    'admin.users',
    'admin.settings',
    'admin.reports',
    'database-core.view',
    'database-core.metrics.view',
    'database-core.connections.manage',
    'database-core.cache.manage',
    'database-core.explore',
    'database-core.query.execute',
    'database-core.transactions.view',
    'database-core.audit.view',
    'database-core.backups.manage',
    'database-core.migrations.manage',
    'whitelist.view',
    'whitelist.create',
    'whitelist.update',
    'whitelist.delete',
    'whitelist.manage',
    'role-simulation.enable',
    'role-simulation.manage',
  ]

  useEffect(() => {
    if (error) {
      handleError(error, {
        message: t('admin.whitelist.messages.error_title'),
        context: 'WhitelistManagementPage',
      })
    }
  }, [error, t])

  const handleCreate = () => {
    formModal.open()
  }

  const handleEdit = (entry: WhitelistEntry) => {
    formModal.openWith(entry)
  }

  const handleDelete = (entry: WhitelistEntry) => {
    deleteModal.openWith(entry)
  }

  const handleConfirmDelete = async () => {
    if (!deleteModal.selectedData) return

    try {
      await deleteEntry(deleteModal.selectedData.id)
      deleteModal.close()
    } catch (error) {
      handleError(error, {
        message: t('admin.whitelist.messages.delete_fail'),
        context: 'WhitelistManagementPage',
      })
    }
  }

  const handleActivate = async (entry: WhitelistEntry) => {
    try {
      await activateEntry(entry.id)
    } catch (error) {
      handleError(error, {
        message: t('admin.whitelist.messages.activate_fail'),
        context: 'WhitelistManagementPage',
      })
    }
  }

  const handleDeactivate = async (entry: WhitelistEntry) => {
    try {
      await deactivateEntry(entry.id)
    } catch (error) {
      handleError(error, {
        message: t('admin.whitelist.messages.deactivate_fail'),
        context: 'WhitelistManagementPage',
      })
    }
  }

  const handleFormSubmit = async (data: WhitelistEntryFormData) => {
    try {
      if (formModal.selectedData) {
        await updateEntry(formModal.selectedData.id, {
          permission_level: data.permission_level,
          permissions: data.permissions,
          expires_at: data.expires_at,
          is_active: true, // Keep current state
          notes: data.notes,
        })
      } else {
        await createEntry({
          email: data.email,
          permission_level: data.permission_level,
          permissions: data.permissions,
          expires_at: data.expires_at,
          is_permanent: data.is_permanent,
          notes: data.notes,
        })
      }
      formModal.close()
    } catch (error) {
      handleError(error, {
        message: t('admin.whitelist.messages.save_fail'),
        context: 'WhitelistManagementPage',
      })
      throw error // Let form handle the error
    }
  }

  return (
    <AdminPageWrapper requiredRole="admin" loadingMessage={t('loading')}>
      <div className={styles['whitelist-management-page']}>
        <PageHeader
          title={t('admin.whitelist.title')}
          description={t('admin.whitelist.description')}
          icon={<Shield />}
        />

        {/* Toolbar */}
        <div className={styles['whitelist-management-page__toolbar']}>
          <div className={styles['whitelist-management-page__search']}>
            <Input
              placeholder={t('common.search_placeholder')}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className={styles['whitelist-management-page__search-input']}
            />
          </div>

          <div className={styles['whitelist-management-page__filters']}>
            <Button
              variant={filter === 'all' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              {t('admin.whitelist.filters.all')}
            </Button>
            <Button
              variant={filter === 'active' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('active')}
            >
              {t('admin.whitelist.filters.active')}
            </Button>
            <Button
              variant={filter === 'inactive' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('inactive')}
            >
              {t('admin.whitelist.filters.inactive')}
            </Button>
            <Button
              variant={filter === 'expired' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('expired')}
            >
              {t('admin.whitelist.filters.expired')}
            </Button>
          </div>

          <div className={styles['whitelist-management-page__actions']}>
            <Button variant="ghost" size="sm" onClick={refresh} leftIcon={<RefreshCw />}>
              {t('admin.whitelist.actions.refresh')}
            </Button>
            <Button variant="primary" onClick={handleCreate} leftIcon={<Plus />}>
              {t('admin.whitelist.actions.add_new')}
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Card className={styles['whitelist-management-page__error-card']}>
            <div className={styles['whitelist-management-page__error-content']}>
              <AlertCircle size={20} />
              <span>{error.message}</span>
              <Button variant="ghost" size="sm" onClick={clearError}>
                {t('admin.whitelist.actions.clear_error')}
              </Button>
            </div>
          </Card>
        )}

        {/* Success Message */}
        {!error && entries.length > 0 && (
          <Card className={styles['whitelist-management-page__info-card']}>
            <div className={styles['whitelist-management-page__info-content']}>
              <CheckCircle2 size={20} />
              <span>{t('admin.whitelist.messages.load_success', { count: entries.length })}</span>
            </div>
          </Card>
        )}

        {/* Table */}
        <Card className={styles['whitelist-management-page__table-card']}>
          <WhitelistEntryTable
            entries={filteredData as WhitelistEntry[]}
            loading={loading}
            error={error}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onActivate={handleActivate}
            onDeactivate={handleDeactivate}
          />
        </Card>

        {/* Create/Edit Modal */}
        <Modal
          isOpen={formModal.isOpen}
          onClose={formModal.close}
          size="lg"
          title={formModal.selectedData ? t('admin.whitelist.form.edit_title') : t('admin.whitelist.form.create_title')}
        >
          <WhitelistEntryForm
            entry={formModal.selectedData}
            onSubmit={handleFormSubmit}
            onCancel={formModal.close}
            loading={loading}
            allPermissions={allPermissions}
          />
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.close}
          size="md"
          title={t('admin.whitelist.messages.delete_title')}
        >
          <div className={styles['whitelist-management-page__delete-modal']}>
            <p>
              {t('admin.whitelist.messages.delete_confirm')} <strong>{deleteModal.selectedData?.email}</strong>?
            </p>
            {deleteModal.selectedData?.is_permanent && (
              <div className={styles['whitelist-management-page__permanent-warning']}>
                <AlertCircle size={16} />
                <span>{t('admin.whitelist.messages.permanent_warning')}</span>
              </div>
            )}
            <div className={styles['whitelist-management-page__delete-actions']}>
              <Button variant="ghost" onClick={deleteModal.close}>
                {t('admin.whitelist.form.cancel')}
              </Button>
              <Button
                variant="danger"
                onClick={handleConfirmDelete}
                disabled={deleteModal.selectedData?.is_permanent}
              >
                {t('admin.whitelist.actions.delete')}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AdminPageWrapper>
  )
}

export default WhitelistManagementPage
