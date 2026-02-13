/**
 * FeatureGate Component Tests
 * 
 * Tests permission-based rendering logic
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FeatureGate } from './FeatureGate'
import * as useRoleModule from '@/features/user-authentication-management/hooks/useRole'

// Mock useRole hook
vi.mock('@/features/user-authentication-management/hooks/useRole')

describe('FeatureGate', () => {
    const mockHasPermission = vi.fn()

    beforeEach(() => {
        vi.clearAllMocks()
        vi.spyOn(useRoleModule, 'useRole').mockReturnValue({
            hasPermission: mockHasPermission,
            role: 'student',
            permissions: [],
        } as any)
    })

    it('should render children when user has permission', () => {
        mockHasPermission.mockReturnValue(true)

        render(
            <FeatureGate permission="ai.content-generation.use">
                <div>Protected Content</div>
            </FeatureGate>
        )

        expect(screen.getByText('Protected Content')).toBeInTheDocument()
    })

    it('should render UpgradePrompt when user lacks permission', () => {
        mockHasPermission.mockReturnValue(false)

        render(
            <FeatureGate
                permission="ai.content-generation.use"
                featureName="AI Content Generation"
            >
                <div>Protected Content</div>
            </FeatureGate>
        )

        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
        expect(screen.getByText('ميزة متقدمة')).toBeInTheDocument()
    })

    it('should render custom fallback when provided', () => {
        mockHasPermission.mockReturnValue(false)

        render(
            <FeatureGate
                permission="ai.recommendations.view"
                fallback={<div>Custom Fallback</div>}
            >
                <div>Protected Content</div>
            </FeatureGate>
        )

        expect(screen.getByText('Custom Fallback')).toBeInTheDocument()
        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    })

    it('should render nothing when hideOnDenied is true and user lacks permission', () => {
        mockHasPermission.mockReturnValue(false)

        const { container } = render(
            <FeatureGate
                permission="ai.models.view"
                hideOnDenied
            >
                <div>Protected Content</div>
            </FeatureGate>
        )

        expect(container.firstChild).toBeNull()
    })

    it('should call hasPermission with correct permission string', () => {
        mockHasPermission.mockReturnValue(true)

        render(
            <FeatureGate permission="ai.analytics.view">
                <div>Analytics</div>
            </FeatureGate>
        )

        expect(mockHasPermission).toHaveBeenCalledWith('ai.analytics.view')
    })
})
