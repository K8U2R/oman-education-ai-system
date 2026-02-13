/**
 * OpenAPI Specification Generator - مولد مواصفات OpenAPI
 * 
 * Auto-generates OpenAPI 3.1 specification from JSDoc comments
 */

import swaggerJsdoc from 'swagger-jsdoc';

interface PackageJson {
    version: string;
    [key: string]: any;
}

// Read package.json for version
const packageJson: PackageJson = {
    version: '1.0.0' // Default fallback
};

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'Oman Education AI System API',
            version: packageJson.version,
            description: 'Enterprise-grade Educational AI Platform with advanced features',
            contact: {
                name: 'API Support',
                email: 'support@k8u2r.online'
            },
            license: {
                name: 'Proprietary',
                url: 'https://k8u2r.online/license'
            }
        },
        servers: [
            {
                url: 'http://localhost:30000/api/v1',
                description: 'Development Server'
            },
            {
                url: 'https://k8u2r.online/api/v1',
                description: 'Production Server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'JWT authentication token'
                }
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                            description: 'Error type'
                        },
                        message: {
                            type: 'string',
                            description: 'Error message'
                        },
                        details: {
                            type: 'array',
                            items: {
                                type: 'object'
                            },
                            description: 'Additional error details'
                        }
                    }
                },
                RateLimitError: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                            example: 'Too Many Requests'
                        },
                        message: {
                            type: 'string'
                        },
                        tier: {
                            type: 'string',
                            enum: ['FREE', 'PRO', 'PREMIUM']
                        },
                        limit: {
                            type: 'number'
                        },
                        retryAfter: {
                            type: 'number',
                            description: 'Seconds until rate limit resets'
                        }
                    }
                }
            },
            responses: {
                UnauthorizedError: {
                    description: 'Access token is missing or invalid',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Error'
                            }
                        }
                    }
                },
                RateLimitError: {
                    description: 'Too many requests - rate limit exceeded',
                    headers: {
                        'X-RateLimit-Limit': {
                            schema: {
                                type: 'integer'
                            },
                            description: 'Request limit per time window'
                        },
                        'X-RateLimit-Remaining': {
                            schema: {
                                type: 'integer'
                            },
                            description: 'Remaining requests in current window'
                        },
                        'X-RateLimit-Reset': {
                            schema: {
                                type: 'string',
                                format: 'date-time'
                            },
                            description: 'Time when rate limit resets'
                        },
                        'Retry-After': {
                            schema: {
                                type: 'integer'
                            },
                            description: 'Seconds to wait before retrying'
                        }
                    },
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/RateLimitError'
                            }
                        }
                    }
                }
            }
        },
        tags: [
            {
                name: 'AI',
                description: 'AI-powered features including lesson generation and code review'
            },
            {
                name: 'Authentication',
                description: 'User authentication and session management'
            },
            {
                name: 'Education',
                description: 'Educational content and learning modules'
            }
        ]
    },
    apis: [
        './src/presentation/api/routes/**/*.ts',
        './src/modules/**/routes/**/*.ts'
    ]
};

export const generateOpenAPISpec = () => swaggerJsdoc(options);
