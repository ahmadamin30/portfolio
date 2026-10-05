import { Router } from 'express';
import {
  getAllCertificates,
  getCertificateById,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} from './certificates.controller';
import { authenticate as authenticateAdmin } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', getAllCertificates);
router.get('/:id', getCertificateById);

router.post('/', authenticateAdmin, createCertificate);
router.put('/:id', authenticateAdmin, updateCertificate);
router.delete('/:id', authenticateAdmin, deleteCertificate);

export default router;
