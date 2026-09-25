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