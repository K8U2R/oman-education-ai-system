/**
 * Privacy Policy Page - صفحة سياسة الخصوصية
 * Simplified using LegalDocumentPage template
 */

import React from 'react'
import { LegalDocumentPage } from './LegalDocumentPage'

const PrivacyPolicyPage: React.FC = () => {
  return (
    <LegalDocumentPage
      type="privacy"
      title="سياسة الخصوصية"
      apiEndpoint="/api/v1/legal/privacy/current"
      acceptEndpoint="/api/v1/legal/privacy/accept"
      loadingMessage="جارٍ تحميل سياسة الخصوصية..."
      errorMessage="فشل تحميل سياسة الخصوصية"
      acceptButtonText="أوافق على سياسة الخصوصية"
    />
  )
}

export default PrivacyPolicyPage
