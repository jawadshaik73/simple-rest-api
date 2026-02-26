import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'TaskMaster Pro API',
            version: '1.0.0',
            description: `
## Scalable REST API with Authentication & Role-Based Access Control

### Features
- 🔐 JWT Authentication with bcrypt password hashing
- 👥 Role-Based Access Control (user / admin)
- ✅ Full CRUD operations for Tasks
- 📧 Password reset via Email & SMS OTP
- 🛡️ Rate limiting, input sanitization, and XSS protection
- 📊 Admin dashboard with platform statistics
            `,
            contact: {
                name: 'TaskMaster Pro',
            },
        },
        servers: [
            {
                url: 'http://localhost:5000/api/v1',
                description: 'Development Server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter JWT token obtained from /auth/login',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        email: { type: 'string', format: 'email' },
                        role: { type: 'string', enum: ['user', 'admin'] },
                        phoneNumber: { type: 'string', nullable: true },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
                Task: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', format: 'uuid' },
                        title: { type: 'string' },
                        description: { type: 'string', nullable: true },
                        completed: { type: 'boolean' },
                        userId: { type: 'string', format: 'uuid' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string' },
                    },
                },
            },
        },
        security: [{ bearerAuth: [] }],
        tags: [
            { name: 'Auth', description: 'Authentication & User Management' },
            { name: 'Tasks', description: 'Task CRUD Operations' },
            { name: 'Admin', description: 'Admin-Only Operations' },
        ],
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const specs = swaggerJsdoc(options);
export { swaggerUi };
