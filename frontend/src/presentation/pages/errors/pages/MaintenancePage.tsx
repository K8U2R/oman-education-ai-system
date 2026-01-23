/**
 * Maintenance Page - صفحة الصيانة
 *
 * صفحة تظهر عندما يكون النظام قيد الصيانة
 */

import React from 'react'
import { Wrench } from 'lucide-react'
import { BaseErrorPage } from '../BaseErrorPage'

export const MaintenancePage: React.FC = () => {
  return (
    <BaseErrorPage
      type="maintenance"
      title="الصيانة قيد التنفيذ"
      message="نعتذر، النظام قيد الصيانة حاليًا."
      secondaryMessage="سنعود قريباً. شكراً لصبرك."
      icon={Wrench}
      iconColor="info"
      showRefreshButton={false}
      showDevDetails={false}
    />
  )
}
