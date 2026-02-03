/**
 * Button Component Tests - اختبارات مكون الزر
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/utils'
import userEvent from '@testing-library/user-event'
import Button from './Button'

describe('Button', () => {
  it('should render button with text', () => {
    render(<Button>انقر هنا</Button>)
    expect(screen.getByRole('button', { name: /انقر هنا/i })).toBeInTheDocument()
  })

  it('should call onClick when clicked', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<Button onClick={handleClick}>انقر هنا</Button>)

    const button = screen.getByRole('button', { name: /انقر هنا/i })
    await user.click(button)

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>زر معطل</Button>)

    const button = screen.getByRole('button', { name: /زر معطل/i })
    expect(button).toBeDisabled()
  })

  it('should not call onClick when disabled', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(
      <Button onClick={handleClick} disabled>
        زر معطل
      </Button>
    )

    const button = screen.getByRole('button', { name: /زر معطل/i })
    await user.click(button)

    expect(handleClick).not.toHaveBeenCalled()
  })

  it('should render with primary variant', () => {
    render(<Button variant="primary">زر أساسي</Button>)

    const button = screen.getByRole('button', { name: /زر أساسي/i })
    expect(button).toHaveClass('button--primary')
  })

  it('should render with different sizes', () => {
    const { rerender } = render(<Button size="sm">صغير</Button>)
    expect(screen.getByRole('button')).toHaveClass('button--sm')

    rerender(<Button size="md">متوسط</Button>)
    expect(screen.getByRole('button')).toHaveClass('button--md')

    rerender(<Button size="lg">كبير</Button>)
    expect(screen.getByRole('button')).toHaveClass('button--lg')
  })

  it('should show loading state', () => {
    render(<Button isLoading>جاري التحميل</Button>)

    const button = screen.getByRole('button')
    expect(button).toHaveClass('button--loading')
    expect(button).toBeDisabled()
    expect(screen.getByText(/جاري التحميل/i)).toBeInTheDocument()
  })

  it('should render with fullWidth prop', () => {
    render(<Button fullWidth>زر كامل العرض</Button>)

    const button = screen.getByRole('button', { name: /زر كامل العرض/i })
    expect(button).toHaveClass('button--full-width')
  })
})
