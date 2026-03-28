import { Router } from 'express';
import { authenticate } from '@/shared/middlewares/authenticate.middleware';
import { authController } from './auth.controller';

const authRouter = Router();

authRouter.post('/register', authController.register);
authRouter.post('/login', authController.login);
authRouter.get('/me', authenticate, authController.me);

export { authRouter };
