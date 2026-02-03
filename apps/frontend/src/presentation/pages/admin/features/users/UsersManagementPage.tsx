/**
 * Users Management Page - صفحة إدارة المستخدمين
 *
 * صفحة لإدارة المستخدمين و (للمسؤولين فقط)
 * تم نقلها إلى الهيكل الجديد مع استخدام Core Infrastructure
 */

import React, { useState } from 'react'
import { Users, Edit, Trash2, Search, Check, X } from 'lucide-react'
import { Button, Input, Modal, DeleteConfirmModal } from '@/presentation/components/common'
import { DataTableColumn } from '@/presentation/components/data'
import { AdminPageLayout, AdminDataTable } from '@/presentation/pages/admin/core/components'
import { AdminLoadingState, AdminErrorState } from '@/presentation/pages/admin/shared/components'
import { useUsersManagement } from './hooks'
import { useModal, useSearchFilter } from '@/application/shared/hooks'
import { useAuth } from '@/features/user-authentication-management'
import { Permission, ROLE_PERMISSIONS, UserRole } from '@/domain/types/auth.types'
import type { AdminUserInfo, UpdateUserRequest } from './types'


const UsersManagementPage: React.FC = () => {
  const { user } = useAuth()
  const { canAccess, loading, error, users, allPermissions, refresh, updateUser, deleteUser } =
    useUsersManagement()

  const editModal = useModal<AdminUserInfo>()
  const deleteModal = useModal<AdminUserInfo>()

  const {
    searchTerm,
    setSearchTerm,
    filteredData: filteredUsers,
  } = useSearchFilter(users, {
    searchFields: ['email', 'first_name', 'last_name', 'username'],
  })

  const [editForm, setEditForm] = useState<UpdateUserRequest>({})

  // حالة التحميل
  if (loading) {
    return <AdminLoadingState message="جاري تحميل المستخدمين..." fullScreen />
  }

  // حالة الخطأ
  if (error) {
    return <AdminErrorState title="حدث خطأ" message={error} onRetry={refresh} />
  }

  // عدم الوصول
  if (!canAccess) {
    return null
  }

  const handleEdit = (user: AdminUserInfo) => {
    editModal.openWith(user)
    setEditForm({
      role: user.role as UserRole,
      is_active: user.is_active,
      is_verified: user.is_verified,
      permissions: [],
    })
  }

  const handleSave = async () => {
    if (!editModal.selectedData) return

    try {
      await updateUser(editModal.selectedData.id, editForm)
      editModal.close()
      setEditForm({})
    } catch (_err) {
      // Error handled by hook
    }
  }

  const handleDelete = async () => {
    if (!deleteModal.selectedData) return

    try {
      await deleteUser(deleteModal.selectedData.id)
      deleteModal.close()
    } catch (_err) {
      // Error handled by hook
    }
  }

  const handleGrantAllPermissions = () => {
    setEditForm({
      ...editForm,
      permissions: allPermissions as Permission[],
    })
  }

  const handleTogglePermission = (permission: Permission) => {
    const currentPermissions = editForm.permissions || []
    const newPermissions = currentPermissions.includes(permission)
      ? currentPermissions.filter(p => p !== permission)
      : [...currentPermissions, permission]

    setEditForm({
      ...editForm,
      permissions: newPermissions,
    })
  }

  const columns: DataTableColumn<AdminUserInfo>[] = [
    {
      key: 'email',
      label: 'البريد الإلكتروني',
      sortable: true,
    },
    {
      key: 'first_name',
      label: 'الاسم',
      render: (_value, row) => (
        <div>
          {row.first_name && row.last_name
            ? `${row.first_name} ${row.last_name}`
            : row.first_name || row.username || '-'}
        </div>
      ),
    },
    {
      key: 'role',
      label: 'الدور',
      render: (value): React.ReactNode => {
        const roleLabels: Record<string, string> = {
          student: 'طالب',
          teacher: 'معلم',
          admin: 'مسؤول',
          developer: 'مطور',
          parent: 'ولي أمر',
          moderator: 'مشرف',
        }
        return roleLabels[value as string] || (value as string)
      },
    },
    {
      key: 'is_active',
      label: 'الحالة',
      render: (_value, row) => (
        <div className="users-management-page__status">
          {row.is_active ? (
            <span className="users-management-page__status-badge users-management-page__status-badge--active">
              <Check className="w-4 h-4" />
              نشط
            </span>
          ) : (
            <span className="users-management-page__status-badge users-management-page__status-badge--inactive">
              <X className="w-4 h-4" />
              غير نشط
            </span>
          )}
          {!row.is_verified && (
            <span className="users-management-page__status-badge users-management-page__status-badge--unverified">
              غير موثق
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'الإجراءات',
      render: (_, row) => (
        <div className="users-management-page__actions">
          <Button variant="ghost" size="sm" onClick={() => handleEdit(row)} leftIcon={<Edit />}>
            تعديل
          </Button>
          {row.id !== user?.id && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteModal.openWith(row)}
              leftIcon={<Trash2 />}
            >
              حذف
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <AdminPageLayout
      title="إدارة المستخدمين"
      description="إدارة المستخدمين و والأدوار"
      icon={<Users />}
      actions={
        <Button onClick={refresh} variant="outline" leftIcon={<Search />}>
          تحديث
        </Button>
      }
    >
      <div className="users-management-page">
        <div className="users-management-page__toolbar">
          <div className="users-management-page__search">
            <Input
              placeholder="بحث في المستخدمين..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              leftIcon={<Search />}
            />
          </div>
        </div>

        <AdminDataTable
          data={filteredUsers as AdminUserInfo[]}
          columns={columns}
          searchable={false}
          pagination
          pageSize={20}
        />

        {/* Edit Modal */}
        <Modal
          isOpen={editModal.isOpen}
          onClose={() => {
            editModal.close()
            setEditForm({})
          }}
          size="lg"
          title={`تعديل المستخدم: ${editModal.selectedData?.email}`}
        >
          <div className="users-management-page__edit-modal">
            <div className="users-management-page__form">
              <div className="users-management-page__form-group">
                <label>الدور</label>
                <select
                  value={editForm.role || 'student'}
                  onChange={e => setEditForm({ ...editForm, role: e.target.value as UserRole })}
                  className="users-management-page__select"
                >
                  <option value="student">طالب</option>
                  <option value="teacher">معلم</option>
                  <option value="admin">مسؤول</option>
                  <option value="developer">مطور</option>
                  <option value="parent">ولي أمر</option>
                  <option value="moderator">مشرف</option>
                </select>
              </div>

              <div className="users-management-page__form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={editForm.is_active ?? true}
                    onChange={e => setEditForm({ ...editForm, is_active: e.target.checked })}
                  />
                  نشط
                </label>
              </div>

              <div className="users-management-page__form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={editForm.is_verified ?? false}
                    onChange={e => setEditForm({ ...editForm, is_verified: e.target.checked })}
                  />
                  موثق
                </label>
              </div>

              <div className="users-management-page__form-group">
                <div className="users-management-page__permissions-header">
                  <label></label>
                  <Button variant="outline" size="sm" onClick={handleGrantAllPermissions}>
                    منح جميع
                  </Button>
                </div>
                <div className="users-management-page__permissions-grid">
                  {(allPermissions as Permission[]).map(permission => {
                    const isChecked = editForm.permissions?.includes(permission) || false
                    const rolePermissions = editForm.role
                      ? ROLE_PERMISSIONS[editForm.role as UserRole] || []
                      : []
                    const hasRolePermission = rolePermissions.includes(permission)

                    return (
                      <label
                        key={permission}
                        className={`users-management-page__permission-item ${hasRolePermission
                            ? 'users-management-page__permission-item--from-role'
                            : ''
                          }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleTogglePermission(permission)}
                        />
                        <span>{permission}</span>
                        {hasRolePermission && (
                          <span className="users-management-page__permission-badge">من الدور</span>
                        )}
                      </label>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="users-management-page__modal-actions">
              <Button
                variant="secondary"
                onClick={() => {
                  editModal.close()
                  setEditForm({})
                }}
              >
                إلغاء
              </Button>
              <Button variant="primary" onClick={handleSave}>
                حفظ
              </Button>
            </div>
          </div>
        </Modal>

        {/* Delete Confirm Dialog */}
        <DeleteConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={deleteModal.close}
          onConfirm={handleDelete}
          itemTitle={deleteModal.selectedData?.email || ''}
          itemType="مستخدم"
        />
      </div>
    </AdminPageLayout>
  )
}

export default UsersManagementPage
