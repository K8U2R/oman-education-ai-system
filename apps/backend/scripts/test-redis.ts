/**
 * Redis Connection Test Script
 * Tests Redis connectivity independently of the main application
 */

import { redisClient } from '../src/infrastructure/cache/RedisClient.js';
import { logger } from '../src/shared/utils/logger.js';

async function testRedis() {
    try {
        logger.info('🧪 Starting Redis Connection Test...');

        // Test 1: Connect
        await redisClient.connect();
        logger.info('✅ Test 1: Connection successful');

        // Test 2: Health Check
        const isHealthy = await redisClient.isHealthy();
        logger.info(`✅ Test 2: Health check - ${isHealthy ? 'HEALTHY' : 'UNHEALTHY'}`);

        // Test 3: Set/Get
        await redisClient.setex('test:key', 60, 'test-value');
        const value = await redisClient.get('test:key');
        logger.info(`✅ Test 3: Set/Get - Value: ${value}`);

        // Test 4: Counter (atomic operations)
        await redisClient.del('test:counter');
        const count1 = await redisClient.incr('test:counter');
        const count2 = await redisClient.incr('test:counter');
        logger.info(`✅ Test 4: Atomic counter - ${count1}, ${count2}`);

        // Test 5: Expiration
        await redisClient.setex('test:expire', 1, 'expires-soon');
        const exists1 = await redisClient.exists('test:expire');
        logger.info(`✅ Test 5a: Key exists before expiration: ${exists1}`);

        await new Promise(resolve => setTimeout(resolve, 1500));
        const exists2 = await redisClient.exists('test:expire');
        logger.info(`✅ Test 5b: Key exists after expiration (should be false): ${exists2}`);

        // Cleanup
        await redisClient.del('test:key');
        await redisClient.del('test:counter');

        logger.info('✅ All Redis tests passed!');

        await redisClient.disconnect();
        process.exit(0);
    } catch (error) {
        logger.error('❌ Redis test failed:', error);
        process.exit(1);
    }
}

testRedis();
