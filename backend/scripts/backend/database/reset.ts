/**
 * Database Reset Script
 * @law Law-4 (Completeness Law) - Full implementation
 * @law Law-5 (Config Law) - Production safety check
 * 
 * ⚠️ DANGER: Drops all tables and recreates from scratch
 * Only allowed in development environment
 */

import { getDbClient } from './utils/db-client.js';
import { scriptLogger } from './utils/logger.js';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function checkEnvironment() {
    const module = await import('../../../src/infrastructure/config/env.config.js');
    const ENV_CONFIG = module.ENV_CONFIG;

    if (ENV_CONFIG.NODE_ENV === 'production') {
        throw new Error('🚫 RESET IS FORBIDDEN IN PRODUCTION!');
    }

    scriptLogger.warn('Running in development environment - reset allowed');
}

async function dropAllTables(client: any) {
    scriptLogger.step('Dropping all tables...');

    const tables = ['user_roles', 'oauth_states', 'roles', 'users', 'schema_migrations'];

    for (const table of tables) {
        try {
            await client.query(`DROP TABLE IF EXISTS ${table} CASCADE;`);
            scriptLogger.info(`Dropped table: ${table}`);
        } catch (err) {
            scriptLogger.warn(`Failed to drop ${table}: ${(err as Error).message}`);
        }
    }

    scriptLogger.success('All tables dropped');
}

async function resetDatabase() {
    scriptLogger.info('🔄 Starting database reset (PostgreSQL)...');
    scriptLogger.warn('⚠️  This will DELETE ALL DATA!');

    const client = await getDbClient();

    try {
        // Safety check
        await checkEnvironment();

        await client.connect();
        scriptLogger.info('Connected to PostgreSQL');

        // Drop everything
        await dropAllTables(client);

        // Reinitialize
        scriptLogger.step('Running init script...');
        await execAsync('npm run db:init', { cwd: process.cwd() });

        // Reseed
        scriptLogger.step('Running seed script...');
        await execAsync('npm run db:seed', { cwd: process.cwd() });

        scriptLogger.success('🎉 Database reset complete!');
    } catch (err) {
        scriptLogger.error('Database reset failed', err as Error);
        process.exit(1);
    } finally {
        await client.end();
        process.exit(0);
    }
}

resetDatabase();
