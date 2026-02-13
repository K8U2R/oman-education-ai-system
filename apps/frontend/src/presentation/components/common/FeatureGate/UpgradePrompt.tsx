/**
 * UpgradePrompt Component - مطالبة بالترقية
 *
 * ✅ SCSS-based styling (Local Sovereign)
 * ✅ Liquid variables system compliant
 * ✅ CSS custom properties for theming
 */

import React from 'react'
import { Lock, Sparkles } from 'lucide-react'
import type { Permission } from '@/domain/types/auth.types'
import './_upgrade-prompt.scss'

interface UpgradePromptProps {
  feature: string
  requiredPermission: Permission
}

export const UpgradePrompt: React.FC<UpgradePromptProps> = ({ feature, requiredPermission }) => {
  return (
    <div className="upgrade-prompt">
      <div className="upgrade-prompt__icon">
        <Lock />
        <Sparkles className="upgrade-prompt__icon-sparkle" />
      </div>

      <h3 className="upgrade-prompt__title">ميزة متقدمة</h3>

      <p className="upgrade-prompt__description">
        للوصول إلى <strong>{feature}</strong>، يرجى الترقية إلى خطة أعلى
      </p>

      <div className="upgrade-prompt__details">
        <span className="upgrade-prompt__details-label">الصلاحية المطلوبة:</span>
        <code className="upgrade-prompt__details-code">{requiredPermission}</code>
      </div>

      <button className="upgrade-prompt__button">ترقية الخطة</button>
    </div>
  )
}

export default UpgradePrompt
