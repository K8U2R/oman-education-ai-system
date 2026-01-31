/**
 * Frontend Environment Configuration
 * 
 * @description Type-safe access to environment variables
 */

interface FrontendEnv {
    API_URL: string;
    API_BASE_URL: string;
    API_TARGET: string;
    WS_URL: string;
    SSE_URL: string;
    APP_URL: string;
    APP_NAME: string;
    ENABLE_ANALYTICS: boolean;
    IS_DEV: boolean;
    IS_PROD: boolean;
}

/**
 * Validate and load environment configuration
 */
function loadEnvironment(): FrontendEnv {
    const errors: string[] = [];

    // Required variables
    const requiredVars = [
        'VITE_API_URL',
        'VITE_API_BASE_URL',
        'VITE_WS_URL',
        'VITE_SSE_URL',
        'VITE_APP_URL',
    ];

    for (const varName of requiredVars) {
        if (!import.meta.env[varName]) {
            errors.push(`Missing required environment variable: ${varName}`);
        }
    }

    if (errors.length > 0) {
        const errorMsg = `Frontend Environment Validation Failed:\n${errors.map(e => `  - ${e}`).join('\n')}`;
        console.error('🔴', errorMsg);
        throw new Error(errorMsg);
    }

    const env: FrontendEnv = {
        API_URL: import.meta.env.VITE_API_URL,
        API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
        API_TARGET: import.meta.env.VITE_API_TARGET || import.meta.env.VITE_API_BASE_URL,
        WS_URL: import.meta.env.VITE_WS_URL,
        SSE_URL: import.meta.env.VITE_SSE_URL,
        APP_URL: import.meta.env.VITE_APP_URL,
        APP_NAME: import.meta.env.VITE_APP_NAME || 'Oman Education AI',
        ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
        IS_DEV: import.meta.env.DEV,
        IS_PROD: import.meta.env.PROD,
    };

    // Log environment info (non-sensitive)
    console.log('✅ Environment Loaded:', {
        mode: env.IS_DEV ? 'development' : 'production',
        apiUrl: env.API_URL,
        appUrl: env.APP_URL,
    });

    return env;
}

// Export validated environment
export const ENV = loadEnvironment();
