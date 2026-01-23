/**
 * CORS Middleware - Middleware CORS
 *
 * Safe initialization using ENV_CONFIG engine.
 */

import cors from "cors";
import { ENV_CONFIG } from "../../../../../infrastructure/config/env.config.js";

const corsOrigins = ENV_CONFIG.CORS_ORIGIN.split(",")
  .map((origin) => origin.trim())
  .filter((origin) => origin.length > 0);

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin in development
    if (!origin && ENV_CONFIG.NODE_ENV !== "production") {
      return callback(null, true);
    }

    if (corsOrigins.length === 0) {
      return callback(null, ENV_CONFIG.NODE_ENV !== "production");
    }

    if (origin && corsOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Always allow localhost in development
    if (
      ENV_CONFIG.NODE_ENV !== "production" &&
      origin &&
      origin.startsWith("http://localhost:")
    ) {
      return callback(null, true);
    }

    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "X-CSRF-Token",
  ],
  exposedHeaders: ["Content-Length"],
  optionsSuccessStatus: 200,
});
