/**
 * Terms & Conditions Page - صفحة الشروط والأحكام
 * Simplified using LegalDocumentPage template
 */

import React from 'react'
import { useTranslation } from 'react-i18next'
import { LegalDocumentPage } from './LegalDocumentPage'

const TermsPage: React.FC = () => {
  const { t } = useTranslation('common')

  return (
    <LegalDocumentPage
      type="terms"
      title={t('public.legal.terms.title')}
      apiEndpoint="/api/v1/legal/terms/current"
      acceptEndpoint="/api/v1/legal/terms/accept"
      loadingMessage={t('public.legal.terms.loading')}
      errorMessage={t('public.legal.terms.error')}
      acceptButtonText={t('public.legal.terms.accept')}
    />
  )
}

export default TermsPage
