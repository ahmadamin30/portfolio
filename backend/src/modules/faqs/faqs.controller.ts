import { Request, Response, NextFunction } from 'express';
import * as faqsService from './faqs.service';
import { AppError } from '../../middlewares/error.middleware';

/**
 * @route   GET /api/faqs
 * @desc    Fetch all FAQs, optional queries ?category=... and ?publishedOnly=true
 * @access  Public
 */
export const getAllFaqs = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { category, publishedOnly } = req.query;

    const filterOptions: faqsService.FaqFilterOptions = {};
    if (typeof category === 'string' && category.trim()) {
      filterOptions.category = category.trim();
    }
    if (publishedOnly === 'true' || publishedOnly === '1') {
      filterOptions.publishedOnly = true;
    }

    const faqs = await faqsService.getAllFaqs(filterOptions);

    res.status(200).json({
      success: true,
      count: faqs.length,
      data: faqs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/faqs/:id
 * @desc    Fetch single FAQ by ID
 * @access  Public
 */
export const getFaqById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      throw new AppError('Invalid FAQ ID parameter', 400);
    }

    const faq = await faqsService.getFaqById(id);
    if (!faq) {
      throw new AppError('FAQ not found', 404);
    }

    res.status(200).json({
      success: true,
      data: faq,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/faqs
 * @desc    Create new FAQ
 * @access  Protected (Admin only)
 */
export const createFaq = async (
  req: Request<unknown, unknown, faqsService.CreateFaqDto>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { questionEn, answerEn } = req.body;

    if (!questionEn || typeof questionEn !== 'string' || !questionEn.trim()) {
      throw new AppError('English question (questionEn) is required', 400);
    }

    if (!answerEn || typeof answerEn !== 'string' || !answerEn.trim()) {
      throw new AppError('English answer (answerEn) is required', 400);
    }

    const created = await faqsService.createFaq(req.body);

    res.status(201).json({
      success: true,
      message: 'FAQ created successfully',
      data: created,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/faqs/:id
 * @desc    Update FAQ
 * @access  Protected (Admin only)
 */
export const updateFaq = async (
  req: Request<{ id: string }, unknown, faqsService.UpdateFaqDto>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      throw new AppError('Invalid FAQ ID parameter', 400);
    }

    const existing = await faqsService.getFaqById(id);
    if (!existing) {
      throw new AppError('FAQ not found', 404);
    }

    const updated = await faqsService.updateFaq(id, req.body);

    res.status(200).json({
      success: true,
      message: 'FAQ updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/faqs/:id
 * @desc    Delete FAQ
 * @access  Protected (Admin only)
 */
export const deleteFaq = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      throw new AppError('Invalid FAQ ID parameter', 400);
    }

    const existing = await faqsService.getFaqById(id);
    if (!existing) {
      throw new AppError('FAQ not found', 404);
    }

    await faqsService.deleteFaq(id);

    res.status(200).json({
      success: true,
      message: 'FAQ deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllFaqs,
  getFaqById,
  createFaq,
  updateFaq,
  deleteFaq,
};
