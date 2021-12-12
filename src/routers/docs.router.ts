import { Router } from 'express';
import SwaggerUi from 'swagger-ui-express';
import SwaggerJSDoc, { Options as SwaggerJSDocOptions, } from 'swagger-jsdoc';

// Create router:
const router = Router();

// Docs router settings:
const {
    APP_NAME: appName,
    APP_CONTACT_NAME: contactName,
    APP_CONTACT_EMAIL: contactEmail,
    APP_CONTACT_URL: contactUrl,
    APP_VERSION: appVersion,
    HOST: serverHost,
    PORT: serverPort
} = process.env;

// Prepare options:
const swaggerJSDocOptions: SwaggerJSDocOptions = {
    apis: ['src/routers/*.router.ts'],
    swaggerDefinition: {
        info: {
            title: `${appName} API Documentation`,
            description: `Docs of ${appName}. Includes paths, requests, response, body/query/params data required and authentication types`,
            contact: {
                name: contactName,
                email: contactEmail,
                url: contactUrl,
            },
            servers: [`http://${serverHost}:${serverPort}`],
            version: appVersion as string,
        },
    }
};

// Create swagger Doc:
const swaggerJSDoc = SwaggerJSDoc(swaggerJSDocOptions)

// Generrate router:
router.use('/', SwaggerUi.serve, SwaggerUi.setup(swaggerJSDoc));

export default router;
