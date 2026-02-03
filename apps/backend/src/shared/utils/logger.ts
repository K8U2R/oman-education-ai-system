/**
 * Logger - مسجل الأحداث
 *
 * Winston logger configuration
 */

import winston from "winston";
import { getSettings } from "../configuration/index.js";

const settings = getSettings();

export const logger = winston.createLogger({
  level: settings.logging.level,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  defaultMeta: { service: "backend" },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  ],
});

// Add file transport in production
if (settings.app.env === "production") {
  logger.add(
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      maxsize: settings.logging.maxBytes,
      maxFiles: settings.logging.backupCount,
    }),
  );

  logger.add(
    new winston.transports.File({
      filename: "logs/combined.log",
      maxsize: settings.logging.maxBytes,
      maxFiles: settings.logging.backupCount,
    }),
  );
}
