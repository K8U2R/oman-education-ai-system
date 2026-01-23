/**
 * Skeleton Loader - مكون تحميل الهيكل
 *
 * مكون محسّن لعرض Skeleton loaders أثناء التحميل
 */

import React from 'react'

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
  <div className="skeletonCard">
    <div className="skeletonCardHeader"></div>
    <div className="skeletonCardContent">
      <div className="skeletonLine"></div>
      <div className="skeletonLine"></div>
      <div className="skeletonLine" style={{ width: '60%' }}></div>
    </div>
    <div className="skeletonCardFooter">
      <div className="skeletonButton"></div>
      <div className="skeletonButton"></div>
    </div>
  </div>
)

/**
 * Skeleton List Item
 */
const SkeletonListItem: React.FC = () => (
  <div className="skeletonListItem">
    <div className="skeletonAvatar"></div>
    <div className="skeletonListItemContent">
      <div className="skeletonLine"></div>
      <div className="skeletonLine" style={{ width: '70%' }}></div>
    </div>
  </div>
)

/**
 * Skeleton Table Row
 */
const SkeletonTableRow: React.FC = () => (
  <tr className="skeletonTableRow">
    <td>
      <div className="skeletonLine" style={{ width: '80%' }}></div>
    </td>
    <td>
      <div className="skeletonLine" style={{ width: '60%' }}></div>
    </td>
    <td>
      <div className="skeletonLine" style={{ width: '40%' }}></div>
    </td>
    <td>
      <div className="skeletonButton" style={{ width: '60px' }}></div>
    </td>
  </tr>
)

/**
 * Skeleton Form
 */
const SkeletonForm: React.FC = () => (
  <div className="skeletonForm">
    <div className="skeletonFormGroup">
      <div className="skeletonLabel"></div>
      <div className="skeletonInput"></div>
    </div>
    <div className="skeletonFormGroup">
      <div className="skeletonLabel"></div>
      <div className="skeletonInput"></div>
    </div>
    <div className="skeletonFormGroup">
      <div className="skeletonLabel"></div>
      <div className="skeletonTextarea"></div>
    </div>
    <div className="skeletonFormActions">
      <div className="skeletonButton" style={{ width: '120px' }}></div>
      <div className="skeletonButton" style={{ width: '100px' }}></div>
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
    return <div className={`skeletonContainer ${className}`}>{custom}</div>
  }

  switch (type) {
    case 'card':
      return (
        <div className={`skeletonContainer ${className}`}>
          {Array.from({ length: count }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      )

    case 'list':
      return (
        <div className={`skeletonContainer ${className}`}>
          {Array.from({ length: count }).map((_, index) => (
            <SkeletonListItem key={index} />
          ))}
        </div>
      )

    case 'table':
      return (
        <table className={`skeletonTable ${className}`}>
          <thead>
            <tr>
              <th>
                <div className="skeletonLine" style={{ width: '80%' }}></div>
              </th>
              <th>
                <div className="skeletonLine" style={{ width: '60%' }}></div>
              </th>
              <th>
                <div className="skeletonLine" style={{ width: '40%' }}></div>
              </th>
              <th>
                <div className="skeletonLine" style={{ width: '30%' }}></div>
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
        <div className={`skeletonContainer ${className}`}>
          <SkeletonForm />
        </div>
      )

    default:
      return (
        <div className={`skeletonContainer ${className}`}>
          <SkeletonCard />
        </div>
      )
  }
}
