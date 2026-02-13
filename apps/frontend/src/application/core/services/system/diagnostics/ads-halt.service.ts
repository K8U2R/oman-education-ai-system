
import { useState, useEffect } from 'react'

export interface SystemHaltState {
    message: string
    code: string
}

class AdsSystemHaltService {
    private static instance: AdsSystemHaltService
    private listeners: ((state: SystemHaltState | null) => void)[] = []

    private constructor() {
        if (typeof window !== 'undefined') {
            window.addEventListener('ADS:SYSTEM_HALT', this.handleEvent.bind(this))
        }
    }

    public static getInstance(): AdsSystemHaltService {
        if (!AdsSystemHaltService.instance) {
            AdsSystemHaltService.instance = new AdsSystemHaltService()
        }
        return AdsSystemHaltService.instance
    }

    private handleEvent(event: Event): void {
        const customEvent = event as CustomEvent
        if (customEvent.detail) {
            const state: SystemHaltState = {
                message: customEvent.detail.reason || 'System Halted',
                code: customEvent.detail.code || 'EMERGENCY_STOP'
            }
            this.notifyListeners(state)
        }
    }

    public subscribe(callback: (state: SystemHaltState | null) => void): () => void {
        this.listeners.push(callback)
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback)
        }
    }

    private notifyListeners(state: SystemHaltState): void {
        this.listeners.forEach(listener => listener(state))
    }

    public cleanup(): void {
        if (typeof window !== 'undefined') {
            window.removeEventListener('ADS:SYSTEM_HALT', this.handleEvent.bind(this))
        }
    }
}

export const adsSystemHaltService = AdsSystemHaltService.getInstance()

// React Hook for easy consumption
export const useAdsSystemHalt = () => {
    const [haltState, setHaltState] = useState<SystemHaltState | null>(null)

    useEffect(() => {
        const unsubscribe = adsSystemHaltService.subscribe(setHaltState)
        return () => unsubscribe()
    }, [])

    return haltState
}
