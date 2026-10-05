import { Request, Response, NextFunction } from 'express';
import * as socialLinksService from './socialLinks.service';
import { AppError } from '../../middlewares/error.middleware';

/**
 * @route   GET /api/social-links
 * @desc    Fetch all social links ordered by orderIndex
 * @access  Public
 */
export const getAllSocialLinks = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const links = await socialLinksService.getAllSocialLinks();
    res.status(200).json({
      success: true,
      count: links.length,
      data: links,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/social-links/:id
 * @desc    Fetch single social link by ID
 * @access  Public
 */
export const getSocialLinkById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      throw new AppError('Invalid social link ID parameter', 400);
    }

    const link = await socialLinksService.getSocialLinkById(id);
    if (!link) {
      throw new AppError('Social link not found', 404);
    }

    res.status(200).json({
      success: true,
      data: link,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/social-links
 * @desc    Create new social link
 * @access  Protected (Admin only)
 */
export const createSocialLink = async (
  req: Request<unknown, unknown, socialLinksService.CreateSocialLinkDto>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { platform, url } = req.body;

    if (!platform || typeof platform !== 'string' || !platform.trim()) {
      throw new AppError('Platform name is required (e.g., GitHub, LinkedIn, X, Telegram)', 400);
    }

    if (!url || typeof url !== 'string' || !url.trim()) {
      throw new AppError('URL is required', 400);
    }

    const created = await socialLinksService.createSocialLink(req.body);

    res.status(201).json({
      success: true,
      message: 'Social link created successfully',
      data: created,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/social-links/:id
 * @desc    Update social link
 * @access  Protected (Admin only)
 */
export const updateSocialLink = async (
  req: Request<{ id: string }, unknown, socialLinksService.UpdateSocialLinkDto>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      throw new AppError('Invalid social link ID parameter', 400);
    }

    const existing = await socialLinksService.getSocialLinkById(id);
    if (!existing) {
      throw new AppError('Social link not found', 404);
    }

    const updated = await socialLinksService.updateSocialLink(id, req.body);

    res.status(200).json({
      success: true,
      message: 'Social link updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/social-links/:id
 * @desc    Delete social link
 * @access  Protected (Admin only)
 */
export const deleteSocialLink = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      throw new AppError('Invalid social link ID parameter', 400);
    }

    const existing = await socialLinksService.getSocialLinkById(id);
    if (!existing) {
      throw new AppError('Social link not found', 404);
    }

    await socialLinksService.deleteSocialLink(id);

    res.status(200).json({
      success: true,
      message: 'Social link deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllSocialLinks,
  getSocialLinkById,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
};
