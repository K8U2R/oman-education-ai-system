/**
 * Event Handlers Types - أنواع معالجات الأحداث
 *
 * تعريف Types شامل لجميع Event Handlers في التطبيق
 */

import React from 'react'

/**
 * Form Event Handlers
 */
export type FormSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => void
export type FormResetHandler = (event: React.FormEvent<HTMLFormElement>) => void
export type FormChangeHandler = (event: React.ChangeEvent<HTMLFormElement>) => void

/**
 * Input Event Handlers
 */
export type InputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => void
export type TextareaChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => void
export type SelectChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => void

/**
 * Generic Change Handler
 */
export type ChangeHandler<T = HTMLInputElement> = (event: React.ChangeEvent<T>) => void

/**
 * Focus Event Handlers
 */
export type FocusHandler = (event: React.FocusEvent<HTMLElement>) => void
export type BlurHandler = (event: React.FocusEvent<HTMLElement>) => void

/**
 * Keyboard Event Handlers
 */
export type KeyDownHandler = (event: React.KeyboardEvent<HTMLElement>) => void
export type KeyUpHandler = (event: React.KeyboardEvent<HTMLElement>) => void
export type KeyPressHandler = (event: React.KeyboardEvent<HTMLElement>) => void

/**
 * Mouse Event Handlers
 */
export type ClickHandler = (event: React.MouseEvent<HTMLElement>) => void
export type MouseEnterHandler = (event: React.MouseEvent<HTMLElement>) => void
export type MouseLeaveHandler = (event: React.MouseEvent<HTMLElement>) => void
export type MouseDownHandler = (event: React.MouseEvent<HTMLElement>) => void
export type MouseUpHandler = (event: React.MouseEvent<HTMLElement>) => void
export type MouseMoveHandler = (event: React.MouseEvent<HTMLElement>) => void

/**
 * Drag Event Handlers
 */
export type DragStartHandler = (event: React.DragEvent<HTMLElement>) => void
export type DragEndHandler = (event: React.DragEvent<HTMLElement>) => void
export type DragOverHandler = (event: React.DragEvent<HTMLElement>) => void
export type DropHandler = (event: React.DragEvent<HTMLElement>) => void

/**
 * Touch Event Handlers
 */
export type TouchStartHandler = (event: React.TouchEvent<HTMLElement>) => void
export type TouchEndHandler = (event: React.TouchEvent<HTMLElement>) => void
export type TouchMoveHandler = (event: React.TouchEvent<HTMLElement>) => void

/**
 * Scroll Event Handlers
 */
export type ScrollHandler = (event: React.UIEvent<HTMLElement>) => void

/**
 * Generic Event Handler
 */
export type EventHandler<T = HTMLElement> = (event: React.SyntheticEvent<T>) => void

/**
 * Custom Event Handlers
 */
export type ValueChangeHandler<T = unknown> = (value: T) => void
export type AsyncEventHandler<T = unknown> = (event: T) => Promise<void>
export type VoidEventHandler = () => void

/**
 * File Input Handler
 */
export type FileChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => void
export type FileSelectHandler = (files: FileList | null) => void

/**
 * Checkbox Handler
 */
export type CheckboxChangeHandler = (checked: boolean) => void

/**
 * Radio Handler
 */
export type RadioChangeHandler = (value: string) => void

/**
 * Range/Slider Handler
 */
export type RangeChangeHandler = (value: number) => void

/**
 * Generic Handler with Event
 */
export type HandlerWithEvent<TEvent = React.SyntheticEvent> = (event: TEvent) => void

/**
 * Generic Handler with Value
 */
export type HandlerWithValue<TValue = unknown> = (value: TValue) => void
