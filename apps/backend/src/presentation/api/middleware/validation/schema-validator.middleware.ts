/**
 * JSON Schema Validator Middleware - وسيط التحقق من مخطط JSON
 * 
 * Validates request body against JSON Schema using AJV
 */

import type { Request, Response, NextFunction } from 'express';
import Ajv, { type JSONSchemaType } from 'ajv';
import addFormats from 'ajv-formats';

// Create AJV instance with formats support
const ajv = new Ajv({
    allErrors: true,
    removeAdditional: true,  // Remove additional properties
    useDefaults: true,       // Fill in default values
    coerceTypes: false       // Strict type checking
});
addFormats(ajv);

/**
 * Validate request body against JSON Schema
 * 
 * @param schema - JSON Schema to validate against
 * @returns Express middleware function
 */
export const validateSchema = <T>(schema: JSONSchemaType<T>) => {
    const validate = ajv.compile(schema);

    return (req: Request, res: Response, next: NextFunction): void => {
        const valid = validate(req.body);

        if (!valid) {
            res.status(400).json({
                error: 'Validation Error',
                message: 'Request body does not match expected schema',
                details: validate.errors?.map(err => ({
                    field: err.instancePath || 'root',
                    message: err.message,
                    params: err.params
                }))
            });
            return;
        }

        next();
    };
};

/**
 * Validate query parameters against JSON Schema
 */
export const validateQuery = <T>(schema: JSONSchemaType<T>) => {
    const validate = ajv.compile(schema);

    return (req: Request, res: Response, next: NextFunction): void => {
        const valid = validate(req.query);

        if (!valid) {
            res.status(400).json({
                error: 'Query Validation Error',
                message: 'Query parameters do not match expected schema',
                details: validate.errors?.map(err => ({
                    field: err.instancePath || 'root',
                    message: err.message,
                    params: err.params
                }))
            });
            return;
        }

        next();
    };
};
