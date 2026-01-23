/**
 * Whitelist Management Page - صفحة إدارة القائمة البيضاء
 *
 * صفحة شاملة لإدارة القائمة البيضاء للصلاحيات المتقدمة
 */

import React, { useEffect } from 'react'
import { Shield, Plus, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react'
import { PageHeader } from '../components'
import { Card, Button, Modal, Input } from '../../components/common'
import { WhitelistEntryTable, WhitelistEntryForm } from '../../components/whitelist'
import { useWhitelist } from '@/application/features/whitelist'
import { useModal, useSearchFilter } from '@/application/shared/hooks'
import { AdminPageWrapper } from '../../components/admin'
import { handleError } from '@/utils/errorHandler'
import type { WhitelistEntry, WhitelistEntryFormData } from '@/application/features/whitelist'
import { Permission } from '@/domain/types/auth.types'

const WhitelistManagementPage: React.FC = () => {
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
      { value: 'all', label: 'الكل' },
      {
        value: 'active',
        label: 'نشط',
        filterFn: entry => (entry as unknown as WhitelistEntry).is_active,
      },
      {
        value: 'inactive',
        label: 'غير نشط',
        filterFn: entry => !(entry as unknown as WhitelistEntry).is_active,
      },
      {
        value: 'expired',
        label: 'منتهي',
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
        message: 'خطأ في القائمة البيضاء',
        context: 'WhitelistManagementPage',
      })
    }
  }, [error])

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
        message: 'فشل حذف إدخال القائمة البيضاء',
        context: 'WhitelistManagementPage',
      })
    }
  }

  const handleActivate = async (entry: WhitelistEntry) => {
    try {
      await activateEntry(entry.id)
    } catch (error) {
      handleError(error, {
        message: 'فشل تفعيل إدخال القائمة البيضاء',
        context: 'WhitelistManagementPage',
      })
    }
  }

  const handleDeactivate = async (entry: WhitelistEntry) => {
    try {
      await deactivateEntry(entry.id)
    } catch (error) {
      handleError(error, {
        message: 'فشل تعطيل إدخال القائمة البيضاء',
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
        message: 'فشل حفظ إدخال القائمة البيضاء',
        context: 'WhitelistManagementPage',
      })
      throw error // Let form handle the error
    }
  }

  return (
    <AdminPageWrapper
      requiredPermissions={['whitelist.manage']}
      loadingMessage="جاري تحميل القائمة البيضاء..."
    >
      <div className="whitelist-management-page">
        <PageHeader
          title="إدارة القائمة البيضاء"
          description="إدارة  المتقدمة للمستخدمين المصرح لهم"
          icon={<Shield />}
        />

        {/* Toolbar */}
        <div className="whitelist-management-page__toolbar">
          <div className="whitelist-management-page__search">
            <Input
              placeholder="بحث في القائمة البيضاء..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="whitelist-management-page__search-input"
            />
          </div>

          <div className="whitelist-management-page__filters">
            <Button
              variant={filter === 'all' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              الكل
            </Button>
            <Button
              variant={filter === 'active' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('active')}
            >
              نشط
            </Button>
            <Button
              variant={filter === 'inactive' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('inactive')}
            >
              معطل
            </Button>
            <Button
              variant={filter === 'expired' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('expired')}
            >
              منتهي
            </Button>
          </div>

          <div className="whitelist-management-page__actions">
            <Button variant="ghost" size="sm" onClick={refresh} leftIcon={<RefreshCw />}>
              تحديث
            </Button>
            <Button variant="primary" onClick={handleCreate} leftIcon={<Plus />}>
              إضافة جديد
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Card className="whitelist-management-page__error-card">
            <div className="whitelist-management-page__error-content">
              <AlertCircle size={20} />
              <span>{error.message}</span>
              <Button variant="ghost" size="sm" onClick={clearError}>
                إخفاء
              </Button>
            </div>
          </Card>
        )}

        {/* Success Message */}
        {!error && entries.length > 0 && (
          <Card className="whitelist-management-page__info-card">
            <div className="whitelist-management-page__info-content">
              <CheckCircle2 size={20} />
              <span>تم تحميل {entries.length} إدخال بنجاح</span>
            </div>
          </Card>
        )}

        {/* Table */}
        <Card className="whitelist-management-page__table-card">
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
          title={formModal.selectedData ? 'تعديل إدخال القائمة البيضاء' : 'إضافة إدخال جديد'}
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
          title="تأكيد الحذف"
        >
          <div className="whitelist-management-page__delete-modal">
            <p>
              هل أنت متأكد من حذف الإدخال <strong>{deleteModal.selectedData?.email}</strong>؟
            </p>
            {deleteModal.selectedData?.is_permanent && (
              <div className="whitelist-management-page__permanent-warning">
                <AlertCircle size={16} />
                <span>هذا إدخال دائم ولا يمكن حذفه</span>
              </div>
            )}
            <div className="whitelist-management-page__delete-actions">
              <Button variant="ghost" onClick={deleteModal.close}>
                إلغاء
              </Button>
              <Button
                variant="danger"
                onClick={handleConfirmDelete}
                disabled={deleteModal.selectedData?.is_permanent}
              >
                حذف
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AdminPageWrapper>
  )
}

export default WhitelistManagementPage
