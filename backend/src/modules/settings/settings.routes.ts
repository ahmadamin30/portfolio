import { Router } from 'express';
import {
  getSettings,
  updateSettings,
  updateCopywriting,
  uploadAsset,
} from './settings.controller';
import { authenticate as authenticateAdmin } from '../../middlewares/auth.middleware';
import { uploadAssetMiddleware } from '../../middlewares/upload.middleware';

const router = Router();

/**
 * @route   GET /api/settings
 * @desc    Get site settings
 * @access  Public
 */
router.get('/', getSettings);

/**
 * @route   PUT /api/settings
 * @desc    Update site settings
 * @access  Protected (Admin only)
 */
router.put('/', authenticateAdmin, updateSettings);

/**
 * @route   PATCH /api/settings/copywriting
 * @desc    Update individual section headings and copywriting
 * @access  Protected (Admin only)
 */
router.patch('/copywriting', authenticateAdmin, updateCopywriting);

/**
 * @route   POST /api/settings/upload
 * @desc    Upload brand assets (logo, avatar, resume PDF)
 * @access  Protected (Admin only)
 */
router.post('/upload', authenticateAdmin, uploadAssetMiddleware, uploadAsset);

export default router;