import React, { useState } from 'react'
import { User as UserIcon, Lock, Globe, Cloud, Palette, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Modal } from '@/presentation/components/ui/layout/Modal/Modal'
import { useRole } from '@/features/user-authentication-management'
import GeneralSettings from '@/presentation/pages/user/settings/components/GeneralSettings'
import ChangePassword from '@/presentation/pages/user/settings/components/ChangePassword'
import LanguageSettings from '@/presentation/pages/user/settings/components/LanguageSettings'
import ThemeSelector from '@/presentation/pages/user/settings/components/ThemeSelector'
import IntegrationsSettings from '@/presentation/pages/user/settings/components/IntegrationsSettings'
import { cn } from '@/presentation/components/ui/utils/classNames'
import styles from './SettingsModal.module.scss'

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
  const { t } = useTranslation('common')
  const [activeSection, setActiveSection] = useState<SectionType>(initialSection as SectionType)
  const { userRole } = useRole()
  const canAccessIntegrations = userRole === 'admin' || userRole === 'developer'

  const sections = [
    {
      id: 'profile',
      label: t('settings.sections.profile.label'),
      icon: <UserIcon className={styles.navIcon} />,
      component: <GeneralSettings />,
      description: t('settings.sections.profile.description'),
    },
    {
      id: 'security',
      label: t('settings.sections.security.label'),
      icon: <Lock className={styles.navIcon} />,
      component: <ChangePassword />,
      description: t('settings.sections.security.description'),
    },
    {
      id: 'appearance',
      label: t('settings.sections.appearance.label'),
      icon: <Palette className={styles.navIcon} />,
      component: (
        <div className="settings-appearance">
          <ThemeSelector />
        </div>
      ),
      description: t('settings.sections.appearance.description'),
    },
    {
      id: 'language',
      label: t('settings.sections.language.label'),
      icon: <Globe className={styles.navIcon} />,
      component: <LanguageSettings />,
      description: t('settings.sections.language.description'),
    },
  ]

  if (canAccessIntegrations) {
    sections.splice(2, 0, {
      id: 'integrations',
      label: t('settings.sections.integrations.label'),
      icon: <Cloud className={styles.navIcon} />,
      component: <IntegrationsSettings />,
      description: t('settings.sections.integrations.description'),
    })
  }

  const activeSectionData = sections.find(s => s.id === activeSection) || sections[0]

  return (
    <div className={styles.wrapper}>
      {onClose && (
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label={t('settings.actions.close')}
        >
          <X size={20} />
        </button>
      )}

      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <h2 className={styles.title}>{t('settings.title')}</h2>
          </div>
          <div className={styles.sidebarNav}>
            {sections.map(section => (
              <button
                key={section.id}
                className={cn(
                  styles.navItem,
                  activeSection === section.id && styles['navItem--active']
                )}
                onClick={() => setActiveSection(section.id as SectionType)}
              >
                <span className={styles.navIconWrapper}>{section.icon}</span>
                <span>{section.label}</span>
              </button>
            ))}
          </div>
        </aside>

        <main className={styles.content}>
          {activeSectionData ? (
            <>
              <header className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>{activeSectionData.label}</h3>
                <p className={styles.sectionDescription}>
                  {activeSectionData.description}
                </p>
              </header>
              <div className={styles.sectionBody}>{activeSectionData.component}</div>
            </>
          ) : (
            <div className={styles.unavailable}>{t('settings.status.section_unavailable')}</div>
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
      className={styles.modal}
    >
      <SettingsContent onClose={onClose} initialSection={initialSection} />
    </Modal>
  )
}

export default SettingsModal
