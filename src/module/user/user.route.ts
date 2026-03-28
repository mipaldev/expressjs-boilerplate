import { Router } from 'express';
import { authenticate } from '@/shared/middlewares/authenticate.middleware';
import { userController } from './user.controller';

const userRouter = Router();

userRouter.post('/', userController.createUser);
userRouter.get('/', userController.getUsers);
userRouter.get('/:id', authenticate, userController.getUserById);
userRouter.patch('/:id', authenticate, userController.updateUser);
userRouter.delete('/:id', authenticate, userController.deleteUser);

export { userRouter };
