import { Router } from 'express';
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from './services.controller';
import { authenticate as authenticateAdmin } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', getAllServices);
router.get('/:id', getServiceById);

router.post('/', authenticateAdmin, createService);
router.put('/:id', authenticateAdmin, updateService);
router.delete('/:id', authenticateAdmin, deleteService);

export default router;
