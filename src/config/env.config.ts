import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  // Application
  APP_URL: z.url(),
  ALLOWED_ORIGINS: z.string().transform((v) => v.split(',')),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Server
  PORT: z.coerce.number().int().positive().default(3000),

  // Database
  DATABASE_URL: z.string(),

  // Authentication
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),

  // Logging
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const errors = parsed.error.issues.map((e) => `${e.path.join('.')}: ${e.message}`).join('\n');
  throw new Error(`Invalid environment variables:\n${errors}`);
}

const vars = parsed.data;

export const envConfig = {
  app: {
    url: vars.APP_URL,
    allowedOrigins: vars.ALLOWED_ORIGINS,
    nodeEnv: vars.NODE_ENV,
  },
  server: {
    port: vars.PORT,
    nodeEnv: vars.NODE_ENV,
    logLevel: vars.LOG_LEVEL,
  },
  db: {
    url: vars.DATABASE_URL,
  },
  auth: {
    jwtSecret: vars.JWT_SECRET,
    jwtExpiresIn: vars.JWT_EXPIRES_IN,
  },
  logging: {
    level: vars.LOG_LEVEL,
  },
};
