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
      setError('الرجاء إدخال وصف للكود المطلوب')
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
        setError('فشل توليد الكود. الرجاء المحاولة مرة أخرى.')
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error
          ?.message || 'حدث خطأ أثناء توليد الكود'
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
    <div className="code-generator">
      <Card className="code-generator__card">
        <div className="code-generator__header">
          <div className="code-generator__title">
            <Code2 className="code-generator__icon" />
            <h2>توليد الكود الذكي</h2>
          </div>
          <p className="code-generator__subtitle">
            اكتب وصفاً للكود الذي تريده وسيقوم الذكاء الاصطناعي بتوليده لك
          </p>
        </div>

        <div className="code-generator__form">
          <div className="code-generator__field">
            <label className="code-generator__label">وصف الكود المطلوب *</label>
            <textarea
              className="code-generator__textarea"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="مثال: أنشئ دالة لحساب مجموع الأرقام في مصفوفة..."
              rows={4}
              disabled={isGenerating}
            />
          </div>

          <div className="code-generator__row">
            <div className="code-generator__field code-generator__field--half">
              <label className="code-generator__label">اللغة البرمجية</label>
              <select
                className="code-generator__select"
                value={language}
                onChange={e => setLanguage(e.target.value)}
                disabled={isGenerating}
              >
                <option value="">اختر اللغة (اختياري)</option>
                {languages.map(lang => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            <div className="code-generator__field code-generator__field--half">
              <label className="code-generator__label">الإطار البرمجي</label>
              <select
                className="code-generator__select"
                value={framework}
                onChange={e => setFramework(e.target.value)}
                disabled={isGenerating}
              >
                <option value="">اختر الإطار (اختياري)</option>
                {frameworks.map(fw => (
                  <option key={fw} value={fw}>
                    {fw}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="code-generator__row">
            <div className="code-generator__field code-generator__field--half">
              <label className="code-generator__label">نمط الكود</label>
              <select
                className="code-generator__select"
                value={style}
                onChange={e =>
                  setStyle(e.target.value as 'simple' | 'detailed' | 'commented' | 'minimal')
                }
                disabled={isGenerating}
              >
                <option value="simple">بسيط</option>
                <option value="detailed">مفصل</option>
                <option value="commented">مع تعليقات</option>
                <option value="minimal">مختصر</option>
              </select>
            </div>

            <div className="code-generator__field code-generator__field--half">
              <div className="code-generator__checkboxes">
                <label className="code-generator__checkbox">
                  <input
                    type="checkbox"
                    checked={includeTests}
                    onChange={e => setIncludeTests(e.target.checked)}
                    disabled={isGenerating}
                  />
                  <span>تضمين اختبارات</span>
                </label>
                <label className="code-generator__checkbox">
                  <input
                    type="checkbox"
                    checked={includeDocs}
                    onChange={e => setIncludeDocs(e.target.checked)}
                    disabled={isGenerating}
                  />
                  <span>تضمين توثيق</span>
                </label>
              </div>
            </div>
          </div>

          {error && (
            <div className="code-generator__error">
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
            {isGenerating ? 'جاري التوليد...' : 'توليد الكود'}
          </Button>
        </div>

        {result && (
          <div className="code-generator__result">
            <div className="code-generator__result-header">
              <h3>الكود المولد</h3>
              <div className="code-generator__actions">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCopy}
                  leftIcon={copied ? <Check /> : <Copy />}
                >
                  {copied ? 'تم النسخ' : 'نسخ'}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleDownload}
                  leftIcon={<Download />}
                >
                  تحميل
                </Button>
              </div>
            </div>

            {result.explanation && (
              <div className="code-generator__explanation">
                <h4>شرح الكود:</h4>
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
