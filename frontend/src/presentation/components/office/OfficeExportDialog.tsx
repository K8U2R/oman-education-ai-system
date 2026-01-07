/**
 * Office Export Dialog - حوار تصدير Office
 *
 * مكون حوار لتصدير ملفات Office
 */

import React, { useState } from 'react'
import { Download, FileSpreadsheet, FileText, Presentation, X } from 'lucide-react'
import { Modal, Button, Card } from '../common'
import './OfficeExportDialog.scss'

interface OfficeExportDialogProps {
  isOpen: boolean
  onClose: () => void
  onExport: (type: 'excel' | 'word' | 'powerpoint', options?: ExportOptions) => void
  fileName?: string
}

export interface ExportOptions {
  includeCharts?: boolean
  includeImages?: boolean
  style?: 'simple' | 'professional' | 'academic' | 'business'
  language?: 'ar' | 'en'
}

export const OfficeExportDialog: React.FC<OfficeExportDialogProps> = ({
  isOpen,
  onClose,
  onExport,
  fileName: _fileName = 'document',
}) => {
  const [selectedType, setSelectedType] = useState<'excel' | 'word' | 'powerpoint'>('word')
  const [options, setOptions] = useState<ExportOptions>({
    includeCharts: true,
    includeImages: true,
    style: 'professional',
    language: 'ar',
  })

  const handleExport = () => {
    onExport(selectedType, options)
    onClose()
  }

  const fileTypes: Array<{
    type: 'excel' | 'word' | 'powerpoint'
    label: string
    icon: React.ReactNode
  }> = [
    {
      type: 'excel',
      label: 'Excel',
      icon: <FileSpreadsheet />,
    },
    {
      type: 'word',
      label: 'Word',
      icon: <FileText />,
    },
    {
      type: 'powerpoint',
      label: 'PowerPoint',
      icon: <Presentation />,
    },
  ]

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="office-export-dialog">
        <div className="office-export-dialog__header">
          <h2>تصدير ملف Office</h2>
          <Button variant="ghost" size="sm" onClick={onClose} leftIcon={<X />}>
            إغلاق
          </Button>
        </div>

        <div className="office-export-dialog__content">
          <div className="office-export-dialog__section">
            <label className="office-export-dialog__label">نوع الملف</label>
            <div className="office-export-dialog__types">
              {fileTypes.map(fileType => (
                <Card
                  key={fileType.type}
                  className={`office-export-dialog__type ${
                    selectedType === fileType.type ? 'office-export-dialog__type--selected' : ''
                  }`}
                  onClick={() => setSelectedType(fileType.type)}
                  hoverable
                >
                  <div className="office-export-dialog__type-icon">{fileType.icon}</div>
                  <span className="office-export-dialog__type-label">{fileType.label}</span>
                </Card>
              ))}
            </div>
          </div>

          <div className="office-export-dialog__section">
            <label className="office-export-dialog__label">خيارات التصدير</label>
            <div className="office-export-dialog__options">
              <div className="office-export-dialog__option">
                <label className="office-export-dialog__checkbox">
                  <input
                    type="checkbox"
                    checked={options.includeCharts}
                    onChange={e => setOptions({ ...options, includeCharts: e.target.checked })}
                  />
                  <span>تضمين الرسوم البيانية</span>
                </label>
              </div>
              <div className="office-export-dialog__option">
                <label className="office-export-dialog__checkbox">
                  <input
                    type="checkbox"
                    checked={options.includeImages}
                    onChange={e => setOptions({ ...options, includeImages: e.target.checked })}
                  />
                  <span>تضمين الصور</span>
                </label>
              </div>
              <div className="office-export-dialog__option">
                <label className="office-export-dialog__label">النمط</label>
                <select
                  className="office-export-dialog__select"
                  value={options.style}
                  onChange={e =>
                    setOptions({
                      ...options,
                      style: e.target.value as 'simple' | 'professional' | 'academic' | 'business',
                    })
                  }
                >
                  <option value="simple">بسيط</option>
                  <option value="professional">احترافي</option>
                  <option value="academic">أكاديمي</option>
                  <option value="business">تجاري</option>
                </select>
              </div>
              <div className="office-export-dialog__option">
                <label className="office-export-dialog__label">اللغة</label>
                <select
                  className="office-export-dialog__select"
                  value={options.language}
                  onChange={e =>
                    setOptions({
                      ...options,
                      language: e.target.value as 'ar' | 'en',
                    })
                  }
                >
                  <option value="ar">العربية</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="office-export-dialog__footer">
          <Button variant="secondary" onClick={onClose}>
            إلغاء
          </Button>
          <Button variant="primary" onClick={handleExport} leftIcon={<Download />}>
            تصدير
          </Button>
        </div>
      </div>
    </Modal>
  )
}
