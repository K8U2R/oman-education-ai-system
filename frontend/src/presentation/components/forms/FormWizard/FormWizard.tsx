/**
 * FormWizard Component - مكون معالج النماذج
 *
 * مكون لبناء نماذج متعددة الخطوات
 */

import React, { useState, useCallback } from 'react'
import { ChevronRight, ChevronLeft, Check } from 'lucide-react'
import { Button } from '../../common'
import type { FormFieldConfig } from '../FormBuilder/FormBuilder.types'
import { cn } from '../../common/utils/classNames'

export interface FormWizardStep {
  id: string
  title: string
  description?: string
  fields: FormFieldConfig[]
}

export interface FormWizardProps {
  steps: FormWizardStep[]
  onSubmit: (data: Record<string, unknown>) => Promise<void> | void
  onStepChange?: (stepIndex: number) => void
  className?: string
  initialValues?: Record<string, unknown>
}

export const FormWizard: React.FC<FormWizardProps> = ({
  steps,
  onSubmit,
  onStepChange,
  className = '',
  initialValues = {},
}) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Record<string, unknown>>(initialValues)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  const currentStepData = steps[currentStep]
  const isFirstStep = currentStep === 0
  const isLastStep = currentStep === steps.length - 1

  const handleNext = useCallback(() => {
    if (!isLastStep) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      setCompletedSteps(prev => new Set([...prev, currentStep]))
      onStepChange?.(nextStep)
    }
  }, [currentStep, isLastStep, onStepChange])

  const handlePrevious = useCallback(() => {
    if (!isFirstStep) {
      const prevStep = currentStep - 1
      setCurrentStep(prevStep)
      onStepChange?.(prevStep)
    }
  }, [currentStep, isFirstStep, onStepChange])

  const handleStepClick = useCallback(
    (stepIndex: number) => {
      // Allow clicking on completed steps or next step
      if (completedSteps.has(stepIndex) || stepIndex === currentStep + 1) {
        setCurrentStep(stepIndex)
        onStepChange?.(stepIndex)
      }
    },
    [completedSteps, currentStep, onStepChange]
  )

  const handleFieldChange = useCallback((name: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleSubmit = useCallback(async () => {
    setCompletedSteps(prev => new Set([...prev, currentStep]))
    await onSubmit(formData)
  }, [formData, onSubmit, currentStep])

  return (
    <div className={cn('form-wizard', className)}>
      {/* Steps Indicator */}
      <div className="form-wizard__steps">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(index)
          const isActive = index === currentStep
          const isClickable = isCompleted || index === currentStep + 1

          return (
            <div
              key={step.id}
              className={cn(
                'form-wizard__step',
                isActive && 'form-wizard__step--active',
                isCompleted && 'form-wizard__step--completed',
                isClickable && 'form-wizard__step--clickable'
              )}
              onClick={() => isClickable && handleStepClick(index)}
            >
              <div className="form-wizard__step-number">
                {isCompleted ? <Check className="w-4 h-4" /> : <span>{index + 1}</span>}
              </div>
              <div className="form-wizard__step-content">
                <h3 className="form-wizard__step-title">{step.title}</h3>
                {step.description && (
                  <p className="form-wizard__step-description">{step.description}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Form Content */}
      {currentStepData && (
        <div className="form-wizard__content">
          <div className="form-wizard__step-header">
            <h2 className="form-wizard__step-header-title">{currentStepData.title}</h2>
            {currentStepData.description && (
              <p className="form-wizard__step-header-description">{currentStepData.description}</p>
            )}
          </div>

          <div className="form-wizard__form">
            {currentStepData.fields.map(field => (
              <div key={field.name} className="form-wizard__field">
                {/* Render field based on type */}
                <label className="form-wizard__field-label">
                  {field.label}
                  {field.required && <span className="form-wizard__field-required">*</span>}
                </label>
                {field.type === 'textarea' ? (
                  <textarea
                    className="form-wizard__textarea"
                    value={(formData[field.name] as string) || ''}
                    onChange={e => handleFieldChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    required={field.required}
                  />
                ) : field.type === 'select' ? (
                  <select
                    className="form-wizard__select"
                    value={(formData[field.name] as string) || ''}
                    onChange={e => handleFieldChange(field.name, e.target.value)}
                    required={field.required}
                  >
                    <option value="">{field.placeholder || 'اختر...'}</option>
                    {field.options?.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type || 'text'}
                    className="form-wizard__input"
                    value={(formData[field.name] as string) || ''}
                    onChange={e => handleFieldChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    required={field.required}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="form-wizard__navigation">
        <Button
          type="button"
          variant="outline"
          onClick={handlePrevious}
          disabled={isFirstStep}
          leftIcon={<ChevronRight className="w-4 h-4" />}
        >
          السابق
        </Button>

        {isLastStep ? (
          <Button
            type="button"
            variant="primary"
            onClick={handleSubmit}
            rightIcon={<Check className="w-4 h-4" />}
          >
            إرسال
          </Button>
        ) : (
          <Button
            type="button"
            variant="primary"
            onClick={handleNext}
            rightIcon={<ChevronLeft className="w-4 h-4" />}
          >
            التالي
          </Button>
        )}
      </div>
    </div>
  )
}
