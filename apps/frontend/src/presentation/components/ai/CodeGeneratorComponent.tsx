/**
 * Code Generator Component - مكون توليد الكود
 *
 * مكون تفاعلي لتوليد الكود باستخدام AI
 */

import React, { useState } from 'react'
import { Code2, Sparkles, Copy, Download, Check } from 'lucide-react'
import { Button, Card } from '../common'
import { CodePreviewComponent } from './CodePreviewComponent'
import { apiClient } from '@/infrastructure/services/api'
import { API_ENDPOINTS } from '@/domain/constants'
import { useTranslation } from 'react-i18next'
import styles from './CodeGeneratorComponent.module.scss'

export interface CodeGenerationRequest {
  prompt: string
  language?: string
  framework?: string
  context?: string
  style?: 'simple' | 'detailed' | 'commented' | 'minimal'
  include_tests?: boolean
  include_docs?: boolean
}

export interface CodeGenerationResult {
  code: string
  language: string
  explanation?: string
  project_id?: string
  files?: Array<{
    path: string
    content: string
  }>
}

interface CodeGeneratorComponentProps {
  onCodeGenerated?: (result: CodeGenerationResult) => void
  initialPrompt?: string
}

export const CodeGeneratorComponent: React.FC<CodeGeneratorComponentProps> = ({
  onCodeGenerated,
  initialPrompt = '',
}) => {
  const { t } = useTranslation()
  const [prompt, setPrompt] = useState(initialPrompt)
  const [language, setLanguage] = useState('')
  const [framework, setFramework] = useState('')
  const [style, setStyle] = useState<'simple' | 'detailed' | 'commented' | 'minimal'>('detailed')
  const [includeTests, setIncludeTests] = useState(false)
  const [includeDocs, setIncludeDocs] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<CodeGenerationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError(t('ai.generator.errors.description_required'))
      return
    }

    setIsGenerating(true)
    setError(null)
    setResult(null)

    try {
      const request: CodeGenerationRequest = {
        prompt: prompt.trim(),
        language: language || undefined,
        framework: framework || undefined,
        style,
        include_tests: includeTests,
        include_docs: includeDocs,
      }

      const response = await apiClient.post<{ success: boolean; data: CodeGenerationResult }>(
        API_ENDPOINTS.CODE_GENERATION.GENERATE,
        request
      )

      if (response.success && response.data) {
        setResult(response.data)
        onCodeGenerated?.(response.data)
      } else {
        setError(t('ai.generator.errors.generation_failed'))
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error
          ?.message || t('ai.generator.errors.generation_failed')
      setError(errorMessage)
      console.error('Code generation error:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async () => {
    if (!result?.code) return

    try {
      await navigator.clipboard.writeText(result.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  const handleDownload = () => {
    if (!result?.code) return

    const blob = new Blob([result.code], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `generated-code.${result.language || 'txt'}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const languages = [
    'JavaScript',
    'TypeScript',
    'Python',
    'Java',
    'C++',
    'C#',
    'Go',
    'Rust',
    'PHP',
    'Ruby',
    'Swift',
    'Kotlin',
  ]

  const frameworks = [
    'React',
    'Vue',
    'Angular',
    'Next.js',
    'Express',
    'Django',
    'Flask',
    'Spring',
    'Laravel',
    'FastAPI',
  ]

  return (
    <div className={styles.generator}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <div className={styles.title}>
            <Code2 className={styles.icon} />
            <h2>{t('ai.generator.title')}</h2>
          </div>
          <p className={styles.subtitle}>
            {t('ai.generator.subtitle')}
          </p>
        </div>

        <div className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>{t('ai.generator.description_label')} *</label>
            <textarea
              className={styles.textarea}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder={t('ai.generator.description_placeholder')}
              rows={4}
              disabled={isGenerating}
            />
          </div>

          <div className={styles.row}>
            <div className={`${styles.field} ${styles['field--half']}`}>
              <label className={styles.label}>{t('ai.generator.language_label')}</label>
              <select
                className={styles.select}
                value={language}
                onChange={e => setLanguage(e.target.value)}
                disabled={isGenerating}
              >
                <option value="">{t('ai.generator.language_placeholder')}</option>
                {languages.map(lang => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            <div className={`${styles.field} ${styles['field--half']}`}>
              <label className={styles.label}>{t('ai.generator.framework_label')}</label>
              <select
                className={styles.select}
                value={framework}
                onChange={e => setFramework(e.target.value)}
                disabled={isGenerating}
              >
                <option value="">{t('ai.generator.framework_placeholder')}</option>
                {frameworks.map(fw => (
                  <option key={fw} value={fw}>
                    {fw}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={`${styles.field} ${styles['field--half']}`}>
              <label className={styles.label}>{t('ai.generator.style_label')}</label>
              <select
                className={styles.select}
                value={style}
                onChange={e =>
                  setStyle(e.target.value as 'simple' | 'detailed' | 'commented' | 'minimal')
                }
                disabled={isGenerating}
              >
                <option value="simple">{t('ai.generator.styles.simple')}</option>
                <option value="detailed">{t('ai.generator.styles.detailed')}</option>
                <option value="commented">{t('ai.generator.styles.commented')}</option>
                <option value="minimal">{t('ai.generator.styles.minimal')}</option>
              </select>
            </div>

            <div className={`${styles.field} ${styles['field--half']}`}>
              <div className={styles.checkboxes}>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={includeTests}
                    onChange={e => setIncludeTests(e.target.checked)}
                    disabled={isGenerating}
                  />
                  <span>{t('ai.generator.include_tests')}</span>
                </label>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={includeDocs}
                    onChange={e => setIncludeDocs(e.target.checked)}
                    disabled={isGenerating}
                  />
                  <span>{t('ai.generator.include_docs')}</span>
                </label>
              </div>
            </div>
          </div>

          {error && (
            <div className={styles.error}>
              <span>{error}</span>
            </div>
          )}

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleGenerate}
            isLoading={isGenerating}
            leftIcon={<Sparkles />}
            disabled={!prompt.trim() || isGenerating}
          >
            {isGenerating ? t('ai.generator.generating') : t('ai.generator.generate_btn')}
          </Button>
        </div>

        {result && (
          <div className={styles.result}>
            <div className={styles.resultHeader}>
              <h3>{t('ai.generator.result_title')}</h3>
              <div className={styles.actions}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCopy}
                  leftIcon={copied ? <Check /> : <Copy />}
                >
                  {copied ? t('ai.generator.copied') : t('ai.generator.copy')}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleDownload}
                  leftIcon={<Download />}
                >
                  {t('ai.generator.download')}
                </Button>
              </div>
            </div>

            {result.explanation && (
              <div className={styles.explanation}>
                <h4>{t('ai.generator.explanation_title')}</h4>
                <p>{result.explanation}</p>
              </div>
            )}

            <CodePreviewComponent code={result.code} language={result.language} />
          </div>
        )}
      </Card>
    </div>
  )
}
