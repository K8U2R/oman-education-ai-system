/**
 * API Documentation Routes - مسارات توثيق API
 * 
 * Serves OpenAPI documentation via Swagger UI
 */

import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { generateOpenAPISpec } from '../docs/openapi-generator.js';

const router = Router();

// Generate OpenAPI specification
const spec = generateOpenAPISpec();

// Serve Swagger UI
router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(spec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Oman Education AI - API Documentation'
}));

// Serve raw JSON spec
router.get('/json', (_req, res) => {
    res.json(spec);
});

export default router;
