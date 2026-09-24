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
 * @desc    Get all projects (ordered by displayOrder ASC, createdAt DESC)
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
        { displayOrder: 'asc' },
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
    if (isNaN(id)) {
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
 * @desc    Create a new project with optional image upload
 * @access  Protected (Admin only)
 */
export const createProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, description, liveUrl, githubUrl, tags, featured, displayOrder } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      throw new AppError('Project title is required', 400);
    }

    if (!description || typeof description !== 'string' || !description.trim()) {
      throw new AppError('Project description is required', 400);
    }

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
    const isFeatured = featured === true || featured === 'true' || featured === '1' || featured === 1;
    const orderNumber = displayOrder !== undefined ? Number(displayOrder) || 0 : 0;

    const project = await prisma.project.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        imageUrl,
        liveUrl: liveUrl && typeof liveUrl === 'string' && liveUrl.trim() ? liveUrl.trim() : null,
        githubUrl: githubUrl && typeof githubUrl === 'string' && githubUrl.trim() ? githubUrl.trim() : null,
        tags: parsedTags,
        featured: isFeatured,
        displayOrder: orderNumber,
      },
    });

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    // Clean up uploaded file if database insert failed
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
    if (isNaN(id)) {
      throw new AppError('Invalid project ID parameter', 400);
    }

    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      throw new AppError('Project not found', 404);
    }

    const { title, description, liveUrl, githubUrl, tags, featured, displayOrder } = req.body;

    interface ProjectUpdatePayload {
      title?: string;
      description?: string;
      imageUrl?: string;
      liveUrl?: string | null;
      githubUrl?: string | null;
      tags?: string[];
      featured?: boolean;
      displayOrder?: number;
    }

    const updateData: ProjectUpdatePayload = {};

    if (title !== undefined && typeof title === 'string') {
      updateData.title = title.trim();
    }

    if (description !== undefined && typeof description === 'string') {
      updateData.description = description.trim();
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

    if (featured !== undefined) {
      updateData.featured = featured === true || featured === 'true' || featured === '1' || featured === 1;
    }

    if (displayOrder !== undefined) {
      updateData.displayOrder = Number(displayOrder) || 0;
    }

    // Handle new image upload
    if (req.file) {
      updateData.imageUrl = `/uploads/${req.file.filename}`;
      // Remove old local image file
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
    if (isNaN(id)) {
      throw new AppError('Invalid project ID parameter', 400);
    }

    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    // Remove local uploaded asset if applicable
    removeLocalFile(project.imageUrl);

    // Delete record from database
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
