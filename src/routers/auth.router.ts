import { Router } from 'express';
import { AuthController } from '@controllers';

const router = Router();

router.post('/register', AuthController.register);

export default router;