/**
 * User Management Routes (Admin) - مسارات إدارة المستخدمين
 * 
 * @law Law-10 (Scalability) - Management Domain
 */

import { RouteFactory } from "../../../shared/route-factory.js";
import { UserHandler } from "../../../../handlers/user/index.js";
import { authMiddleware } from "../../../../middleware/security/index.js";

const router = RouteFactory.createFeatureRouter();

// GET /api/v1/users/management/
router.get(
    "/",
    ...RouteFactory.createAuthenticatedRoute<UserHandler>(
        "UserHandler",
        "listUsers",
        authMiddleware.authenticate
    )
);

// POST /api/v1/users/management/:id/ban
router.post(
    "/:id/ban",
    ...RouteFactory.createAuthenticatedRoute<UserHandler>(
        "UserHandler",
        "banUser",
        authMiddleware.authenticate
    )
);

export default router;
