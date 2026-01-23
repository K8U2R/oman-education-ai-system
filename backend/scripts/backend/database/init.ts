/**
 * Database Initialization Script
 * @law Law-4 (Completeness Law) - Full implementation
 * @law Law-5 (Config Law) - Uses ENV_CONFIG
 * 
 * Creates the database if it doesn't exist, then creates tables, indexes, etc.
 */

import { getDbClient } from './utils/db-client.js';
import { scriptLogger } from './utils/logger.js';
import pkg from 'pg';
const { Client } = pkg;

async function ensureDatabaseExists() {
  const module = await import('../../../src/infrastructure/config/env.config.js');
  const config = module.ENV_CONFIG;

  // Parse connection string to connect to 'postgres' default database
  const connectionString = config.DATABASE_URL;
  const parts = connectionString.split('/');
  const dbName = parts.pop()?.split('?')[0] || 'oman_edu';
  const baseConnectionString = connectionString.replace(`/${dbName}`, '/postgres');

  const client = new Client({ connectionString: baseConnectionString });

  try {
    await client.connect();
    scriptLogger.step(`Checking if database "${dbName}" exists...`);

    const res = await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);

    if (res.rowCount === 0) {
      scriptLogger.info(`Database "${dbName}" does not exist. Creating...`);
      // CREATE DATABASE cannot be run in a transaction
      await client.query(`CREATE DATABASE ${dbName}`);
      scriptLogger.success(`Database "${dbName}" created successfully`);
    } else {
      scriptLogger.info(`Database "${dbName}" already exists`);
    }
  } catch (err) {
    scriptLogger.error(`Failed to ensure database exists: ${(err as Error).message}`);
    throw err;
  } finally {
    await client.end();
  }
}

async function initDatabase() {
  scriptLogger.info('🚀 Starting database initialization (PostgreSQL)...');

  try {
    // 1. Ensure DB exists (connects to postgres default DB)
    await ensureDatabaseExists();

    // 2. Connect to actual DB (oman_edu) and create tables
    const client = await getDbClient();
    await client.connect();
    scriptLogger.info('Connected to target database');

    scriptLogger.step('Creating tables...');

    const sql = `
            -- Enable UUID extension
            CREATE EXTENSION IF NOT EXISTS "pgcrypto";

            -- Users Table
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT,
                first_name TEXT,
                last_name TEXT,
                username TEXT UNIQUE,
                avatar_url TEXT,
                is_verified BOOLEAN DEFAULT FALSE,
                email_verified BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW()
            );

            CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
            CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

            -- Roles Table
            CREATE TABLE IF NOT EXISTS roles (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name TEXT UNIQUE NOT NULL,
                description TEXT,
                created_at TIMESTAMPTZ DEFAULT NOW()
            );

            -- User Roles Junction
            CREATE TABLE IF NOT EXISTS user_roles (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
                assigned_at TIMESTAMPTZ DEFAULT NOW(),
                UNIQUE(user_id, role_id)
            );

            CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_roles(user_id);
            CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role_id);

            -- OAuth States Table
            CREATE TABLE IF NOT EXISTS oauth_states (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                state_token TEXT UNIQUE NOT NULL,
                redirect_to TEXT NOT NULL,
                code_verifier TEXT NOT NULL,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                expires_at TIMESTAMPTZ NOT NULL,
                used_at TIMESTAMPTZ
            );

            CREATE INDEX IF NOT EXISTS idx_oauth_states_token ON oauth_states(state_token);
            CREATE INDEX IF NOT EXISTS idx_oauth_states_expires ON oauth_states(expires_at);
        `;

    await client.query(sql);
    scriptLogger.success('🎉 Database initialization complete!');
    await client.end();
    process.exit(0);

  } catch (err) {
    scriptLogger.error('Database initialization failed', err as Error);
    process.exit(1);
  }
}

initDatabase();
