/**
 * Modal Stories - قصص مكون النافذة المنبثقة
 *
 * توثيق تفاعلي لمكون Modal مع جميع المتغيرات والحالات
 */

import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Modal } from './Modal'
import { Button } from '../../inputs/Button'

const meta: Meta<typeof Modal> = {
  title: 'Components/Common/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'مكون نافذة منبثقة قابلة لإعادة الاستخدام مع دعم الأحجام المختلفة وخيارات الإغلاق.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'حالة فتح/إغلاق النافذة',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      description: 'حجم النافذة',
    },
    showCloseButton: {
      control: 'boolean',
      description: 'إظهار زر الإغلاق',
    },
    closeOnOverlayClick: {
      control: 'boolean',
      description: 'الإغلاق عند النقر على الخلفية',
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'الإغلاق عند الضغط على Escape',
    },
  },
}

export default meta
type Story = StoryObj<typeof Modal>

/**
 * النافذة الأساسية
 */
export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>فتح النافذة</Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="عنوان النافذة">
          <p>هذا محتوى النافذة المنبثقة. يمكنك إضافة أي محتوى هنا.</p>
        </Modal>
      </>
    )
  },
}

/**
 * جميع الأحجام
 */
export const Sizes: Story = {
  render: () => {
    const [openSize, setOpenSize] = useState<'sm' | 'md' | 'lg' | 'xl' | 'full' | null>(null)

    return (
      <>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button onClick={() => setOpenSize('sm')}>صغير</Button>
          <Button onClick={() => setOpenSize('md')}>متوسط</Button>
          <Button onClick={() => setOpenSize('lg')}>كبير</Button>
          <Button onClick={() => setOpenSize('xl')}>كبير جداً</Button>
          <Button onClick={() => setOpenSize('full')}>كامل</Button>
        </div>
        {openSize && (
          <Modal
            isOpen={true}
            onClose={() => setOpenSize(null)}
            title={`نافذة ${openSize}`}
            size={openSize}
          >
            <p>هذه نافذة بحجم {openSize}</p>
          </Modal>
        )}
      </>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'جميع الأحجام المتاحة للنافذة',
      },
    },
  },
}

/**
 * مع وصف
 */
export const WithDescription: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>فتح النافذة</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="تأكيد العملية"
          description="هل أنت متأكد من رغبتك في تنفيذ هذه العملية؟"
        >
          <p>سيتم تنفيذ العملية بعد التأكيد.</p>
        </Modal>
      </>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'نافذة مع عنوان ووصف',
      },
    },
  },
}

/**
 * مع Footer
 */
export const WithFooter: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>فتح النافذة</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="تأكيد الحذف"
          description="هل أنت متأكد من رغبتك في حذف هذا العنصر؟"
          footer={
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                إلغاء
              </Button>
              <Button variant="danger" onClick={() => setIsOpen(false)}>
                حذف
              </Button>
            </div>
          }
        >
          <p>لا يمكن التراجع عن هذه العملية بعد التنفيذ.</p>
        </Modal>
      </>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'نافذة مع Footer مخصص',
      },
    },
  },
}

/**
 * بدون زر الإغلاق
 */
export const WithoutCloseButton: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>فتح النافذة</Button>
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="نافذة بدون زر إغلاق"
          showCloseButton={false}
        >
          <p>
            هذه النافذة لا تحتوي على زر إغلاق. يمكنك الإغلاق بالنقر على الخلفية أو الضغط على Escape.
          </p>
          <div style={{ marginTop: '1rem' }}>
            <Button onClick={() => setIsOpen(false)}>إغلاق</Button>
          </div>
        </Modal>
      </>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'نافذة بدون زر الإغلاق',
      },
    },
  },
}

/**
 * محتوى طويل
 */
export const LongContent: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false)

    return (
      <>
        <Button onClick={() => setIsOpen(true)}>فتح النافذة</Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="محتوى طويل">
          <div>
            <p>هذا مثال على نافذة تحتوي على محتوى طويل.</p>
            {Array.from({ length: 20 }, (_, i) => (
              <p key={i} style={{ marginBottom: '1rem' }}>
                فقرة رقم {i + 1}: هذا نص تجريبي لإظهار كيفية تعامل النافذة مع المحتوى الطويل.
              </p>
            ))}
          </div>
        </Modal>
      </>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'نافذة مع محتوى طويل لإظهار التمرير',
      },
    },
  },
}

/**
 * أمثلة استخدام
 */
export const Examples: Story = {
  render: () => {
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [infoOpen, setInfoOpen] = useState(false)
    const [formOpen, setFormOpen] = useState(false)

    return (
      <>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
          <Button onClick={() => setConfirmOpen(true)}>نافذة تأكيد</Button>
          <Button onClick={() => setInfoOpen(true)}>نافذة معلومات</Button>
          <Button onClick={() => setFormOpen(true)}>نافذة نموذج</Button>
        </div>

        {/* Confirm Modal */}
        <Modal
          isOpen={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          title="تأكيد العملية"
          description="هل أنت متأكد من رغبتك في تنفيذ هذه العملية؟"
          footer={
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <Button variant="outline" onClick={() => setConfirmOpen(false)}>
                إلغاء
              </Button>
              <Button variant="primary" onClick={() => setConfirmOpen(false)}>
                تأكيد
              </Button>
            </div>
          }
        >
          <p>لا يمكن التراجع عن هذه العملية بعد التنفيذ.</p>
        </Modal>

        {/* Info Modal */}
        <Modal isOpen={infoOpen} onClose={() => setInfoOpen(false)} title="معلومات" size="sm">
          <p>هذه نافذة معلومات بسيطة.</p>
        </Modal>

        {/* Form Modal */}
        <Modal
          isOpen={formOpen}
          onClose={() => setFormOpen(false)}
          title="نموذج"
          size="lg"
          footer={
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <Button variant="outline" onClick={() => setFormOpen(false)}>
                إلغاء
              </Button>
              <Button variant="primary" onClick={() => setFormOpen(false)}>
                حفظ
              </Button>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label>
              الاسم:
              <input
                type="text"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  marginTop: '0.25rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                }}
              />
            </label>
            <label>
              البريد الإلكتروني:
              <input
                type="email"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  marginTop: '0.25rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                }}
              />
            </label>
          </div>
        </Modal>
      </>
    )
  },
  parameters: {
    docs: {
      description: {
        story: 'أمثلة عملية لاستخدام النوافذ في سيناريوهات مختلفة',
      },
    },
  },
}
