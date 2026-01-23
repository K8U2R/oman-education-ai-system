/**
 * FormBuilder Component - مكون بناء النماذج
 *
 * مكون لبناء نماذج ديناميكية
 */

import React, { useState, useCallback } from 'react'
import { FormField } from '../FormField'
import { Button } from '../../common'
import { ValidationService } from '@/application'
import { cn } from '../../common/utils/classNames'
import type { FormBuilderProps } from './FormBuilder.types'

export const FormBuilder: React.FC<FormBuilderProps> = ({
  fields,
  onSubmit,
  submitLabel = 'إرسال',
  resetLabel = 'إعادة تعيين',
  showReset = true,
  className = '',
  initialValues = {},
}) => {
  const [formData, setFormData] = useState<Record<string, unknown>>(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = useCallback(
    (name: string, value: unknown) => {
      setFormData(prev => ({ ...prev, [name]: value }))
      // Clear error when user starts typing
      if (errors[name]) {
        setErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors[name]
          return newErrors
        })
      }
    },
    [errors]
  )

  const validate = useCallback((): boolean => {
    const newErrors: Record<string, string> = {}

    fields.forEach(field => {
      const value = formData[field.name]
      const fieldName = field.label

      if (field.rules) {
        const error = ValidationService.validateField(value, field.rules, fieldName)
        if (error) {
          newErrors[field.name] = error
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [fields, formData])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (!validate()) {
        return
      }

      setIsSubmitting(true)
      try {
        await onSubmit(formData)
      } catch (error) {
        console.error('Form submission error:', error)
      } finally {
        setIsSubmitting(false)
      }
    },
    [formData, onSubmit, validate]
  )

  const handleReset = useCallback(() => {
    setFormData(initialValues)
    setErrors({})
  }, [initialValues])

  return (
    <form onSubmit={handleSubmit} className={cn('form-builder', className)}>
      {fields.map(field => (
        <FormField
          key={field.name}
          label={field.label}
          name={field.name}
          value={(formData[field.name] as string) || ''}
          onChange={value => handleChange(field.name, value)}
          type={field.type === 'textarea' ? 'text' : field.type === 'select' ? 'text' : field.type}
          placeholder={field.placeholder}
          error={errors[field.name]}
          hint={field.hint}
          required={field.required}
          leftIcon={field.leftIcon}
          rightIcon={field.rightIcon}
        />
      ))}

      <div className="form-builder__actions">
        <Button type="submit" variant="primary" disabled={isSubmitting} fullWidth>
          {isSubmitting ? 'جاري الإرسال...' : submitLabel}
        </Button>

        {showReset && (
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isSubmitting}
            fullWidth
          >
            {resetLabel}
          </Button>
        )}
      </div>
    </form>
  )
}
