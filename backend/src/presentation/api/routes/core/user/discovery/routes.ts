/**
 * User Discovery Routes (Public/Social) - مسارات الاكتشاف والعرض العام
 * 
 * @law Law-10 (Scalability) - Discovery Domain
 */

import { RouteFactory } from "../../../shared/route-factory.js";
import { UserHandler } from "../../../../handlers/user/index.js";

const router = RouteFactory.createFeatureRouter();

/**
 * @swagger
 * /api/v1/users/discovery/search:
 *   get:
 *     summary: البحث عن مستخدمين
 *     tags: [User - Discovery]
 */
router.get(
    "/search",
    ...RouteFactory.createRoute<UserHandler>(
        "UserHandler",
        "searchUsers"
    )
);

export default router;
