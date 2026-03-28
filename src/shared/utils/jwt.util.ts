import jwt from 'jsonwebtoken';
import { envConfig } from '@/config/env.config';
import type { JwtPayload } from '@/shared/types/jwt-payload.type';

function sign(payload: JwtPayload): string {
  return jwt.sign(payload, envConfig.auth.jwtSecret, {
    expiresIn: envConfig.auth.jwtExpiresIn as jwt.SignOptions['expiresIn'],
  });
}

function verify(token: string): JwtPayload {
  return jwt.verify(token, envConfig.auth.jwtSecret) as JwtPayload;
}

export const jwtUtil = {
  sign,
  verify,
};
