import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import prisma from '../config/db';
import { AppError } from '../middlewares/error.middleware';

/**
 * Safely parse tags from form-data string or array
 */
const parseTags = (tags: unknown): string[] => {
  if (!tags) return [];

  if (Array.isArray(tags)) {
    return tags.map((t) => String(t).trim()).filter(Boolean);
  }

  if (typeof tags === 'string') {
    const trimmed = tags.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed.map((t) => String(t).trim()).filter(Boolean);
        }
      } catch {
        return trimmed
          .replace(/[\[\]"]/g, '')
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
      }
    }
    return trimmed
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
  }

  return [];
};

/**
 * Helper to remove local uploaded file
 */
const removeLocalFile = (fileUrl: string | null | undefined): void => {
  if (fileUrl && fileUrl.startsWith('/uploads/')) {
    const filename = path.basename(fileUrl);
    const filePath = path.resolve(__dirname, '../../uploads', filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (error) {
        console.error('Failed to delete local uploaded file:', error);
      }
    }
  }
};

/**
 * @route   GET /api/projects
 * @desc    Get all projects (ordered by orderIndex ASC, createdAt DESC)
 * @access  Public
 */
export const getAllProjects = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [
        { orderIndex: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/projects/:id
 * @desc    Get single project by ID
 * @access  Public
 */
export const getProjectById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      throw new AppError('Invalid project ID parameter', 400);
    }

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/projects
 * @desc    Create a new project with optional image upload (multilingual support)
 * @access  Protected (Admin only)
 */
export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      titleAr,
      titleEn,
      titleTr,
      title,
      descriptionAr,
      descriptionEn,
      descriptionTr,
      description,
      liveUrl,
      githubUrl,
      tags,
      isFeatured,
      featured,
      orderIndex,
      displayOrder,
    } = req.body;

    // Normalizing multilingual title & description with legacy fallbacks
    const resolvedTitleEn = typeof titleEn === 'string' && titleEn.trim() ? titleEn.trim() : (typeof title === 'string' ? title.trim() : '');
    const resolvedTitleAr = typeof titleAr === 'string' && titleAr.trim() ? titleAr.trim() : resolvedTitleEn;
    const resolvedTitleTr = typeof titleTr === 'string' && titleTr.trim() ? titleTr.trim() : resolvedTitleEn;

    if (!resolvedTitleEn && !resolvedTitleAr && !resolvedTitleTr) {
      throw new AppError('Project title is required in at least one language (Arabic, English, or Turkish)', 400);
    }

    const resolvedDescEn = typeof descriptionEn === 'string' ? descriptionEn.trim() : (typeof description === 'string' ? description.trim() : '');
    const resolvedDescAr = typeof descriptionAr === 'string' ? descriptionAr.trim() : resolvedDescEn;
    const resolvedDescTr = typeof descriptionTr === 'string' ? descriptionTr.trim() : resolvedDescEn;

    // Determine imageUrl: uploaded file takes priority, then body imageUrl
    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.imageUrl && typeof req.body.imageUrl === 'string') {
      imageUrl = req.body.imageUrl.trim();
    }

    if (!imageUrl) {
      throw new AppError('Project image is required (upload a file or supply imageUrl)', 400);
    }

    const parsedTags = parseTags(tags);
    const featuredFlag = isFeatured === true || isFeatured === 'true' || featured === true || featured === 'true' || isFeatured === 1 || featured === 1;

    let orderNum = 0;
    if (orderIndex !== undefined) {
      orderNum = Number(orderIndex);
    } else if (displayOrder !== undefined) {
      orderNum = Number(displayOrder);
    }
    if (isNaN(orderNum)) {
      orderNum = 0;
    }

    const project = await prisma.project.create({
      data: {
        titleAr: resolvedTitleAr || resolvedTitleEn,
        titleEn: resolvedTitleEn || resolvedTitleAr,
        titleTr: resolvedTitleTr || resolvedTitleEn,
        descriptionAr: resolvedDescAr,
        descriptionEn: resolvedDescEn,
        descriptionTr: resolvedDescTr,
        imageUrl,
        liveUrl: liveUrl && typeof liveUrl === 'string' && liveUrl.trim() ? liveUrl.trim() : null,
        githubUrl: githubUrl && typeof githubUrl === 'string' && githubUrl.trim() ? githubUrl.trim() : null,
        tags: parsedTags,
        isFeatured: featuredFlag,
        orderIndex: orderNum,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    });
  } catch (error) {
    if (req.file) {
      removeLocalFile(`/uploads/${req.file.filename}`);
    }
    next(error);
  }
};

