/**
 * Database Client (PostgreSQL)
 * @law Law-5 (Config Law) - Uses ENV_CONFIG exclusively
 */

import pkg from 'pg';
const { Client } = pkg;

// Dynamic import to avoid circular dependencies
let ENV_CONFIG: any;

async function getEnvConfig() {
    if (!ENV_CONFIG) {
        const module = await import('../../../../src/infrastructure/config/env.config.js');
        ENV_CONFIG = module.ENV_CONFIG;
    }
    return ENV_CONFIG;
}

/**
 * Get a PostgreSQL client for admin operations
 */
export async function getDbClient() {
    const config = await getEnvConfig();

    if (!config.DATABASE_URL) {
        throw new Error('Missing DATABASE_URL configuration. Check environment variables.');
    }

    const client = new Client({
        connectionString: config.DATABASE_URL,
    });

    return client;
}
