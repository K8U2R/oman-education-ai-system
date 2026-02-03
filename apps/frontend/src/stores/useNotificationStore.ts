import { create } from 'zustand'

export type NotificationType = 'success' | 'error' | 'info' | 'warning'

export interface DebugDetails {
    code?: string
    stack?: string
    path?: string // File path or API endpoint
    context?: Record<string, any>
    timestamp: string
}

export interface Notification {
    id: string
    type: NotificationType
    title?: string
    message: string
    duration?: number // duration in ms, 0 for persistent
    debugDetails?: DebugDetails // For dev mode
}

interface NotificationState {
    notifications: Notification[]
    addNotification: (notification: Omit<Notification, 'id'>) => string
    removeNotification: (id: string) => void
    clearAll: () => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
    notifications: [],
    addNotification: (notification) => {
        const id = Math.random().toString(36).substring(7)
        const newNotification = { ...notification, id }
        set((state) => ({ notifications: [...state.notifications, newNotification] }))

        if (notification.type !== 'error' && notification.duration !== 0) {
            const duration = notification.duration || 5000
            setTimeout(() => {
                set((state) => ({
                    notifications: state.notifications.filter((n) => n.id !== id)
                }))
            }, duration)
        }

        return id
    },
    removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id)
    })),
    clearAll: () => set({ notifications: [] }),
}))
