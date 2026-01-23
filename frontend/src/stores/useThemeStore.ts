import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeMode = 'university' | 'children'

interface ThemeState {
    mode: ThemeMode
    setMode: (mode: ThemeMode) => void
    toggleMode: () => void
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            mode: 'university', // Default to University (Serious) mode
            setMode: (mode) => {
                set({ mode })
                updateBodyClass(mode)
            },
            toggleMode: () =>
                set((state) => {
                    const newMode = state.mode === 'university' ? 'children' : 'university'
                    updateBodyClass(newMode)
                    return { mode: newMode }
                }),
        }),
        {
            name: 'theme-storage',
            onRehydrateStorage: () => (state) => {
                if (state) {
                    updateBodyClass(state.mode)
                }
            },
        }
    )
)

// Helper to update body class directly
const updateBodyClass = (mode: ThemeMode) => {
    document.body.classList.remove('theme-university', 'theme-children')
    document.body.classList.add(`theme-${mode}`)
}
