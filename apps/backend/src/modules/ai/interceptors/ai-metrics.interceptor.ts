import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { RedisClient } from '@/infrastructure/cache/redis.client'; // Correct path

@Injectable()
export class AIMetricsInterceptor implements NestInterceptor {
    private readonly logger = new Logger(AIMetricsInterceptor.name);
    private redisClient: any;

    constructor() {
        // Use Singleton directly if DI isn't set up for it
        try {
            this.redisClient = RedisClient.getInstance().getClient();
        } catch (e) {
            this.logger.warn('RedisClient not initialized yet');
        }
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const start = Date.now();
        const request = context.switchToHttp().getRequest();
        const { method, url } = request;

        return next.handle().pipe(
            tap(() => {
                const duration = Date.now() - start;
                this.logMetric('success', method, url, duration);
            }),
            catchError((error) => {
                const duration = Date.now() - start;
                this.logMetric('error', method, url, duration, error);
                return throwError(() => error);
            }),
        );
    }

    private async logMetric(
        status: 'success' | 'error',
        method: string,
        url: string,
        duration: number,
        error?: any,
    ) {
        if (!this.redisClient) {
            try {
                this.redisClient = RedisClient.getInstance().getClient();
            } catch { return; }
        }

        const logEntry = JSON.stringify({
            timestamp: Date.now(),
            status,
            method,
            url,
            duration,
            errorMessage: error?.message || error?.response?.message,
            errorCode: error?.status || error?.response?.statusCode || 500,
        });

        try {
            // Publish for real-time dev console
            await this.redisClient.publish('ai.diagnostic', logEntry);

            // Store last 50 logs for history
            await this.redisClient.lPush('ai:logs', logEntry);
            await this.redisClient.lTrim('ai:logs', 0, 49);
        } catch (err) {
            this.logger.error('Failed to log AI metric to Redis', err);
        }
    }
}
