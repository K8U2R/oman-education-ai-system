import { useAuthStore } from '@/features/user-authentication-management'
import type { PlanTier } from '@/domain/types/auth.types'

/**
 * useUserTier - Hook to get the current user's plan tier
 * 
 * Enforces Law of Plan Sovereignty by retrieving the actual tier from the authenticated user.
 * Defaults to 'FREE' if no user is logged in or data is missing.
 */
export const useUserTier = (): PlanTier => {
    const user = useAuthStore(state => state.user)

    if (!user) {
        return 'FREE'
    }

    // Assuming User entity has planTier property (which we just added)
    // Casting or checking property existence if typescript flags it (it shouldn't if User is updated)
    return user.planTier || 'FREE'
}
