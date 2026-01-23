/**
 * Card Stories - قصص مكون البطاقة
 *
 * توثيق تفاعلي لمكون Card مع جميع المتغيرات والحالات
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { BookOpen, Users, Sparkles } from 'lucide-react'
import Card from './Card'

const meta: Meta<typeof Card> = {
  title: 'Components/Common/Card',
  component: Card,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'مكون بطاقة قابل لإعادة الاستخدام لعرض المحتوى. يدعم أنماط مختلفة وظلال و hover effects.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'outlined', 'filled'],
      description: 'نمط البطاقة',
      table: {
        type: { summary: 'CardVariant' },
        defaultValue: { summary: 'default' },
      },
    },
    padding: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg', 'xl'],
      description: 'حجم الحشو الداخلي',
      table: {
        type: { summary: 'CardPadding' },
        defaultValue: { summary: 'md' },
      },
    },
    shadow: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
      description: 'حجم الظل',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'md' },
      },
    },
    hoverable: {
      control: 'boolean',
      description: 'تأثير hover',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    onClick: {
      action: 'clicked',
      description: 'دالة النقر',
    },
  },
}

export default meta
type Story = StoryObj<typeof Card>

/**
 * البطاقة الأساسية
 */
export const Default: Story = {
  args: {
    children: (
      <div>
        <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>عنوان البطاقة</h3>
        <p style={{ margin: 0, color: '#6b7280' }}>
          هذا محتوى البطاقة الأساسية. يمكنك إضافة أي محتوى هنا.
        </p>
      </div>
    ),
    variant: 'default',
    padding: 'md',
    shadow: 'md',
  },
}

/**
 * جميع الأنماط
 */
export const Variants: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem',
      }}
    >
      <Card variant="default" padding="md">
        <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>افتراضي</h3>
        <p style={{ margin: 0, color: '#6b7280' }}>نمط البطاقة الافتراضي</p>
      </Card>
      <Card variant="elevated" padding="md">
        <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>مرتفع</h3>
        <p style={{ margin: 0, color: '#6b7280' }}>نمط البطاقة المرتفعة</p>
      </Card>
      <Card variant="outlined" padding="md">
        <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>إطار</h3>
        <p style={{ margin: 0, color: '#6b7280' }}>نمط البطاقة مع إطار</p>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'جميع الأنماط المتاحة للبطاقة',
      },
    },
  },
}

/**
 * جميع أحجام الحشو
 */
export const PaddingSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Card padding="none" shadow="sm">
        <div style={{ padding: '1rem', background: '#f3f4f6' }}>بدون حشو</div>
      </Card>
      <Card padding="sm" shadow="sm">
        حشو صغير
      </Card>
      <Card padding="md" shadow="sm">
        حشو متوسط
      </Card>
      <Card padding="lg" shadow="sm">
        حشو كبير
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'جميع أحجام الحشو المتاحة',
      },
    },
  },
}

/**
 * جميع أحجام الظل
 */
export const Shadows: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
      }}
    >
      <Card shadow="none" padding="md">
        بدون ظل
      </Card>
      <Card shadow="sm" padding="md">
        ظل صغير
      </Card>
      <Card shadow="md" padding="md">
        ظل متوسط
      </Card>
      <Card shadow="lg" padding="md">
        ظل كبير
      </Card>
      <Card shadow="xl" padding="md">
        ظل كبير جداً
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'جميع أحجام الظل المتاحة',
      },
    },
  },
}

/**
 * بطاقة قابلة للنقر
 */
export const Clickable: Story = {
  args: {
    children: (
      <div>
        <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>بطاقة قابلة للنقر</h3>
        <p style={{ margin: 0, color: '#6b7280' }}>انقر على هذه البطاقة</p>
      </div>
    ),
    onClick: () => alert('تم النقر على البطاقة!'),
    hoverable: true,
    padding: 'md',
  },
  parameters: {
    docs: {
      description: {
        story: 'بطاقة قابلة للنقر مع تأثير hover',
      },
    },
  },
}

/**
 * بطاقة مع hover
 */
export const Hoverable: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1rem',
      }}
    >
      <Card hoverable padding="md">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <BookOpen size={32} style={{ color: '#c8102e' }} />
          <div>
            <h3 style={{ margin: 0, marginBottom: '0.25rem' }}>الدروس</h3>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>استكشف الدروس</p>
          </div>
        </div>
      </Card>
      <Card hoverable padding="md">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Users size={32} style={{ color: '#007a3d' }} />
          <div>
            <h3 style={{ margin: 0, marginBottom: '0.25rem' }}>المستخدمون</h3>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>إدارة المستخدمين</p>
          </div>
        </div>
      </Card>
      <Card hoverable padding="md">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Sparkles size={32} style={{ color: '#a855f7' }} />
          <div>
            <h3 style={{ margin: 0, marginBottom: '0.25rem' }}>الميزات</h3>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>الميزات الجديدة</p>
          </div>
        </div>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'بطاقات مع تأثير hover تفاعلي',
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
        <h2 style={{ marginBottom: '1rem' }}>بطاقة لوحة التحكم</h2>
        <Card variant="elevated" padding="lg" shadow="lg" hoverable>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ margin: 0, marginBottom: '0.5rem' }}>إجمالي المستخدمين</h3>
              <p style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#c8102e' }}>
                1,234
              </p>
              <p style={{ margin: 0, marginTop: '0.5rem', color: '#6b7280' }}>
                زيادة بنسبة 12% عن الشهر الماضي
              </p>
            </div>
            <Users size={48} style={{ color: '#c8102e', opacity: 0.2 }} />
          </div>
        </Card>
      </div>

      <div>
        <h2 style={{ marginBottom: '1rem' }}>بطاقة المحتوى</h2>
        <Card variant="outlined" padding="lg">
          <h3 style={{ margin: 0, marginBottom: '1rem' }}>عنوان المقال</h3>
          <p style={{ margin: 0, marginBottom: '1rem', color: '#374151', lineHeight: '1.6' }}>
            هذا مثال على بطاقة محتوى تحتوي على نص طويل. يمكن استخدام هذا النمط لعرض المقالات
            والمدونات والمحتوى التعليمي.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span
              style={{
                padding: '0.25rem 0.75rem',
                background: '#f3f4f6',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
              }}
            >
              تعليم
            </span>
            <span
              style={{
                padding: '0.25rem 0.75rem',
                background: '#f3f4f6',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
              }}
            >
              ذكاء اصطناعي
            </span>
          </div>
        </Card>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'أمثلة عملية لاستخدام البطاقات في سيناريوهات مختلفة',
      },
    },
  },
}
