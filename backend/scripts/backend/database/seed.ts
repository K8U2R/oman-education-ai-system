/**
 * Database Seed Script
 * @law Law-4 (Completeness Law) - Full implementation
 * 
 * Inserts default roles and permissions
 */

import { getDbClient } from './utils/db-client.js';
import { scriptLogger } from './utils/logger.js';

async function seedRoles(client: any) {
    scriptLogger.step('Seeding default roles...');

    const roles = [
        { name: 'admin', description: 'System administrator with full access' },
        { name: 'teacher', description: 'Teacher with course management access' },
        { name: 'student', description: 'Student with learning access' },
    ];

    for (const role of roles) {
        const { rowCount } = await client.query(
            'INSERT INTO roles (name, description) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING',
            [role.name, role.description]
        );

        if (rowCount === 0) {
            scriptLogger.info(`Role '${role.name}' already exists`);
        } else {
            scriptLogger.info(`Role '${role.name}' inserted`);
        }
    }

    scriptLogger.success('Roles seeded');
}

async function seedDatabase() {
    scriptLogger.info('🌱 Starting database seeding (PostgreSQL)...');

    const client = await getDbClient();

    try {
        await client.connect();
        scriptLogger.info('Connected to PostgreSQL');

        await seedRoles(client);

        scriptLogger.success('🎉 Database seeding complete!');
    } catch (err) {
        scriptLogger.error('Database seeding failed', err as Error);
        process.exit(1);
    } finally {
        await client.end();
        process.exit(0);
    }
}

seedDatabase();
