import { Router } from 'express';
import SwaggerUi from 'swagger-ui-express';
import SwaggerJSDoc, { Options as SwaggerJSDocOptions, } from 'swagger-jsdoc';
import TestRouter from './test.router';

// App Routers
const router = Router();
router.use('/tests', TestRouter);

// Documentation Router
const {
    APP_NAME: appName,
    APP_CONTACT_NAME: contactName,
    APP_CONTACT_EMAIL: contactEmail,
    APP_CONTACT_URL: contactUrl,
    APP_VERSION: appVersion,
    HOST: serverHost,
    PORT: serverPort
} = process.env;
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
const swaggerJSDoc = SwaggerJSDoc(swaggerJSDocOptions)
router.use('/docs', SwaggerUi.serve, SwaggerUi.setup(swaggerJSDoc));

router.all('*', (_request, response) => response.status(404).json({ error: 'Page not found' }))

export default router;
