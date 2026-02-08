import type { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS } from '@/shared/constants/http-status.constant';
import { HttpException } from '@/shared/exceptions/http.exception';
import { loggerUtil } from '@/shared/utils/logger.util';
import { httpResponseUtil } from '@/shared/utils/http-response.util';

type ErrorLike = {
  message?: string;
  statusCode?: number;
  errors?: Record<string, string | string[]>;
};

function isErrorLike(err: unknown): err is ErrorLike {
  return typeof err === 'object' && err !== null;
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const statusCode =
    err instanceof HttpException
      ? err.statusCode
      : isErrorLike(err) && typeof err.statusCode === 'number'
        ? err.statusCode
        : HTTP_STATUS.INTERNAL_SERVER_ERROR;

  const message =
    err instanceof HttpException
      ? err.message
      : isErrorLike(err) && typeof err.message === 'string'
        ? err.message
        : statusCode === HTTP_STATUS.NOT_FOUND
          ? 'Not Found'
          : 'Internal Server Error';

  const errors = isErrorLike(err) ? err.errors : undefined;

  loggerUtil.error(err instanceof Error ? err.message : message);

  httpResponseUtil.error({
    res,
    statusCode,
    message,
    errors,
  });
}
