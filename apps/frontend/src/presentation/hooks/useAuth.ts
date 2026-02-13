import { useState } from 'react';

// Basic useAuth mock to unblock build
// Ideally this should integrate with a real auth provider (e.g. Supabase, Context)
export const useAuth = () => {
    const [user] = useState<{ email: string } | null>({ email: 'test@example.com' }); // Mock user

    return {
        user,
        isAuthenticated: !!user,
        login: () => { },
        logout: () => { },
    };
};
