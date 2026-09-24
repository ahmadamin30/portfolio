import { Request, Response, NextFunction } from 'express';
import { verifyToken, AdminPayload } from '../utils/jwt';
import prisma from '../config/db';
import { AppError } from './error.middleware';

export interface AuthenticatedAdmin {
  id: number;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}

declare global {
  namespace Express {
    interface Request {
      admin?: AuthenticatedAdmin;
    }
  }
}

/**
 * Middleware to authenticate requests via Bearer JWT token
 */
export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authorization token required', 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new AppError('Authorization token required', 401);
    }

    let payload: AdminPayload;
    try {
      payload = verifyToken(token);
    } catch {
      throw new AppError('Invalid or expired authentication token', 401);
    }

    // Verify admin exists in the database
    const admin = await prisma.admin.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!admin) {
      throw new AppError('Admin account not found or access revoked', 401);
    }

    req.admin = admin;
    next();
  } catch (error) {
    next(error);
  }
};

export default authenticate;
