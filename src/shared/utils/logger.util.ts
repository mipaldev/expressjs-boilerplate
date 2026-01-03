import pino from 'pino';
import { envConfig } from '@/config/env.config';

const pinoLogger = pino({
  level: envConfig.server.logLevel,
  base: {
    pid: false,
    hostname: false,
  },
  transport:
    envConfig.server.nodeEnv === 'development'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
          },
        }
      : undefined,
});

function info(message: string): void {
  pinoLogger.info(message);
}

function warn(message: string): void {
  pinoLogger.warn(message);
}

function error(message: string): void {
  pinoLogger.error(message);
}

function debug(message: string): void {
  pinoLogger.debug(message);
}

function fatal(message: string): void {
  pinoLogger.fatal(message);
}

export const loggerUtil = {
  info,
  warn,
  error,
  debug,
  fatal,
};
