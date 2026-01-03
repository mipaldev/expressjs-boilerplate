import { envConfig } from '@/config/env.config';
import { loggerUtil } from '@/shared/utils/logger.util';
import { app } from './app';

const server = app.listen(envConfig.server.port, () => {
  loggerUtil.info(`Application is running at http://localhost:${envConfig.server.port}`);
});

process.on('SIGTERM', () => {
  loggerUtil.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    loggerUtil.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  loggerUtil.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    loggerUtil.info('Server closed');
    process.exit(0);
  });
});
