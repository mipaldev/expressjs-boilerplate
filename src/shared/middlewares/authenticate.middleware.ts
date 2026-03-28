import type { NextFunction, Request, Response } from 'express';
import { UnauthorizedException } from '@/shared/exceptions/unauthorized.exception';
import { jwtUtil } from '@/shared/utils/jwt.util';
import type { AuthenticatedRequest } from '@/shared/types/jwt-payload.type';

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return next(new UnauthorizedException('Missing or invalid authorization header'));
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwtUtil.verify(token);
    (req as AuthenticatedRequest).user = payload;
    next();
  } catch {
    next(new UnauthorizedException('Invalid or expired token'));
  }
}
