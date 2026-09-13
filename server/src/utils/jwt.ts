import jwt from 'jsonwebtoken';
import { AuthUserPayload } from '../types/express';

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }
  return secret;
};

export const generateToken = (payload: AuthUserPayload): string => {
  const secret = getJwtSecret();
  const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'];
  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyJwt = (token: string): AuthUserPayload => {
  const secret = getJwtSecret();
  return jwt.verify(token, secret) as AuthUserPayload;
};
