import React from 'react'
import { Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { AdminPageWrapper } from '@/presentation/features/system-administration-portal/components/AdminPageWrapper/AdminPageWrapper'
import { DeleteConfirmModal, LoadingWrapper } from '@/presentation/components/common'
import { PageHeader } from '@/presentation/components/common'
import { useUsersManagement } from './core/UsersManagement.hooks'
import UserFilters from './components/UserFilters/UserFilters'
import UserTable from './components/UserTable/UserTable'
import UserEditModal from './components/UserEditModal/UserEditModal'
import styles from './UsersManagement.module.scss'

/**
 * UsersManagementPage - صفحة إدارة المستخدمين
 *
 * Sovereign container component following Rule 13 (Functional Decomposition).
 * Logic is handled by useUsersManagement hook (Rule 2).
 */
const UsersManagementPage: React.FC = () => {
  const { t: translate } = useTranslation()
  const {
    users,
    loading,
    searchTerm,
    setSearchTerm,
    editModal,
    deleteModal,
    editForm,
    setEditForm,
    allPermissions,
    handleEdit,
    handleSave,
    handleDelete,
  } = useUsersManagement()

  return (
    <AdminPageWrapper requiredRole="admin" loadingMessage={translate('loading')}>
      <div className={styles['users-management-page']}>
        <PageHeader
          title={translate('admin.users.title')}
          description={translate('admin.users.description')}
          icon={<Users />}
          className={styles['users-management-page__header']}
        />

        <UserFilters searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        <LoadingWrapper isLoading={loading} message="جاري تحميل المستخدمين...">
          <UserTable
            users={users}
            isLoading={loading}
            onEdit={handleEdit}
            onDelete={(user) => deleteModal.openWith(user)}
          />
        </LoadingWrapper>

        <UserEditModal
          isOpen={editModal.isOpen}
          onClose={editModal.close}
          onSave={handleSave}
          user={editModal.selectedData}
          form={editForm}
          setForm={setEditForm}
          allPermissions={allPermissions}
        />

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
