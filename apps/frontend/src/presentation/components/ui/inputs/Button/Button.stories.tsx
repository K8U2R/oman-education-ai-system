/**
 * Button Stories - قصص مكون الزر
 *
 * توثيق تفاعلي لمكون Button مع جميع المتغيرات والحالات
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { Search, Download, ArrowRight, Check } from 'lucide-react'
import Button from './Button'

const meta: Meta<typeof Button> = {
  title: 'Components/Common/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'مكون زر قابل لإعادة الاستخدام مع أنماط وأحجام مختلفة. يدعم حالات التحميل والأيقونات.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger', 'success', 'warning'],
      description: 'نمط الزر',
      table: {
        type: { summary: 'ButtonVariant' },
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'حجم الزر',
      table: {
        type: { summary: 'ButtonSize' },
        defaultValue: { summary: 'md' },
      },
    },
    isLoading: {
      control: 'boolean',
      description: 'حالة التحميل',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    disabled: {
      control: 'boolean',
      description: 'حالة التعطيل',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    fullWidth: {
      control: 'boolean',
      description: 'عرض كامل',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    children: {
      control: 'text',
      description: 'محتوى الزر',
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

/**
 * الزر الأساسي
 */
export const Default: Story = {
  args: {
    children: 'زر أساسي',
    variant: 'primary',
    size: 'md',
  },
}

/**
 * جميع الأنماط
 */
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button variant="primary">أساسي</Button>
      <Button variant="secondary">ثانوي</Button>
      <Button variant="outline">إطار</Button>
      <Button variant="ghost">شبح</Button>
      <Button variant="danger">خطر</Button>
      <Button variant="success">نجاح</Button>
      <Button variant="warning">تحذير</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'جميع الأنماط المتاحة للزر',
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
      <Button size="xs">صغير جداً</Button>
      <Button size="sm">صغير</Button>
      <Button size="md">متوسط</Button>
      <Button size="lg">كبير</Button>
      <Button size="xl">كبير جداً</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'جميع الأحجام المتاحة للزر',
      },
    },
  },
}

/**
 * مع أيقونات
 */
export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button leftIcon={<Search size={16} />}>بحث</Button>
      <Button rightIcon={<Download size={16} />}>تحميل</Button>
      <Button leftIcon={<Check size={16} />} rightIcon={<ArrowRight size={16} />}>
        إرسال
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'أزرار مع أيقونات على اليسار أو اليمين أو كليهما',
      },
    },
  },
}

/**
 * حالة التحميل
 */
export const Loading: Story = {
  args: {
    children: 'جاري التحميل...',
    isLoading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'حالة التحميل مع مؤشر تحميل تلقائي',
      },
    },
  },
}

/**
 * معطل
 */
export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button disabled>معطل</Button>
      <Button variant="primary" disabled>
        معطل
      </Button>
      <Button variant="outline" disabled>
        معطل
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'حالة التعطيل للزر',
      },
    },
  },
}

/**
 * عرض كامل
 */
export const FullWidth: Story = {
  args: {
    children: 'زر بعرض كامل',
    fullWidth: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'زر يأخذ العرض الكامل للحاوية',
      },
    },
  },
}

/**
 * أمثلة استخدام
 */
export const Examples: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>أزرار الإجراءات</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button variant="primary" size="lg">
            حفظ التغييرات
          </Button>
          <Button variant="outline" size="lg">
            إلغاء
          </Button>
          <Button variant="danger" size="lg">
            حذف
          </Button>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '1rem' }}>أزرار التنقل</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button variant="primary" rightIcon={<ArrowRight size={16} />}>
            التالي
          </Button>
          <Button variant="outline">السابق</Button>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '1rem' }}>أزرار النماذج</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button variant="primary" fullWidth>
            تسجيل الدخول
          </Button>
          <Button variant="outline" fullWidth>
            إنشاء حساب جديد
          </Button>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'أمثلة عملية لاستخدام الأزرار في سيناريوهات مختلفة',
      },
    },
  },
}
