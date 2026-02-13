/**
 * Privacy Policy Page - صفحة سياسة الخصوصية
 * Simplified using LegalDocumentPage template
 */

import React from 'react'
import { useTranslation } from 'react-i18next'
import { LegalDocumentPage } from './LegalDocumentPage'

const PrivacyPolicyPage: React.FC = () => {
  const { t } = useTranslation('common')

  return (
    <LegalDocumentPage
      type="privacy"
      title={t('public.legal.privacy.title')}
      apiEndpoint="/api/v1/legal/privacy/current"
      acceptEndpoint="/api/v1/legal/privacy/accept"
      loadingMessage={t('public.legal.privacy.loading')}
      errorMessage={t('public.legal.privacy.error')}
      acceptButtonText={t('public.legal.privacy.accept')}
    />
  )
}

export default PrivacyPolicyPage
