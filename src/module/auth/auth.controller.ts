import { HTTP_STATUS } from '@/shared/constants/http-status.constant';
import { httpResponseUtil } from '@/shared/utils/http-response.util';
import type { NextFunction, Request, Response } from 'express';
import { loginSchema } from './schemas/login.schema';
import { registerSchema } from './schemas/register.schema';
import { authService } from './auth.service';
import type { AuthenticatedRequest } from '@/shared/types/jwt-payload.type';

async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const input = registerSchema.parse(req.body);
    const user = await authService.register(input);
    httpResponseUtil.success({
      res,
      statusCode: HTTP_STATUS.CREATED,
      message: 'Registration successful',
      data: user,
    });
  } catch (err) {
    next(err);
  }
}

async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const input = loginSchema.parse(req.body);
    const result = await authService.login(input);
    httpResponseUtil.success({
      res,
      statusCode: HTTP_STATUS.OK,
      message: 'Login successful',
      data: result,
    });
  } catch (err) {
    next(err);
  }
}

async function me(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const user = await authService.me(req.user.sub);
    httpResponseUtil.success({
      res,
      statusCode: HTTP_STATUS.OK,
      data: user,
    });
  } catch (err) {
    next(err);
  }
}

export const authController = {
  register,
  login,
  me,
};
