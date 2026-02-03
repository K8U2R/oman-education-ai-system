/**
 * Avatar Stories - قصص مكون صورة المستخدم
 *
 * توثيق تفاعلي لمكون Avatar مع جميع المتغيرات والحالات
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar } from './Avatar'

const meta: Meta<typeof Avatar> = {
  title: 'Components/Common/Avatar',
  component: Avatar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'مكون صورة المستخدم قابلة لإعادة الاستخدام مع دعم الصور والأحرف الأولى والأيقونات.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    src: {
      control: 'text',
      description: 'رابط الصورة',
    },
    alt: {
      control: 'text',
      description: 'النص البديل للصورة',
    },
    name: {
      control: 'text',
      description: 'اسم المستخدم (لإظهار الأحرف الأولى)',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'حجم الصورة',
    },
    onClick: {
      action: 'clicked',
      description: 'دالة النقر',
    },
  },
}

export default meta
type Story = StoryObj<typeof Avatar>

/**
 * الصورة الأساسية
 */
export const Default: Story = {
  args: {
    name: 'أحمد محمد',
    size: 'md',
  },
}

/**
 * جميع الأحجام
 */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
      <div
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
      >
        <Avatar name="أحمد محمد" size="xs" />
        <span style={{ fontSize: '0.75rem' }}>xs</span>
      </div>
      <div
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
      >
        <Avatar name="أحمد محمد" size="sm" />
        <span style={{ fontSize: '0.75rem' }}>sm</span>
      </div>
      <div
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
      >
        <Avatar name="أحمد محمد" size="md" />
        <span style={{ fontSize: '0.75rem' }}>md</span>
      </div>
      <div
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
      >
        <Avatar name="أحمد محمد" size="lg" />
        <span style={{ fontSize: '0.75rem' }}>lg</span>
      </div>
      <div
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
      >
        <Avatar name="أحمد محمد" size="xl" />
        <span style={{ fontSize: '0.75rem' }}>xl</span>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'جميع الأحجام المتاحة للصورة',
      },
    },
  },
}

/**
 * مع صورة
 */
export const WithImage: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Avatar src="https://i.pravatar.cc/150?img=1" alt="صورة المستخدم" name="أحمد محمد" />
      <Avatar src="https://i.pravatar.cc/150?img=2" alt="صورة المستخدم" name="فاطمة علي" />
      <Avatar src="https://i.pravatar.cc/150?img=3" alt="صورة المستخدم" name="محمد سالم" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'صور مع روابط صور حقيقية',
      },
    },
  },
}

/**
 * مع الأحرف الأولى
 */
export const WithInitials: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Avatar name="أحمد محمد" />
      <Avatar name="فاطمة علي" />
      <Avatar name="محمد سالم" />
      <Avatar name="سارة أحمد" />
      <Avatar name="علي" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'صور مع الأحرف الأولى من الاسم',
      },
    },
  },
}

/**
 * بدون اسم (أيقونة افتراضية)
 */
export const WithoutName: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Avatar />
      <Avatar size="lg" />
      <Avatar size="xl" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'صور بدون اسم (تظهر أيقونة افتراضية)',
      },
    },
  },
}

/**
 * قابلة للنقر
 */
export const Clickable: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Avatar name="أحمد محمد" onClick={() => alert('تم النقر على الصورة!')} />
      <Avatar
        src="https://i.pravatar.cc/150?img=1"
        name="فاطمة علي"
        onClick={() => alert('تم النقر على الصورة!')}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'صور قابلة للنقر',
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
        <h3 style={{ marginBottom: '1rem' }}>قائمة المستخدمين</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { name: 'أحمد محمد', role: 'مدير' },
            { name: 'فاطمة علي', role: 'مطور' },
            { name: 'محمد سالم', role: 'مصمم' },
            { name: 'سارة أحمد', role: 'كاتب' },
          ].map((user, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.75rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
              }}
            >
              <Avatar name={user.name} size="md" />
              <div>
                <div style={{ fontWeight: '500' }}>{user.name}</div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{user.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '1rem' }}>شريط التعليقات</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { name: 'أحمد محمد', comment: 'تعليق رائع!' },
            { name: 'فاطمة علي', comment: 'شكراً لك' },
            { name: 'محمد سالم', comment: 'معلومات مفيدة' },
          ].map((item, index) => (
            <div key={index} style={{ display: 'flex', gap: '0.75rem' }}>
              <Avatar name={item.name} size="sm" />
              <div
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: '#f3f4f6',
                  borderRadius: '0.5rem',
                }}
              >
                <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>{item.name}</div>
                <div>{item.comment}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '1rem' }}>معلومات المستخدم</h3>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '1rem',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            maxWidth: '300px',
          }}
        >
          <Avatar name="أحمد محمد" size="lg" />
          <div>
            <div style={{ fontWeight: '600', fontSize: '1.125rem' }}>أحمد محمد</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>ahmed@example.com</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.25rem' }}>
              عضو منذ 2024
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'أمثلة عملية لاستخدام الصور في سيناريوهات مختلفة',
      },
    },
  },
}
