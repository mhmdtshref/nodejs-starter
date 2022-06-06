import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { ResponseUtils } from '@utils';
import router from '@routers';
import environments from '@environments';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use((request: Request, response: Response, nextFunction: NextFunction) => {
    const {whitelistOrigins} = environments.server;
    const requestOrigin = request.headers?.origin as string;
    if (whitelistOrigins.length && !whitelistOrigins.includes(requestOrigin)) {
        ResponseUtils.forbidden(response, 'Forbidden host')
        return;
    }
    nextFunction();
});

// Router
app.use('/api/v1', router);
app.use('*', (_request, response) => response.status(404).json({ error: 'Page not found' }));

export default app;