/**
 * @route   PUT /api/projects/:id
 * @desc    Update project details and optional new image
 * @access  Protected (Admin only)
 */
export const updateProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      throw new AppError('Invalid project ID parameter', 400);
    }

    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      throw new AppError('Project not found', 404);
    }

    const {
      titleAr,
      titleEn,
      titleTr,
      title,
      descriptionAr,
      descriptionEn,
      descriptionTr,
      description,
      liveUrl,
      githubUrl,
      tags,
      isFeatured,
      featured,
      orderIndex,
      displayOrder,
    } = req.body;

    interface ProjectUpdatePayload {
      titleAr?: string;
      titleEn?: string;
      titleTr?: string;
      descriptionAr?: string;
      descriptionEn?: string;
      descriptionTr?: string;
      imageUrl?: string;
      liveUrl?: string | null;
      githubUrl?: string | null;
      tags?: string[];
      isFeatured?: boolean;
      orderIndex?: number;
    }

    const updateData: ProjectUpdatePayload = {};

    if (titleAr !== undefined && typeof titleAr === 'string') updateData.titleAr = titleAr.trim();
    if (titleEn !== undefined && typeof titleEn === 'string') updateData.titleEn = titleEn.trim();
    if (titleTr !== undefined && typeof titleTr === 'string') updateData.titleTr = titleTr.trim();
    if (title !== undefined && typeof title === 'string' && !updateData.titleEn) {
      updateData.titleEn = title.trim();
    }

    if (descriptionAr !== undefined && typeof descriptionAr === 'string') updateData.descriptionAr = descriptionAr.trim();
    if (descriptionEn !== undefined && typeof descriptionEn === 'string') updateData.descriptionEn = descriptionEn.trim();
    if (descriptionTr !== undefined && typeof descriptionTr === 'string') updateData.descriptionTr = descriptionTr.trim();
    if (description !== undefined && typeof description === 'string' && !updateData.descriptionEn) {
      updateData.descriptionEn = description.trim();
    }

    if (liveUrl !== undefined) {
      updateData.liveUrl = typeof liveUrl === 'string' && liveUrl.trim() ? liveUrl.trim() : null;
    }

    if (githubUrl !== undefined) {
      updateData.githubUrl = typeof githubUrl === 'string' && githubUrl.trim() ? githubUrl.trim() : null;
    }

    if (tags !== undefined) {
      updateData.tags = parseTags(tags);
    }

    if (isFeatured !== undefined || featured !== undefined) {
      const val = isFeatured !== undefined ? isFeatured : featured;
      updateData.isFeatured = val === true || val === 'true' || val === 1 || val === '1';
    }

    const targetOrder = orderIndex !== undefined ? orderIndex : displayOrder;
    if (targetOrder !== undefined) {
      const parsedOrder = Number(targetOrder);
      if (!isNaN(parsedOrder)) {
        updateData.orderIndex = parsedOrder;
      }
    }

    // Handle new image upload
    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
      removeLocalFile(existingProject.imageUrl);
    } else if (req.body.imageUrl && typeof req.body.imageUrl === 'string') {
      updateData.imageUrl = req.body.imageUrl.trim();
    }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: updatedProject,
    });
  } catch (error) {
    if (req.file) {
      removeLocalFile(`/uploads/${req.file.filename}`);
    }
    next(error);
  }
};

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete a project and its local image asset
 * @access  Protected (Admin only)
 */
export const deleteProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      throw new AppError('Invalid project ID parameter', 400);
    }

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    removeLocalFile(project.imageUrl);

    await prisma.project.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};