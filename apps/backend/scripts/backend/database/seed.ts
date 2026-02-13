import 'dotenv/config';
import { getDbClient } from './utils/db-client.js';

async function seed() {
    console.log('🌱 Starting database seeding (Raw SQL)...');

    const client = await getDbClient();
    await client.connect();

    try {
        // 1. Seed Admin User
        const adminEmail = 'admin@oman-edu.ai';
        console.log(`Checking admin user: ${adminEmail}`);

        // Upsert Admin
        await client.query(`
            INSERT INTO users (email, username, role, "planTier", first_name, last_name, is_verified, is_active)
            VALUES ($1, $2, 'admin', 'PREMIUM', 'System', 'Admin', true, true)
            ON CONFLICT (email) DO NOTHING
        `, [adminEmail, 'admin']);

        // 1.b Seed Free Student
        const studentEmail = 'student@oman-edu.ai';
        console.log(`Checking student user: ${studentEmail}`);
        await client.query(`
            INSERT INTO users (email, username, role, "planTier", first_name, last_name, is_verified, is_active)
            VALUES ($1, $2, 'student', 'FREE', 'Ali', 'Al-Student', true, true)
            ON CONFLICT (email) DO NOTHING
        `, [studentEmail, 'student']);

        // 2. Seed Sample Course
        const courseSlug = 'introduction-to-ai';
        console.log(`Seeding course: ${courseSlug}`);

        // Upsert Course
        const courseRes = await client.query(`
            INSERT INTO courses (title, slug, description, level, is_published)
            VALUES ($1, $2, 'A foundational course on AI.', 'beginner', true)
            ON CONFLICT (slug) DO UPDATE SET title = EXCLUDED.title
            RETURNING id
        `, ['Introduction to AI in Education', courseSlug]);

        const courseId = courseRes.rows[0]?.id;

        if (courseId) {
            // Seed Module
            const modRes = await client.query(`
                INSERT INTO modules (course_id, title, "order")
                VALUES ($1, 'Module 1: AI Basics', 1)
                RETURNING id
            `, [courseId]);
            // Note: simplistic check, better to select first if exists
        }

        console.log('🎉 Seeding complete!');
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    } finally {
        await client.end();
    }
}

seed();
