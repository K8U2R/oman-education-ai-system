/**
 * Skip Link - رابط التخطي
 *
 * رابط للانتقال مباشرة إلى المحتوى الرئيسي (لإمكانية الوصول)
 */

import React from 'react'

interface SkipLinkProps {
  /**
   * ID العنصر المستهدف
   */
  targetId?: string

  /**
   * نص الرابط
   */
  text?: string
}

/**
 * Skip Link Component
 */
export const SkipLink: React.FC<SkipLinkProps> = ({
  targetId = 'main-content',
  text = 'تخطي إلى المحتوى الرئيسي',
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault()
    const target = document.getElementById(targetId)
    if (target) {
      target.focus()
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <a href={`#${targetId}`} className="skipLink" onClick={handleClick}>
      {text}
    </a>
  )
}
