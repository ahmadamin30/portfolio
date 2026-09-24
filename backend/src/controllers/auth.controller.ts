import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { comparePassword } from '../utils/password';
import { signToken, AdminPayload } from '../utils/jwt';
import { AppError } from '../middlewares/error.middleware';

interface LoginRequestBody {
  email?: string;
  password?: string;
}

/**
 * Handle admin login authentication
 * @route POST /api/auth/login
 */
export const login = async (
  req: Request<unknown, unknown, LoginRequestBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Query admin record
    const admin = await prisma.admin.findUnique({
      where: { email: trimmedEmail },
    });

    if (!admin) {
      throw new AppError('Invalid email or password', 401);
    }

    // Verify password hash
    const isPasswordValid = await comparePassword(password, admin.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate JWT
    const payload: AdminPayload = {
      id: admin.id,
      username: admin.name || admin.email.split('@')[0],
      email: admin.email,
    };

    const token = signToken(payload);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current authenticated admin details
 * @route GET /api/auth/me
 */
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.admin) {
      throw new AppError('Not authenticated', 401);
    }

    res.status(200).json({
      success: true,
      data: {
        admin: req.admin,
      },
    });
  } catch (error) {
    next(error);
  }
};
