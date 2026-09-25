import { Router, Request, Response } from 'express';
import authRoutes from './auth.routes';
import projectRoutes from './project.routes';
import skillRoutes from './skill.routes';
import messageRoutes from './message.routes';
import settingsRoutes from '../modules/settings/settings.routes';

const router = Router();

/**
 * @route   GET /api/health
 * @desc    Service health check endpoint
 * @access  Public
 */
router.get('/health', (_req: Request, res: Response): void => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Mount module sub-routers
router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/skills', skillRoutes);
router.use('/messages', messageRoutes);
router.use('/settings', settingsRoutes);

export default router;