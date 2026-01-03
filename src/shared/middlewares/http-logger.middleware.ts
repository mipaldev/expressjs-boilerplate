import type { NextFunction, Request, Response } from 'express';

import { loggerUtil } from '@/shared/utils/logger.util';

export function httpLogger(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    loggerUtil.info(`${req.method} ${req.path} ${res.statusCode} ~ ${duration}ms`);
  });

  next();
}
