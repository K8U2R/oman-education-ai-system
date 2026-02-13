/**
 * Backend Comprehensive Performance Testing Script
 * سكريبت فحص شامل لأداء الخادم الخلفي
 */

import { performance } from 'perf_hooks';
import { writeFile } from 'fs/promises';
import { join } from 'path';

const BASE_URL = process.env.API_URL || 'http://localhost:30000';

interface TestResult {
    endpoint: string;
    method: string;
    status: number;
    responseTime: number;
    success: boolean;
    error?: string;
    body?: any;
    headers?: Record<string, string>;
    bodySize?: number;
}

interface TestCategory {
    name: string;
    tests: TestResult[];
    avgTime: number;
    successRate: number;
}

class ComprehensiveBackendTester {
    private results: TestResult[] = [];
    private categories: Map<string, TestResult[]> = new Map();

    /**
     * اختبار endpoint واحد
     */
    async testEndpoint(
        endpoint: string,
        method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
        body?: any,
        headers?: Record<string, string>,
        category: string = 'General'
    ): Promise<TestResult> {
        const url = `${BASE_URL}${endpoint}`;
        const startTime = performance.now();

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
                body: body ? JSON.stringify(body) : undefined,
            });

            const endTime = performance.now();
            const responseTime = endTime - startTime;

            let responseBody;
            let bodySize = 0;
            const contentType = response.headers.get('content-type');

            if (contentType?.includes('application/json')) {
                const text = await response.text();
                bodySize = text.length;
                try {
                    responseBody = JSON.parse(text);
                } catch {
                    responseBody = text;
                }
            } else if (contentType?.includes('text/html')) {
                responseBody = await response.text();
                bodySize = responseBody.length;
            } else {
                const text = await response.text();
                responseBody = text;
                bodySize = text.length;
            }

            const responseHeaders: Record<string, string> = {};
            response.headers.forEach((value, key) => {
                responseHeaders[key] = value;
            });

            const result: TestResult = {
                endpoint,
                method,
                status: response.status,
                responseTime: Math.round(responseTime * 100) / 100,
                success: response.ok,
                body: responseBody,
                headers: responseHeaders,
                bodySize,
            };

            this.results.push(result);

            // Add to category
            if (!this.categories.has(category)) {
                this.categories.set(category, []);
            }
            this.categories.get(category)!.push(result);

            return result;
        } catch (error) {
            const endTime = performance.now();
            const responseTime = endTime - startTime;

            const result: TestResult = {
                endpoint,
                method,
                status: 0,
                responseTime: Math.round(responseTime * 100) / 100,
                success: false,
                error: error instanceof Error ? error.message : String(error),
            };

            this.results.push(result);

            if (!this.categories.has(category)) {
                this.categories.set(category, []);
            }
            this.categories.get(category)!.push(result);

            return result;
        }
    }

    /**
     * تشغيل جميع الاختبارات الشاملة
     */
    async runComprehensiveTests() {
        this.printHeader();

        // 1. اختبارات الصحة والحالة
        await this.testHealthEndpoints();

        // 2. اختبارات الوثائق
        await this.testDocumentationEndpoints();

        // 3. اختبارات المصادقة
        await this.testAuthEndpoints();

        // 4. اختبارات الأداء المتكرر
        await this.testPerformance();

        // 5. اختبارات معدل الطلبات
        await this.testConcurrency();

        // 6. اختبارات نقاط النهاية الإضافية
        await this.testAdditionalEndpoints();

        // طباعة النتائج
        this.printDetailedResults();
        await this.saveResults();
    }

    /**
     * اختبارات الصحة
     */
    private async testHealthEndpoints() {
        console.log('\n' + '━'.repeat(80));
        console.log('📊 اختبارات الصحة والحالة (Health & Status Tests)');
        console.log('━'.repeat(80) + '\n');

        const tests = [
            { endpoint: '/health', desc: 'نقطة الصحة الرئيسية' },
            { endpoint: '/api/v1/health', desc: 'نقطة الصحة API v1' },
            { endpoint: '/', desc: 'الصفحة الرئيسية' },
        ];

        for (const test of tests) {
            await this.testAndLog(
                test.endpoint,
                'GET',
                undefined,
                undefined,
                'Health',
                test.desc
            );
        }
    }

    /**
     * اختبارات الوثائق
     */
    private async testDocumentationEndpoints() {
        console.log('\n' + '━'.repeat(80));
        console.log('📚 اختبارات الوثائق (Documentation Tests)');
        console.log('━'.repeat(80) + '\n');

        const tests = [
            { endpoint: '/api-docs', desc: 'واجهة Swagger UI' },
            { endpoint: '/swagger.json', desc: 'ملف Swagger JSON' },
        ];

        for (const test of tests) {
            await this.testAndLog(
                test.endpoint,
                'GET',
                undefined,
                undefined,
                'Documentation',
                test.desc
            );
        }
    }

    /**
     * اختبارات المصادقة
     */
    private async testAuthEndpoints() {
        console.log('\n' + '━'.repeat(80));
        console.log('🔐 اختبارات المصادقة (Authentication Tests)');
        console.log('━'.repeat(80) + '\n');

        // Login with invalid credentials
        await this.testAndLog(
            '/api/v1/auth/login',
            'POST',
            {
                email: 'test@example.com',
                password: 'wrongpassword',
            },
            undefined,
            'Authentication',
            'محاولة تسجيل دخول خاطئة'
        );

        // Register new user
        const timestamp = Date.now();
        await this.testAndLog(
            '/api/v1/auth/register',
            'POST',
            {
                email: `test_${timestamp}@example.com`,
                password: 'Test123456!',
                first_name: 'Test',
                last_name: 'User',
            },
            undefined,
            'Authentication',
            'تسجيل مستخدم جديد'
        );

        // Request password reset (should fail for non-existent user)
        await this.testAndLog(
            '/api/v1/auth/password/reset/request',
            'POST',
            {
                email: 'nonexistent@example.com',
            },
            undefined,
            'Authentication',
            'طلب إعادة تعيين كلمة المرور'
        );

        // Get current user (without token - should fail)
        await this.testAndLog(
            '/api/v1/auth/me',
            'GET',
            undefined,
            undefined,
            'Authentication',
            'الحصول على المستخدم الحالي (بدون token)'
        );

        // Logout (without token - should fail or return error)
        await this.testAndLog(
            '/api/v1/auth/logout',
            'POST',
            {},
            undefined,
            'Authentication',
            'تسجيل الخروج (بدون token)'
        );
    }

    /**
     * اختبارات نقاط النهاية الإضافية
     */
    private async testAdditionalEndpoints() {
        console.log('\n' + '━'.repeat(80));
        console.log('🔍 اختبارات نقاط النهاية الإضافية (Additional Endpoints)');
        console.log('━'.repeat(80) + '\n');

        const endpoints = [
            { path: '/api/v1/chat', method: 'POST' as const, body: { message: 'مرحبا' }, desc: 'Chat endpoint' },
            { path: '/api/v1/learning/subjects', method: 'GET' as const, desc: 'قائمة المواد الدراسية' },
            { path: '/api/v1/projects', method: 'GET' as const, desc: 'قائمة المشاريع' },
            { path: '/api/v1/office/templates', method: 'GET' as const, desc: 'قوالب Office' },
            { path: '/api/v1/storage/providers', method: 'GET' as const, desc: 'مزودي التخزين' },
        ];

        for (const endpoint of endpoints) {
            await this.testAndLog(
                endpoint.path,
                endpoint.method,
                endpoint.body,
                undefined,
                'Additional',
                endpoint.desc
            );
        }
    }

    /**
     * اختبار الأداء المتكرر
     */
    private async testPerformance() {
        console.log('\n' + '━'.repeat(80));
        console.log('⚡ اختبار الأداء المتكرر (Performance Load Test)');
        console.log('━'.repeat(80) + '\n');

        const iterations = 20;
        const times: number[] = [];

        console.log(`جاري إجراء ${iterations} طلب متتالي إلى /health...\n`);

        for (let i = 0; i < iterations; i++) {
            const result = await this.testEndpoint('/health', 'GET', undefined, undefined, 'Performance');
            times.push(result.responseTime);

            const bar = this.createProgressBar(i + 1, iterations, result.responseTime);
            process.stdout.write(`\r${bar}`);
        }

        console.log('\n');

        const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
        const minTime = Math.min(...times);
        const maxTime = Math.max(...times);
        const medianTime = this.calculateMedian(times);
        const p95Time = this.calculatePercentile(times, 95);
        const p99Time = this.calculatePercentile(times, 99);

        console.log('📈 إحصائيات الأداء:');
        console.log(`  ├─ متوسط الوقت: ${avgTime.toFixed(2)}ms`);
        console.log(`  ├─ الوسيط (Median): ${medianTime.toFixed(2)}ms`);
        console.log(`  ├─ أسرع: ${minTime.toFixed(2)}ms`);
        console.log(`  ├─ أبطأ: ${maxTime.toFixed(2)}ms`);
        console.log(`  ├─ النسبة المئوية 95: ${p95Time.toFixed(2)}ms`);
        console.log(`  └─ النسبة المئوية 99: ${p99Time.toFixed(2)}ms`);
    }

    /**
     * اختبار الطلبات المتزامنة
     */
    private async testConcurrency() {
        console.log('\n' + '━'.repeat(80));
        console.log('🔄 اختبار الطلبات المتزامنة (Concurrency Test)');
        console.log('━'.repeat(80) + '\n');

        const concurrentRequests = 10;
        console.log(`جاري إجراء ${concurrentRequests} طلب متزامن...\n`);

        const startTime = performance.now();

        const promises = Array.from({ length: concurrentRequests }, (_, i) =>
            this.testEndpoint('/health', 'GET', undefined, undefined, 'Concurrency')
        );

        const results = await Promise.all(promises);
        const endTime = performance.now();
        const totalTime = endTime - startTime;

        const successCount = results.filter(r => r.success).length;
        const avgResponseTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;

        console.log('📊 نتائج الطلبات المتزامنة:');
        console.log(`  ├─ إجمالي الوقت: ${totalTime.toFixed(2)}ms`);
        console.log(`  ├─ عدد الطلبات الناجحة: ${successCount}/${concurrentRequests}`);
        console.log(`  ├─ متوسط وقت الاستجابة: ${avgResponseTime.toFixed(2)}ms`);
        console.log(`  └─ الطلبات في الثانية: ${(concurrentRequests / (totalTime / 1000)).toFixed(2)} req/s`);
    }

    /**
     * طباعة النتائج التفصيلية
     */
    private printDetailedResults() {
        console.log('\n' + '═'.repeat(80));
        console.log('📊 ملخص شامل للنتائج');
        console.log('═'.repeat(80) + '\n');

        // Overall stats
        const successful = this.results.filter((r) => r.success).length;
        const failed = this.results.filter((r) => !r.success).length;
        const total = this.results.length;
        const avgResponseTime = this.results.reduce((sum, r) => sum + r.responseTime, 0) / total;

        console.log('🎯 الإحصائيات العامة:');
        console.log(`  ├─ إجمالي الطلبات: ${total}`);
        console.log(`  ├─ نجح: ${successful} (${((successful / total) * 100).toFixed(1)}%)`);
        console.log(`  ├─ فشل: ${failed} (${((failed / total) * 100).toFixed(1)}%)`);
        console.log(`  └─ متوسط وقت الاستجابة: ${avgResponseTime.toFixed(2)}ms`);

        // Performance rating
        console.log('\n⭐ تقييم الأداء الإجمالي:');
        const rating = this.getPerformanceRating(avgResponseTime);
        console.log(`  ${rating.emoji} ${rating.text} (${avgResponseTime.toFixed(2)}ms)`);

        // Category breakdown
        console.log('\n📋 تفصيل حسب الفئة:\n');

        for (const [category, results] of this.categories.entries()) {
            const categorySuccessful = results.filter(r => r.success).length;
            const categoryTotal = results.length;
            const categoryAvg = results.reduce((sum, r) => sum + r.responseTime, 0) / categoryTotal;

            console.log(`  ${category}:`);
            console.log(`    ├─ الطلبات: ${categorySuccessful}/${categoryTotal} نجح`);
            console.log(`    └─ متوسط الوقت: ${categoryAvg.toFixed(2)}ms`);
        }

        // Failed requests details
        const failedResults = this.results.filter(r => !r.success);
        if (failedResults.length > 0) {
            console.log('\n❌ الطلبات الفاشلة:\n');
            failedResults.forEach((r, i) => {
                console.log(`  ${i + 1}. ${r.method} ${r.endpoint}`);
                console.log(`     ├─ الحالة: ${r.status || 'فشل الاتصال'}`);
                console.log(`     └─ الخطأ: ${r.error || 'غير معروف'}`);
            });
        }

        // Slowest endpoints
        const sortedByTime = [...this.results]
            .filter(r => r.success)
            .sort((a, b) => b.responseTime - a.responseTime)
            .slice(0, 5);

        if (sortedByTime.length > 0) {
            console.log('\n🐌 أبطأ 5 نقاط نهاية:\n');
            sortedByTime.forEach((r, i) => {
                console.log(`  ${i + 1}. ${r.method} ${r.endpoint} - ${r.responseTime.toFixed(2)}ms`);
            });
        }

        // Fastest endpoints
        const sortedByTimeFast = [...this.results]
            .filter(r => r.success)
            .sort((a, b) => a.responseTime - b.responseTime)
            .slice(0, 5);

        if (sortedByTimeFast.length > 0) {
            console.log('\n⚡ أسرع 5 نقاط نهاية:\n');
            sortedByTimeFast.forEach((r, i) => {
                console.log(`  ${i + 1}. ${r.method} ${r.endpoint} - ${r.responseTime.toFixed(2)}ms`);
            });
        }

        console.log('\n' + '═'.repeat(80));
    }

    /**
     * اختبار وطباعة النتيجة
     */
    private async testAndLog(
        endpoint: string,
        method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
        body?: any,
        headers?: Record<string, string>,
        category: string = 'General',
        description?: string
    ) {
        const result = await this.testEndpoint(endpoint, method, body, headers, category);

        const statusIcon = result.success ? '✅' : '❌';
        const statusColor = result.success ? '\x1b[32m' : '\x1b[31m';
        const resetColor = '\x1b[0m';

        const desc = description ? ` (${description})` : '';

        console.log(
            `${statusIcon} ${method.padEnd(6)} ${endpoint.padEnd(45)} ` +
            `${statusColor}${String(result.status).padEnd(3)}${resetColor} ` +
            `${result.responseTime.toFixed(2).padStart(8)}ms` +
            desc
        );

        if (!result.success && result.error) {
            console.log(`   ⚠️  ${result.error}`);
        }
    }

    /**
     * حفظ النتائج
     */
    async saveResults() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `backend-test-results-${timestamp}.json`;
        const resultsPath = join(process.cwd(), filename);

        const categoryStats: any = {};
        for (const [category, results] of this.categories.entries()) {
            const successful = results.filter(r => r.success).length;
            const avgTime = results.reduce((sum, r) => sum + r.responseTime, 0) / results.length;

            categoryStats[category] = {
                total: results.length,
                successful,
                failed: results.length - successful,
                avgResponseTime: avgTime,
            };
        }

        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                total: this.results.length,
                successful: this.results.filter((r) => r.success).length,
                failed: this.results.filter((r) => !r.success).length,
                avgResponseTime:
                    this.results.reduce((sum, r) => sum + r.responseTime, 0) / this.results.length,
            },
            categories: categoryStats,
            results: this.results,
        };

        await writeFile(resultsPath, JSON.stringify(report, null, 2));
        console.log(`\n💾 تم حفظ النتائج التفصيلية في: ${filename}`);
    }

    /**
     * طباعة الرأسية
     */
    private printHeader() {
        console.log('\x1b[36m%s\x1b[0m', `
╔═══════════════════════════════════════════════════════════════════════════════╗
║                         اختبار شامل لأداء الخادم الخلفي                     ║
║                   Comprehensive Backend Performance Testing                   ║
╚═══════════════════════════════════════════════════════════════════════════════╝
`);
    }

    /**
     * إنشاء شريط تقدم
     */
    private createProgressBar(current: number, total: number, time: number): string {
        const percentage = (current / total) * 100;
        const filled = Math.floor(percentage / 2);
        const empty = 50 - filled;

        const bar = '█'.repeat(filled) + '░'.repeat(empty);
        return `[${bar}] ${current}/${total} (${percentage.toFixed(0)}%) - آخر: ${time.toFixed(2)}ms`;
    }

    /**
     * حساب الوسيط
     */
    private calculateMedian(values: number[]): number {
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 === 0
            ? (sorted[mid - 1] + sorted[mid]) / 2
            : sorted[mid];
    }

    /**
     * حساب النسبة المئوية
     */
    private calculatePercentile(values: number[], percentile: number): number {
        const sorted = [...values].sort((a, b) => a - b);
        const index = Math.ceil((percentile / 100) * sorted.length) - 1;
        return sorted[index];
    }

    /**
     * الحصول على تقييم الأداء
     */
    private getPerformanceRating(avgTime: number): { emoji: string; text: string } {
        if (avgTime < 50) return { emoji: '🌟', text: 'ممتاز! (< 50ms)' };
        if (avgTime < 100) return { emoji: '✨', text: 'جيد جداً (50-100ms)' };
        if (avgTime < 200) return { emoji: '👍', text: 'جيد (100-200ms)' };
        if (avgTime < 500) return { emoji: '⚠️', text: 'مقبول (200-500ms)' };
        return { emoji: '❌', text: 'بطيء (> 500ms)' };
    }
}

// تشغيل الاختبارات
async function main() {
    const tester = new ComprehensiveBackendTester();

    try {
        await tester.runComprehensiveTests();

        console.log('\n✅ اكتملت جميع الاختبارات بنجاح!\n');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ فشلت الاختبارات:', error);
        process.exit(1);
    }
}

main();
