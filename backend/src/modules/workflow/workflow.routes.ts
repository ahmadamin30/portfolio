import { Router } from 'express';
import {
  getAllSteps,
  getStepById,
  createStep,
  updateStep,
  deleteStep,
} from './workflow.controller';
import { authenticate as authenticateAdmin } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', getAllSteps);
router.get('/:id', getStepById);

router.post('/', authenticateAdmin, createStep);
router.put('/:id', authenticateAdmin, updateStep);
router.delete('/:id', authenticateAdmin, deleteStep);

export default router;
