import { Router } from 'express';
import { AuthController } from '@controllers';
import { AuthMiddleware } from '@middlewares';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/verify', [AuthMiddleware.isPendingVerification], AuthController.verify);
router.get('/resendVerification', [AuthMiddleware.isAuthorized, AuthMiddleware.isPendingVerification], AuthController.requestVerificationEmail);

export default router;
