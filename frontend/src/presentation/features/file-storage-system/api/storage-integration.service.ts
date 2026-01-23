/**
 * Storage Integration Service
 * خدمة تكامل التخزين السحابي
 */

import { apiClient } from '@/infrastructure/services/api/api-client'
import type { ApiRequestConfig } from '@/infrastructure/services/api/types'

export interface StorageProvider {
  id: string
  provider_type: 'google_drive' | 'onedrive'
  name: string
  display_name: string
  description?: string
  is_active: boolean
  is_enabled: boolean
  icon_url?: string
  auth_url?: string
}

export interface UserStorageConnection {
  id: string
  user_id: string
  provider_id: string
  status: 'PENDING' | 'CONNECTED' | 'DISCONNECTED' | 'EXPIRED' | 'ERROR'
  root_folder_id?: string
  created_at: string
  updated_at: string
}

export interface StorageFile {
  id: string
  connection_id: string
  provider_file_id: string
  name: string
  file_type: string
  mime_type?: string
  size?: number
  parent_folder_id?: string
  web_view_link?: string
  download_link?: string
  thumbnail_link?: string
  modified_at?: string
  created_at?: string
}

export interface StorageFolder {
  id: string
  connection_id: string
  provider_folder_id: string
  name: string
  parent_folder_id?: string
  path?: string
  web_view_link?: string
  item_count?: number
  created_at?: string
  modified_at?: string
}

class StorageIntegrationService {
  /**
   * Get all storage providers
   */
  async getProviders(): Promise<StorageProvider[]> {
    const response = await apiClient.get<{ providers: StorageProvider[] }>('/storage/providers')
    return response.providers || []
  }

  /**
   * Get provider by ID
   */
  async getProvider(providerId: string): Promise<StorageProvider> {
    return apiClient.get<StorageProvider>(`/storage/providers/${providerId}`)
  }

  /**
   * Get user storage connections
   */
  async getUserConnections(): Promise<UserStorageConnection[]> {
    const response = await apiClient.get<{
      connections: UserStorageConnection[]
    }>('/storage/connections')
    return response.connections || []
  }

  /**
   * Connect to a storage provider
   */
  async connectProvider(providerId: string): Promise<{ auth_url: string }> {
    return apiClient.post<{ auth_url: string }>(`/storage/providers/${providerId}/connect`)
  }

  /**
   * Disconnect from a storage provider
   */
  async disconnectProvider(connectionId: string): Promise<void> {
    return apiClient.post(`/storage/connections/${connectionId}/disconnect`)
  }

  /**
   * Refresh connection token
   */
  async refreshConnection(connectionId: string): Promise<void> {
    return apiClient.post(`/storage/connections/${connectionId}/refresh`)
  }

  /**
   * List files
   */
  async listFiles(
    connectionId: string,
    folderId?: string,
    fileType?: string
  ): Promise<StorageFile[]> {
    const params: Record<string, string> = {}
    if (folderId) params.folder_id = folderId
    if (fileType) params.file_type = fileType

    const response = await apiClient.get<{ files: StorageFile[] }>(
      `/storage/connections/${connectionId}/files`,
      Object.keys(params).length > 0 ? { params } : undefined
    )
    return response.files || []
  }

  /**
   * List folders
   */
  async listFolders(connectionId: string, parentFolderId?: string): Promise<StorageFolder[]> {
    const params: Record<string, string> = {}
    if (parentFolderId) params.parent_folder_id = parentFolderId

    const response = await apiClient.get<{ folders: StorageFolder[] }>(
      `/storage/connections/${connectionId}/folders`,
      params ? { params } : undefined
    )
    return response.folders || []
  }

  /**
   * Upload file
   */
  async uploadFile(
    connectionId: string,
    file: File,
    parentFolderId?: string
  ): Promise<StorageFile> {
    const formData = new FormData()
    formData.append('file', file)
    if (parentFolderId) {
      formData.append('parent_folder_id', parentFolderId)
    }

    return apiClient.post<StorageFile>(
      `/storage/connections/${connectionId}/files/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        } as Partial<ApiRequestConfig>['headers'],
      }
    )
  }

  /**
   * Download file
   */
  async downloadFile(connectionId: string, fileId: string): Promise<Blob> {
    const response = await apiClient.get(
      `/storage/connections/${connectionId}/files/${fileId}/download`,
      {
        responseType: 'blob',
      } as Partial<ApiRequestConfig>
    )
    return response as unknown as Blob
  }

  /**
   * Delete file
   */
  async deleteFile(connectionId: string, fileId: string): Promise<void> {
    return apiClient.delete(`/storage/connections/${connectionId}/files/${fileId}`)
  }

  /**
   * Create folder
   */
  async createFolder(
    connectionId: string,
    folderName: string,
    parentFolderId?: string
  ): Promise<StorageFolder> {
    return apiClient.post<StorageFolder>(`/storage/connections/${connectionId}/folders`, {
      name: folderName,
      parent_folder_id: parentFolderId,
    })
  }

  /**
   * Export to Office
   */
  async exportToOffice(
    connectionId: string,
    fileId: string,
    format: 'word' | 'excel' | 'powerpoint',
    outputFolderId?: string
  ): Promise<{ file_id: string }> {
    return apiClient.post<{ file_id: string }>(
      `/storage/connections/${connectionId}/files/${fileId}/export`,
      {
        format,
        output_folder_id: outputFolderId,
      }
    )
  }
}

export const storageIntegrationService = new StorageIntegrationService()
