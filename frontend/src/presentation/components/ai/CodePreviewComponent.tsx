/**
 * Code Preview Component - مكون معاينة الكود
 *
 * مكون لعرض الكود المولد مع تمييز الصيغة
 */

import React, { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { Button } from '../common'
import './CodePreviewComponent.scss'

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

  // بسيط: تقسيم الكود إلى أسطر لعرض أرقام الأسطر
  const lines = code.split('\n')

  return (
    <div className="code-preview">
      <div className="code-preview__header">
        <span className="code-preview__language">{language}</span>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleCopy}
          leftIcon={copied ? <Check /> : <Copy />}
        >
          {copied ? 'تم النسخ' : 'نسخ'}
        </Button>
      </div>
      <div className="code-preview__container">
        {showLineNumbers && (
          <div className="code-preview__line-numbers">
            {lines.map((_, index) => (
              <span key={index} className="code-preview__line-number">
                {index + 1}
              </span>
            ))}
          </div>
        )}
        <pre className="code-preview__code">
          <code className={`language-${language}`}>{code}</code>
        </pre>
      </div>
    </div>
  )
}
