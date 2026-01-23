/**
 * Error Message - رسالة الخطأ
 *
 * مكون لإظهار رسائل الأخطاء بشكل منسق
 */

import React from 'react'


interface ErrorMessageProps {
  /** الرسالة الأساسية */
  message: string
  /** الرسالة الثانوية */
  secondaryMessage?: string
  /** المسار الذي حاول المستخدم الوصول إليه */
  attemptedPath?: string
  /** className إضافي */
  className?: string
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  secondaryMessage,
  attemptedPath,
  className = '',
}) => {
  return (
    <div className={`error-message ${className}`}>
      <p className="error-message__primary">{message}</p>
      {secondaryMessage && <p className="error-message__secondary">{secondaryMessage}</p>}
      {attemptedPath && attemptedPath !== window.location.pathname && (
        <div className="error-message__path">
          <span className="error-message__path-label">المسار المطلوب:</span>
          <span className="error-message__path-value">{attemptedPath}</span>
        </div>
      )}
    </div>
  )
}
