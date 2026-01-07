/**
 * PWA Install Prompt Component
 *
 * Component to prompt users to install the PWA
 */

import React, { useState, useEffect, useCallback } from 'react'
import { X, Download, Smartphone } from 'lucide-react'
import styles from './PWAInstallPrompt.module.scss'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Check if app was installed before
    const installed = localStorage.getItem('pwa-installed')
    if (installed === 'true') {
      setIsInstalled(true)
      return
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event): void => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)

      // Show prompt after a delay (better UX)
      setTimeout(() => {
        setShowPrompt(true)
      }, 3000) // Show after 3 seconds
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Listen for app installed event
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true)
      setShowPrompt(false)
      localStorage.setItem('pwa-installed', 'true')
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = useCallback(async (): Promise<void> => {
    if (!deferredPrompt) {
      return
    }

    try {
      // Show the install prompt
      await deferredPrompt.prompt()

      // Wait for user response
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === 'accepted') {
        // User accepted the install prompt
        setShowPrompt(false)
        localStorage.setItem('pwa-installed', 'true')
      } else {
        // User dismissed the install prompt
        setShowPrompt(false)
        // Don't show again for this session
        sessionStorage.setItem('pwa-prompt-dismissed', 'true')
      }

      // Clear the deferred prompt
      setDeferredPrompt(null)
    } catch (error) {
      // Error handling is done by error interceptor
      setShowPrompt(false)
    }
  }, [deferredPrompt])

  const handleDismiss = useCallback((): void => {
    setShowPrompt(false)
    // Don't show again for this session
    sessionStorage.setItem('pwa-prompt-dismissed', 'true')
  }, [])

  // Don't show if already installed or dismissed
  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null
  }

  // Check if user dismissed in this session
  if (sessionStorage.getItem('pwa-prompt-dismissed') === 'true') {
    return null
  }

  return (
    <div className={styles.pwaInstallPrompt} role="dialog" aria-label="تثبيت التطبيق">
      <div className={styles.content}>
        <div className={styles.icon}>
          <Smartphone size={24} />
        </div>
        <div className={styles.text}>
          <h3 className={styles.title}>ثبّت التطبيق</h3>
          <p className={styles.description}>ثبّت التطبيق على جهازك للوصول السريع وتجربة أفضل</p>
        </div>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.installButton}
            onClick={handleInstall}
            aria-label="تثبيت التطبيق"
          >
            <Download size={18} />
            <span>تثبيت</span>
          </button>
          <button
            type="button"
            className={styles.dismissButton}
            onClick={handleDismiss}
            aria-label="إغلاق"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
