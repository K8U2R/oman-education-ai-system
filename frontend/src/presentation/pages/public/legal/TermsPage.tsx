/**
 * Terms & Conditions Page - صفحة الشروط والأحكام
 * Simplified using LegalDocumentPage template
 */

import React from 'react'
import { LegalDocumentPage } from './LegalDocumentPage'

const TermsPage: React.FC = () => {
  return (
    <LegalDocumentPage
      type="terms"
      title="الشروط والأحكام"
      apiEndpoint="/api/v1/legal/terms/current"
      acceptEndpoint="/api/v1/legal/terms/accept"
      loadingMessage="جارٍ تحميل الشروط والأحكام..."
      errorMessage="فشل تحميل الشروط والأحكام"
      acceptButtonText="أوافق على الشروط والأحكام"
    />
  )
}

export default TermsPage
