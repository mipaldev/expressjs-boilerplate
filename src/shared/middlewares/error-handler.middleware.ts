import type { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS } from '@/shared/constants/http-status.constant';
import { HttpException } from '@/shared/exceptions/http.exception';
import { httpResponseUtil } from '@/shared/utils/http-response.util';
import { loggerUtil } from '@/shared/utils/logger.util';
import { zodErrorUtil } from '@/shared/utils/zod-error.util';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (zodErrorUtil.isZodError(err)) {
    const errors = zodErrorUtil.normalize(err);
    loggerUtil.warn(`Validation error: ${JSON.stringify(errors)}`);
    httpResponseUtil.error({
      res,
      statusCode: HTTP_STATUS.BAD_REQUEST,
      message: 'Bad Request',
      errors,
    });
    return;
  }

  if (err instanceof HttpException) {
    loggerUtil.warn(`${err.statusCode} ${err.message}`);
    httpResponseUtil.error({
      res,
      statusCode: err.statusCode,
      message: err.message,
    });
    return;
  }

  const message = err instanceof Error ? err.message : 'Internal Server Error';
  loggerUtil.error(`Unhandled error: ${message}`);
  httpResponseUtil.error({
    res,
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    message: 'Internal Server Error',
  });
}
