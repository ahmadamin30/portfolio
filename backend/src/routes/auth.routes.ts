import { Router } from 'express';
import { login, getMe } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate admin and retrieve JWT
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   GET /api/auth/me
 * @desc    Get currently authenticated admin profile
 * @access  Protected (Requires Bearer JWT)
 */
router.get('/me', authenticate, getMe);

export default router;
