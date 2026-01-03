import type { NextFunction, Request, Response } from 'express';

import { HTTP_STATUS } from '@/shared/constants/http-status.constant';
import { HttpException } from '@/shared/exceptions/http.exception';
import { loggerUtil } from '@/shared/utils/logger.util';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof HttpException) {
    res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
    });
    return;
  }

  loggerUtil.error(err.message);

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    message: 'Internal Server Error',
  });
}
