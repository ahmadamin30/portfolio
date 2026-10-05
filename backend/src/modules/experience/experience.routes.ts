import { Router } from 'express';
import {
  getAllExperiences,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
} from './experience.controller';
import { authenticate as authenticateAdmin } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', getAllExperiences);
router.get('/:id', getExperienceById);

router.post('/', authenticateAdmin, createExperience);
router.put('/:id', authenticateAdmin, updateExperience);
router.delete('/:id', authenticateAdmin, deleteExperience);

export default router;
