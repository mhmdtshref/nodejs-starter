import express from 'express';
import cors from 'cors';
import { ResponseUtils } from './utils';
import router from './routers';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use((request, response, next) => {
    const whitelistOrigins = process.env.WHITELIST_ORIGINS?.split(',') || [];
    const requestOrigin = request.headers?.origin as string;
    if (whitelistOrigins.length && !whitelistOrigins.includes(requestOrigin)) {
        ResponseUtils.forbidden(response, 'Forbidden host')
        return;
    }
    next();
});

// Router
app.use('/api/v1', router);
app.use('*', (_request, response) => response.status(404).json({ error: 'Page not found' }));

export default app;
