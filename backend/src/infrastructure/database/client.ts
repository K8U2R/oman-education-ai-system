import { PrismaClient } from "@prisma/client";

/**
 * Database Client Proxy
 * 
 * Implements a lazy-initialization proxy for PrismaClient.
 * This ensures that Prisma is ONLY instantiated when first accessed,
 * preventing crashes during the early module evaluation phase.
 */
let prismaInstance: PrismaClient | null = null;

export const prisma = new Proxy({} as any, {
    get: (_target: any, prop: string | symbol) => {
        if (prop === "moduleLoaded") return true;
        if (prop === "toJSON") return () => "PrismaClientProxy";

        if (!prismaInstance) {
            console.log("⏳ [LAZY-INIT] First access to Prisma detected - Instantiating...");
            try {
                prismaInstance = new PrismaClient();
                console.log("✅ [LAZY-INIT] PrismaClient successfully instantiated");
            } catch (error: any) {
                console.error("❌ [LAZY-INIT] FATAL: Failed to instantiate Prisma:", error.message);
                throw error;
            }
        }

        return (prismaInstance as any)[prop];
    }
}) as PrismaClient;
