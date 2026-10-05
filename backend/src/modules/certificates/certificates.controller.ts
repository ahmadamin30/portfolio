import { Request, Response, NextFunction } from 'express';
import * as certificatesService from './certificates.service';
import { AppError } from '../../middlewares/error.middleware';

/**
 * @route   GET /api/certificates
 * @desc    Fetch all certificates ordered by orderIndex
 * @access  Public
 */
export const getAllCertificates = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const certificates = await certificatesService.getAllCertificates();
    res.status(200).json({
      success: true,
      count: certificates.length,
      data: certificates,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/certificates/:id
 * @desc    Fetch single certificate by ID
 * @access  Public
 */
export const getCertificateById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      throw new AppError('Invalid certificate ID parameter', 400);
    }

    const certificate = await certificatesService.getCertificateById(id);
    if (!certificate) {
      throw new AppError('Certificate not found', 404);
    }

    res.status(200).json({
      success: true,
      data: certificate,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/certificates
 * @desc    Create new certificate
 * @access  Protected (Admin only)
 */
export const createCertificate = async (
  req: Request<unknown, unknown, certificatesService.CreateCertificateDto>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { titleEn, issuer, issueDate } = req.body;

    if (!titleEn || typeof titleEn !== 'string' || !titleEn.trim()) {
      throw new AppError('Certificate English title (titleEn) is required', 400);
    }

    if (!issuer || typeof issuer !== 'string' || !issuer.trim()) {
      throw new AppError('Certificate issuer is required', 400);
    }

    if (!issueDate || typeof issueDate !== 'string' || !issueDate.trim()) {
      throw new AppError('Issue date is required', 400);
    }

    const created = await certificatesService.createCertificate(req.body);

    res.status(201).json({
      success: true,
      message: 'Certificate created successfully',
      data: created,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/certificates/:id
 * @desc    Update certificate
 * @access  Protected (Admin only)
 */
export const updateCertificate = async (
  req: Request<{ id: string }, unknown, certificatesService.UpdateCertificateDto>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      throw new AppError('Invalid certificate ID parameter', 400);
    }

    const existing = await certificatesService.getCertificateById(id);
    if (!existing) {
      throw new AppError('Certificate not found', 404);
    }

    const updated = await certificatesService.updateCertificate(id, req.body);

    res.status(200).json({
      success: true,
      message: 'Certificate updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/certificates/:id
 * @desc    Delete certificate
 * @access  Protected (Admin only)
 */
export const deleteCertificate = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      throw new AppError('Invalid certificate ID parameter', 400);
    }

    const existing = await certificatesService.getCertificateById(id);
    if (!existing) {
      throw new AppError('Certificate not found', 404);
    }

    await certificatesService.deleteCertificate(id);

    res.status(200).json({
      success: true,
      message: 'Certificate deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllCertificates,
  getCertificateById,
  createCertificate,
  updateCertificate,
  deleteCertificate,
};
