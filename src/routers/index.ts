import { Router } from 'express';
import { ResponseUtils } from '@utils';
import AuthRouter from './auth.router';
import DocsRouter from './docs.router';

// App Routers
const router = Router();

// Routers:
router.use('/auth', AuthRouter);
router.use('/docs', DocsRouter);

// Page not found error:
router.all('*', (_request, response) => ResponseUtils.notFound(response, 'Page not found'));

export default router;
