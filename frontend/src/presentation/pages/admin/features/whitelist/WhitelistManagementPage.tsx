/**
 * Whitelist Management Page - صفحة إدارة القائمة البيضاء
 *
 * صفحة شاملة لإدارة القائمة البيضاء للصلاحيات المتقدمة
 * تم نقلها إلى الهيكل الجديد مع استخدام Core Infrastructure
 */

import React from 'react'
import { Shield, Plus, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button, Modal, Input, Card } from '@/presentation/components/common'
import { WhitelistEntryTable, WhitelistEntryForm } from '@/presentation/components/whitelist'
import { AdminPageLayout } from '@/presentation/pages/admin/core/components'
import { AdminLoadingState, AdminErrorState } from '@/presentation/pages/admin/shared/components'
import { useWhitelistManagement } from './hooks'
import { useModal, useSearchFilter } from '@/application/shared/hooks'
import { getAllAdminPermissions } from '@/presentation/pages/admin/core/constants'
import type { WhitelistEntry, WhitelistEntryFormData } from './types'


const WhitelistManagementPage: React.FC = () => {
  const {
    canAccess,
    loading,
    error,
    entries,
    refresh,
    createEntry,
    updateEntry,
    deleteEntry,
    activateEntry,
    deactivateEntry,
    clearError,
  } = useWhitelistManagement()

  const formModal = useModal<WhitelistEntry>()
  const deleteModal = useModal<WhitelistEntry>()

  const { searchTerm, filter, setSearchTerm, setFilter, filteredData } = useSearchFilter(entries, {
    searchFields: ['email', 'permission_level'],
    filterOptions: [
      { value: 'all', label: 'الكل' },
      {
        value: 'active',
        label: 'نشط',
        filterFn: entry => (entry as WhitelistEntry).is_active,
      },
      {
        value: 'inactive',
        label: 'غير نشط',
        filterFn: entry => !(entry as WhitelistEntry).is_active,
      },
      {
        value: 'expired',
        label: 'منتهي',
        filterFn: entry => {
          const entryData = entry as WhitelistEntry
          return entryData.expires_at ? new Date(entryData.expires_at) < new Date() : false
        },
      },
    ],
  })

  // استخدام جميع  من Core Constants
  const permissionsList = getAllAdminPermissions()

  // حالة التحميل
  if (loading) {
    return <AdminLoadingState message="جاري تحميل القائمة البيضاء..." fullScreen />
  }

  // حالة الخطأ
  if (error) {
    const errorMessage =
      error instanceof Error ? error.message : typeof error === 'string' ? error : String(error)
    return <AdminErrorState title="حدث خطأ" message={errorMessage} onRetry={refresh} />
  }

  // عدم الوصول
  if (!canAccess) {
    return null
  }

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
    } catch (_err) {
      // Error handled by hook
    }
  }

  const handleActivate = async (entry: WhitelistEntry) => {
    try {
      await activateEntry(entry.id)
    } catch (_err) {
      // Error handled by hook
    }
  }

  const handleDeactivate = async (entry: WhitelistEntry) => {
    try {
      await deactivateEntry(entry.id)
    } catch (_err) {
      // Error handled by hook
    }
  }

  const handleFormSubmit = async (data: WhitelistEntryFormData) => {
    if (formModal.selectedData) {
      await updateEntry(formModal.selectedData.id, {
        permission_level: data.permission_level,
        permissions: data.permissions,
        expires_at: data.expires_at,
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
  }

  return (
    <AdminPageLayout
      title="إدارة القائمة البيضاء"
      description="إدارة  المتقدمة للمستخدمين المصرح لهم"
      icon={<Shield />}
      actions={
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="ghost" size="sm" onClick={refresh} leftIcon={<RefreshCw />}>
            تحديث
          </Button>
          <Button variant="primary" onClick={handleCreate} leftIcon={<Plus />}>
            إضافة جديد
          </Button>
        </div>
      }
    >
      <div className="whitelist-management-page">
        {/* Toolbar */}
        <div className="whitelist-management-page__toolbar">
          <div className="whitelist-management-page__search">
            <Input
              placeholder="بحث في القائمة البيضاء..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
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
        </div>

        {/* Error Alert */}
        {error && (
          <Card className="whitelist-management-page__error-card">
            <div className="whitelist-management-page__error-content">
              <AlertCircle size={20} />
              <span>
                {error !== null && typeof error === 'object' && 'message' in error
                  ? String((error as { message: string }).message)
                  : typeof error === 'string'
                    ? error
                    : String(error)}
              </span>
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
            allPermissions={permissionsList}
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
    </AdminPageLayout>
  )
}

export default WhitelistManagementPage
