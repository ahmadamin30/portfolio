import jwt, { Secret, SignOptions } from 'jsonwebtoken';

export interface AdminPayload {
  id: number;
  username: string;
  email: string;
}

const getJwtSecret = (): Secret => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured in environment variables');
  }
  return secret;
};

/**
 * Sign an admin JWT payload
 * @param payload AdminPayload containing id, username, email
 * @returns Signed JWT string
 */
export const signToken = (payload: AdminPayload): string => {
  const secret = getJwtSecret();
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  const options: SignOptions = {
    expiresIn: expiresIn as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, secret, options);
};

/**
 * Verify and decode an admin JWT token
 * @param token JWT string
 * @returns Decoded AdminPayload
 */
export const verifyToken = (token: string): AdminPayload => {
  const secret = getJwtSecret();
  const decoded = jwt.verify(token, secret);
  return decoded as AdminPayload;
};
