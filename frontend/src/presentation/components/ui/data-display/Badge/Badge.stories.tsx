/**
 * Badge Stories - قصص مكون الشارة
 *
 * توثيق تفاعلي لمكون Badge مع جميع المتغيرات والحالات
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './Badge'

const meta: Meta<typeof Badge> = {
  title: 'Components/Common/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'مكون شارة قابلة لإعادة الاستخدام لعرض الحالة أو التصنيف.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'success', 'warning', 'error', 'info'],
      description: 'نمط الشارة',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
      description: 'حجم الشارة',
    },
    dot: {
      control: 'boolean',
      description: 'إظهار نقطة بدلاً من النص',
    },
    children: {
      control: 'text',
      description: 'محتوى الشارة',
    },
  },
}

export default meta
type Story = StoryObj<typeof Badge>

/**
 * الشارة الأساسية
 */
export const Default: Story = {
  args: {
    children: 'شارة',
    variant: 'default',
    size: 'md',
  },
}

/**
 * جميع الأنماط
 */
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <Badge variant="default">افتراضي</Badge>
      <Badge variant="primary">أساسي</Badge>
      <Badge variant="secondary">ثانوي</Badge>
      <Badge variant="success">نجاح</Badge>
      <Badge variant="warning">تحذير</Badge>
      <Badge variant="error">خطأ</Badge>
      <Badge variant="info">معلومات</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'جميع الأنماط المتاحة للشارة',
      },
    },
  },
}

/**
 * جميع الأحجام
 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <Badge size="xs">صغير جداً</Badge>
      <Badge size="sm">صغير</Badge>
      <Badge size="md">متوسط</Badge>
      <Badge size="lg">كبير</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'جميع الأحجام المتاحة للشارة',
      },
    },
  },
}

/**
 * مع نقطة
 */
export const WithDot: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <Badge variant="default" dot>
        افتراضي
      </Badge>
      <Badge variant="primary" dot>
        أساسي
      </Badge>
      <Badge variant="secondary" dot>
        ثانوي
      </Badge>
      <Badge variant="success" dot>
        نجاح
      </Badge>
      <Badge variant="warning" dot>
        تحذير
      </Badge>
      <Badge variant="error" dot>
        خطأ
      </Badge>
      <Badge variant="info" dot>
        معلومات
      </Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'شارات مع نقطة بدلاً من النص',
      },
    },
  },
}

/**
 * مع أرقام
 */
export const WithNumbers: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
      <Badge variant="primary">1</Badge>
      <Badge variant="primary">5</Badge>
      <Badge variant="primary">12</Badge>
      <Badge variant="primary">99+</Badge>
      <Badge variant="error">3</Badge>
      <Badge variant="success">0</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'شارات مع أرقام (مثل الإشعارات)',
      },
    },
  },
}

/**
 * أمثلة استخدام
 */
export const Examples: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>حالات المستخدم</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span>مستخدم نشط</span>
          <Badge variant="success">نشط</Badge>
          <span>مستخدم معطل</span>
          <Badge variant="error">معطل</Badge>
          <span>مستخدم معلق</span>
          <Badge variant="warning">معلق</Badge>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '1rem' }}>إشعارات</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                background: 'white',
              }}
            >
              الرسائل
            </button>
            <div style={{ position: 'absolute', top: '-8px', right: '-8px' }}>
              <Badge variant="error" size="sm">
                5
              </Badge>
            </div>
          </div>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
              style={{
                padding: '0.5rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                background: 'white',
              }}
            >
              الإشعارات
            </button>
            <div style={{ position: 'absolute', top: '-8px', right: '-8px' }}>
              <Badge variant="primary" size="sm">
                12
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '1rem' }}>حالات الاتصال</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              U
            </div>
            <Badge variant="success" dot>
              متصل
            </Badge>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              A
            </div>
            <Badge variant="warning" dot>
              مشغول
            </Badge>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              M
            </div>
            <Badge variant="error" dot>
              غير متصل
            </Badge>
          </div>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '1rem' }}>التصنيفات</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Badge variant="primary">تعليم</Badge>
          <Badge variant="secondary">تقنية</Badge>
          <Badge variant="success">صحة</Badge>
          <Badge variant="info">رياضة</Badge>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'أمثلة عملية لاستخدام الشارات في سيناريوهات مختلفة',
      },
    },
  },
}
