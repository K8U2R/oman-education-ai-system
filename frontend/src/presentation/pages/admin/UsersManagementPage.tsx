/**
 * Users Management Page - صفحة إدارة المستخدمين
 *
 * صفحة لإدارة المستخدمين والصلاحيات (للمسؤولين فقط)
 */

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Edit, Trash2, Search, Check, X } from 'lucide-react'
import { Card, Button, Input, Modal } from '../../components/common'
import { DataTable, DataTableColumn } from '../../components/data'
import { adminService, AdminUserInfo, UpdateUserRequest } from '@/application'
import { useAuth, useRole } from '@/application'
import { Permission, ROLE_PERMISSIONS, UserRole } from '@/domain/types/auth.types'
import { PageHeader, LoadingState } from '../components'
import './UsersManagementPage.scss'

const UsersManagementPage: React.FC = () => {
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const { isAdmin } = useRole()
  const [users, setUsers] = useState<AdminUserInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<AdminUserInfo | null>(null)
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
    if (!isAdmin) {
      navigate('/forbidden')
      return
    }
    loadUsers()
  }, [isAdmin, navigate])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const result = await adminService.searchUsers({ per_page: 100 })
      setUsers(result.users)
    } catch (error) {
      console.error('Failed to load users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (user: AdminUserInfo) => {
    setSelectedUser(user)
    setEditForm({
      role: user.role,
      is_active: user.is_active,
      is_verified: user.is_verified,
      permissions: [], // سيتم تحميلها من قاعدة البيانات
    })
    setEditModalOpen(true)
  }

  const handleSave = async () => {
    if (!selectedUser) return

    try {
      await adminService.updateUser(selectedUser.id, editForm)
      await loadUsers()
      setEditModalOpen(false)
      setSelectedUser(null)
      setEditForm({})
    } catch (error) {
      console.error('Failed to update user:', error)
      alert('فشل تحديث المستخدم')
    }
  }

  const handleDelete = async () => {
    if (!selectedUser) return

    try {
      await adminService.deleteUser(selectedUser.id)
      await loadUsers()
      setDeleteModalOpen(false)
      setSelectedUser(null)
    } catch (error) {
      console.error('Failed to delete user:', error)
      alert('فشل حذف المستخدم')
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

  const filteredUsers = users.filter(u => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      u.email.toLowerCase().includes(query) ||
      u.first_name?.toLowerCase().includes(query) ||
      u.last_name?.toLowerCase().includes(query) ||
      u.username?.toLowerCase().includes(query)
    )
  })

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
          {row.id !== currentUser?.id && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedUser(row)
                setDeleteModalOpen(true)
              }}
              leftIcon={<Trash2 />}
            >
              حذف
            </Button>
          )}
        </div>
      ),
    },
  ]

  if (loading) {
    return <LoadingState fullScreen message="جاري تحميل المستخدمين..." />
  }

  return (
    <div className="users-management-page">
      <PageHeader
        title="إدارة المستخدمين"
        description="إدارة المستخدمين والصلاحيات والأدوار"
        icon={<Users />}
      />

      <div className="users-management-page__toolbar">
        <div className="users-management-page__search">
          <Input
            placeholder="بحث في المستخدمين..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            leftIcon={<Search />}
          />
        </div>
      </div>

      <Card className="users-management-page__table-card">
        <DataTable
          data={filteredUsers as unknown as Record<string, unknown>[]}
          columns={columns as unknown as DataTableColumn<Record<string, unknown>>[]}
          searchable={false}
          pagination
          pageSize={20}
          emptyMessage="لا يوجد مستخدمين"
        />
      </Card>

      {/* Edit Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false)
          setSelectedUser(null)
          setEditForm({})
        }}
        size="lg"
      >
        <div className="users-management-page__edit-modal">
          <h3 className="users-management-page__modal-title">
            تعديل المستخدم: {selectedUser?.email}
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
                <label>الصلاحيات</label>
                <Button variant="outline" size="sm" onClick={handleGrantAllPermissions}>
                  منح جميع الصلاحيات
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
                      className={`users-management-page__permission-item ${
                        hasRolePermission ? 'users-management-page__permission-item--from-role' : ''
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
                setEditModalOpen(false)
                setSelectedUser(null)
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

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setSelectedUser(null)
        }}
        size="sm"
      >
        <div className="users-management-page__delete-modal">
          <h3>تأكيد الحذف</h3>
          <p>هل أنت متأكد من حذف المستخدم "{selectedUser?.email}"؟</p>
          <p className="users-management-page__delete-warning">لا يمكن التراجع عن هذا الإجراء.</p>
          <div className="users-management-page__delete-actions">
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              إلغاء
            </Button>
            <Button variant="primary" onClick={handleDelete}>
              حذف
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default UsersManagementPage
