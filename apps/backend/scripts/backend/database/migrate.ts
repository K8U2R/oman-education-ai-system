/**
 * Database Migration Script
 * @law Law-4 (Completeness Law) - Full implementation
 * 
 * Runs SQL migrations from migrations/ folder
 */

import { getDbClient } from './utils/db-client.js';
import { scriptLogger } from './utils/logger.js';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

async function createMigrationsTable(client: any) {
    await client.query(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            id SERIAL PRIMARY KEY,
            version TEXT UNIQUE NOT NULL,
            applied_at TIMESTAMPTZ DEFAULT NOW()
        );
    `);
}

async function getAppliedMigrations(client: any): Promise<string[]> {
    const { rows } = await client.query('SELECT version FROM schema_migrations ORDER BY version');
    return rows.map((row: any) => row.version);
}

async function applyMigration(client: any, version: string, sql: string) {
    scriptLogger.step(`Applying migration: ${version}`);

    try {
        await client.query('BEGIN');
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations (version) VALUES ($1)', [version]);
        await client.query('COMMIT');
        scriptLogger.success(`Migration ${version} applied`);
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    }
}

async function runMigrations() {
    scriptLogger.info('🔄 Starting database migrations (PostgreSQL)...');

    const client = await getDbClient();

    try {
        await client.connect();
        scriptLogger.info('Connected to PostgreSQL');

        let migrationsDir = join(process.cwd(), 'migrations');

        // Fallback to database-core/migrations if called from backend and local migrations is missing
        try {
            const files = await readdir(migrationsDir);
            if (files.length === 0) throw new Error('Empty');
        } catch (e) {
            const fallback = join(process.cwd(), '..', 'database-core', 'migrations');
            scriptLogger.info(`Local migrations not found, trying fallback: ${fallback}`);
            migrationsDir = fallback;
        }

        // Create migrations table
        await createMigrationsTable(client);

        // Get applied migrations
        const applied = await getAppliedMigrations(client);
        scriptLogger.info(`Applied migrations: ${applied.length}`);

        // Read migration files
        const files = await readdir(migrationsDir).catch(() => []);
        const sqlFiles = files
            .filter(f => f.endsWith('.sql'))
            .sort();

        if (sqlFiles.length === 0) {
            scriptLogger.warn('No migration files found');
            return;
        }

        // Apply pending migrations
        for (const file of sqlFiles) {
            const version = file.replace('.sql', '');

            if (applied.includes(version)) {
                scriptLogger.info(`Skipping ${version} (already applied)`);
                continue;
            }

            const sql = await readFile(join(migrationsDir, file), 'utf-8');
            await applyMigration(client, version, sql);
        }

        scriptLogger.success('🎉 All migrations applied!');
    } catch (err) {
        scriptLogger.error('Migration failed', err as Error);
        process.exit(1);
    } finally {
        await client.end();
        process.exit(0);
    }
}

runMigrations();
