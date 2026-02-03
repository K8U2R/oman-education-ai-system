import swaggerJsdoc from 'swagger-jsdoc';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Oman Education AI System API',
            version: '1.0.0',
            description: 'API documentation for the Oman Education AI System Backend',
        },
        servers: [
            {
                url: 'http://localhost:3000/api/v1',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/presentation/api/routes/**/*.ts'], // Path to the API docs
};

console.log('📄 Generating Swagger Documentation...');

try {
    const openapiSpecification = swaggerJsdoc(options);
    const outputPath = path.resolve(__dirname, '../../swagger.json');

    fs.writeFileSync(outputPath, JSON.stringify(openapiSpecification, null, 2), 'utf8');
    console.log(`✅ Swagger Docs generated successfully at: ${outputPath}`);
} catch (error) {
    console.error('❌ Failed to generate Swagger Docs:', error);
    process.exit(1);
}
