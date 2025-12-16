/**
 * Sync Service
 * Provides synchronization between local storage and server
 */

import { localStorageService } from './localStorage-service';
import { indexedDBService } from './indexedDB-service';
import { cacheService } from './cache-service';
import { apiClient } from '@/services/api/api-client';

interface SyncItem {
  key: string;
  value: unknown;
  timestamp: number;
  synced: boolean;
}

class SyncService {
  private syncQueue: SyncItem[] = [];
  private isSyncing = false;

  async addToQueue(key: string, value: unknown): Promise<void> {
    const item: SyncItem = {
      key,
      value,
      timestamp: Date.now(),
      synced: false,
    };

    this.syncQueue.push(item);
    localStorageService.set(key, value);

    // Try to sync immediately
    if (!this.isSyncing) {
      await this.sync();
    }
  }

  async sync(): Promise<void> {
    if (this.isSyncing || this.syncQueue.length === 0) return;

    this.isSyncing = true;

    try {
      const itemsToSync = this.syncQueue.filter((item) => !item.synced);

      for (const item of itemsToSync) {
        try {
          await apiClient.post('/sync', { 
            key: item.key, 
            value: item.value,
            timestamp: item.timestamp,
          });
          item.synced = true;
        } catch (error) {
          console.error(`Failed to sync item ${item.key}:`, error);
          // Continue with other items even if one fails
        }
      }

      // Remove synced items
      this.syncQueue = this.syncQueue.filter((item) => !item.synced);
    } finally {
      this.isSyncing = false;
    }
  }

  async getFromCache<T>(key: string): Promise<T | null> {
    // Try cache first
    const cached = cacheService.get<T>(key);
    if (cached !== null) return cached;

    // Try localStorage
    const local = localStorageService.get<T>(key);
    if (local !== null) {
      cacheService.set(key, local);
      return local;
    }

    // Try IndexedDB
    try {
      const db = await indexedDBService.get<T>('cache', key);
      if (db !== null) {
        cacheService.set(key, db);
        return db;
      }
    } catch (error) {
      console.error(`Failed to get from IndexedDB ${key}:`, error);
    }

    return null;
  }

  async setToCache<T>(key: string, value: T): Promise<void> {
    cacheService.set(key, value);
    localStorageService.set(key, value);

    try {
      await indexedDBService.set('cache', { key, value, timestamp: Date.now() });
    } catch (error) {
      console.error(`Failed to set to IndexedDB ${key}:`, error);
    }

    await this.addToQueue(key, value);
  }
}

export const syncService = new SyncService();

// Auto-sync every 30 seconds
if (typeof window !== 'undefined') {
  setInterval(() => {
    syncService.sync();
  }, 30 * 1000);
}

