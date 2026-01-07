/**
 * Terms & Conditions Page
 */

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClientRefactored as apiClient } from '@/infrastructure/api'
// import { authService } from '@/application/services/auth.service' // غير مستخدم حالياً
import { Button, Card } from '@/presentation/components/common'

interface Terms {
  id: string
  version: string
  content: string
  is_active: boolean
  created_at: string
  updated_at?: string
  effective_date?: string
  expiry_date?: string
}

const TermsPage: React.FC = () => {
  const navigate = useNavigate()
  const [terms, setTerms] = useState<Terms | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [accepting, setAccepting] = useState(false)

  useEffect(() => {
    loadTerms()
  }, [])

  const loadTerms = async () => {
    try {
      setLoading(true)
      // apiClient.get يعيد Promise<T> مباشرة (response.data)
      const termsData = await apiClient.get<Terms>('/api/v1/legal/terms/current')
      setTerms(termsData)
      setError(null)
    } catch (err) {
      console.error('Failed to load terms:', err)
      setError('فشل تحميل الشروط والأحكام')
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async () => {
    try {
      setAccepting(true)
      await apiClient.post('/api/v1/legal/terms/accept', {})
      navigate('/dashboard')
    } catch (err) {
      console.error('Failed to accept terms:', err)
      setError('فشل قبول الشروط والأحكام')
    } finally {
      setAccepting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جارٍ تحميل الشروط والأحكام...</p>
        </div>
      </div>
    )
  }

  if (error || !terms) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-2xl mx-auto p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">خطأ</h2>
            <p className="text-gray-600 mb-4">{error || 'لم يتم العثور على الشروط والأحكام'}</p>
            <Button onClick={() => navigate('/')}>العودة للصفحة الرئيسية</Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">الشروط والأحكام</h1>
            <p className="text-gray-600">الإصدار: {terms.version}</p>
            {terms.updated_at && (
              <p className="text-sm text-gray-500">
                آخر تحديث: {new Date(terms.updated_at).toLocaleDateString('ar-OM')}
              </p>
            )}
          </div>

          <div className="prose max-w-none mb-8">
            <div
              className="text-gray-700 whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: terms.content }}
            />
          </div>

          <div className="flex gap-4 justify-end">
            <Button variant="outline" onClick={() => navigate('/')}>
              رفض
            </Button>
            <Button onClick={handleAccept} disabled={accepting}>
              {accepting ? 'جاري القبول...' : 'أوافق على الشروط'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default TermsPage
