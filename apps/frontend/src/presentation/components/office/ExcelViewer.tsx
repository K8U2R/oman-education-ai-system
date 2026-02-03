/**
 * Excel Viewer - معاين Excel
 *
 * مكون لعرض ملفات Excel
 */

import React from 'react'
import { FileSpreadsheet, Download } from 'lucide-react'
import { Card, Button } from '../common'

interface ExcelViewerProps {
  data?: Record<string, unknown> | Array<Record<string, unknown>>
  fileName?: string
  onDownload?: () => void
}

export const ExcelViewer: React.FC<ExcelViewerProps> = ({
  data,
  fileName = 'document.xlsx',
  onDownload,
}) => {
  // في الإصدار الحالي، نعرض معلومات بسيطة
  // يمكن تحسين هذا لاحقاً لعرض البيانات الفعلية

  return (
    <Card className="excel-viewer">
      <div className="excel-viewer__header">
        <div className="excel-viewer__title">
          <FileSpreadsheet className="excel-viewer__icon" />
          <div>
            <h3>{fileName}</h3>
            <span className="excel-viewer__type">ملف Excel</span>
          </div>
        </div>
        {onDownload && (
          <Button variant="secondary" size="sm" onClick={onDownload} leftIcon={<Download />}>
            تحميل
          </Button>
        )}
      </div>
      <div className="excel-viewer__content">
        {data ? (
          <div className="excel-viewer__preview">
            <p>معاينة ملف Excel</p>
            <p className="excel-viewer__note">
              ملاحظة: عرض البيانات الكاملة يتطلب مكتبة متخصصة مثل SheetJS
            </p>
          </div>
        ) : (
          <div className="excel-viewer__empty">
            <FileSpreadsheet className="excel-viewer__empty-icon" />
            <p>لا توجد بيانات للعرض</p>
          </div>
        )}
      </div>
    </Card>
  )
}
