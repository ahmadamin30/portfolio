import { Request, Response, NextFunction } from 'express';
import * as translationsService from './translations.service';
import { AppError } from '../../middlewares/error.middleware';

/**
 * @route   GET /api/translations
 * @desc    Fetch all translation keys, optional ?category=
 * @access  Public
 */
export const getAllTranslations = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { category } = req.query;
    const categoryFilter = typeof category === 'string' && category.trim() ? category.trim() : undefined;

    const list = await translationsService.getAllTranslations(categoryFilter);

    res.status(200).json({
      success: true,
      count: list.length,
      data: list,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/translations/export
 * @desc    Export structured JSON of translations dictionary, optional ?lang=ar|en|tr
 * @access  Public
 */
export const exportTranslations = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { lang } = req.query;
    let targetLang: 'ar' | 'en' | 'tr' | undefined = undefined;

    if (lang === 'ar' || lang === 'en' || lang === 'tr') {
      targetLang = lang;
    }

    const exported = await translationsService.exportTranslations(targetLang);

    res.status(200).json({
      success: true,
      language: targetLang || 'all',
      data: exported,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/translations/:id
 * @desc    Fetch single translation key by ID
 * @access  Public
 */
export const getTranslationById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      throw new AppError('Invalid translation ID parameter', 400);
    }

    const item = await translationsService.getTranslationById(id);
    if (!item) {
      throw new AppError('Translation key not found', 404);
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/translations
 * @desc    Create single translation key
 * @access  Protected (Admin only)
 */
export const createTranslation = async (
  req: Request<unknown, unknown, translationsService.CreateTranslationDto>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { key, valueEn } = req.body;

    if (!key || typeof key !== 'string' || !key.trim()) {
      throw new AppError('Translation key is required (e.g., nav.home, hero.cta)', 400);
    }

    if (valueEn === undefined || typeof valueEn !== 'string') {
      throw new AppError('English translation value (valueEn) is required', 400);
    }

    const existing = await translationsService.getTranslationByKey(key.trim());
    if (existing) {
      throw new AppError(`Translation key "${key.trim()}" already exists`, 409);
    }

    const created = await translationsService.createTranslation(req.body);

    res.status(201).json({
      success: true,
      message: 'Translation key created successfully',
      data: created,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/translations/:id
 * @desc    Update translation key
 * @access  Protected (Admin only)
 */
export const updateTranslation = async (
  req: Request<{ id: string }, unknown, translationsService.UpdateTranslationDto>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      throw new AppError('Invalid translation ID parameter', 400);
    }

    const existing = await translationsService.getTranslationById(id);
    if (!existing) {
      throw new AppError('Translation key not found', 404);
    }

    if (req.body.key && req.body.key.trim() !== existing.key) {
      const duplicate = await translationsService.getTranslationByKey(req.body.key.trim());
      if (duplicate && duplicate.id !== id) {
        throw new AppError(`Translation key "${req.body.key.trim()}" already exists`, 409);
      }
    }

    const updated = await translationsService.updateTranslation(id, req.body);

    res.status(200).json({
      success: true,
      message: 'Translation updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/translations/:id
 * @desc    Delete translation key
 * @access  Protected (Admin only)
 */
export const deleteTranslation = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      throw new AppError('Invalid translation ID parameter', 400);
    }

    const existing = await translationsService.getTranslationById(id);
    if (!existing) {
      throw new AppError('Translation key not found', 404);
    }

    await translationsService.deleteTranslation(id);

    res.status(200).json({
      success: true,
      message: 'Translation key deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

interface BulkImportPayload {
  items?: translationsService.BulkImportTranslationItem[];
  translations?: Record<string, { ar?: string; en?: string; tr?: string; category?: string }>;
}

/**
 * @route   POST /api/translations/bulk-import
 * @desc    Bulk upsert translation keys from JSON array or dictionary object
 * @access  Protected (Admin only)
 */
export const bulkImport = async (
  req: Request<unknown, unknown, BulkImportPayload | translationsService.BulkImportTranslationItem[]>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let itemsToImport: translationsService.BulkImportTranslationItem[] = [];

    if (Array.isArray(req.body)) {
      itemsToImport = req.body;
    } else if (req.body && typeof req.body === 'object') {
      const payload = req.body as BulkImportPayload;
      if (Array.isArray(payload.items)) {
        itemsToImport = payload.items;
      } else if (payload.translations && typeof payload.translations === 'object') {
        itemsToImport = Object.entries(payload.translations).map(([key, vals]) => ({
          key,
          valueAr: vals.ar,
          valueEn: vals.en,
          valueTr: vals.tr,
          category: vals.category || 'general',
        }));
      }
    }

    if (itemsToImport.length === 0) {
      throw new AppError('No valid translation items provided for bulk import', 400);
    }

    const result = await translationsService.bulkImport(itemsToImport);

    res.status(200).json({
      success: true,
      message: `Bulk import completed: ${result.importedCount} keys upserted`,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllTranslations,
  exportTranslations,
  getTranslationById,
  createTranslation,
  updateTranslation,
  deleteTranslation,
  bulkImport,
};
