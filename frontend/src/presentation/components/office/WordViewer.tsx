/**
 * Word Viewer - معاين Word
 *
 * مكون لعرض ملفات Word
 */

import React from 'react'
import { FileText, Download } from 'lucide-react'
import { sanitizeHTML } from '@/infrastructure/utils/sanitize.util'
import { Card, Button } from '../common'

interface WordViewerProps {
  content?: string
  fileName?: string
  onDownload?: () => void
}

export const WordViewer: React.FC<WordViewerProps> = ({
  content,
  fileName = 'document.docx',
  onDownload,
}) => {
  return (
    <Card className="word-viewer">
      <div className="word-viewer__header">
        <div className="word-viewer__title">
          <FileText className="word-viewer__icon" />
          <div>
            <h3>{fileName}</h3>
            <span className="word-viewer__type">ملف Word</span>
          </div>
        </div>
        {onDownload && (
          <Button variant="secondary" size="sm" onClick={onDownload} leftIcon={<Download />}>
            تحميل
          </Button>
        )}
      </div>
      <div className="word-viewer__content">
        {content ? (
          <div
            className="word-viewer__preview"
            dangerouslySetInnerHTML={{ __html: sanitizeHTML(content) }}
          />
        ) : (
          <div className="word-viewer__empty">
            <FileText className="word-viewer__empty-icon" />
            <p>لا يوجد محتوى للعرض</p>
          </div>
        )}
      </div>
    </Card>
  )
}
