/**
 * useStorage Hook - Hook للتخزين السحابي
 *
 * Custom Hook لإدارة التخزين السحابي
 */

import { useState, useEffect, useCallback } from 'react'
import { storageIntegrationService } from '../api/storage-integration.service'
import { StorageConnection } from '@/domain/entities/StorageConnection'
import type { StorageProvider, UserStorageConnection } from '@/domain/types/storage.types'

interface UseStorageReturn {
  providers: StorageProvider[]
  connections: StorageConnection[]
  isLoading: boolean
  error: string | null
  loadProviders: () => Promise<void>
  loadConnections: () => Promise<void>
  connectProvider: (providerId: string) => Promise<{ auth_url: string }>
  disconnectProvider: (connectionId: string) => Promise<void>
  refreshConnection: (connectionId: string) => Promise<void>
}

export const useStorage = (): UseStorageReturn => {
  const [providers, setProviders] = useState<StorageProvider[]>([])
  const [connections, setConnections] = useState<StorageConnection[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  /**
   * تحميل مقدمي الخدمة
   */
  const loadProviders = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const providersData = await storageIntegrationService.getProviders()
      setProviders(providersData)
    } catch (err) {
      console.error('Failed to load providers:', err)
      setError('فشل تحميل مقدمي الخدمة')
      setProviders([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * تحميل الاتصالات
   */
  const loadConnections = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const connectionsData = await storageIntegrationService.getUserConnections()
      const connectionEntities = connectionsData.map((conn: UserStorageConnection) =>
        StorageConnection.fromData(conn)
      )
      setConnections(connectionEntities)
    } catch (err) {
      console.error('Failed to load connections:', err)
      setError('فشل تحميل الاتصالات')
      setConnections([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * الاتصال بمقدم خدمة
   */
  const connectProvider = useCallback(
    async (providerId: string) => {
      try {
        setIsLoading(true)
        setError(null)
        const result = await storageIntegrationService.connectProvider(providerId)
        await loadConnections() // تحديث الاتصالات بعد الاتصال
        return result
      } catch (err) {
        console.error('Failed to connect provider:', err)
        setError('فشل الاتصال بمقدم الخدمة')
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [loadConnections]
  )

  /**
   * قطع الاتصال بمقدم خدمة
   */
  const disconnectProvider = useCallback(
    async (connectionId: string) => {
      try {
        setIsLoading(true)
        setError(null)
        await storageIntegrationService.disconnectProvider(connectionId)
        await loadConnections() // تحديث الاتصالات بعد قطع الاتصال
      } catch (err) {
        console.error('Failed to disconnect provider:', err)
        setError('فشل قطع الاتصال')
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [loadConnections]
  )

  /**
   * تحديث الاتصال
   */
  const refreshConnection = useCallback(
    async (connectionId: string) => {
      try {
        setIsLoading(true)
        setError(null)
        await storageIntegrationService.refreshConnection(connectionId)
        await loadConnections() // تحديث الاتصالات بعد التحديث
      } catch (err) {
        console.error('Failed to refresh connection:', err)
        setError('فشل تحديث الاتصال')
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [loadConnections]
  )

  /**
   * تحميل البيانات عند التحميل الأولي
   */
  useEffect(() => {
    loadProviders()
    loadConnections()
  }, [loadProviders, loadConnections])

  return {
    providers,
    connections,
    isLoading,
    error,
    loadProviders,
    loadConnections,
    connectProvider,
    disconnectProvider,
    refreshConnection,
  }
}
