import { Router } from 'express';
import SwaggerUi from 'swagger-ui-express';
import SwaggerJSDoc, { Options as SwaggerJSDocOptions, } from 'swagger-jsdoc';
import environments from '@environments';

// Create router:
const router = Router();


// Prepare options:
const swaggerJSDocOptions: SwaggerJSDocOptions = {
    openapi: '3.0.0',
    apis: ['src/routers/*.router.ts'],
    swaggerDefinition: {
        info: {
            title: `${environments.app.name} API Documentation`,
            description: `Docs of ${environments.app.name}. Includes paths, requests, response, body/query/params data required and authentication types`,
            contact: {
                name: environments.app.contact.name,
                email: environments.app.contact.email,
                url: environments.app.contact.url,
            },
            version: environments.app.version,
        },
        host: `${environments.server.host}:${environments.server.port}`,
        basePath: '/api/v1',
        schemes: ['http'],
    }
};

// Create swagger Doc:
const swaggerJSDoc = SwaggerJSDoc(swaggerJSDocOptions)

// Generrate router:
router.use('/', SwaggerUi.serve, SwaggerUi.setup(swaggerJSDoc));

export default router;
