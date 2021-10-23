import { Router } from 'express';
import { ResponseUtils } from 'src/utils';

const router = Router();

/**
 * @swagger
 * /api/v1/tests:
 *      get:
 *          description: Test request just returns sent ruery
 *          responses:
 *              '200':
 *                  description: returns success response
 */
router.get('/', (request, response) => {
    const { query } = request;
    ResponseUtils.success(response, { query }, 'Query returned successfully');
});

export default router;