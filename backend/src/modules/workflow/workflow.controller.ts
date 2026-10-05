import { Request, Response, NextFunction } from 'express';
import * as workflowService from './workflow.service';
import { AppError } from '../../middlewares/error.middleware';

/**
 * @route   GET /api/workflow
 * @desc    Fetch all workflow steps ordered by orderIndex
 * @access  Public
 */
export const getAllSteps = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const steps = await workflowService.getAllSteps();
    res.status(200).json({
      success: true,
      count: steps.length,
      data: steps,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/workflow/:id
 * @desc    Fetch single workflow step by ID
 * @access  Public
 */
export const getStepById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      throw new AppError('Invalid step ID parameter', 400);
    }

    const step = await workflowService.getStepById(id);
    if (!step) {
      throw new AppError('Workflow step not found', 404);
    }

    res.status(200).json({
      success: true,
      data: step,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/workflow
 * @desc    Create new workflow step
 * @access  Protected (Admin only)
 */
export const createStep = async (
  req: Request<unknown, unknown, workflowService.CreateWorkflowStepDto>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { stepNumber, titleEn, descriptionEn } = req.body;

    if (stepNumber === undefined || isNaN(Number(stepNumber))) {
      throw new AppError('Step number is required and must be numeric', 400);
    }

    if (!titleEn || typeof titleEn !== 'string' || !titleEn.trim()) {
      throw new AppError('English title (titleEn) is required', 400);
    }

    if (!descriptionEn || typeof descriptionEn !== 'string' || !descriptionEn.trim()) {
      throw new AppError('English description (descriptionEn) is required', 400);
    }

    const newStep = await workflowService.createStep(req.body);

    res.status(201).json({
      success: true,
      message: 'Workflow step created successfully',
      data: newStep,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/workflow/:id
 * @desc    Update an existing workflow step
 * @access  Protected (Admin only)
 */
export const updateStep = async (
  req: Request<{ id: string }, unknown, workflowService.UpdateWorkflowStepDto>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      throw new AppError('Invalid step ID parameter', 400);
    }

    const existing = await workflowService.getStepById(id);
    if (!existing) {
      throw new AppError('Workflow step not found', 404);
    }

    const updated = await workflowService.updateStep(id, req.body);

    res.status(200).json({
      success: true,
      message: 'Workflow step updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/workflow/:id
 * @desc    Delete a workflow step
 * @access  Protected (Admin only)
 */
export const deleteStep = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      throw new AppError('Invalid step ID parameter', 400);
    }

    const existing = await workflowService.getStepById(id);
    if (!existing) {
      throw new AppError('Workflow step not found', 404);
    }

    await workflowService.deleteStep(id);

    res.status(200).json({
      success: true,
      message: 'Workflow step deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllSteps,
  getStepById,
  createStep,
  updateStep,
  deleteStep,
};
