/**
 * FormBuilder Types - أنواع مكون بناء النماذج
 *
 * جميع Types و Interfaces لمكون FormBuilder
 */

import type { ValidationRule } from '@/application'

export interface FormFieldConfig {
  name: string
  label: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'textarea' | 'select'
  placeholder?: string
  required?: boolean
  rules?: ValidationRule
  options?: Array<{ value: string; label: string }>
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export interface FormBuilderProps {
  fields: FormFieldConfig[]
  onSubmit: (data: Record<string, unknown>) => Promise<void> | void
  submitLabel?: string
  resetLabel?: string
  showReset?: boolean
  className?: string
  initialValues?: Record<string, unknown>
}
