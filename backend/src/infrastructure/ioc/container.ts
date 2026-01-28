
import { DatabaseCoreAdapter } from "@/infrastructure/adapters/db/DatabaseCoreAdapter.js";
import { PerformanceOptimizer } from "@/infrastructure/performance/PerformanceOptimizer.js";
import { StandardHtmlTemplateEngine } from "@/infrastructure/templates/StandardHtmlTemplateEngine.js";
import { IEmailTemplateEngine } from "@/domain/interfaces/email/IEmailTemplateEngine.js";

/**
 * IoC Container - Law 01 (Iron Firewall)
 * Centralizes dependency instantiation to prevent "Hard Dependencies" in middleware.
 */
export class ServiceContainer {
    private static _databaseAdapter: DatabaseCoreAdapter;
    private static _performanceOptimizer: PerformanceOptimizer;
    private static _emailTemplateEngine: IEmailTemplateEngine;

    /**
     * Get Database Adapter Singleton
     */
    static get databaseAdapter(): DatabaseCoreAdapter {
        if (!this._databaseAdapter) {
            this._databaseAdapter = new DatabaseCoreAdapter();
        }
        return this._databaseAdapter;
    }

    /**
     * Get Performance Optimizer Singleton
     */
    static get performanceOptimizer(): PerformanceOptimizer {
        if (!this._performanceOptimizer) {
            this._performanceOptimizer = new PerformanceOptimizer(this.databaseAdapter);
        }
        return this._performanceOptimizer;
    }

    /**
     * Get Email Template Engine Singleton
     */
    static get emailTemplateEngine(): IEmailTemplateEngine {
        if (!this._emailTemplateEngine) {
            this._emailTemplateEngine = new StandardHtmlTemplateEngine();
        }
        return this._emailTemplateEngine;
    }
}
