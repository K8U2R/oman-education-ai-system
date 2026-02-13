/**
 * Code Preview Component - مكون معاينة الكود
 *
 * مكون لعرض الكود المولد مع تمييز الصيغة
 */

import React, { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { Button } from '../common'
import { useTranslation } from 'react-i18next'
import styles from './CodePreviewComponent.module.scss'

interface CodePreviewComponentProps {
  code: string
  language?: string
  showLineNumbers?: boolean
}

export const CodePreviewComponent: React.FC<CodePreviewComponentProps> = ({
  code,
  language = 'javascript',
  showLineNumbers = true,
}) => {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  // Split code into lines for line number display
  const lines = code.split('\n')

  return (
    <div className={styles.preview}>
      <div className={styles.header}>
        <span className={styles.language}>{language}</span>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleCopy}
          leftIcon={copied ? <Check /> : <Copy />}
        >
          {copied ? t('ai.generator.copied') : t('ai.generator.copy')}
        </Button>
      </div>
      <div className={styles.container}>
        {showLineNumbers && (
          <div className={styles.lineNumbers}>
            {lines.map((_, index) => (
              <span key={index} className={styles.lineNumber}>
                {index + 1}
              </span>
            ))}
          </div>
        )}
        <pre className={styles.code}>
          <code className={`language-${language}`}>{code}</code>
        </pre>
      </div>
    </div>
  )
}
