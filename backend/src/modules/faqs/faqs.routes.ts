import { Router } from 'express';
import {
  getAllFaqs,
  getFaqById,
  createFaq,
  updateFaq,
  deleteFaq,
} from './faqs.controller';
import { authenticate as authenticateAdmin } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', getAllFaqs);
router.get('/:id', getFaqById);

router.post('/', authenticateAdmin, createFaq);
router.put('/:id', authenticateAdmin, updateFaq);
router.delete('/:id', authenticateAdmin, deleteFaq);

export default router;
