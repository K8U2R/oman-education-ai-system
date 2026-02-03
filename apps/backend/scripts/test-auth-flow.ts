/**
 * Test Auth Flow Script - سكربت اختبار تدفق المصادقة
 *
 * Standalone test script to verify the complete authentication flow:
 * 1. Initialize DI Container
 * 2. Resolve services
 * 3. Register a dummy user
 * 4. Attempt login
 * 5. Generate and verify tokens
 *
 * Usage: npm run test:auth-flow
 * Or: ts-node backend/scripts/test-auth-flow.ts
 */

import "dotenv/config";
import { container } from "../src/infrastructure/di/Container.js";
import { registerServices } from "../src/infrastructure/di/ServiceRegistry.js";
import { AuthService } from "../src/application/services/auth/index.js";
import { EmailService } from "../src/application/services/communication/index.js";
import { TokenService } from "../src/application/services/auth/index.js";
import { logger } from "../src/shared/common.js";

// Test data
const TEST_USER = {
    email: "test-" + Date.now() + "@oman-education.ai",
    password: "SecureTest123!",
    first_name: "أحمد",
    last_name: "التجريبي",
    username: "test-user-" + Date.now(),
    role: "student" as const,
};

async function testAuthFlow() {
    console.log("\n🚀 Starting Auth Flow Test...\n");
    console.log("═".repeat(80));

    try {
        // Step 1: Initialize DI Container
        console.log("\n📦 Step 1: Initializing DI Container...");
        registerServices();
        console.log("✓ DI Container initialized");

        // Step 2: Resolve Services
        console.log("\n🔧 Step 2: Resolving Services...");
        const authService = container.resolve<AuthService>("AuthService");
        const emailService = container.resolve<EmailService>("EmailService");
        const tokenService = container.resolve<TokenService>("TokenService");

        console.log("✓ AuthService resolved");
        console.log("✓ EmailService resolved");
        console.log("✓ TokenService resolved");

        // Step 3: Validate Email Provider
        console.log("\n📧 Step 3: Validating Email Provider...");
        const isEmailValid = await emailService.validate();
        if (isEmailValid) {
            console.log("✓ Email provider connection validated");
        } else {
            console.log("⚠ Email provider validation failed (continuing anyway)");
        }

        // Step 4: Register User
        console.log("\n👤 Step 4: Registering Test User...");
        console.log(`   Email: ${TEST_USER.email}`);
        console.log(`   Name: ${TEST_USER.first_name} ${TEST_USER.last_name}`);

        const user = await authService.register(TEST_USER);

        console.log("✓ User registered successfully!");
        console.log(`   User ID: ${user.id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Verified: ${user.isVerified}`);

        // Step 5: Generate Tokens
        console.log("\n🔑 Step 5: Generating Tokens...");
        const userData = {
            id: user.id,
            email: user.email.toString(),
            first_name: user.firstName,
            last_name: user.lastName,
            username: user.username,
            is_verified: user.isVerified,
            is_active: user.isActive,
            role: user.role,
            permissions: user.permissions,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };

        const tokens = tokenService.generateTokens(userData);

        console.log("✓ Tokens generated successfully!");
        console.log(`   Access Token: ${tokens.access_token.substring(0, 50)}...`);
        console.log(`   Refresh Token: ${tokens.refresh_token.substring(0, 50)}...`);
        console.log(`   Expires In: ${tokens.expires_in} seconds`);

        // Step 6: Verify Access Token
        console.log("\n🔍 Step 6: Verifying Access Token...");
        const payload = tokenService.verifyAccessToken(tokens.access_token);

        console.log("✓ Token verified successfully!");
        console.log(`   User ID: ${payload.userId}`);
        console.log(`   Email: ${payload.email}`);
        console.log(`   Role: ${payload.role}`);

        // Step 7: Attempt Login
        console.log("\n🔐 Step 7: Testing Login...");
        const loginResponse = await authService.login({
            email: TEST_USER.email,
            password: TEST_USER.password,
        });

        console.log("✓ Login successful!");
        console.log(`   User ID: ${loginResponse.user.id}`);
        console.log(`   Has Access Token: ${!!loginResponse.tokens.access_token}`);
        console.log(`   Has Refresh Token: ${!!loginResponse.tokens.refresh_token}`);

        // Step 8: Test Email Sending (Optional - will fail if no SMTP configured)
        if (process.env.TEST_EMAIL_SEND === "true") {
            console.log("\n📨 Step 8: Testing Email Sending...");
            try {
                await emailService.sendVerificationEmail(
                    TEST_USER.email,
                    "test-token-abc123",
                    `${TEST_USER.first_name} ${TEST_USER.last_name}`,
                );
                console.log("✓ Verification email sent successfully!");
            } catch (error) {
                console.log("⚠ Email sending failed (check SMTP configuration)");
                console.log(`   Error: ${error instanceof Error ? error.message : "Unknown"}`);
            }
        }

        // Success Summary
        console.log("\n" + "═".repeat(80));
        console.log("✅ AUTH FLOW TEST COMPLETED SUCCESSFULLY! 🎉");
        console.log("═".repeat(80));
        console.log("\n✓ All components working correctly:");
        console.log("  - DI Container initialized");
        console.log("  - Services resolved");
        console.log("  - User registration working");
        console.log("  - Token generation working");
        console.log("  - Token verification working");
        console.log("  - Login flow working");
        console.log("\n🇴🇲 The Oman AI Education System is ready! 🚀\n");

    } catch (error) {
        console.error("\n" + "═".repeat(80));
        console.error("❌ AUTH FLOW TEST FAILED");
        console.error("═".repeat(80));

        if (error instanceof Error) {
            console.error("\n💥 Error Details:");
            console.error(`   Message: ${error.message}`);
            console.error(`   Stack: ${error.stack}`);
        } else {
            console.error("\n💥 Unknown Error:", error);
        }

        console.log("\n📝 Troubleshooting Tips:");
        console.log("  1. Check that your .env file has all required variables");
        console.log("  2. Verify database connection (DatabaseAdapter)");
        console.log("  3. Check SMTP configuration for email provider");
        console.log("  4. Ensure AuthRepository is implemented");
        console.log("  5. Review the error stack trace above\n");

        process.exit(1);
    }
}

// Run the test
testAuthFlow().catch((error) => {
    logger.error("Fatal error in test script", { error });
    process.exit(1);
});
