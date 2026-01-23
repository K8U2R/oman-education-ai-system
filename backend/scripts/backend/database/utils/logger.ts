/**
 * Script Logger Utility
 * Provides consistent logging for database scripts
 */

export const scriptLogger = {
    info: (msg: string) => console.log(`ℹ️  ${msg}`),
    success: (msg: string) => console.log(`✅ ${msg}`),
    warn: (msg: string) => console.warn(`⚠️  ${msg}`),
    error: (msg: string, err?: Error) => {
        console.error(`❌ ${msg}`);
        if (err) {
            console.error(`   Details: ${err.message}`);
            if (err.stack) console.error(err.stack);
        }
    },
    step: (msg: string) => console.log(`📍 ${msg}`),
};
