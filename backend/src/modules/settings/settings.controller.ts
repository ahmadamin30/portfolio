import { Request, Response, NextFunction } from 'express';
import * as settingsService from './settings.service';
import { AppError } from '../../middlewares/error.middleware';

/**
 * @route   GET /api/settings
 * @desc    Fetch singleton site settings
 * @access  Public
 */
export const getSettings = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const settings = await settingsService.getSettings();
    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/settings
 * @desc    Update singleton site settings
 * @access  Protected (Admin only)
 */
export const updateSettings = async (
  req: Request<unknown, unknown, settingsService.UpdateSettingsDto>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updated = await settingsService.updateSettings(req.body);
    res.status(200).json({
      success: true,
      message: 'Site settings updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

interface UpdateCopywritingBody {
  section?: string;
  data?: settingsService.SectionCopywritingItem;
  badgeAr?: string;
  badgeEn?: string;
  badgeTr?: string;
  titleAr?: string;
  titleEn?: string;
  titleTr?: string;
  subtitleAr?: string;
  subtitleEn?: string;
  subtitleTr?: string;
  [key: string]: unknown;
}

/**
 * @route   PATCH /api/settings/copywriting
 * @desc    Update individual section headings and copywriting
 * @access  Protected (Admin only)
 */
export const updateCopywriting = async (
  req: Request<unknown, unknown, UpdateCopywritingBody>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { section, data, ...rest } = req.body;

    if (!section || typeof section !== 'string' || !section.trim()) {
      throw new AppError('Section identifier is required (e.g., projects, skills, workflow, experience, services, faqs, about)', 400);
    }

    const targetSection = section.trim().toLowerCase();

    // Determine copywriting content from either nested `data` object or body fields
    const copywritingPayload: settingsService.SectionCopywritingItem = {
      ...(data && typeof data === 'object' ? data : {}),
      ...(rest as Record<string, string | undefined>),
    };

    const updated = await settingsService.updateSectionCopywriting(targetSection, copywritingPayload);

    res.status(200).json({
      success: true,
      message: `Copywriting for section "${targetSection}" updated successfully`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/settings/upload
 * @desc    Upload brand assets (avatar, logo, resume PDF, etc.)
 * @access  Protected (Admin only)
 */
export const uploadAsset = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      throw new AppError('No asset file was uploaded', 400);
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: 'Asset uploaded successfully',
      data: {
        filename: req.file.filename,
        url: fileUrl,
        mimetype: req.file.mimetype,
        size: req.file.size,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getSettings,
  updateSettings,
  updateCopywriting,
  uploadAsset,
};