/**
 * Skeleton Loader - مكون تحميل الهيكل
 *
 * مكون محسّن لعرض Skeleton loaders أثناء التحميل
 */

import React from 'react'
import styles from './SkeletonLoader.module.scss'

interface SkeletonLoaderProps {
  /**
   * نوع الـ skeleton (card, list, table, form)
   */
  type?: 'card' | 'list' | 'table' | 'form' | 'custom'

  /**
   * عدد العناصر (لـ list و table)
   */
  count?: number

  /**
   * عرض مخصص
   */
  custom?: React.ReactNode

  /**
   * className إضافي
   */
  className?: string
}

/**
 * Skeleton Card
 */
const SkeletonCard: React.FC = () => (
  <div className={styles.skeletonCard}>
    <div className={styles.skeletonCardHeader}></div>
    <div className={styles.skeletonCardContent}>
      <div className={styles.skeletonLine}></div>
      <div className={styles.skeletonLine}></div>
      <div className={styles.skeletonLine} style={{ width: '60%' }}></div>
    </div>
    <div className={styles.skeletonCardFooter}>
      <div className={styles.skeletonButton}></div>
      <div className={styles.skeletonButton}></div>
    </div>
  </div>
)

/**
 * Skeleton List Item
 */
const SkeletonListItem: React.FC = () => (
  <div className={styles.skeletonListItem}>
    <div className={styles.skeletonAvatar}></div>
    <div className={styles.skeletonListItemContent}>
      <div className={styles.skeletonLine}></div>
      <div className={styles.skeletonLine} style={{ width: '70%' }}></div>
    </div>
  </div>
)

/**
 * Skeleton Table Row
 */
const SkeletonTableRow: React.FC = () => (
  <tr className={styles.skeletonTableRow}>
    <td>
      <div className={styles.skeletonLine} style={{ width: '80%' }}></div>
    </td>
    <td>
      <div className={styles.skeletonLine} style={{ width: '60%' }}></div>
    </td>
    <td>
      <div className={styles.skeletonLine} style={{ width: '40%' }}></div>
    </td>
    <td>
      <div className={styles.skeletonButton} style={{ width: '60px' }}></div>
    </td>
  </tr>
)

/**
 * Skeleton Form
 */
const SkeletonForm: React.FC = () => (
  <div className={styles.skeletonForm}>
    <div className={styles.skeletonFormGroup}>
      <div className={styles.skeletonLabel}></div>
      <div className={styles.skeletonInput}></div>
    </div>
    <div className={styles.skeletonFormGroup}>
      <div className={styles.skeletonLabel}></div>
      <div className={styles.skeletonInput}></div>
    </div>
    <div className={styles.skeletonFormGroup}>
      <div className={styles.skeletonLabel}></div>
      <div className={styles.skeletonTextarea}></div>
    </div>
    <div className={styles.skeletonFormActions}>
      <div className={styles.skeletonButton} style={{ width: '120px' }}></div>
      <div className={styles.skeletonButton} style={{ width: '100px' }}></div>
    </div>
  </div>
)

/**
 * Skeleton Loader Component
 */
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type = 'card',
  count = 3,
  custom,
  className = '',
}) => {
  if (custom) {
    return <div className={`${styles.skeletonContainer} ${className}`}>{custom}</div>
  }

  switch (type) {
    case 'card':
      return (
        <div className={`${styles.skeletonContainer} ${className}`}>
          {Array.from({ length: count }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      )

    case 'list':
      return (
        <div className={`${styles.skeletonContainer} ${className}`}>
          {Array.from({ length: count }).map((_, index) => (
            <SkeletonListItem key={index} />
          ))}
        </div>
      )

    case 'table':
      return (
        <table className={`${styles.skeletonTable} ${className}`}>
          <thead>
            <tr>
              <th>
                <div className={styles.skeletonLine} style={{ width: '80%' }}></div>
              </th>
              <th>
                <div className={styles.skeletonLine} style={{ width: '60%' }}></div>
              </th>
              <th>
                <div className={styles.skeletonLine} style={{ width: '40%' }}></div>
              </th>
              <th>
                <div className={styles.skeletonLine} style={{ width: '30%' }}></div>
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: count }).map((_, index) => (
              <SkeletonTableRow key={index} />
            ))}
          </tbody>
        </table>
      )

    case 'form':
      return (
        <div className={`${styles.skeletonContainer} ${className}`}>
          <SkeletonForm />
        </div>
      )

    default:
      return (
        <div className={`${styles.skeletonContainer} ${className}`}>
          <SkeletonCard />
        </div>
      )
  }
}
