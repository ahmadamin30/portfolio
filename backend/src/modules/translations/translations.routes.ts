import { Router } from 'express';
import {
  getAllTranslations,
  exportTranslations,
  getTranslationById,
  createTranslation,
  updateTranslation,
  deleteTranslation,
  bulkImport,
} from './translations.controller';
import { authenticate as authenticateAdmin } from '../../middlewares/auth.middleware';

const router = Router();

// Public read routes
router.get('/', getAllTranslations);
router.get('/export', exportTranslations);
router.get('/:id', getTranslationById);

// Protected mutation routes
router.post('/', authenticateAdmin, createTranslation);
router.post('/bulk-import', authenticateAdmin, bulkImport);
router.put('/:id', authenticateAdmin, updateTranslation);
router.delete('/:id', authenticateAdmin, deleteTranslation);

export default router;
