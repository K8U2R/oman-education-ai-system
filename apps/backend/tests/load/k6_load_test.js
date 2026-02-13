import http from 'k6/http';
import { check, sleep, group } from 'k6';
import crypto from 'k6/crypto';
import encoding from 'k6/encoding';

// --- CONFIGURATION ---
// const BASE_URL = 'http://localhost:3000/api/v1'; // Testing locally on VPS to avoid network latency noise
const BASE_URL = 'https://k8u2r.online/api/v1'; // Production URL (use if testing from external)

const JWT_SECRET = '0e85359483d70ac93ffc3cd264b8a7d1aa89cf464a106ade49dd1333d19c7c65';

// To be populated after fetch-test-data.ts runs
const USERS = {
    FREE: { id: '87fe3590-ef2b-4a23-8b88-8c4c8cdc5068', email: 'student@oman-edu.ai', role: 'student', planTier: 'FREE' },
    PREMIUM: { id: '3d3ff5ee-0ddc-446a-af4a-afae423362dd', email: 'admin@oman-edu.ai', role: 'admin', planTier: 'PREMIUM' }
};

const COURSE_SLUG = 'introduction-to-ai';
const COURSE_ID = '451aa3bd-8c62-4fd5-8ec3-ce2880851700';
const USER_ASSESSMENT_ID = 'a3144f6e-65b1-4847-a6e0-1f6546bc51d9';

export const options = {
    stages: [
        { duration: '30s', target: 50 },  // Ramp up to 50 users
        { duration: '1m', target: 100 },  // Stay at 100
        { duration: '30s', target: 0 },   // Ramp down
    ],
    thresholds: {
        http_req_duration: ['p(95)<5000'], // 95% of requests should be below 5s
        http_req_failed: ['rate<0.01'],    // Less than 1% failure
    },
};

// --- HELPER: GENERATE JWT ---
function generateToken(user) {
    const header = encoding.b64encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }), 'url');
    const payload = encoding.b64encode(JSON.stringify({
        id: user.id,
        email: user.email,
        role: user.role,
        planTier: user.planTier,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600 // 1 hour
    }), 'url');
    const signature = encoding.b64encode(crypto.hmac('sha256', JWT_SECRET, `${header}.${payload}`, 'binary'), 'url');
    return `${header}.${payload}.${signature}`;
}

export default function () {
    const freeUserToken = generateToken(USERS.FREE);
    const premiumUserToken = generateToken(USERS.PREMIUM);

    // 1. Browse Course (Public/Auth optional but we send auth)
    group('Browse Course', () => {
        const res = http.get(`${BASE_URL}/learning/courses/${COURSE_SLUG}`, {
            headers: { Authorization: `Bearer ${freeUserToken}` }
        });
        check(res, { 'Course loaded': (r) => r.status === 200 });
        sleep(1);
    });

    // 2. Chat with AI (Law 14 Check)
    group('Chat AI - Free User (Should Block)', () => {
        const res = http.post(`${BASE_URL}/learning/chat`, JSON.stringify({
            message: "Hello AI"
        }), {
            headers: {
                Authorization: `Bearer ${freeUserToken}`,
                'Content-Type': 'application/json'
            }
        });
        check(res, {
            'TierGuard Blocked': (r) => r.status === 403
        });
    });

    group('Chat AI - Premium User (Should Pass)', () => {
        const res = http.post(`${BASE_URL}/learning/chat`, JSON.stringify({
            message: "Hello AI"
        }), {
            headers: {
                Authorization: `Bearer ${premiumUserToken}`,
                'Content-Type': 'application/json'
            }
        });
        // Note: Actual OpenAI call might fail if key invalid, but we expect 200 or 500, NOT 403.
        // If 500 (OpenAI error), it means TierGuard passed.
        check(res, {
            'TierGuard Passed': (r) => r.status !== 403
        });
        sleep(2);
    });

    // 3. Submit Assessment
    group('Submit Assessment', () => {
        const res = http.post(`${BASE_URL}/assessments/${USER_ASSESSMENT_ID}/submit`, JSON.stringify({
            questionId: 'mock-q-id', // Grading service doesn't validate questionId yet
            answer: "Neural networks are..."
        }), {
            headers: {
                Authorization: `Bearer ${premiumUserToken}`,
                'Content-Type': 'application/json'
            }
        });
        // We expect 200 (Success) or 500 (if OpenAIService fails) but NOT 404/403
        check(res, { 'Request Handled': (r) => r.status === 200 });
    });
}
