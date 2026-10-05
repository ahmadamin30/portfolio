import { Request, Response, NextFunction } from 'express';
import * as experienceService from './experience.service';
import { AppError } from '../../middlewares/error.middleware';

/**
 * @route   GET /api/experience
 * @desc    Fetch all experience records, optional query ?type=WORK|EDUCATION|MILESTONE
 * @access  Public
 */
export const getAllExperiences = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { type } = req.query;
    const typeFilter = typeof type === 'string' ? type : undefined;

    const experiences = await experienceService.getAllExperiences(typeFilter);

    res.status(200).json({
      success: true,
      count: experiences.length,
      data: experiences,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/experience/:id
 * @desc    Fetch single experience record by ID
 * @access  Public
 */
export const getExperienceById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      throw new AppError('Invalid experience ID parameter', 400);
    }

    const experience = await experienceService.getExperienceById(id);
    if (!experience) {
      throw new AppError('Experience record not found', 404);
    }

    res.status(200).json({
      success: true,
      data: experience,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/experience
 * @desc    Create new experience record
 * @access  Protected (Admin only)
 */
export const createExperience = async (
  req: Request<unknown, unknown, experienceService.CreateExperienceDto>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { type, degreeOrRoleEn, institutionOrCompanyEn, startDate } = req.body;

    if (!type || typeof type !== 'string' || !type.trim()) {
      throw new AppError('Experience type is required ("EDUCATION", "WORK", or "MILESTONE")', 400);
    }

    if (!degreeOrRoleEn || typeof degreeOrRoleEn !== 'string' || !degreeOrRoleEn.trim()) {
      throw new AppError('Role or Degree (English) is required', 400);
    }

    if (!institutionOrCompanyEn || typeof institutionOrCompanyEn !== 'string' || !institutionOrCompanyEn.trim()) {
      throw new AppError('Institution or Company (English) is required', 400);
    }

    if (!startDate || typeof startDate !== 'string' || !startDate.trim()) {
      throw new AppError('Start date is required', 400);
    }

    const created = await experienceService.createExperience(req.body);

    res.status(201).json({
      success: true,
      message: 'Experience record created successfully',
      data: created,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/experience/:id
 * @desc    Update experience record
 * @access  Protected (Admin only)
 */
export const updateExperience = async (
  req: Request<{ id: string }, unknown, experienceService.UpdateExperienceDto>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      throw new AppError('Invalid experience ID parameter', 400);
    }

    const existing = await experienceService.getExperienceById(id);
    if (!existing) {
      throw new AppError('Experience record not found', 404);
    }

    const updated = await experienceService.updateExperience(id, req.body);

    res.status(200).json({
      success: true,
      message: 'Experience record updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/experience/:id
 * @desc    Delete experience record
 * @access  Protected (Admin only)
 */
export const deleteExperience = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      throw new AppError('Invalid experience ID parameter', 400);
    }

    const existing = await experienceService.getExperienceById(id);
    if (!existing) {
      throw new AppError('Experience record not found', 404);
    }

    await experienceService.deleteExperience(id);

    res.status(200).json({
      success: true,
      message: 'Experience record deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllExperiences,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
};
