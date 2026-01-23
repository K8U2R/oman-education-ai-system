/**
 * Error Page Factory - مصنع صفحات الأخطاء
 *
 * Factory لإنشاء صفحات الأخطاء ديناميكياً
 */

import React from 'react'
import { BaseErrorPage } from '../BaseErrorPage'
import { getErrorConfig } from '../config/error-config'
import type { BaseErrorPageProps } from '../BaseErrorPage'
import type { ErrorType } from './types'

/**
 * إنشاء صفحة خطأ ديناميكياً
 */
export class ErrorPageFactory {
  /**
   * إنشاء صفحة خطأ من نوع معين
   */
  static create(type: ErrorType, props?: Partial<BaseErrorPageProps>): React.ReactElement {
    const config = getErrorConfig(type)

    if (!config) {
      // Fallback إلى server-error إذا لم يتم العثور على الإعدادات
      const fallbackConfig = getErrorConfig('server-error')!
      return (
        <BaseErrorPage
          type={fallbackConfig.type}
          title={fallbackConfig.title}
          message={fallbackConfig.message}
          secondaryMessage={fallbackConfig.secondaryMessage}
          icon={fallbackConfig.icon}
          iconColor={fallbackConfig.iconColor}
          showRefreshButton={fallbackConfig.showRefreshButton}
          {...props}
        />
      )
    }

    return (
      <BaseErrorPage
        type={config.type}
        title={config.title}
        message={config.message}
        secondaryMessage={config.secondaryMessage}
        icon={config.icon}
        iconColor={config.iconColor}
        showRefreshButton={config.showRefreshButton}
        {...props}
      />
    )
  }

  /**
   * إنشاء صفحة خطأ مخصصة
   */
  static createCustom(props: BaseErrorPageProps): React.ReactElement {
    return <BaseErrorPage {...props} />
  }
}
