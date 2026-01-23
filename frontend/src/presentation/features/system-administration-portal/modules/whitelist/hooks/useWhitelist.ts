/**
 * useWhitelist Hook - Hook لإدارة القائمة البيضاء
 *
 * Hook شامل لجميع عمليات CRUD للقائمة البيضاء
 * يستخدم Shared Hooks لتقليل التكرار
 */

import { useCallback } from 'react'
import { whitelistService } from '../services'
import { useAsyncOperation } from '@/application/shared/hooks'
import type {
  WhitelistEntry,
  CreateWhitelistEntryRequest,
  UpdateWhitelistEntryRequest,
  WhitelistListQuery,
} from '../types'

export interface UseWhitelistReturn {
  entries: WhitelistEntry[]
  loading: boolean
  error: Error | null
  refresh: () => Promise<void>
  createEntry: (data: CreateWhitelistEntryRequest) => Promise<WhitelistEntry>
  updateEntry: (id: string, data: UpdateWhitelistEntryRequest) => Promise<WhitelistEntry>
  deleteEntry: (id: string) => Promise<void>
  activateEntry: (id: string) => Promise<WhitelistEntry>
  deactivateEntry: (id: string) => Promise<WhitelistEntry>
  getExpiredEntries: () => Promise<WhitelistEntry[]>
  clearError: () => void
}

export interface UseWhitelistOptions {
  query?: WhitelistListQuery
  autoFetch?: boolean
  interval?: number
}

/**
 * Hook لإدارة القائمة البيضاء
 */
export function useWhitelist(options: UseWhitelistOptions = {}): UseWhitelistReturn {
  const { query, autoFetch = true, interval } = options

  // استخدام useAsyncOperation لجلب البيانات (مع دعم autoFetch و interval)
  const {
    data: entriesData,
    isLoading: loading,
    error,
    fetch: fetchEntries,
    clearError,
  } = useAsyncOperation<{ entries: WhitelistEntry[] }, void>(
    async () => {
      const response = await whitelistService.getAllEntries(query)
      return { entries: response.entries }
    },
    {
      autoFetch,
      interval,
      defaultErrorMessage: 'فشل جلب إدخالات القائمة البيضاء',
    }
  )

  const entries = entriesData?.entries || []

  const refresh = useCallback(async () => {
    if (fetchEntries) {
      await fetchEntries()
    }
  }, [fetchEntries])

  // استخدام useAsyncOperation للعمليات CRUD
  const createOperation = useAsyncOperation(
    async (data: CreateWhitelistEntryRequest) => {
      const newEntry = await whitelistService.createEntry(data)
      await refresh()
      return newEntry
    },
    {
      defaultErrorMessage: 'فشل إنشاء إدخال القائمة البيضاء',
      onSuccess: () => refresh(),
    }
  )

  const createEntry = useCallback(
    async (data: CreateWhitelistEntryRequest): Promise<WhitelistEntry> => {
      return createOperation.execute(data)
    },
    [createOperation]
  )

  const updateOperation = useAsyncOperation(
    async ({ id, data }: { id: string; data: UpdateWhitelistEntryRequest }) => {
      const updatedEntry = await whitelistService.updateEntry(id, data)
      await refresh()
      return updatedEntry
    },
    {
      defaultErrorMessage: 'فشل تحديث إدخال القائمة البيضاء',
      onSuccess: () => refresh(),
    }
  )

  const updateEntry = useCallback(
    async (id: string, data: UpdateWhitelistEntryRequest): Promise<WhitelistEntry> => {
      return updateOperation.execute({ id, data })
    },
    [updateOperation]
  )

  const deleteOperation = useAsyncOperation(
    async (id: string) => {
      await whitelistService.deleteEntry(id)
      await refresh()
    },
    {
      defaultErrorMessage: 'فشل حذف إدخال القائمة البيضاء',
      onSuccess: () => refresh(),
    }
  )

  const deleteEntry = useCallback(
    async (id: string): Promise<void> => {
      await deleteOperation.execute(id)
    },
    [deleteOperation]
  )

  const activateOperation = useAsyncOperation(
    async (id: string) => {
      const activatedEntry = await whitelistService.activateEntry(id)
      await refresh()
      return activatedEntry
    },
    {
      defaultErrorMessage: 'فشل تفعيل إدخال القائمة البيضاء',
      onSuccess: () => refresh(),
    }
  )

  const activateEntry = useCallback(
    async (id: string): Promise<WhitelistEntry> => {
      return activateOperation.execute(id)
    },
    [activateOperation]
  )

  const deactivateOperation = useAsyncOperation(
    async (id: string) => {
      const deactivatedEntry = await whitelistService.deactivateEntry(id)
      await refresh()
      return deactivatedEntry
    },
    {
      defaultErrorMessage: 'فشل تعطيل إدخال القائمة البيضاء',
      onSuccess: () => refresh(),
    }
  )

  const deactivateEntry = useCallback(
    async (id: string): Promise<WhitelistEntry> => {
      return deactivateOperation.execute(id)
    },
    [deactivateOperation]
  )

  const getExpiredOperation = useAsyncOperation(
    async () => {
      return await whitelistService.getExpiredEntries()
    },
    {
      defaultErrorMessage: 'فشل جلب الإدخالات المنتهية',
    }
  )

  const getExpiredEntries = useCallback(async (): Promise<WhitelistEntry[]> => {
    return getExpiredOperation.execute(undefined as void)
  }, [getExpiredOperation])

  return {
    entries,
    loading,
    error,
    refresh,
    createEntry,
    updateEntry,
    deleteEntry,
    activateEntry,
    deactivateEntry,
    getExpiredEntries,
    clearError,
  }
}
