/**
 * Swagger Routes - مسارات Swagger
 *
 * Routes لـ Swagger UI و OpenAPI JSON
 */

import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.config.js";

const router = Router();

/**
 * GET /api-docs.json
 * OpenAPI JSON Schema
 */
router.get("/api-docs.json", (_req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

/**
 * GET /api-docs
 * Swagger UI
 *
 * Note: swaggerUi.serve يجب أن يكون middleware منفصل قبل swaggerUi.setup
 */
router.use("/", swaggerUi.serve);
router.get(
  "/",
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "نظام التعليم الذكي العماني - API Documentation",
    // Removed customfavIcon to avoid 404 error
  }),
);

export default router;
