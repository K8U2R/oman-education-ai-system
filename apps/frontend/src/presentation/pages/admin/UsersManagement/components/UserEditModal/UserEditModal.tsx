import React from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, Button } from '@/presentation/components/common'
import type { AdminUserInfo, UpdateUserRequest } from '@/application/types/admin.types'
import { Permission, ROLE_PERMISSIONS, UserRole } from '@/domain/types/auth.types'
import styles from '../../UsersManagement.module.scss'

interface UserEditModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: () => void
    user: AdminUserInfo | null
    form: UpdateUserRequest
    setForm: (form: UpdateUserRequest) => void
    allPermissions: Permission[]
}

const UserEditModal: React.FC<UserEditModalProps> = ({
    isOpen,
    onClose,
    onSave,
    user,
    form,
    setForm,
    allPermissions,
}) => {
    const { t: translate } = useTranslation()

    if (!user) return null

    const handleGrantAllPermissions = () => {
        setForm({
            ...form,
            permissions: allPermissions,
        })
    }

    const handleTogglePermission = (permission: Permission) => {
        const currentPermissions = form.permissions || []
        const newPermissions = currentPermissions.includes(permission)
            ? currentPermissions.filter(p => p !== permission)
            : [...currentPermissions, permission]

        setForm({
            ...form,
            permissions: newPermissions,
        })
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <div className={styles['users-management-page__edit-modal']}>
                <h3 className={styles['users-management-page__modal-title']}>
                    تعديل المستخدم: {user.email}
                </h3>

                <div className={styles['users-management-page__form']}>
                    <div className={styles['users-management-page__form-group']}>
                        <label>الدور</label>
                        <select
                            value={form.role || 'student'}
                            onChange={e => setForm({ ...form, role: e.target.value as UserRole })}
                            className={styles['users-management-page__select']}
                        >
                            <option value="student">طالب</option>
                            <option value="teacher">معلم</option>
                            <option value="admin">مسؤول</option>
                            <option value="developer">مطور</option>
                            <option value="parent">ولي أمر</option>
                            <option value="moderator">مشرف</option>
                        </select>
                    </div>

                    <div className={styles['users-management-page__form-group']}>
                        <label>
                            <input
                                type="checkbox"
                                checked={form.is_active ?? true}
                                onChange={e => setForm({ ...form, is_active: e.target.checked })}
                            />
                            نشط
                        </label>
                    </div>

                    <div className={styles['users-management-page__form-group']}>
                        <label>
                            <input
                                type="checkbox"
                                checked={form.is_verified ?? false}
                                onChange={e => setForm({ ...form, is_verified: e.target.checked })}
                            />
                            موثق
                        </label>
                    </div>

                    <div className={styles['users-management-page__form-group']}>
                        <div className={styles['users-management-page__permissions-header']}>
                            <label></label>
                            <Button variant="outline" size="sm" onClick={handleGrantAllPermissions}>
                                منح جميع
                            </Button>
                        </div>
                        <div className={styles['users-management-page__permissions-grid']}>
                            {allPermissions.map(permission => {
                                const isChecked = form.permissions?.includes(permission) || false
                                const rolePermissions = form.role
                                    ? ROLE_PERMISSIONS[form.role as UserRole] || []
                                    : []
                                const hasRolePermission = rolePermissions.includes(permission)

                                return (
                                    <label
                                        key={permission}
                                        className={`${styles['users-management-page__permission-item']} ${hasRolePermission
                                            ? styles['users-management-page__permission-item--from-role']
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
                                            <span className={styles['users-management-page__permission-badge']}>من الدور</span>
                                        )}
                                    </label>
                                )
                            })}
                        </div>
                    </div>
                </div>

                <div className={styles['users-management-page__modal-actions']}>
                    <Button variant="secondary" onClick={onClose}>
                        إلغاء
                    </Button>
                    <Button variant="primary" onClick={onSave}>
                        حفظ
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default UserEditModal
