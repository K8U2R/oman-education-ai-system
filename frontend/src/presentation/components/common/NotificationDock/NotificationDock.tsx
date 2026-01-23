import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, CheckCircle, Info, X, Terminal, Copy } from 'lucide-react'
import { useNotificationStore, Notification } from '@/stores/useNotificationStore'
import { cn } from '@/presentation/components/ui/utils/classNames'

// Dev Debug Console Component
const DevDebugConsole: React.FC<{ notification: Notification }> = ({ notification }) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const isDev = import.meta.env.DEV

    if (!isDev || !notification.debugDetails) return null

    const { code, stack, path, context, timestamp } = notification.debugDetails

    return (
        <div className="mt-2 text-xs font-mono border-t border-red-200/20 pt-2">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors w-full text-left"
            >
                <Terminal size={12} />
                <span>Dev Debug Info {code ? `[${code}]` : ''}</span>
            </button>

            {isExpanded && (
                <div className="mt-2 bg-black/90 p-3 rounded-md text-green-400 overflow-x-auto terminal-ui shadow-inner">
                    <div className="flex justify-between items-center mb-2 border-b border-green-800 pb-1">
                        <span className="opacity-70">{timestamp}</span>
                        <button title="Copy Stack" onClick={() => navigator.clipboard.writeText(stack || '')}>
                            <Copy size={12} />
                        </button>
                    </div>
                    {path && <div className="mb-1 text-blue-400">Path: {path}</div>}
                    {context && (
                        <div className="mb-2 opacity-80">
                            Context: {JSON.stringify(context, null, 2)}
                        </div>
                    )}
                    {stack && <pre className="whitespace-pre-wrap opacity-90">{stack}</pre>}
                </div>
            )}
        </div>
    )
}

// Notification Item Component
const NotificationItem: React.FC<{ notification: Notification; onClose: (id: string) => void }> = ({
    notification,
    onClose,
}) => {
    const icons = {
        success: <CheckCircle className="text-green-500" size={24} />,
        error: <AlertCircle className="text-red-500" size={24} />,
        warning: <AlertCircle className="text-yellow-500" size={24} />,
        info: <Info className="text-blue-500" size={24} />,
    }

    const bgColors = {
        success: 'bg-white border-green-500 shadow-green-500/20',
        error: 'bg-gray-900 text-white border-red-500 shadow-red-500/20', // Error dark mode style
        warning: 'bg-white border-yellow-500 shadow-yellow-500/20',
        info: 'bg-white border-blue-500 shadow-blue-500/20',
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, transition: { duration: 0.2 } }}
            className={cn(
                'relative rounded-xl border-l-4 shadow-lg p-4 mb-3 w-[350px] pointer-events-auto backdrop-blur-md',
                bgColors[notification.type],
                // Glassmorphism logic can be added here
            )}
        >
            <button
                onClick={() => onClose(notification.id)}
                className="absolute top-2 right-2 opacity-50 hover:opacity-100 transition-opacity"
            >
                <X size={16} />
            </button>

            <div className="flex gap-3">
                <div className="flex-shrink-0 mt-1">{icons[notification.type]}</div>
                <div className="flex-1 overflow-hidden">
                    {notification.title && <h4 className="font-bold text-sm mb-1">{notification.title}</h4>}
                    <p className="text-sm opacity-90 leading-relaxed">{notification.message}</p>

                    <DevDebugConsole notification={notification} />
                </div>
            </div>
        </motion.div>
    )
}

// Main Dock Component
export const NotificationDock: React.FC = () => {
    const { notifications, removeNotification } = useNotificationStore()

    return (
        <div className="absolute top-0 right-full h-full flex flex-col justify-start items-end pr-4 py-8 z-50 pointer-events-none">
            {/* 
               Positioning: 
               - absolute relative to the modal container (which serves as anchor)
               - right-full pushes it to the left of the modal (if modal is LTR) or right if RTL context applies (check direction)
               Let's assume standard layout. We want it attached to the side.
            */}
            <AnimatePresence mode="popLayout">
                {notifications.map((n) => (
                    <NotificationItem key={n.id} notification={n} onClose={removeNotification} />
                ))}
            </AnimatePresence>
        </div>
    )
}
