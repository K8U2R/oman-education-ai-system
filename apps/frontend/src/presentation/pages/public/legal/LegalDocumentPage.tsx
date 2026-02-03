/**
 * LegalDocumentPage Template - قالب صفحات المستندات القانونية
 * Generic reusable template for Privacy Policy, Terms, etc.
 */

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { apiClientRefactored as apiClient } from '@/infrastructure/services/api'
import { loggingService } from '@/infrastructure/services'
import { sanitizeHTML } from '@/infrastructure/utils/sanitize.util'
import { Button, Card } from '../../../components/common'
import { LoadingState, ErrorState } from '../../../components/shared'


interface LegalDocument {
  id: string
  version: string
  content: string
  is_active: boolean
  created_at: string
  updated_at?: string
  effective_date?: string
  expiry_date?: string
}

export interface LegalDocumentPageProps {
  type: 'privacy' | 'terms'
  title: string
  apiEndpoint: string
  acceptEndpoint: string
  loadingMessage?: string
  errorMessage?: string
  acceptButtonText?: string
}

export const LegalDocumentPage: React.FC<LegalDocumentPageProps> = ({
  type,
  title,
  apiEndpoint,
  acceptEndpoint,
  loadingMessage,
  errorMessage,
  acceptButtonText,
}) => {
  const navigate = useNavigate()
  const [document, setDocument] = useState<LegalDocument | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [accepting, setAccepting] = useState(false)

  const loadDocument = React.useCallback(async () => {
    try {
      setLoading(true)
      const data = await apiClient.get<LegalDocument>(apiEndpoint)
      setDocument(data)
      setError(null)
    } catch (err) {
      loggingService.error(`Failed to load ${type}`, err as Error)
      setError(errorMessage || `فشل تحميل ${title}`)
    } finally {
      setLoading(false)
    }
  }, [apiEndpoint, errorMessage, title, type])

  useEffect(() => {
    loadDocument()
  }, [loadDocument])

  const handleAccept = async () => {
    try {
      setAccepting(true)
      await apiClient.post(acceptEndpoint, {})
      navigate('/dashboard')
    } catch (err) {
      loggingService.error(`Failed to accept ${type}`, err as Error)
      setError(`فشل قبول ${title}`)
    } finally {
      setAccepting(false)
    }
  }

  if (loading) {
    return <LoadingState message={loadingMessage || `جاري تحميل ${title}...`} fullScreen />
  }

  if (error || !document) {
    return (
      <ErrorState
        message={error || `لم يتم العثور على ${title}`}
        onGoBack={() => navigate('/')}
        onRetry={loadDocument}
        fullScreen
      />
    )
  }

  return (
    <motion.div
      className="legal-document-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="legal-document-page__container">
        <Card className="legal-document-page__card">
          {/* Header */}
          <div className="legal-document-page__header">
            <h1 className="legal-document-page__title">{title}</h1>
            <div className="legal-document-page__meta">
              <span className="legal-document-page__version">الإصدار: {document.version}</span>
              {document.updated_at && (
                <span className="legal-document-page__date">
                  آخر تحديث: {new Date(document.updated_at).toLocaleDateString('ar-OM')}
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="legal-document-page__content">
            <div
              className="legal-document-page__text"
              dangerouslySetInnerHTML={{ __html: sanitizeHTML(document.content) }}
            />
          </div>

          {/* Actions */}
          <div className="legal-document-page__actions">
            <Button variant="outline" onClick={() => navigate('/')} disabled={accepting}>
              رفض
            </Button>
            <Button variant="primary" onClick={handleAccept} disabled={accepting}>
              {accepting ? 'جاري القبول...' : acceptButtonText || `أوافق على ${title}`}
            </Button>
          </div>
        </Card>
      </div>
    </motion.div>
  )
}
