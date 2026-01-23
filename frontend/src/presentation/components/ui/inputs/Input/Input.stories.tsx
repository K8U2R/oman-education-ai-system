/**
 * Input Stories - قصص مكون حقل الإدخال
 *
 * توثيق تفاعلي لمكون Input مع جميع المتغيرات والحالات
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { Search, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import Input from './Input'

const meta: Meta<typeof Input> = {
  title: 'Components/Common/Input',
  component: Input,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'مكون حقل إدخال قابل لإعادة الاستخدام مع دعم الأخطاء والمساعدة والأيقونات.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'filled', 'underlined'],
      description: 'نمط حقل الإدخال',
      table: {
        type: { summary: 'InputVariant' },
        defaultValue: { summary: 'default' },
      },
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'حجم حقل الإدخال',
      table: {
        type: { summary: 'InputSize' },
        defaultValue: { summary: 'md' },
      },
    },
    label: {
      control: 'text',
      description: 'تسمية الحقل',
    },
    error: {
      control: 'text',
      description: 'رسالة الخطأ',
    },
    helperText: {
      control: 'text',
      description: 'نص المساعدة',
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
        defaultValue: { summary: 'true' },
      },
    },
    placeholder: {
      control: 'text',
      description: 'نص توضيحي',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
      description: 'نوع الحقل',
    },
  },
}

export default meta
type Story = StoryObj<typeof Input>

/**
 * حقل الإدخال الأساسي
 */
export const Default: Story = {
  args: {
    label: 'الاسم',
    placeholder: 'أدخل اسمك',
    variant: 'default',
    size: 'md',
    fullWidth: true,
  },
}

/**
 * جميع الأنماط
 */
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '400px' }}>
      <Input label="افتراضي" placeholder="حقل إدخال افتراضي" variant="default" />
      <Input label="مع إطار" placeholder="حقل إدخال مع إطار" variant="outlined" />
      <Input label="مملوء" placeholder="حقل إدخال مملوء" variant="filled" />
      <Input label="تحت خط" placeholder="حقل إدخال تحت خط" variant="underlined" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'جميع الأنماط المتاحة لحقل الإدخال',
      },
    },
  },
}

/**
 * جميع الأحجام
 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '400px' }}>
      <Input label="صغير" placeholder="حقل إدخال صغير" size="sm" />
      <Input label="متوسط" placeholder="حقل إدخال متوسط" size="md" />
      <Input label="كبير" placeholder="حقل إدخال كبير" size="lg" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'جميع الأحجام المتاحة لحقل الإدخال',
      },
    },
  },
}

/**
 * مع أيقونات
 */
export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '400px' }}>
      <Input label="البحث" placeholder="ابحث..." leftIcon={<Search size={18} />} />
      <Input
        label="البريد الإلكتروني"
        placeholder="example@email.com"
        type="email"
        leftIcon={<Mail size={18} />}
      />
      <Input
        label="كلمة المرور"
        type="password"
        placeholder="أدخل كلمة المرور"
        leftIcon={<Lock size={18} />}
        rightIcon={<Eye size={18} />}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'حقول إدخال مع أيقونات على اليسار أو اليمين',
      },
    },
  },
}

/**
 * مع رسالة خطأ
 */
export const WithError: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '400px' }}>
      <Input
        label="البريد الإلكتروني"
        placeholder="example@email.com"
        type="email"
        error="البريد الإلكتروني غير صحيح"
        defaultValue="invalid-email"
      />
      <Input
        label="كلمة المرور"
        type="password"
        placeholder="أدخل كلمة المرور"
        error="كلمة المرور يجب أن تكون 8 أحرف على الأقل"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'حقول إدخال مع رسائل خطأ',
      },
    },
  },
}

/**
 * مع نص مساعدة
 */
export const WithHelperText: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '400px' }}>
      <Input
        label="اسم المستخدم"
        placeholder="username"
        helperText="يجب أن يكون اسم المستخدم فريداً"
      />
      <Input
        label="كلمة المرور"
        type="password"
        placeholder="أدخل كلمة المرور"
        helperText="يجب أن تحتوي على 8 أحرف على الأقل"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'حقول إدخال مع نصوص مساعدة',
      },
    },
  },
}

/**
 * معطل
 */
export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '400px' }}>
      <Input label="معطل" placeholder="هذا الحقل معطل" disabled />
      <Input label="معطل مع قيمة" defaultValue="قيمة معطلة" disabled />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'حقول إدخال معطلة',
      },
    },
  },
}

/**
 * أنواع مختلفة
 */
export const InputTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '400px' }}>
      <Input label="نص" type="text" placeholder="أدخل النص" />
      <Input label="بريد إلكتروني" type="email" placeholder="example@email.com" />
      <Input label="رقم" type="number" placeholder="أدخل رقماً" />
      <Input label="هاتف" type="tel" placeholder="+968 1234 5678" />
      <Input label="رابط" type="url" placeholder="https://example.com" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'أنواع مختلفة من حقول الإدخال',
      },
    },
  },
}

/**
 * كلمة مرور تفاعلية
 */
export const InteractivePassword: Story = {
  render: () => {
    const [showPassword, setShowPassword] = useState(false)

    return (
      <div style={{ maxWidth: '400px' }}>
        <Input
          label="كلمة المرور"
          type={showPassword ? 'text' : 'password'}
          placeholder="أدخل كلمة المرور"
          leftIcon={<Lock size={18} />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />
      </div>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'حقل كلمة مرور تفاعلي مع إمكانية إظهار/إخفاء كلمة المرور',
      },
    },
  },
}

/**
 * أمثلة استخدام
 */
export const Examples: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '500px' }}>
      <div>
        <h3 style={{ marginBottom: '1rem' }}>نموذج تسجيل الدخول</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input
            label="البريد الإلكتروني"
            type="email"
            placeholder="example@email.com"
            leftIcon={<Mail size={18} />}
          />
          <Input
            label="كلمة المرور"
            type="password"
            placeholder="أدخل كلمة المرور"
            leftIcon={<Lock size={18} />}
          />
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '1rem' }}>نموذج البحث</h3>
        <Input label="البحث" placeholder="ابحث عن أي شيء..." leftIcon={<Search size={18} />} />
      </div>

      <div>
        <h3 style={{ marginBottom: '1rem' }}>نموذج مع التحقق</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input
            label="البريد الإلكتروني"
            type="email"
            placeholder="example@email.com"
            error="البريد الإلكتروني مطلوب"
          />
          <Input
            label="كلمة المرور"
            type="password"
            placeholder="أدخل كلمة المرور"
            helperText="يجب أن تحتوي على 8 أحرف على الأقل"
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'أمثلة عملية لاستخدام حقول الإدخال في سيناريوهات مختلفة',
      },
    },
  },
}
