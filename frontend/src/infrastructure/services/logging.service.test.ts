/**
 * Logging Service Tests - اختبارات خدمة التسجيل
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { loggingService, LogLevel } from './logging.service'

describe('LoggingService', () => {
  const originalEnv = import.meta.env
  const consoleDebugSpy = vi.spyOn(console, 'debug').mockImplementation(() => {})
  const consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
  const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

  beforeEach(() => {
    vi.clearAllMocks()
    loggingService.setLogLevel(LogLevel.DEBUG)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('setLogLevel', () => {
    it('should set log level correctly', () => {
      loggingService.setLogLevel(LogLevel.WARN)
      loggingService.debug('Debug message')
      loggingService.info('Info message')
      loggingService.warn('Warn message')

      expect(consoleDebugSpy).not.toHaveBeenCalled()
      expect(consoleInfoSpy).not.toHaveBeenCalled()
      expect(consoleWarnSpy).toHaveBeenCalledWith('[WARN] Warn message', '')
    })
  })

  describe('debug', () => {
    it('should log debug message in development', () => {
      Object.defineProperty(import.meta, 'env', {
        value: { ...originalEnv, DEV: true },
        writable: true,
      })

      loggingService.debug('Debug message', { key: 'value' })
      expect(consoleDebugSpy).toHaveBeenCalledWith('[DEBUG] Debug message', { key: 'value' })
    })

    it('should not log debug message when log level is higher', () => {
      loggingService.setLogLevel(LogLevel.INFO)
      loggingService.debug('Debug message')
      expect(consoleDebugSpy).not.toHaveBeenCalled()
    })
  })

  describe('info', () => {
    it('should log info message', () => {
      loggingService.info('Info message', { key: 'value' })
      expect(consoleInfoSpy).toHaveBeenCalledWith('[INFO] Info message', { key: 'value' })
    })

    it('should not log info message when log level is higher', () => {
      loggingService.setLogLevel(LogLevel.WARN)
      loggingService.info('Info message')
      expect(consoleInfoSpy).not.toHaveBeenCalled()
    })
  })

  describe('warn', () => {
    it('should log warn message', () => {
      loggingService.warn('Warn message', { key: 'value' })
      expect(consoleWarnSpy).toHaveBeenCalledWith('[WARN] Warn message', { key: 'value' })
    })

    it('should not log warn message when log level is ERROR', () => {
      loggingService.setLogLevel(LogLevel.ERROR)
      loggingService.warn('Warn message')
      expect(consoleWarnSpy).not.toHaveBeenCalled()
    })
  })

  describe('error', () => {
    it('should log error message', () => {
      const error = new Error('Test error')
      loggingService.error('Error message', error, { key: 'value' })
      expect(consoleErrorSpy).toHaveBeenCalledWith('[ERROR] Error message', error, { key: 'value' })
    })

    it('should log error message without error object', () => {
      loggingService.error('Error message')
      expect(consoleErrorSpy).toHaveBeenCalledWith('[ERROR] Error message', '', '')
    })

    it('should always log error regardless of log level', () => {
      loggingService.setLogLevel(LogLevel.ERROR)
      loggingService.error('Error message')
      expect(consoleErrorSpy).toHaveBeenCalled()
    })
  })

  describe('silentError', () => {
    it('should not log in development', () => {
      Object.defineProperty(import.meta, 'env', {
        value: { ...originalEnv, DEV: true },
        writable: true,
      })

      loggingService.silentError('Silent error', new Error('Test'))
      expect(consoleErrorSpy).not.toHaveBeenCalled()
    })
  })

  describe('log level filtering', () => {
    it('should filter logs based on log level', () => {
      loggingService.setLogLevel(LogLevel.INFO)

      loggingService.debug('Debug message')
      loggingService.info('Info message')
      loggingService.warn('Warn message')
      loggingService.error('Error message')

      expect(consoleDebugSpy).not.toHaveBeenCalled()
      expect(consoleInfoSpy).toHaveBeenCalled()
      expect(consoleWarnSpy).toHaveBeenCalled()
      expect(consoleErrorSpy).toHaveBeenCalled()
    })
  })
})
