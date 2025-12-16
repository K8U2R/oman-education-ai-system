import { useState, useCallback, useRef, useEffect } from 'react';
import { TextInputState, TextInputOptions, TextValidationResult } from '../types/text-input.types';
import { validateMessage } from '../utils/messageValidator';

/**
 * Hook لإدارة حالة حقل إدخال النص
 */
export function useTextInput(
  initialValue: string = '',
  options: TextInputOptions = {}
) {
  const [value, setValue] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // حساب الإحصائيات
  const characterCount = value.length;
  const wordCount = value.trim() ? value.trim().split(/\s+/).filter(word => word.length > 0).length : 0;
  const lineCount = value.split('\n').length;

  // حالة الإدخال
  const state: TextInputState = {
    value,
    characterCount,
    wordCount,
    lineCount,
    isFocused,
    isLoading: false,
    hasError,
    errorMessage,
  };

  // تحديث القيمة
  const updateValue = useCallback((newValue: string) => {
    setValue(newValue);
    setHasError(false);
    setErrorMessage(undefined);
  }, []);

  // التحقق من النص
  const validate = useCallback((): TextValidationResult => {
    const result = validateMessage(value);
    if (!result.valid) {
      setHasError(true);
      setErrorMessage(result.error);
    } else {
      setHasError(false);
      setErrorMessage(undefined);
    }
    return result;
  }, [value]);

  // التركيز على الحقل
  const focus = useCallback(() => {
    textareaRef.current?.focus();
    setIsFocused(true);
  }, []);

  // إزالة التركيز
  const blur = useCallback(() => {
    textareaRef.current?.blur();
    setIsFocused(false);
  }, []);

  // مسح الحقل
  const clear = useCallback(() => {
    setValue('');
    setHasError(false);
    setErrorMessage(undefined);
  }, []);

  // ضبط ارتفاع textarea تلقائياً
  const adjustHeight = useCallback(() => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    textarea.style.height = 'auto';
    const maxHeight = options.maxHeight || 200;
    const minHeight = options.minHeight || 52;
    const newHeight = Math.max(
      minHeight,
      Math.min(textarea.scrollHeight, maxHeight)
    );
    textarea.style.height = `${newHeight}px`;
    textarea.style.overflowY = newHeight >= maxHeight ? 'auto' : 'hidden';
  }, [options.maxHeight, options.minHeight]);

  // ضبط الارتفاع عند تغيير القيمة
  useEffect(() => {
    if (isFocused) {
      adjustHeight();
    }
  }, [value, isFocused, adjustHeight]);

  return {
    state,
    value,
    setValue: updateValue,
    textareaRef,
    validate,
    focus,
    blur,
    clear,
    adjustHeight,
    // إحصائيات
    characterCount,
    wordCount,
    lineCount,
    // حالة
    isFocused,
    hasError,
    errorMessage,
  };
}

