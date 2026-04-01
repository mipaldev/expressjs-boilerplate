import { HTTP_STATUS } from '@/shared/constants/http-status.constant';
import { uuidParamSchema } from '@/shared/schemas/uuid-param.schema';
import { httpResponseUtil } from '@/shared/utils/http-response.util';
import type { NextFunction, Request, Response } from 'express';
import { createUserSchema } from './schemas/create-user.schema';
import { queryUserSchema } from './schemas/query-user.schema';
import { updateUserSchema } from './schemas/update-user.schema';
import { userService } from './user.service';

async function createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const input = createUserSchema.parse(req.body);
    const user = await userService.create(input);
    httpResponseUtil.success({
      res,
      statusCode: HTTP_STATUS.CREATED,
      message: 'User created successfully',
      data: user,
    });
  } catch (err) {
    next(err);
  }
}

async function getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const query = queryUserSchema.parse(req.query);
    const result = await userService.getAll(query);
    httpResponseUtil.paginated({
      res,
      statusCode: HTTP_STATUS.OK,
      data: result.data,
      meta: result.meta,
    });
  } catch (err) {
    next(err);
  }
}

async function getUserById(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = uuidParamSchema.parse(req.params);
    const user = await userService.getById(id);
    httpResponseUtil.success({
      res,
      statusCode: HTTP_STATUS.OK,
      data: user,
    });
  } catch (err) {
    next(err);
  }
}

async function updateUser(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = uuidParamSchema.parse(req.params);
    const input = updateUserSchema.parse(req.body);
    const user = await userService.update(id, input);
    httpResponseUtil.success({
      res,
      statusCode: HTTP_STATUS.OK,
      message: 'User updated successfully',
      data: user,
    });
  } catch (err) {
    next(err);
  }
}

async function deleteUser(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { id } = uuidParamSchema.parse(req.params);
    const deleted = await userService.remove(id);
    httpResponseUtil.success({
      res,
      statusCode: HTTP_STATUS.OK,
      message: 'User deleted successfully',
      data: deleted,
    });
  } catch (err) {
    next(err);
  }
}

export const userController = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
