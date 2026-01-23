/**
 * Office Template Selector - محدد قوالب Office
 *
 * مكون لاختيار قالب Office
 */

import React, { useState, useEffect, useCallback } from 'react'
import { FileSpreadsheet, FileText, Presentation, Loader2 } from 'lucide-react'
import { Card, Button } from '../common'
import { officeService, type OfficeTemplate } from '@/application'

// Re-export for backward compatibility
export type { OfficeTemplate } from '@/application'

interface OfficeTemplateSelectorProps {
  type?: 'excel' | 'word' | 'powerpoint'
  onSelect?: (template: OfficeTemplate) => void
  selectedTemplateId?: string
}

export const OfficeTemplateSelector: React.FC<OfficeTemplateSelectorProps> = ({
  type,
  onSelect,
  selectedTemplateId,
}) => {
  const [templates, setTemplates] = useState<OfficeTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadTemplates = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const templatesData = await officeService.getTemplates(type)
      setTemplates(templatesData)
    } catch (err: unknown) {
      console.error('Failed to load templates:', err)
      setError('فشل تحميل القوالب')
      setTemplates([])
    } finally {
      setLoading(false)
    }
  }, [type])

  useEffect(() => {
    loadTemplates()
  }, [loadTemplates])

  const getTypeIcon = (templateType: string) => {
    switch (templateType) {
      case 'excel':
        return <FileSpreadsheet />
      case 'word':
        return <FileText />
      case 'powerpoint':
        return <Presentation />
      default:
        return <FileText />
    }
  }

  const getTypeLabel = (templateType: string) => {
    switch (templateType) {
      case 'excel':
        return 'Excel'
      case 'word':
        return 'Word'
      case 'powerpoint':
        return 'PowerPoint'
      default:
        return templateType
    }
  }

  if (loading) {
    return (
      <div className="office-template-selector office-template-selector--loading">
        <Loader2 className="office-template-selector__loader" />
        <span>جاري تحميل القوالب...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="office-template-selector office-template-selector--error">
        <span>{error}</span>
        <Button variant="secondary" size="sm" onClick={loadTemplates}>
          إعادة المحاولة
        </Button>
      </div>
    )
  }

  if (templates.length === 0) {
    return (
      <div className="office-template-selector office-template-selector--empty">
        <p>لا توجد قوالب متاحة</p>
      </div>
    )
  }

  return (
    <div className="office-template-selector">
      <div className="office-template-selector__grid">
        {templates.map(template => (
          <Card
            key={template.id}
            className={`office-template-selector__template ${
              selectedTemplateId === template.id
                ? 'office-template-selector__template--selected'
                : ''
            }`}
            onClick={() => onSelect?.(template)}
            hoverable
          >
            <div className="office-template-selector__template-icon">
              {getTypeIcon(template.type)}
            </div>
            <div className="office-template-selector__template-info">
              <h4 className="office-template-selector__template-name">{template.name}</h4>
              <span className="office-template-selector__template-type">
                {getTypeLabel(template.type)}
              </span>
              {template.description && (
                <p className="office-template-selector__template-description">
                  {template.description}
                </p>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
