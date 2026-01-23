/**
 * Project Swagger Schemas
 */
export const projectSwaggerSchemas = {
  Project: {
    type: "object",
    properties: {
      id: {
        type: "string",
        format: "uuid",
        example: "123e4567-e89b-12d3-a456-426614174000",
      },
      title: {
        type: "string",
        example: "مشروع الرياضيات",
      },
      description: {
        type: "string",
        nullable: true,
        example: "مشروع عن الجبر والهندسة",
      },
      type: {
        type: "string",
        enum: ["educational", "research", "assignment", "presentation"],
        example: "educational",
      },
      status: {
        type: "string",
        enum: ["draft", "in_progress", "completed", "archived"],
        example: "in_progress",
      },
      subject: {
        type: "string",
        nullable: true,
        example: "Math",
      },
      grade_level: {
        type: "string",
        nullable: true,
        example: "Grade 10",
      },
      created_by: {
        type: "string",
        format: "uuid",
        example: "user-uuid",
      },
      due_date: {
        type: "string",
        format: "date-time",
        nullable: true,
      },
      progress: {
        type: "number",
        example: 50,
      },
      requirements: {
        type: "array",
        items: {
          type: "string",
        },
        example: ["Requirement 1", "Requirement 2"],
      },
      created_at: {
        type: "string",
        format: "date-time",
      },
      updated_at: {
        type: "string",
        format: "date-time",
      },
    },
  },
  CreateProjectRequest: {
    type: "object",
    required: ["title", "type"],
    properties: {
      title: {
        type: "string",
        example: "New Project",
      },
      description: {
        type: "string",
        example: "Project Description",
      },
      type: {
        type: "string",
        enum: ["educational", "research", "assignment", "presentation"],
      },
      subject: {
        type: "string",
        example: "Science",
      },
      grade_level: {
        type: "string",
        example: "10",
      },
      due_date: {
        type: "string",
        format: "date-time",
      },
      requirements: {
        type: "array",
        items: {
          type: "string",
        },
      },
    },
  },
  ProjectStats: {
    type: "object",
    properties: {
      total_projects: { type: "number", example: 10 },
      active_projects: { type: "number", example: 5 },
      completed_projects: { type: "number", example: 5 },
      average_progress: { type: "number", example: 75 },
      by_type: {
        type: "object",
        properties: {
          educational: { type: "number", example: 2 },
          research: { type: "number", example: 3 },
          assignment: { type: "number", example: 1 },
          presentation: { type: "number", example: 4 },
        },
      },
    },
  },
};
