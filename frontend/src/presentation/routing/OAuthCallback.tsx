/**
 * OAuthCallback Component - مكون معالجة OAuth Callback
 *
 * مكون منفصل لمعالجة OAuth callback
 */

import React, { useEffect } from 'react'
import { useOAuth } from '@/application'

const OAuthCallback: React.FC = () => {
  const { isLoading, error, handleCallback } = useOAuth()

  useEffect(() => {
    handleCallback()
  }, [handleCallback])

  if (error) {
    const isConfigError = error.includes('Unable to exchange external code')
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-lg mx-auto p-8 bg-white rounded-lg shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">✕</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">فشل تسجيل الدخول</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          {isConfigError && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-right">
              <p className="text-sm font-semibold text-yellow-800 mb-2">
                ⚠️ المشكلة في إعدادات OAuth:
              </p>
              <ul className="text-sm text-yellow-700 list-disc list-inside space-y-1 mb-2">
                <li>
                  تحقق من Client Secret في Supabase Dashboard (يجب أن يطابق Google Cloud Console)
                </li>
                <li>
                  تحقق من Redirect URI في Google Cloud Console:{' '}
                  <code className="bg-yellow-100 px-1 rounded text-xs">
                    https://arnudllmjhghxmnrfwik.supabase.co/auth/v1/callback
                  </code>
                </li>
                <li>
                  تحقق من Redirect URLs في Supabase Dashboard (يجب أن تحتوي على localhost:3000)
                </li>
                <li>
                  راجع ملف <code className="bg-yellow-100 px-1 rounded">OAUTH_QUICK_FIX.md</code>{' '}
                  للحل السريع
                </li>
              </ul>
              <p className="text-xs text-yellow-600 mt-2">
                📖 دليل شامل: <code className="bg-yellow-100 px-1 rounded">OAUTH_QUICK_FIX.md</code>{' '}
                | <code className="bg-yellow-100 px-1 rounded">OAUTH_TROUBLESHOOTING.md</code>
              </p>
            </div>
          )}
          <p className="text-sm text-gray-500 mt-4">سيتم إعادة توجيهك إلى صفحة تسجيل الدخول...</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جارٍ تسجيل الدخول...</p>
        </div>
      </div>
    )
  }

  return null
}

export default OAuthCallback
