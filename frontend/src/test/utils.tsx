/**
 * Test Utilities - أدوات الاختبار
 *
 * دوال مساعدة لكتابة الاختبارات
 */

import { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@/presentation/providers/ThemeProvider'
import { ToastProvider } from '@/presentation/providers/ToastProvider'

/**
 * Custom render function with providers
 *
 * @param ui - Component to render
 * @param options - Render options
 * @returns Render result with all providers
 */
function customRender(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return (
      <BrowserRouter>
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </BrowserRouter>
    )
  }

  return render(ui, { wrapper: AllTheProviders, ...options })
}

// Re-export everything
// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react'
export { customRender as render }
