/**
 * Route Loader - مكون تحميل المسار
 *
 * مكون محسّن لعرض حالة التحميل أثناء lazy loading للمسارات
 */

import React from 'react'
import styles from './RouteLoader.module.scss'

interface RouteLoaderProps {
  /**
   * رسالة التحميل (اختياري)
   */
  message?: string

  /**
   * حجم الـ loader (صغير، متوسط، كبير)
   */
  size?: 'small' | 'medium' | 'large'

  /**
   * نوع الـ loader (spinner, skeleton, dots)
   */
  type?: 'spinner' | 'skeleton' | 'dots'

  /**
   * عرض رسالة التحميل
   */
  showMessage?: boolean
}

/**
 * Route Loader Component
 */
export const RouteLoader: React.FC<RouteLoaderProps> = ({
  message = 'جاري التحميل...',
  size = 'medium',
  type = 'spinner',
  showMessage = true,
}) => {
  return (
    <div
      className={`${styles.routeLoader} ${styles[size]}`}
      role="status"
      aria-label="جاري التحميل"
    >
      {type === 'spinner' && (
        <div className={styles.spinner}>
          <div className={styles.spinnerCircle}></div>
        </div>
      )}

      {type === 'dots' && (
        <div className={styles.dots}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}

      {type === 'skeleton' && (
        <div className={styles.skeleton}>
          <div className={styles.skeletonHeader}></div>
          <div className={styles.skeletonContent}>
            <div className={styles.skeletonLine}></div>
            <div className={styles.skeletonLine}></div>
            <div className={styles.skeletonLine}></div>
          </div>
        </div>
      )}

      {showMessage && message && <p className={styles.message}>{message}</p>}
    </div>
  )
}

/**
 * Default Route Loader (للـ Suspense fallback)
 */
export const DefaultRouteLoader: React.FC = () => {
  return <RouteLoader type="spinner" size="medium" />
}
