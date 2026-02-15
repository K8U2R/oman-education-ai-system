import { useState, useEffect } from 'react'
import { adminService } from '@/application'
import type { AdminUserInfo, UpdateUserRequest } from '@/application/types/admin.types'
import { useModal, useSearchFilter } from '@/application/shared/hooks'
import { handleError } from '@/utils/errorHandler'
import { Permission } from '@/domain/types/auth.types'

export const useUsersManagement = () => {
    const [users, setUsers] = useState<AdminUserInfo[]>([])
    const [loading, setLoading] = useState(true)
    const [editForm, setEditForm] = useState<UpdateUserRequest>({})

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

    // Should ideally come from a constants file or API
    const allPermissions: Permission[] = [
        'users.view', 'users.create', 'users.update', 'users.delete', 'users.manage',
        'lessons.view', 'lessons.create', 'lessons.update', 'lessons.delete', 'lessons.manage',
        'storage.view', 'storage.upload', 'storage.delete', 'storage.manage',
        'notifications.view', 'notifications.create', 'notifications.manage',
        'system.view', 'system.manage', 'system.settings',
        'admin.dashboard', 'admin.users', 'admin.settings', 'admin.reports',
    ]

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

    useEffect(() => {
        loadUsers()
    }, [])

    const handleEdit = (user: AdminUserInfo) => {
        editModal.openWith(user)
        setEditForm({
            role: user.role,
            is_active: user.is_active,
            is_verified: user.is_verified,
            permissions: [], // Should ideally load current permissions
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

        setUsers(users.filter(u => u.id !== deletedUser.id))
        deleteModal.close()

        try {
            await adminService.deleteUser(deletedUser.id)
            await loadUsers()
        } catch (error) {
            setUsers(previousUsers)
            handleError(error, {
                message: 'فشل حذف المستخدم',
                context: 'UsersManagementPage',
            })
        }
    }

    return {
        users: filteredUsers as unknown as Record<string, unknown>[],
        loading,
        searchTerm,
        setSearchTerm,
        editModal,
        deleteModal,
        editForm,
        setEditForm,
        allPermissions,
        loadUsers,
        handleEdit,
        handleSave,
        handleDelete,
    }
}
