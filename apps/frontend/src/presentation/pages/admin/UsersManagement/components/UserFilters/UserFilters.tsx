import React from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/presentation/components/common'
import styles from '../../UsersManagement.module.scss'

interface UserFiltersProps {
    searchTerm: string
    onSearchChange: (value: string) => void
}

const UserFilters: React.FC<UserFiltersProps> = ({ searchTerm, onSearchChange }) => {
    return (
        <div className={styles['users-management-page__toolbar']}>
            <div className={styles['users-management-page__search']}>
                <Input
                    placeholder="بحث في المستخدمين..."
                    value={searchTerm}
                    onChange={e => onSearchChange(e.target.value)}
                    leftIcon={<Search />}
                />
            </div>
        </div>
    )
}

export default UserFilters
