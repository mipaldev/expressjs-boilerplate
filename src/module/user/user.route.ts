import { Router } from 'express';
import { userController } from './user.controller';

const userRouter = Router();

userRouter.post('/', userController.createUser);
userRouter.get('/', userController.getUsers);
userRouter.get('/:id', userController.getUserById);
userRouter.patch('/:id', userController.updateUser);
userRouter.delete('/:id', userController.deleteUser);

export { userRouter };
