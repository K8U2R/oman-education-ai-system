import { create } from 'zustand'

export type ModalType = 'login' | 'register' | 'forgot-password' | 'settings' | 'confirmation' | null

interface ModalState {
    isOpen: boolean
    modalType: ModalType
    props: Record<string, any>
    open: (type: ModalType, props?: Record<string, any>) => void
    close: () => void
}

export const useModalStore = create<ModalState>((set) => ({
    isOpen: false,
    modalType: null,
    props: {},
    open: (type, props = {}) => set({ isOpen: true, modalType: type, props }),
    close: () => set({ isOpen: false, modalType: null, props: {} }),
}))
