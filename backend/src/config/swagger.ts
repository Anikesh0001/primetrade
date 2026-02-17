import swaggerJsdoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Internship Platform API",
      version: "1.0.0",
      description: "Scalable REST API with auth, RBAC, and projects"
    },
    servers: [{ url: "/" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      schemas: {
        RegisterRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "user@example.com" },
            password: { type: "string", example: "StrongPassw0rd!" }
          }
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "user@example.com" },
            password: { type: "string", example: "StrongPassw0rd!" }
          }
        },
        RefreshRequest: {
          type: "object",
          required: ["refreshToken"],
          properties: {
            refreshToken: { type: "string" }
          }
        },
        ProjectCreateRequest: {
          type: "object",
          required: ["title", "description"],
          properties: {
            title: { type: "string", example: "Platform Revamp" },
            description: { type: "string", example: "Modernize the core platform services" },
            status: { type: "string", enum: ["ACTIVE", "COMPLETED", "ARCHIVED"] }
          }
        },
        ProjectUpdateRequest: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            status: { type: "string", enum: ["ACTIVE", "COMPLETED", "ARCHIVED"] }
          }
        }
      }
    }
  },
  apis: ["./src/routes/*.ts"]
});
