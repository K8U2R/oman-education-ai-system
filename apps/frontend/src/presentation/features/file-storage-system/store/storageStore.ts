/**
 * Storage Store - مخزن التخزين
 *
 * Zustand Store لإدارة حالة التخزين السحابي
 */

import { create } from 'zustand'
import { StorageConnection } from '@/domain/entities/StorageConnection'
import type { StorageProvider } from '@/domain/types/storage.types'

interface StorageState {
  providers: StorageProvider[]
  connections: StorageConnection[]
  currentConnection: StorageConnection | null
  isLoading: boolean
  error: string | null

  // Actions
  setProviders: (providers: StorageProvider[]) => void
  setConnections: (connections: StorageConnection[]) => void
  setCurrentConnection: (connection: StorageConnection | null) => void
  addConnection: (connection: StorageConnection) => void
  updateConnection: (connection: StorageConnection) => void
  removeConnection: (connectionId: string) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

export const useStorageStore = create<StorageState>(set => ({
  providers: [],
  connections: [],
  currentConnection: null,
  isLoading: false,
  error: null,

  setProviders: providers => set({ providers }),
  setConnections: connections => set({ connections }),
  setCurrentConnection: connection => set({ currentConnection: connection }),

  addConnection: connection =>
    set(state => ({
      connections: [...state.connections, connection],
    })),

  updateConnection: connection =>
    set(state => ({
      connections: state.connections.map(c => (c.id === connection.id ? connection : c)),
      currentConnection:
        state.currentConnection?.id === connection.id ? connection : state.currentConnection,
    })),

  removeConnection: connectionId =>
    set(state => ({
      connections: state.connections.filter(c => c.id !== connectionId),
      currentConnection:
        state.currentConnection?.id === connectionId ? null : state.currentConnection,
    })),

  setLoading: isLoading => set({ isLoading }),
  setError: error => set({ error }),
  clearError: () => set({ error: null }),
}))
