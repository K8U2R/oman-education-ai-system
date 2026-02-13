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
import { Button } from '../../../components/common'
import { LoadingState, ErrorState } from '../../../components/shared'
import { ROUTES } from '@/domain/constants/routes.constants'


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

import { useTranslation } from 'react-i18next'
import styles from './Legal.module.scss'

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
  const { t } = useTranslation('common')
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
      setError(errorMessage || t('public.legal.common.load_error'))
    } finally {
      setLoading(false)
    }
  }, [apiEndpoint, errorMessage, title, type, t])

  useEffect(() => {
    loadDocument()
  }, [loadDocument])

  const handleAccept = async () => {
    try {
      setAccepting(true)
      await apiClient.post(acceptEndpoint, {})
      navigate(ROUTES.DASHBOARD)
    } catch (err) {
      loggingService.error(`Failed to accept ${type}`, err as Error)
      setError(t('public.legal.common.accept_error'))
    } finally {
      setAccepting(false)
    }
  }

  if (loading) {
    return <LoadingState message={loadingMessage || t('common.loading')} fullScreen />
  }

  if (error || !document) {
    return (
      <ErrorState
        message={error || t('public.legal.common.not_found')}
        onGoBack={() => navigate('/')}
        onRetry={loadDocument}
        fullScreen
      />
    )
  }

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.contentWrapper}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>{title}</h1>
          <div className={styles.meta}>
            <span className={styles.version}>{t('public.legal.common.version')}: {document.version}</span>
            {document.updated_at && (
              <span className={styles.lastUpdated}>
                {t('public.legal.common.last_updated')}: {new Date(document.updated_at).toLocaleDateString(t('common.locale_code') === 'ar' ? 'ar-OM' : 'en-US')}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className={styles.section}>
          <div
            className={styles.text}
            dangerouslySetInnerHTML={{ __html: sanitizeHTML(document.content) }}
          />
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <Button variant="outline" onClick={() => navigate('/')} disabled={accepting}>
            {t('public.legal.common.reject')}
          </Button>
          <Button variant="primary" onClick={handleAccept} disabled={accepting}>
            {accepting ? t('public.legal.common.accepting') : acceptButtonText || t('public.legal.common.accept')}
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
