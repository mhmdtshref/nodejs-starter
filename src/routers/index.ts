import { Router } from 'express';
import { ResponseUtils } from '@utils';
import AuthRouter from '@routers/auth.router';
import DocsRouter from '@routers/docs.router';

// App Routers
const router = Router();

// Routers:
router.use('/auth', AuthRouter);
router.use('/docs', DocsRouter);

// Page not found error:
router.all('*', (_request, response) => ResponseUtils.notFound(response, 'Page not found'));

export default router;
