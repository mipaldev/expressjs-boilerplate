import { HTTP_STATUS } from '@/shared/constants/http-status.constant';
import type { ApiResponse, PaginatedApiResponse } from '@/shared/types/http-response.type';
import type { NextFunction, Request, Response } from 'express';
import { createUserSchema } from './schemas/create-user.schema';
import { queryUserSchema } from './schemas/query-user.schema';
import { updateUserSchema } from './schemas/update-user.schema';
import { userService } from './user.service';
import type { UserDetailResponse, UserResponse } from './types/user-response.type';

async function createUser(
  req: Request,
  res: Response<ApiResponse<UserResponse>>,
  next: NextFunction,
): Promise<void> {
  try {
    const input = createUserSchema.parse(req.body);
    const user = await userService.create(input);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      statusCode: HTTP_STATUS.CREATED,
      data: user,
      message: 'User created successfully',
    });
  } catch (err) {
    next(err);
  }
}

async function getUsers(
  req: Request,
  res: Response<PaginatedApiResponse<UserDetailResponse>>,
  next: NextFunction,
): Promise<void> {
  try {
    const query = queryUserSchema.parse(req.query);
    const result = await userService.getAll(query);
    res.status(HTTP_STATUS.OK).json({
      success: true,
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
  res: Response<ApiResponse<UserDetailResponse>>,
  next: NextFunction,
): Promise<void> {
  try {
    const user = await userService.getById(req.params.id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      statusCode: HTTP_STATUS.OK,
      data: user,
    });
  } catch (err) {
    next(err);
  }
}

async function updateUser(
  req: Request<{ id: string }>,
  res: Response<ApiResponse<UserDetailResponse>>,
  next: NextFunction,
): Promise<void> {
  try {
    const input = updateUserSchema.parse(req.body);
    const user = await userService.update(req.params.id, input);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      statusCode: HTTP_STATUS.OK,
      data: user,
      message: 'User updated successfully',
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
    await userService.remove(req.params.id);
    res.status(HTTP_STATUS.NO_CONTENT).send();
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
