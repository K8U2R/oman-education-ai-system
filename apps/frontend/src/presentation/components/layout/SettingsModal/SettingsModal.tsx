import React, { useState } from 'react'
import { User as UserIcon, Lock, Globe, Cloud, Palette, X } from 'lucide-react'
import { Modal } from '@/presentation/components/ui/layout/Modal/Modal'
import { useRole } from '@/features/user-authentication-management'
import GeneralSettings from '../../settings/GeneralSettings'
import ChangePassword from '../../settings/ChangePassword'
import LanguageSettings from '../../settings/LanguageSettings'
import ThemeSelector from '../../settings/ThemeSelector'
import IntegrationsSettings from '../../settings/IntegrationsSettings'
import { cn } from '@/presentation/components/ui/utils/classNames'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  initialSection?: string
}

type SectionType = 'profile' | 'security' | 'integrations' | 'appearance' | 'language'

export const SettingsContent: React.FC<{
  onClose?: () => void
  initialSection?: string
}> = ({ onClose, initialSection = 'profile' }) => {
  const [activeSection, setActiveSection] = useState<SectionType>(initialSection as SectionType)
  const { userRole } = useRole()
  const canAccessIntegrations = userRole === 'admin' || userRole === 'developer'

  const sections = [
    {
      id: 'profile',
      label: 'الملف الشخصي',
      icon: <UserIcon size={20} />,
      component: <GeneralSettings />,
      description: 'إدارة معلوماتك الشخصية وبيانات الحساب',
    },
    {
      id: 'security',
      label: 'الأمان',
      icon: <Lock size={20} />,
      component: <ChangePassword />,
      description: 'حماية حسابك وتغيير كلمة المرور',
    },
    {
      id: 'appearance',
      label: 'المظهر',
      icon: <Palette size={20} />,
      component: (
        <div className="settings-appearance">
          <ThemeSelector />
        </div>
      ),
      description: 'تخصيص مظهر النظام والألوان',
    },
    {
      id: 'language',
      label: 'اللغة',
      icon: <Globe size={20} />,
      component: <LanguageSettings />,
      description: 'تغيير لغة النظام والمنطقة الزمنية',
    },
  ]

  if (canAccessIntegrations) {
    sections.splice(2, 0, {
      id: 'integrations',
      label: 'التكامل',
      icon: <Cloud size={20} />,
      component: <IntegrationsSettings />,
      description: 'ربط حسابك مع الخدمات السحابية والتطبيقات الخارجية',
    })
  }

  const activeSectionData = sections.find(s => s.id === activeSection) || sections[0]

  return (
    <div className="settings-modal__wrapper h-full">
      {/* Note: h-full added to ensure it fills modal */}
      {onClose && (
        <button className="settings-modal__close" onClick={onClose} aria-label="إغلاق">
          <X size={20} />
        </button>
      )}

      <div className="settings-modal__container h-full">
        <aside className="settings-modal__sidebar">
          <div className="settings-modal__sidebar-header">
            <h2 className="settings-modal__title">الإعدادات</h2>
          </div>
          <div className="settings-modal__sidebar-nav">
            {sections.map(section => (
              <button
                key={section.id}
                className={cn(
                  'settings-modal__sidebar-item',
                  activeSection === section.id && 'settings-modal__sidebar-item--active'
                )}
                onClick={() => setActiveSection(section.id as SectionType)}
              >
                <span className="settings-modal__sidebar-icon">{section.icon}</span>
                <span>{section.label}</span>
              </button>
            ))}
          </div>
        </aside>

        <main className="settings-modal__content overflow-y-auto">
          {activeSectionData ? (
            <>
              <header className="mb-6">
                <h3 className="settings-modal__section-title">{activeSectionData.label}</h3>
                <p className="settings-modal__section-description">
                  {activeSectionData.description}
                </p>
              </header>
              <div className="settings-modal__section-body">{activeSectionData.component}</div>
            </>
          ) : (
            <div className="p-8 text-center text-gray-500">القسم غير متوفر</div>
          )}
        </main>
      </div>
    </div>
  )
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  initialSection = 'profile',
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      showCloseButton={false}
      className="settings-modal"
    >
      <SettingsContent onClose={onClose} initialSection={initialSection} />
    </Modal>
  )
}

export default SettingsModal
