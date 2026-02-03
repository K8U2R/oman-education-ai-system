/**
 * Auth Aggregator (The Sovereign Gateway) - بوابة المصادقة السيادية
 * 
 * @law Law-1 (Barrel Law) - Main Aggregator
 * @law Law-2 (Isolation) - Domain separation
 */

import sessionRoutes from "./session/index.js";
import accountRoutes from "./account/index.js";
import securityRoutes from "./security/index.js";
import socialRoutes from "./social/index.js";
import { RouteFactory } from "../../shared/route-factory.js";

const router = RouteFactory.createFeatureRouter();

// 1. Session Domain (Login, Logout, Devices)
router.use(sessionRoutes);

// 2. Account Domain (Register, Profile, Verification)
router.use(accountRoutes);

// 3. Security Domain (Password recovery, MFA)
router.use(securityRoutes);

// 4. Social Domain (OAuth - Google, etc.)
router.use(socialRoutes);

export default router;
