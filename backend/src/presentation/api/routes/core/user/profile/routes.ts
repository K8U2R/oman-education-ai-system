/**
 * User Profile Routes (Self) - مسارات ملف المستخدم
 * 
 * @law Law-10 (Scalability) - Profile Domain
 */

import { RouteFactory } from "../../../shared/route-factory.js";
import { UserHandler } from "../../../../handlers/user/index.js";
import { authMiddleware } from "../../../../middleware/security/index.js";

const router = RouteFactory.createFeatureRouter();

// GET /api/v1/users/profile/me
router.get(
    "/me",
    ...RouteFactory.createAuthenticatedRoute<UserHandler>(
        "UserHandler",
        "getMe",
        authMiddleware.authenticate
    )
);

// PATCH /api/v1/users/profile/update
router.patch(
    "/update",
    ...RouteFactory.createAuthenticatedRoute<UserHandler>(
        "UserHandler",
        "updateProfile",
        authMiddleware.authenticate
    )
);

export default router;
