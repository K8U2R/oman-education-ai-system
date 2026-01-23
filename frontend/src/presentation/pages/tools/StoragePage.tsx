import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Cloud } from 'lucide-react'
import { useStorage } from '@/application'
import { useConfirmDialog } from '@/application/shared/hooks'
import { loggingService } from '@/infrastructure/services'
import { ROUTES } from '@/domain/constants/routes.constants'
import { PageHeader, LoadingState, ErrorState, EmptyState } from '../components'
import { ConfirmDialog } from '@/presentation/components/common'
import { ProviderCard } from '../../components/storage'


const StoragePage: React.FC = () => {
  const navigate = useNavigate()
  const {
    providers,
    connections,
    isLoading,
    error,
    loadProviders,
    loadConnections,
    connectProvider,
    disconnectProvider,
    refreshConnection,
  } = useStorage()
  const [connecting, setConnecting] = useState<string | null>(null)

  useEffect(() => {
    loadProviders()
    loadConnections()
  }, [loadProviders, loadConnections])

  const loadData = async () => {
    await Promise.all([loadProviders(), loadConnections()])
  }

  const handleConnect = async (providerId: string) => {
    try {
      setConnecting(providerId)
      const response = await connectProvider(providerId)
      // Redirect to OAuth URL
      if (response?.auth_url) {
        window.location.href = response.auth_url
      }
    } catch (err) {
      loggingService.error('Failed to connect provider', err as Error)
      setConnecting(null)
    }
  }

  const disconnectConfirm = useConfirmDialog()

  const handleDisconnect = (connectionId: string) => {
    const connection = connections.find(conn => conn.id === connectionId)
    const provider = connection ? providers.find(p => p.id === connection.providerId) : null
    const providerName = provider?.display_name || 'مزود التخزين'
    disconnectConfirm.open({
      title: 'تأكيد قطع الاتصال',
      message: `هل أنت متأكد من قطع الاتصال مع "${providerName}"؟`,
      variant: 'warning',
      confirmText: 'قطع الاتصال',
      cancelText: 'إلغاء',
      onConfirm: async () => {
        try {
          await disconnectProvider(connectionId)
          await loadData()
          disconnectConfirm.close()
        } catch (err) {
          loggingService.error('Failed to disconnect', err as Error)
        }
      },
    })
  }

  const handleRefresh = async (connectionId: string) => {
    try {
      await refreshConnection(connectionId)
      await loadData()
    } catch (err) {
      loggingService.error('Failed to refresh connection', err as Error)
    }
  }

  const getConnectionForProvider = (providerId: string) => {
    return connections.find(conn => conn.providerId === providerId)
  }

  if (isLoading) {
    return <LoadingState fullScreen message="جارٍ تحميل مزودي التخزين..." />
  }

  if (error) {
    return <ErrorState title="فشل تحميل بيانات التخزين" message={error} onRetry={loadData} />
  }

  return (
    <div className="storage-page">
      <PageHeader
        title="التخزين السحابي"
        description="اتصل بخدمات التخزين السحابي لإدارة ملفاتك ومشاريعك"
        icon={<Cloud />}
      />

      {providers.length === 0 ? (
        <EmptyState
          icon={<Cloud />}
          title="لا توجد مزودي تخزين متاحين"
          description="سيتم إضافة مزودي تخزين جدد قريباً"
        />
      ) : (
        <div className="storage-page__grid">
          {providers.map(provider => {
            const connection = getConnectionForProvider(provider.id)
            // Convert StorageConnection to UserStorageConnection format
            const connectionData = connection ? connection.toData() : undefined

            return (
              <ProviderCard
                key={provider.id}
                provider={provider}
                connection={connectionData}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
                onRefresh={handleRefresh}
                onOpenBrowser={(connectionId: string) =>
                  navigate(`${ROUTES.STORAGE}/${connectionId}/browser`)
                }
                connecting={connecting === provider.id}
              />
            )
          })}
        </div>
      )}

      {/* Disconnect Confirm Dialog */}
      {disconnectConfirm.options && (
        <ConfirmDialog
          isOpen={disconnectConfirm.isOpen}
          onClose={disconnectConfirm.close}
          onConfirm={disconnectConfirm.options.onConfirm}
          title={disconnectConfirm.options.title}
          message={disconnectConfirm.options.message}
          variant={disconnectConfirm.options.variant || 'warning'}
          confirmText={disconnectConfirm.options.confirmText}
          cancelText={disconnectConfirm.options.cancelText}
        />
      )}
    </div>
  )
}

export default StoragePage
