/**
 * Frontend Environment Configuration
 * 
 * @description Type-safe access to environment variables
 */

import { validateEnv } from '../../env/schema';

/**
 * Frontend Environment Configuration
 * 
 * @description Type-safe access to environment variables
 */

// Load and validate environment
const envVars = validateEnv(import.meta.env);

export const ENV = {
    API_URL: envVars.VITE_API_URL,
    API_BASE_URL: envVars.VITE_API_BASE_URL,
    API_TARGET: envVars.VITE_API_TARGET || envVars.VITE_API_BASE_URL,
    WS_URL: envVars.VITE_WS_URL,
    SSE_URL: envVars.VITE_SSE_URL,
    APP_URL: envVars.VITE_APP_URL,
    APP_NAME: envVars.VITE_APP_NAME,
    ENABLE_ANALYTICS: envVars.VITE_ENABLE_ANALYTICS,
    IS_DEV: import.meta.env.DEV,
    IS_PROD: import.meta.env.PROD,
} as const;

// Log environment info (non-sensitive)
console.log('✅ Environment Loaded:', {
    mode: ENV.IS_DEV ? 'development' : 'production',
    apiUrl: ENV.API_URL,
    appUrl: ENV.APP_URL,
});

