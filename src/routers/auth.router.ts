import { Router } from 'express';
import { AuthController } from '@controllers';
import { AuthMiddleware } from '@middlewares';

const router = Router();

/**
 *  @swagger
 *  tags:
 *  - name: "Authentication"
 *    description: "Requests related to authentication"
 */

/**
 *  @swagger
 *  /auth/register:
 *      get:
 *          description: Register
 *          responses:
 *              '201':
 *                  description: User registered successfully
 */

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/verify', [AuthMiddleware.isPendingVerification], AuthController.verify);
router.get('/resendVerification', [AuthMiddleware.isAuthorized, AuthMiddleware.isPendingVerification], AuthController.requestVerificationEmail);

export default router;
