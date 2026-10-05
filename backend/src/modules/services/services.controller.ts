import { Request, Response, NextFunction } from 'express';
import * as servicesService from './services.service';
import { AppError } from '../../middlewares/error.middleware';

/**
 * @route   GET /api/services
 * @desc    Fetch all services, optional query ?activeOnly=true
 * @access  Public
 */
export const getAllServices = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { activeOnly } = req.query;
    const isActiveFiltered = activeOnly === 'true' || activeOnly === '1';

    const services = await servicesService.getAllServices(isActiveFiltered);

    res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/services/:id
 * @desc    Fetch single service by ID
 * @access  Public
 */
export const getServiceById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      throw new AppError('Invalid service ID parameter', 400);
    }

    const service = await servicesService.getServiceById(id);
    if (!service) {
      throw new AppError('Service not found', 404);
    }

    res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/services
 * @desc    Create new service
 * @access  Protected (Admin only)
 */
export const createService = async (
  req: Request<unknown, unknown, servicesService.CreateServiceDto>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { titleEn, descriptionEn } = req.body;

    if (!titleEn || typeof titleEn !== 'string' || !titleEn.trim()) {
      throw new AppError('English service title (titleEn) is required', 400);
    }

    if (!descriptionEn || typeof descriptionEn !== 'string' || !descriptionEn.trim()) {
      throw new AppError('English service description (descriptionEn) is required', 400);
    }

    const created = await servicesService.createService(req.body);

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: created,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/services/:id
 * @desc    Update service
 * @access  Protected (Admin only)
 */
export const updateService = async (
  req: Request<{ id: string }, unknown, servicesService.UpdateServiceDto>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      throw new AppError('Invalid service ID parameter', 400);
    }

    const existing = await servicesService.getServiceById(id);
    if (!existing) {
      throw new AppError('Service not found', 404);
    }

    const updated = await servicesService.updateService(id, req.body);

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/services/:id
 * @desc    Delete service
 * @access  Protected (Admin only)
 */
export const deleteService = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      throw new AppError('Invalid service ID parameter', 400);
    }

    const existing = await servicesService.getServiceById(id);
    if (!existing) {
      throw new AppError('Service not found', 404);
    }

    await servicesService.deleteService(id);

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
