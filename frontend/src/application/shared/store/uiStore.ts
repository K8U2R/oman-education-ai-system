import { create } from 'zustand'

/**
 * UI State - حالة واجهة المستخدم
 */
interface UIState {
  isSettingsModalOpen: boolean
  settingsSection: string

  // Actions
  openSettings: (section?: string) => void
  closeSettings: () => void
  toggleSettings: (section?: string) => void
}

export const useUIStore = create<UIState>(set => ({
  isSettingsModalOpen: false,
  settingsSection: 'profile',

  openSettings: (section = 'profile') =>
    set({
      isSettingsModalOpen: true,
      settingsSection: section,
    }),

  closeSettings: () =>
    set({
      isSettingsModalOpen: false,
    }),

  toggleSettings: (section = 'profile') =>
    set(state => ({
      isSettingsModalOpen: !state.isSettingsModalOpen,
      settingsSection: section || state.settingsSection,
    })),
}))
