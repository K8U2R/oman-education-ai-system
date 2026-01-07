/**
 * PWAInstallPrompt Component Tests - اختبارات مكون PWA Install Prompt
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@/test/utils'
import userEvent from '@testing-library/user-event'
import { PWAInstallPrompt } from './PWAInstallPrompt'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

describe('PWAInstallPrompt', () => {
  const mockPrompt = vi.fn().mockResolvedValue(undefined)
  const mockUserChoice = Promise.resolve({ outcome: 'accepted' as const })

  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    sessionStorage.clear()

    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(() => ({
        matches: false,
        media: '',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should not render when app is already installed (standalone)', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === '(display-mode: standalone)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })

    render(<PWAInstallPrompt />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should not render when app was installed before (localStorage)', () => {
    localStorage.setItem('pwa-installed', 'true')
    render(<PWAInstallPrompt />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should show prompt when beforeinstallprompt event fires', async () => {
    render(<PWAInstallPrompt />)

    const event = new Event('beforeinstallprompt') as BeforeInstallPromptEvent
    event.prompt = mockPrompt
    event.userChoice = mockUserChoice
    event.preventDefault = vi.fn()

    window.dispatchEvent(event)

    await waitFor(
      () => {
        expect(screen.getByRole('dialog')).toBeInTheDocument()
      },
      { timeout: 4000 }
    )
  })

  it('should call prompt when install button is clicked', async () => {
    const user = userEvent.setup()
    render(<PWAInstallPrompt />)

    const event = new Event('beforeinstallprompt') as BeforeInstallPromptEvent
    event.prompt = mockPrompt
    event.userChoice = mockUserChoice
    event.preventDefault = vi.fn()

    window.dispatchEvent(event)

    await waitFor(
      async () => {
        const installButton = screen.getByLabelText('تثبيت التطبيق')
        await user.click(installButton)
        expect(mockPrompt).toHaveBeenCalled()
      },
      { timeout: 4000 }
    )
  })

  it('should hide prompt when dismiss button is clicked', async () => {
    const user = userEvent.setup()
    render(<PWAInstallPrompt />)

    const event = new Event('beforeinstallprompt') as BeforeInstallPromptEvent
    event.prompt = mockPrompt
    event.userChoice = mockUserChoice
    event.preventDefault = vi.fn()

    window.dispatchEvent(event)

    await waitFor(
      async () => {
        const dismissButton = screen.getByLabelText('إغلاق')
        await user.click(dismissButton)
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        expect(sessionStorage.getItem('pwa-prompt-dismissed')).toBe('true')
      },
      { timeout: 4000 }
    )
  })

  it('should not show prompt if dismissed in this session', () => {
    sessionStorage.setItem('pwa-prompt-dismissed', 'true')
    render(<PWAInstallPrompt />)

    const event = new Event('beforeinstallprompt') as BeforeInstallPromptEvent
    event.prompt = mockPrompt
    event.userChoice = mockUserChoice
    event.preventDefault = vi.fn()

    window.dispatchEvent(event)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should handle appinstalled event', async () => {
    render(<PWAInstallPrompt />)

    const installedEvent = new Event('appinstalled')
    window.dispatchEvent(installedEvent)

    await waitFor(() => {
      expect(localStorage.getItem('pwa-installed')).toBe('true')
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('should render with correct ARIA labels', async () => {
    render(<PWAInstallPrompt />)

    const event = new Event('beforeinstallprompt') as BeforeInstallPromptEvent
    event.prompt = mockPrompt
    event.userChoice = mockUserChoice
    event.preventDefault = vi.fn()

    window.dispatchEvent(event)

    await waitFor(
      () => {
        expect(screen.getByRole('dialog')).toHaveAttribute('aria-label', 'تثبيت التطبيق')
        expect(screen.getByLabelText('تثبيت التطبيق')).toBeInTheDocument()
        expect(screen.getByLabelText('إغلاق')).toBeInTheDocument()
      },
      { timeout: 4000 }
    )
  })
})
