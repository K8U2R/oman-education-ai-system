import React from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { X } from 'lucide-react'
import { NotificationDock } from '@/presentation/components/common/NotificationDock/NotificationDock'

interface ModalLayoutProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
    title?: string
}

const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
}

const modalVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", duration: 0.5, bounce: 0.3 }
    },
    exit: { opacity: 0, y: 50, scale: 0.95 }
}

export const ModalLayout: React.FC<ModalLayoutProps> = ({
    isOpen,
    onClose,
    children,
    title
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                >
                    {/* Notification Dock - Attached to the Modal System */}
                    <div className="absolute top-0 right-0 h-full w-full pointer-events-none z-[60]">
                        <div className="relative w-full h-full max-w-lg mx-auto flex items-start justify-end">
                            {/* Positioning handled by Dock itself usually, but this container helps alignment */}
                        </div>
                    </div>
                    {/* Render Dock globally within the modal context */}
                    <NotificationDock />

                    {/* Backdrop with Blur - OKLCH */}
                    <motion.div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        variants={backdropVariants}
                        onClick={onClose}
                    />

                    {/* Modal Content container - OKLCH Theme-aware */}
                    <motion.div
                        className="relative w-full max-w-lg pointer-events-auto bg-bg-surface rounded-2xl shadow-xl border border-border-primary overflow-hidden"
                        variants={modalVariants}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border-secondary bg-bg-surface">
                            <h3 className="text-xl font-bold text-text-primary">
                                {title || 'Oman AI System'}
                            </h3>
                            <button
                                onClick={onClose}
                                className="text-text-secondary hover:text-error transition-colors p-1 rounded-md hover:bg-bg-tertiary"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="p-6 overflow-y-auto max-h-[80vh] text-text-primary">
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
