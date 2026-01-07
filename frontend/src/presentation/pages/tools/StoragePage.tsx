import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Cloud } from 'lucide-react'
import { useStorage } from '@/application'
import { ROUTES } from '@/domain/constants/routes.constants'
import { PageHeader, LoadingState, ErrorState, EmptyState } from '../components'
import { ProviderCard } from '../../components/storage'
import './StoragePage.scss'

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
      console.error('Failed to connect provider:', err)
      setConnecting(null)
    }
  }

  const handleDisconnect = async (connectionId: string) => {
    if (!confirm('هل أنت متأكد من قطع الاتصال؟')) return

    try {
      await disconnectProvider(connectionId)
      await loadData()
    } catch (err) {
      console.error('Failed to disconnect:', err)
    }
  }

  const handleRefresh = async (connectionId: string) => {
    try {
      await refreshConnection(connectionId)
      await loadData()
    } catch (err) {
      console.error('Failed to refresh connection:', err)
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
    </div>
  )
}

export default StoragePage
