/**
 * Office Generator Page - صفحة إنشاء ملفات Office
 *
 * صفحة كاملة لإنشاء ملفات Office باستخدام AI
 */

import React, { useState } from 'react'
import { FileSpreadsheet, FileText, Presentation, Sparkles } from 'lucide-react'
import { Card, Button } from '../../components/common'
import {
  OfficeTemplateSelector,
  OfficeExportDialog,
  ExcelViewer,
  WordViewer,
  PowerPointViewer,
} from '../../components/office'
import { ExportOptions } from '../../components/office'
import { useOffice, type OfficeTemplate } from '@/application'
import { loggingService } from '@/infrastructure/services'
import type { OfficeGenerationResponse } from '@/features/office-management'
import { PageHeader } from '../components'


const OfficeGeneratorPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<'excel' | 'word' | 'powerpoint'>('word')
  const [description, setDescription] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<OfficeTemplate | null>(null)
  const [generatedFile, setGeneratedFile] = useState<OfficeGenerationResponse | null>(null)
  const [showExportDialog, setShowExportDialog] = useState(false)

  const { isGenerating, error, generateOffice, clearError } = useOffice()

  const handleGenerate = async () => {
    if (!description.trim()) {
      return
    }

    clearError()
    setGeneratedFile(null)

    try {
      const request = {
        type: selectedType,
        template_id: selectedTemplate?.id,
        data: {},
        options: {
          language: 'ar' as const,
          style: 'professional' as const,
        },
        description: description.trim(),
      }

      const response = await generateOffice(request)
      setGeneratedFile(response)
    } catch (err) {
      // Error is handled by useOffice hook
      loggingService.error('Office generation error', err as Error)
    }
  }

  const handleExport = (_type: 'excel' | 'word' | 'powerpoint', _options?: ExportOptions) => {
    // منطق التصدير
    // TODO: Implement export functionality
    if (import.meta.env.DEV) {
      // Development logging
    }
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
    <div className="office-generator-page">
      <PageHeader
        title="إنشاء ملفات Office"
        description="استخدم الذكاء الاصطناعي لإنشاء ملفات Excel و Word و PowerPoint"
        icon={<FileText />}
      />

      <div className="office-generator-page__content">
        <div className="office-generator-page__form-section">
          <Card className="office-generator-page__form-card">
            <h3 className="office-generator-page__section-title">اختر نوع الملف</h3>
            <div className="office-generator-page__types">
              {fileTypes.map(fileType => (
                <Card
                  key={fileType.type}
                  className={`office-generator-page__type ${selectedType === fileType.type ? 'office-generator-page__type--selected' : ''
                    }`}
                  onClick={() => setSelectedType(fileType.type)}
                  hoverable
                >
                  <div className="office-generator-page__type-icon">{fileType.icon}</div>
                  <span className="office-generator-page__type-label">{fileType.label}</span>
                </Card>
              ))}
            </div>

            <div className="office-generator-page__field">
              <label className="office-generator-page__label">وصف الملف المطلوب *</label>
              <textarea
                className="office-generator-page__textarea"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="مثال: أنشئ ملف Excel يحتوي على جدول بيانات للموظفين..."
                rows={4}
                disabled={isGenerating}
              />
            </div>

            <div className="office-generator-page__field">
              <label className="office-generator-page__label">اختر قالب (اختياري)</label>
              <OfficeTemplateSelector
                type={selectedType}
                onSelect={setSelectedTemplate}
                selectedTemplateId={selectedTemplate?.id}
              />
            </div>

            {error && (
              <div className="office-generator-page__error">
                <span>{error}</span>
              </div>
            )}

            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleGenerate}
              isLoading={isGenerating}
              leftIcon={<Sparkles />}
              disabled={!description.trim() || isGenerating}
            >
              {isGenerating ? 'جاري الإنشاء...' : 'إنشاء الملف'}
            </Button>
          </Card>
        </div>

        {generatedFile && (
          <div className="office-generator-page__result-section">
            <Card className="office-generator-page__result-card">
              <div className="office-generator-page__result-header">
                <h3>الملف المولد</h3>
                <Button variant="secondary" size="sm" onClick={() => setShowExportDialog(true)}>
                  تصدير
                </Button>
              </div>
              <div className="office-generator-page__result-content">
                {selectedType === 'excel' && generatedFile && (
                  <ExcelViewer
                    data={generatedFile as unknown as Record<string, unknown>}
                    fileName={generatedFile.file_name}
                  />
                )}
                {selectedType === 'word' && generatedFile && (
                  <WordViewer
                    content={generatedFile.preview_url || generatedFile.download_url}
                    fileName={generatedFile.file_name}
                  />
                )}
                {selectedType === 'powerpoint' && generatedFile && (
                  <PowerPointViewer slides={[]} fileName={generatedFile.file_name} />
                )}
              </div>
            </Card>
          </div>
        )}
      </div>

      <OfficeExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        onExport={handleExport}
        fileName={generatedFile?.file_name}
      />
    </div>
  )
}

export default OfficeGeneratorPage
