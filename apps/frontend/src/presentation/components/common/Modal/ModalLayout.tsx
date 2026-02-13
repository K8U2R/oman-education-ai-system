import React from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { X } from 'lucide-react'
import { NotificationDock } from '@/presentation/components/common/NotificationDock/NotificationDock'
import { useTranslation } from 'react-i18next'
import styles from './ModalLayout.module.scss'

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
    const { t } = useTranslation()

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className={styles.overlay}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                >
                    {/* Notification Dock - Attached to the Modal System */}
                    <div className={styles.notificationDock}>
                        <div className={styles.dockContainer}>
                            {/* Positioning handled by Dock itself usually, but this container helps alignment */}
                        </div>
                    </div>
                    {/* Render Dock globally within the modal context */}
                    <NotificationDock />

                    {/* Backdrop with Blur - OKLCH */}
                    <motion.div
                        className={styles.backdrop}
                        variants={backdropVariants}
                        onClick={onClose}
                    />

                    {/* Modal Content container - OKLCH Theme-aware */}
                    <motion.div
                        className={styles.modal}
                        variants={modalVariants}
                    >
                        {/* Header */}
                        <div className={styles.header}>
                            <h3 className={styles.title}>
                                {title || t('common.default_modal_title')}
                            </h3>
                            <button
                                onClick={onClose}
                                className={styles.closeButton}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className={styles.content}>
                            {children}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
