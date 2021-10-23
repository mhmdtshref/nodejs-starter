import express from 'express';
import router from './routers';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((request, response, next) => {
    const whitelistOrigins = process.env.WHITELIST_ORIGINS?.split(',') || [];
    const requestOrigin = request.headers?.origin as string;
    if (whitelistOrigins.includes(requestOrigin)) {
        response.setHeader('Access-Control-Allow-Origin', origin);
    }
    response.setHeader('Access-Control-Allow-Credentials', 'true');
    response.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS, POST, PUT, PATCH, DELETE');
    response.setHeader(
        'Access-Control-Allow-Headers',
        'Access-Control-Allow-Headers, Origin,Accept, Content-Type, Authorization, Access-Control-Request-Headers, x-provider',
    );

    if (request.method === 'OPTIONS') {
        return response.status(405).json({ success: false, error: 'Method not allowed' });
    }
    return next();
});

// Router
app.use('/api/v1', router);
app.use('*', (_request, response) => response.status(404).json({ error: 'Page not found' }));

export default app;
