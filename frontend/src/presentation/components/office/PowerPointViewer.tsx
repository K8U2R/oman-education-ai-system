/**
 * PowerPoint Viewer - معاين PowerPoint
 *
 * مكون لعرض ملفات PowerPoint
 */

import React from 'react'
import { Presentation, Download } from 'lucide-react'
import { Card, Button } from '../common'

interface PowerPointViewerProps {
  slides?: Array<{ title: string; content: string }>
  fileName?: string
  onDownload?: () => void
}

export const PowerPointViewer: React.FC<PowerPointViewerProps> = ({
  slides,
  fileName = 'presentation.pptx',
  onDownload,
}) => {
  return (
    <Card className="powerpoint-viewer">
      <div className="powerpoint-viewer__header">
        <div className="powerpoint-viewer__title">
          <Presentation className="powerpoint-viewer__icon" />
          <div>
            <h3>{fileName}</h3>
            <span className="powerpoint-viewer__type">ملف PowerPoint</span>
          </div>
        </div>
        {onDownload && (
          <Button variant="secondary" size="sm" onClick={onDownload} leftIcon={<Download />}>
            تحميل
          </Button>
        )}
      </div>
      <div className="powerpoint-viewer__content">
        {slides && slides.length > 0 ? (
          <div className="powerpoint-viewer__slides">
            {slides.map((slide, index) => (
              <div key={index} className="powerpoint-viewer__slide">
                <div className="powerpoint-viewer__slide-number">الشريحة {index + 1}</div>
                <h4 className="powerpoint-viewer__slide-title">{slide.title}</h4>
                <div className="powerpoint-viewer__slide-content">{slide.content}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="powerpoint-viewer__empty">
            <Presentation className="powerpoint-viewer__empty-icon" />
            <p>لا توجد شرائح للعرض</p>
          </div>
        )}
      </div>
    </Card>
  )
}
