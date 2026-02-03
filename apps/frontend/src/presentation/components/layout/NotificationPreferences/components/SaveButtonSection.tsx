/**
 * SaveButtonSection Component - قسم أزرار الحفظ
 *
 * مكون لعرض أزرار الحفظ مع حالات loading و success
 */

import React from 'react'
import { Save, X, RotateCcw, Check } from 'lucide-react'
import { Button } from '../../../common'
import { cn } from '../../../common/utils/classNames'

interface SaveButtonSectionProps {
  /** هل هناك تغييرات؟ */
  hasChanges: boolean
  /** حالة الحفظ */
  saving: boolean
  /** حالة النجاح */
  success?: boolean
  /** دالة الحفظ */
  onSave: () => void
  /** دالة الإلغاء */
  onCancel: () => void
  /** دالة إعادة التعيين */
  onReset?: () => void
  /** Class name إضافي */
  className?: string
}

export const SaveButtonSection: React.FC<SaveButtonSectionProps> = ({
  hasChanges,
  saving,
  success = false,
  onSave,
  onCancel,
  onReset,
  className,
}) => {
  return (
    <div className={cn('save-button-section', className)}>
      {success && (
        <div className="save-button-section__success" role="alert" aria-live="polite">
          <Check className="save-button-section__success-icon" size={18} />
          <span className="save-button-section__success-text">تم الحفظ بنجاح</span>
        </div>
      )}

      <div className="save-button-section__actions">
        {onReset && hasChanges && (
          <Button
            variant="ghost"
            size="md"
            onClick={onReset}
            disabled={saving}
            leftIcon={<RotateCcw size={18} />}
            className="save-button-section__reset-button"
            aria-label="إعادة تعيين التغييرات"
          >
            إعادة تعيين
          </Button>
        )}

        <Button
          variant="outline"
          size="md"
          onClick={onCancel}
          disabled={saving}
          leftIcon={<X size={18} />}
          className="save-button-section__cancel-button"
        >
          إلغاء
        </Button>

        <Button
          variant="primary"
          size="md"
          onClick={onSave}
          disabled={!hasChanges || saving}
          isLoading={saving}
          leftIcon={!saving ? <Save size={18} /> : undefined}
          className="save-button-section__save-button"
        >
          {saving ? 'جاري الحفظ...' : 'حفظ'}
        </Button>
      </div>
    </div>
  )
}
