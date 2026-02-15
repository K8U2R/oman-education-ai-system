/**
 * Code Generator Page - صفحة توليد الكود
 *
 * صفحة كاملة لتوليد الكود باستخدام AI
 */

import React from 'react'
import { Code2 } from 'lucide-react'
import { CodeGeneratorComponent, type CodeGenerationResult } from '@/presentation/components/ai'
import { PageHeader } from '../components'


const CodeGeneratorPage: React.FC = () => {
  const handleCodeGenerated = (_result: CodeGenerationResult): void => {
    // Code generation completed
    // يمكن إضافة منطق إضافي هنا مثل حفظ الكود أو إرسال إشعار
  }

  return (
    <div className="code-generator-page">
      <PageHeader
        title="توليد الكود الذكي"
        description="استخدم الذكاء الاصطناعي لتوليد الكود بسهولة"
        icon={<Code2 />}
      />
      <div className="code-generator-page__content">
        <CodeGeneratorComponent onCodeGenerated={handleCodeGenerated} />
      </div>
    </div>
  )
}

export default CodeGeneratorPage
