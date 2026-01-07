/**
 * Route Protection Page - صفحة حماية المسارات
 *
 * صفحة لإدارة قواعد حماية المسارات (للمسؤولين والمطورين فقط)
 */

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Globe, Plus, Edit, Trash2, Shield, RefreshCw, CheckCircle, XCircle } from 'lucide-react'
import { Button, Badge, Modal } from '../../../components/common'
import { DataTable, DataTableColumn } from '../../../components/data'
import { securityService } from '@/application/features/security/services'
import { useAuth, useRole } from '@/application'
import { ROUTES } from '@/domain/constants/routes.constants'
import { PageHeader, LoadingState } from '../../components'
import type { RouteProtectionRule } from '@/application/features/security/types'
import './RouteProtectionPage.scss'

const RouteProtectionPage: React.FC = () => {
  const navigate = useNavigate()
  const { user, isLoading: authLoading, isAuthenticated } = useAuth()
  const { isAdmin, isDeveloper } = useRole()
  const [rules, setRules] = useState<RouteProtectionRule[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedRule, setSelectedRule] = useState<RouteProtectionRule | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate(ROUTES.LOGIN)
    } else if (!authLoading && !isAdmin && !isDeveloper) {
      navigate(ROUTES.FORBIDDEN)
    }
  }, [authLoading, isAuthenticated, isAdmin, isDeveloper, navigate])

  useEffect(() => {
    if (isAdmin || isDeveloper) {
      loadRules()
    }
  }, [isAdmin, isDeveloper])

  const loadRules = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await securityService.getRouteProtectionRules()
      setRules(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'فشل في تحميل القواعد'
      setError(errorMessage)
      console.error('Failed to load route protection rules:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await securityService.deleteRouteProtectionRule(id)
      setShowDeleteModal(false)
      setSelectedRule(null)
      await loadRules()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'فشل في حذف القاعدة'
      setError(errorMessage)
      console.error('Failed to delete rule:', err)
    }
  }

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('ar-OM', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const columns: DataTableColumn<RouteProtectionRule>[] = [
    {
      key: 'route',
      label: 'المسار',
      render: (_value, rule) => (
        <div className="route-protection-page__route">
          <code className="route-protection-page__route-path">{rule.route}</code>
          {rule.method && (
            <Badge variant="default" size="sm" className="route-protection-page__route-method">
              {rule.method}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'auth',
      label: 'المصادقة',
      render: (_value, rule) => (
        <div className="route-protection-page__auth">
          {rule.requiresAuth ? (
            <Badge variant="success" size="sm">
              <CheckCircle className="route-protection-page__icon" />
              مطلوبة
            </Badge>
          ) : (
            <Badge variant="default" size="sm">
              <XCircle className="route-protection-page__icon" />
              غير مطلوبة
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'roles',
      label: 'الأدوار المطلوبة',
      render: (_value, rule) => (
        <div className="route-protection-page__roles">
          {rule.requiredRoles && rule.requiredRoles.length > 0 ? (
            <div className="route-protection-page__roles-list">
              {rule.requiredRoles.map(role => (
                <Badge key={role} variant="info" size="xs">
                  {role}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="route-protection-page__empty">-</span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'الحالة',
      render: (_value, rule) => (
        <Badge variant={rule.isActive ? 'success' : 'default'} size="sm">
          {rule.isActive ? 'نشط' : 'معطل'}
        </Badge>
      ),
    },
    {
      key: 'updated',
      label: 'آخر تحديث',
      render: (_value, rule) => (
        <div className="route-protection-page__date">{formatDate(rule.updatedAt)}</div>
      ),
    },
    {
      key: 'actions',
      label: 'إجراءات',
      render: (_value, rule) => (
        <div className="route-protection-page__actions">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedRule(rule)
              setShowEditModal(true)
            }}
            leftIcon={<Edit />}
          >
            تعديل
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedRule(rule)
              setShowDeleteModal(true)
            }}
            leftIcon={<Trash2 />}
            className="route-protection-page__delete-btn"
          >
            حذف
          </Button>
        </div>
      ),
    },
  ]

  if (authLoading || loading) {
    return <LoadingState fullScreen message="جاري تحميل قواعد حماية المسارات..." />
  }

  if (!user || (!isAdmin && !isDeveloper)) {
    return null
  }

  return (
    <div className="route-protection-page">
      <PageHeader
        title="حماية المسارات"
        description="إدارة قواعد حماية المسارات والصلاحيات"
        icon={<Globe className="route-protection-page__header-icon" />}
        actions={
          <div className="route-protection-page__header-actions">
            <Button
              variant="outline"
              size="sm"
              onClick={loadRules}
              leftIcon={<RefreshCw />}
              disabled={loading}
            >
              تحديث
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setSelectedRule(null)
                setShowEditModal(true)
              }}
              leftIcon={<Plus />}
            >
              إضافة قاعدة
            </Button>
          </div>
        }
      />

      {error && (
        <div className="route-protection-page__error">
          <Shield className="route-protection-page__error-icon" />
          <span>{error}</span>
        </div>
      )}

      {/* Rules Table */}
      <DataTable
        data={rules as unknown as Record<string, unknown>[]}
        columns={columns as unknown as DataTableColumn<Record<string, unknown>>[]}
        searchable={true}
        pagination={true}
        pageSize={20}
        emptyMessage="لا توجد قواعد حماية"
        className="route-protection-page__table"
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false)
          setSelectedRule(null)
        }}
        title="حذف قاعدة الحماية"
      >
        <div className="route-protection-page__modal-content">
          <p>هل أنت متأكد من حذف قاعدة الحماية هذه؟</p>
          {selectedRule && (
            <div className="route-protection-page__modal-rule">
              <code>{selectedRule.route}</code>
            </div>
          )}
          <p className="route-protection-page__modal-warning">لا يمكن التراجع عن هذا الإجراء.</p>
          <div className="route-protection-page__modal-actions">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteModal(false)
                setSelectedRule(null)
              }}
            >
              إلغاء
            </Button>
            <Button variant="danger" onClick={() => selectedRule && handleDelete(selectedRule.id)}>
              حذف
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit/Create Modal */}
      {showEditModal && (
        <Modal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setSelectedRule(null)
          }}
          title={selectedRule ? 'تعديل قاعدة الحماية' : 'إضافة قاعدة حماية جديدة'}
          size="lg"
        >
          <div className="route-protection-page__modal-content">
            <p className="route-protection-page__modal-note">
              {selectedRule ? 'تعديل قاعدة الحماية الحالية' : 'إنشاء قاعدة حماية جديدة للمسار'}
            </p>
            {/* TODO: إضافة Form لتعديل/إنشاء القاعدة */}
            <div className="route-protection-page__modal-actions">
              <Button
                variant="outline"
                onClick={() => {
                  setShowEditModal(false)
                  setSelectedRule(null)
                }}
              >
                إلغاء
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  // TODO: Handle save
                  setShowEditModal(false)
                  setSelectedRule(null)
                }}
              >
                حفظ
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default RouteProtectionPage
