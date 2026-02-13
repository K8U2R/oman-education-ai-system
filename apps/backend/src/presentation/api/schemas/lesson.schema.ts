/**
 * API Request Schemas - مخططات طلبات API
 * 
 * JSON Schema definitions for API request validation
 */

import type { JSONSchemaType } from 'ajv';

/**
 * Lesson Generation Request Schema
 */
export interface LessonGenerationRequest {
    topic: string;
    subject: string;
    gradeLevel: string;
    language?: 'ar' | 'en';
}

export const LessonGenerationSchema: JSONSchemaType<LessonGenerationRequest> = {
    type: 'object',
    required: ['topic', 'subject', 'gradeLevel'],
    properties: {
        topic: {
            type: 'string',
            minLength: 3,
            maxLength: 200,
            description: 'The topic of the lesson'
        },
        subject: {
            type: 'string',
            minLength: 2,
            maxLength: 50,
            description: 'The subject area (e.g., Mathematics, Science)'
        },
        gradeLevel: {
            type: 'string',
            enum: ['Elementary', 'Middle', 'High School', 'University'],
            description: 'Target grade level'
        },
        language: {
            type: 'string',
            enum: ['ar', 'en'],
            nullable: true,
            default: 'ar',
            description: 'Language for the lesson plan'
        }
    },
    additionalProperties: false
};

/**
 * Code Review Request Schema
 */
export interface CodeReviewRequest {
    code: string;
    language?: string;
    context?: string;
}

export const CodeReviewSchema: JSONSchemaType<CodeReviewRequest> = {
    type: 'object',
    required: ['code'],
    properties: {
        code: {
            type: 'string',
            minLength: 10,
            maxLength: 10000,
            description: 'Source code to review'
        },
        language: {
            type: 'string',
            nullable: true,
            description: 'Programming language (auto-detected if not provided)'
        },
        context: {
            type: 'string',
            nullable: true,
            maxLength: 500,
            description: 'Additional context for the review'
        }
    },
    additionalProperties: false
};
