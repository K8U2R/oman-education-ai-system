/**
 * Users Management Page - صفحة إدارة المستخدمين
 *
 * صفحة لإدارة المستخدمين و (للمسؤولين فقط)
 */

import React, { useState, useEffect } from 'react'
import { Users, Edit, Trash2, Search, Check, X } from 'lucide-react'
import {
  Card,
  Button,
  Input,
  Modal,
  DeleteConfirmModal,
  LoadingWrapper,
} from '../../components/common'
import { AdminPageWrapper } from '../../components/admin'
import { DataTable, DataTableColumn } from '../../components/data'
import { adminService } from '@/application'
import type { AdminUserInfo, UpdateUserRequest } from '@/application/types/admin.types'
import { useModal, useSearchFilter } from '@/application/shared/hooks'
import { useAuth } from '@/features/user-authentication-management'
import { handleError } from '@/utils/errorHandler'
import { Permission, ROLE_PERMISSIONS, UserRole } from '@/domain/types/auth.types'
import { PageHeader } from '../components'

const UsersManagementPage: React.FC = () => {
  const { user } = useAuth()

  const [users, setUsers] = useState<AdminUserInfo[]>([])
  const [loading, setLoading] = useState(true)

  const editModal = useModal<AdminUserInfo>()
  const deleteModal = useModal<AdminUserInfo>()

  const {
    searchTerm,
    setSearchTerm,
    filteredData: filteredUsers,
  } = useSearchFilter(users as unknown as Record<string, unknown>[], {
    searchFields: ['email', 'first_name', 'last_name', 'username'] as (keyof Record<
      string,
      unknown
    >)[],
  })

  const [editForm, setEditForm] = useState<UpdateUserRequest>({})
  const [allPermissions] = useState<Permission[]>([
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
  ])

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const result = await adminService.searchUsers({ per_page: 100 })
      setUsers(result.users)
    } catch (error) {
      handleError(error, {
        message: 'فشل تحميل المستخدمين',
        context: 'UsersManagementPage',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (user: AdminUserInfo) => {
    editModal.openWith(user)
    setEditForm({
      role: user.role,
      is_active: user.is_active,
      is_verified: user.is_verified,
      permissions: [], // سيتم تحميلها من قاعدة البيانات
    })
  }

  const handleSave = async () => {
    if (!editModal.selectedData) return

    try {
      await adminService.updateUser(editModal.selectedData.id, editForm)
      await loadUsers()
      editModal.close()
      setEditForm({})
    } catch (error) {
      handleError(error, {
        message: 'فشل تحديث المستخدم',
        context: 'UsersManagementPage',
      })
    }
  }

  const handleDelete = async () => {
    if (!deleteModal.selectedData) return

    const deletedUser = deleteModal.selectedData
    const previousUsers = [...users]

    // Optimistic update
    setUsers(users.filter(u => u.id !== deletedUser.id))
    deleteModal.close()

    try {
      await adminService.deleteUser(deletedUser.id)
      await loadUsers()
    } catch (error) {
      // Rollback
      setUsers(previousUsers)
      handleError(error, {
        message: 'فشل حذف المستخدم',
        context: 'UsersManagementPage',
      })
    }
  }

  const handleGrantAllPermissions = () => {
    setEditForm({
      ...editForm,
      permissions: allPermissions,
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
    <AdminPageWrapper requiredRole="admin" loadingMessage="جاري تحميل المستخدمين...">
      <div className="users-management-page">
        <PageHeader
          title="إدارة المستخدمين"
          description="إدارة المستخدمين و والأدوار"
          icon={<Users />}
        />

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

        <LoadingWrapper isLoading={loading} message="جاري تحميل المستخدمين...">
          <Card className="users-management-page__table-card">
            <DataTable
              data={
                filteredUsers as unknown as AdminUserInfo[] as unknown as Record<string, unknown>[]
              }
              columns={columns as unknown as DataTableColumn<Record<string, unknown>>[]}
              searchable={false}
              pagination
              pageSize={20}
              emptyMessage="لا يوجد مستخدمين"
            />
          </Card>
        </LoadingWrapper>

        {/* Edit Modal */}
        <Modal
          isOpen={editModal.isOpen}
          onClose={() => {
            editModal.close()
            setEditForm({})
          }}
          size="lg"
        >
          <div className="users-management-page__edit-modal">
            <h3 className="users-management-page__modal-title">
              تعديل المستخدم: {editModal.selectedData?.email}
            </h3>

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
                  {allPermissions.map(permission => {
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
    </AdminPageWrapper>
  )
}

export default UsersManagementPage
