/**
 * User Management Routes (Admin) - مسارات إدارة المستخدمين
 * 
 * @law Law-10 (Scalability) - Management Domain
 */

import { RouteFactory } from "../../../shared/route-factory.js";
import { UserController } from "@/modules/user/controllers/user.controller.js";
import { authMiddleware } from "../../../../middleware/security/index.js";

const router = RouteFactory.createFeatureRouter();

// GET /api/v1/users/management/
router.get(
    "/",
    ...RouteFactory.createAuthenticatedRoute<UserController>(
        "UserController",
        "listUsers",
        authMiddleware.authenticate
    )
);

// POST /api/v1/users/management/:id/ban
router.post(
    "/:id/ban",
    ...RouteFactory.createAuthenticatedRoute<UserController>(
        "UserController",
        "banUser",
        authMiddleware.authenticate
    )
);

export default router;
