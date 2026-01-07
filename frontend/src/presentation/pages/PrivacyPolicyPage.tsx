/**
 * Privacy Policy Page
 */

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClientRefactored as apiClient } from '@/infrastructure/api'
import { Button, Card } from '@/presentation/components/common'

interface PrivacyPolicy {
  id: string
  version: string
  content: string
  is_active: boolean
  created_at: string
  updated_at?: string
  effective_date?: string
  expiry_date?: string
}

const PrivacyPolicyPage: React.FC = () => {
  const navigate = useNavigate()
  const [policy, setPolicy] = useState<PrivacyPolicy | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [accepting, setAccepting] = useState(false)

  useEffect(() => {
    loadPrivacyPolicy()
  }, [])

  const loadPrivacyPolicy = async () => {
    try {
      setLoading(true)
      const response = await apiClient.get<PrivacyPolicy>('/api/v1/legal/privacy/current')
      setPolicy(response)
      setError(null)
    } catch (err) {
      console.error('Failed to load privacy policy:', err)
      setError('فشل تحميل سياسة الخصوصية')
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async () => {
    try {
      setAccepting(true)
      await apiClient.post('/api/v1/legal/privacy/accept', {})
      navigate('/dashboard')
    } catch (err) {
      console.error('Failed to accept privacy policy:', err)
      setError('فشل قبول سياسة الخصوصية')
    } finally {
      setAccepting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جارٍ تحميل سياسة الخصوصية...</p>
        </div>
      </div>
    )
  }

  if (error || !policy) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-2xl mx-auto p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">خطأ</h2>
            <p className="text-gray-600 mb-4">{error || 'لم يتم العثور على سياسة الخصوصية'}</p>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">سياسة الخصوصية</h1>
            <p className="text-gray-600">الإصدار: {policy.version}</p>
            {policy.updated_at && (
              <p className="text-sm text-gray-500">
                آخر تحديث: {new Date(policy.updated_at).toLocaleDateString('ar-OM')}
              </p>
            )}
          </div>

          <div className="prose max-w-none mb-8">
            <div
              className="text-gray-700 whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: policy.content }}
            />
          </div>

          <div className="flex gap-4 justify-end">
            <Button variant="outline" onClick={() => navigate('/')}>
              رفض
            </Button>
            <Button onClick={handleAccept} disabled={accepting}>
              {accepting ? 'جاري القبول...' : 'أوافق على السياسة'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default PrivacyPolicyPage
