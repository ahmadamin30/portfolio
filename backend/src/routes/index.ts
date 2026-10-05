import { Router, Request, Response } from 'express';
import authRoutes from './auth.routes';
import projectRoutes from './project.routes';
import skillRoutes from './skill.routes';
import messageRoutes from './message.routes';
import settingsRoutes from '../modules/settings/settings.routes';
import workflowRoutes from '../modules/workflow/workflow.routes';
import experienceRoutes from '../modules/experience/experience.routes';
import serviceRoutes from '../modules/services/services.routes';
import faqRoutes from '../modules/faqs/faqs.routes';
import socialLinkRoutes from '../modules/social-links/socialLinks.routes';
import translationRoutes from '../modules/translations/translations.routes';
import certificateRoutes from '../modules/certificates/certificates.routes';

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

// Core portfolio modules
router.use('/auth', authRoutes);
router.use('/settings', settingsRoutes);
router.use('/projects', projectRoutes);
router.use('/skills', skillRoutes);
router.use('/messages', messageRoutes);

// Enterprise CMS modules
router.use('/workflow', workflowRoutes);
router.use('/experience', experienceRoutes);
router.use('/services', serviceRoutes);
router.use('/faqs', faqRoutes);
router.use('/social-links', socialLinkRoutes);
router.use('/translations', translationRoutes);
router.use('/certificates', certificateRoutes);

export default router;