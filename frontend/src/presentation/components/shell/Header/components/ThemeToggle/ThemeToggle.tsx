import React from 'react'
import { GraduationCap, Palette } from 'lucide-react'
import { useThemeStore } from '@/stores/useThemeStore'
import { Tooltip } from '@/presentation/components/common/Tooltip/Tooltip'

export const ThemeToggle: React.FC = () => {
    const { mode, toggleMode } = useThemeStore()

    return (
        <Tooltip content={mode === 'university' ? 'وضع الأطفال' : 'الوضع الأكاديمي'}>
            <button
                onClick={toggleMode}
                className="relative p-2 rounded-full hover:bg-black/5 transition-colors overflow-hidden"
                aria-label="Toggle Theme"
            >
                <div className="relative z-10 text-gray-600">
                    {mode === 'university' ? (
                        <GraduationCap size={20} className="text-primary-700" />
                    ) : (
                        <Palette size={20} className="text-secondary-500" />
                    )}
                </div>
            </button>
        </Tooltip>
    )
}
