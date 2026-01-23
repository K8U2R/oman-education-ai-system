import React, { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Folder, Upload, ArrowLeft, FolderPlus, Loader2 } from 'lucide-react'
import { storageIntegrationService, StorageFile, StorageFolder } from '@/application'
import {
  FileItem,
  FolderItem,
  UploadDialog,
  FileSearch,
  FileFilter,
  Breadcrumb,
  StorageStats,
} from '../../components/storage'
import type {
  FileTypeFilter,
  SortOption,
  BreadcrumbItem,
  ExportFormat
} from '../../components/storage'
import { Button } from '../../components/common'


const StorageBrowserPage: React.FC = () => {
  const { connectionId } = useParams<{ connectionId: string }>()
  const navigate = useNavigate()
  const [files, setFiles] = useState<StorageFile[]>([])
  const [folders, setFolders] = useState<StorageFolder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(undefined)
  const [uploading, setUploading] = useState(false)
  const [showUploadDialog, setShowUploadDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [fileTypeFilter, setFileTypeFilter] = useState<FileTypeFilter>('all')
  const [sortBy, setSortBy] = useState<SortOption>('name')
  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItem[]>([])

  const loadFiles = useCallback(async () => {
    if (!connectionId) return

    try {
      setLoading(true)
      setError(null)
      const [filesData, foldersData] = await Promise.all([
        storageIntegrationService.listFiles(connectionId, currentFolderId),
        storageIntegrationService.listFolders(connectionId, currentFolderId),
      ])
      setFiles(filesData)
      setFolders(foldersData)
    } catch (_err) {
      // Error logging is handled by the error interceptor
      setError('فشل تحميل الملفات')
    } finally {
      setLoading(false)
    }
  }, [connectionId, currentFolderId])

  useEffect(() => {
    if (connectionId) {
      loadFiles()
    }
  }, [connectionId, loadFiles])

  const handleFileUpload = async (files: File[]) => {
    if (!connectionId) return

    try {
      setUploading(true)
      for (const file of files) {
        await storageIntegrationService.uploadFile(connectionId, file, currentFolderId)
      }
      await loadFiles()
    } catch (err) {
      // Error logging is handled by the error interceptor
      setError('فشل رفع الملفات')
      throw err
    } finally {
      setUploading(false)
    }
  }

  const handleFileDownload = async (fileId: string, fileName: string) => {
    if (!connectionId) return

    try {
      const blob = await storageIntegrationService.downloadFile(connectionId, fileId)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (_err) {
      // Error logging is handled by the error interceptor
      setError('فشل تحميل الملف')
    }
  }

  const handleFileDelete = async (fileId: string) => {
    if (!connectionId) return
    if (!confirm('هل أنت متأكد من حذف هذا الملف؟')) return

    try {
      await storageIntegrationService.deleteFile(connectionId, fileId)
      await loadFiles()
    } catch (_err) {
      // Error logging is handled by the error interceptor
      setError('فشل حذف الملف')
    }
  }

  const handleFolderClick = (folderId: string) => {
    setCurrentFolderId(folderId)
    // Update breadcrumb (in real implementation, fetch folder name)
    const folder = folders.find(f => f.provider_folder_id === folderId)
    if (folder) {
      setBreadcrumbItems(prev => [...prev, { id: folderId, name: folder.name }])
    }
  }

  const handleBreadcrumbClick = (item: BreadcrumbItem) => {
    const index = breadcrumbItems.findIndex(b => b.id === item.id)
    if (index !== -1) {
      setBreadcrumbItems(breadcrumbItems.slice(0, index + 1))
      setCurrentFolderId(item.id === 'root' ? undefined : item.id)
    }
  }

  const handleHomeClick = () => {
    setCurrentFolderId(undefined)
    setBreadcrumbItems([])
  }

  const handleExport = async (fileId: string, format: ExportFormat) => {
    if (!connectionId) return

    try {
      const file = files.find(f => f.id === fileId)
      if (!file) {
        // File not found - handled
        return
      }

      // Get download link
      const downloadLink = file.download_link
      if (!downloadLink) {
        // Download link not available - handled
        return
      }

      // Download file
      const response = await fetch(downloadLink)
      const blob = await response.blob()

      // Convert to requested format (simplified - in production, use backend conversion)
      const fileName = file.name.replace(/\.[^/.]+$/, '')
      const extension = format === 'docx' ? '.docx' : format === 'xlsx' ? '.xlsx' : '.pptx'
      const newFileName = `${fileName}${extension}`

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = newFileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (_error) {
      // Error logging is handled by the error interceptor
    }
  }

  // Filter and sort files
  const filteredAndSortedFiles = React.useMemo<StorageFile[]>(() => {
    let filtered = files

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(file =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply type filter
    if (fileTypeFilter !== 'all') {
      filtered = filtered.filter(file => {
        const mimeType = file.mime_type || ''

        switch (fileTypeFilter) {
          case 'documents':
            return (
              mimeType.startsWith('application/pdf') ||
              mimeType.startsWith('application/msword') ||
              mimeType.startsWith('application/vnd.openxmlformats-officedocument') ||
              mimeType.startsWith('application/vnd.ms-excel') ||
              mimeType.startsWith('application/vnd.ms-powerpoint') ||
              mimeType.startsWith('text/')
            )
          case 'images':
            return mimeType.startsWith('image/')
          case 'videos':
            return mimeType.startsWith('video/')
          case 'audio':
            return mimeType.startsWith('audio/')
          case 'archives':
            return (
              mimeType.includes('zip') ||
              mimeType.includes('rar') ||
              mimeType.includes('tar') ||
              mimeType.includes('7z') ||
              mimeType.includes('gzip')
            )
          default:
            return true
        }
      })
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name, 'ar')
        case 'size':
          return (a.size || 0) - (b.size || 0)
        case 'date':
          return new Date(b.modified_at || 0).getTime() - new Date(a.modified_at || 0).getTime()
        case 'type':
          return (a.mime_type || '').localeCompare(b.mime_type || '', 'ar')
        default:
          return 0
      }
    })

    return sorted
  }, [files, searchQuery, fileTypeFilter, sortBy])

  const handleCreateFolder = async () => {
    if (!connectionId) return

    const folderName = prompt('أدخل اسم المجلد:')
    if (!folderName) return

    try {
      await storageIntegrationService.createFolder(connectionId, folderName, currentFolderId)
      await loadFiles()
    } catch (_err) {
      // Error logging is handled by the error interceptor
      setError('فشل إنشاء المجلد')
    }
  }

  if (loading) {
    return (
      <div className="storage-browser">
        <div className="storage-browser__loading">
          <Loader2 className="storage-browser__spinner" />
          <p className="storage-browser__loading-text">جارٍ تحميل الملفات...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="storage-browser">
      <div className="storage-browser__header">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/storage')}
          className="storage-browser__back-button"
        >
          <ArrowLeft className="w-4 h-4 ml-2" />
          العودة
        </Button>
        <h1 className="storage-browser__title">الملفات والمجلدات</h1>
      </div>

      {error && (
        <div className="storage-browser__error">
          <p>{error}</p>
        </div>
      )}

      {/* Breadcrumb */}
      {breadcrumbItems.length > 0 && (
        <Breadcrumb
          items={breadcrumbItems}
          onItemClick={handleBreadcrumbClick}
          onHomeClick={handleHomeClick}
          className="storage-browser__breadcrumb"
        />
      )}

      {/* Search and Filter */}
      <div className="storage-browser__controls">
        <FileSearch onSearch={setSearchQuery} className="storage-browser__search" />
        <FileFilter
          fileType={fileTypeFilter}
          sortBy={sortBy}
          onFileTypeChange={setFileTypeFilter}
          onSortChange={setSortBy}
          className="storage-browser__filter"
        />
      </div>

      {/* Storage Stats */}
      <StorageStats
        totalFiles={files.length}
        totalFolders={folders.length}
        className="storage-browser__stats"
      />

      {/* Actions */}
      <div className="storage-browser__actions">
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowUploadDialog(true)}
          disabled={uploading}
          className="storage-browser__upload-button"
        >
          <Upload className="w-4 h-4 ml-2" />
          رفع ملفات
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCreateFolder}
          className="storage-browser__create-folder-button"
        >
          <FolderPlus className="w-4 h-4 ml-2" />
          إنشاء مجلد
        </Button>
      </div>

      {/* Upload Dialog */}
      <UploadDialog
        isOpen={showUploadDialog}
        onClose={() => setShowUploadDialog(false)}
        onUpload={handleFileUpload}
        currentFolderId={currentFolderId}
      />

      {/* Folders */}
      {folders.length > 0 && (
        <div className="storage-browser__section">
          <h2 className="storage-browser__section-title">المجلدات</h2>
          <div className="storage-browser__grid">
            {folders.map(folder => (
              <FolderItem key={folder.id} folder={folder} onClick={handleFolderClick} />
            ))}
          </div>
        </div>
      )}

      {/* Files */}
      {filteredAndSortedFiles.length > 0 && (
        <div className="storage-browser__section">
          <h2 className="storage-browser__section-title">
            الملفات ({filteredAndSortedFiles.length})
          </h2>
          <div className="storage-browser__grid">
            {filteredAndSortedFiles.map(file => (
              <FileItem
                key={file.id}
                file={file}
                onDownload={handleFileDownload}
                onDelete={handleFileDelete}
                onExport={handleExport}
              />
            ))}
          </div>
        </div>
      )}

      {filteredAndSortedFiles.length === 0 && files.length > 0 && (
        <div className="storage-browser__empty">
          <p className="storage-browser__empty-text">لا توجد ملفات تطابق البحث</p>
        </div>
      )}

      {folders.length === 0 && files.length === 0 && (
        <div className="storage-browser__empty">
          <Folder className="storage-browser__empty-icon" />
          <p className="storage-browser__empty-text">لا توجد ملفات أو مجلدات</p>
        </div>
      )}
    </div>
  )
}

export default StorageBrowserPage
