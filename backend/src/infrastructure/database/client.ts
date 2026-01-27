/**
 * Database Client Singleton
 * 
 * Centralizes the database connection logic to enforce Law 01 (Iron Wall) and Law 12 (DRY).
 * Handles the ESM/CommonJS interop issue with Prisma Client in a single location.
 * 
 * Constitutional Authority: Law-12 (Single Responsibility)
 */

import { PrismaClient } from "@prisma/client";
import pkg from "@prisma/client";

// Solve ESM/CJS interop once and for all
const { PrismaClient: PrismaCtor } = pkg;

class DatabaseClient {
    private static instance: PrismaClient;

    private constructor() { }

    /**
     * Get the singleton instance of PrismaClient
     * Law 01: Controlled Access Point
     */
    public static getInstance(): PrismaClient {
        if (!DatabaseClient.instance) {
            // Safe casting to ensure type integrity (Law 02)
            DatabaseClient.instance = new PrismaCtor() as unknown as PrismaClient;
        }
        return DatabaseClient.instance;
    }
}

export const prisma = DatabaseClient.getInstance();
