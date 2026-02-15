import React, { useMemo } from 'react'
import { Edit, Trash2, Check, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button, Card } from '@/presentation/components/common'
import { DataTable, DataTableColumn } from '@/presentation/components/data'
import { useAuth } from '@/features/user-authentication-management'
import type { AdminUserInfo } from '@/application/types/admin.types'
import styles from '../../UsersManagement.module.scss'

interface UserTableProps {
    users: Record<string, unknown>[]
    isLoading: boolean
    onEdit: (user: AdminUserInfo) => void
    onDelete: (user: AdminUserInfo) => void
}

const UserTable: React.FC<UserTableProps> = ({ users, isLoading, onEdit, onDelete }) => {
    const { t: translate } = useTranslation()
    const { user } = useAuth()

    const columns = useMemo<DataTableColumn<AdminUserInfo>[]>(() => [
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
                <div className={styles['users-management-page__status']}>
                    {row.is_active ? (
                        <span className={`${styles['users-management-page__status-badge']} ${styles['users-management-page__status-badge--active']}`}>
                            <Check size={12} />
                            {translate('active')}
                        </span>
                    ) : (
                        <span className={`${styles['users-management-page__status-badge']} ${styles['users-management-page__status-badge--inactive']}`}>
                            <X size={12} />
                            {translate('inactive')}
                        </span>
                    )}
                    {!row.is_verified && (
                        <span className={`${styles['users-management-page__status-badge']} ${styles['users-management-page__status-badge--unverified']}`}>
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
                <div className={styles['users-management-page__actions']}>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(row)}
                        leftIcon={<Edit size={16} />}
                        title={translate('edit')}
                    />
                    {row.id !== user?.id && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className={styles['users-management-page__action-delete']}
                            onClick={() => onDelete(row)}
                            leftIcon={<Trash2 size={16} />}
                            title={translate('delete')}
                        />
                    )}
                </div>
            ),
        },
    ], [translate, user])

    return (
        <Card className={styles['users-management-page__table-card']}>
            <DataTable
                data={users}
                columns={columns as unknown as DataTableColumn<Record<string, unknown>>[]}
                searchable={false}
                pagination
                pageSize={20}
                loading={isLoading} // Optimized: DataTable likely supports loading prop
                emptyMessage="لا يوجد مستخدمين"
            />
        </Card>
    )
}

export default UserTable
