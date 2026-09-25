import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { AppError } from '../middlewares/error.middleware';

/**
 * Interface representing incoming request payload for skill creation
 */
export interface CreateSkillDto {
  name?: string;
  category?: string;
  proficiency?: number | string;
  icon?: string;
  order?: number | string;
  displayOrder?: number | string;
}

/**
 * Interface representing incoming request payload for skill update
 */
export interface UpdateSkillDto {
  name?: string;
  category?: string;
  proficiency?: number | string;
  icon?: string;
  order?: number | string;
  displayOrder?: number | string;
}

/**
 * @route   GET /api/skills
 * @desc    Retrieve all skills, ordered by category ASC and displayOrder ASC
 *          Supports optional ?grouped=true query parameter to group by category
 * @access  Public
 */
export const getAllSkills = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { grouped } = req.query;

    const skills = await prisma.skill.findMany({
      orderBy: [
        { category: 'asc' },
        { displayOrder: 'asc' },
        { createdAt: 'asc' },
      ],
    });

    if (grouped === 'true' || grouped === '1') {
      const groupedSkills = skills.reduce<Record<string, typeof skills>>((acc, skill) => {
        if (!acc[skill.category]) {
          acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
      }, {});

      res.status(200).json({
        success: true,
        data: groupedSkills,
      });
      return;
    }

    res.status(200).json({
      success: true,
      count: skills.length,
      data: skills,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/skills/:id
 * @desc    Get single skill by ID
 * @access  Public
 */
export const getSkillById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      throw new AppError('Invalid skill ID parameter', 400);
    }

    const skill = await prisma.skill.findUnique({
      where: { id },
    });

    if (!skill) {
      throw new AppError('Skill not found', 404);
    }

    res.status(200).json({
      success: true,
      data: skill,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/skills
 * @desc    Create a new skill
 * @access  Protected (Admin only)
 */
export const createSkill = async (
  req: Request<unknown, unknown, CreateSkillDto>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, category, order, displayOrder } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      throw new AppError('Skill name is required', 400);
    }

    if (!category || typeof category !== 'string' || !category.trim()) {
      throw new AppError('Skill category is required', 400);
    }

    // Determine order: support either 'displayOrder' or 'order'
    let orderNum = 0;
    if (displayOrder !== undefined) {
      orderNum = Number(displayOrder);
    } else if (order !== undefined) {
      orderNum = Number(order);
    }
    if (isNaN(orderNum)) {
      orderNum = 0;
    }

    const newSkill = await prisma.skill.create({
      data: {
        name: name.trim(),
        category: category.trim(),
        displayOrder: orderNum,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Skill created successfully',
      data: newSkill,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/skills/:id
 * @desc    Update existing skill details
 * @access  Protected (Admin only)
 */
export const updateSkill = async (
  req: Request<{ id: string }, unknown, UpdateSkillDto>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      throw new AppError('Invalid skill ID parameter', 400);
    }

    const existingSkill = await prisma.skill.findUnique({
      where: { id },
    });

    if (!existingSkill) {
      throw new AppError('Skill not found', 404);
    }

    const { name, category, order, displayOrder } = req.body;

    interface SkillUpdateData {
      name?: string;
      category?: string;
      displayOrder?: number;
    }

    const updateData: SkillUpdateData = {};

    if (name !== undefined) {
      if (typeof name !== 'string' || !name.trim()) {
        throw new AppError('Skill name cannot be empty', 400);
      }
      updateData.name = name.trim();
    }

    if (category !== undefined) {
      if (typeof category !== 'string' || !category.trim()) {
        throw new AppError('Skill category cannot be empty', 400);
      }
      updateData.category = category.trim();
    }

    const targetOrder = displayOrder !== undefined ? displayOrder : order;
    if (targetOrder !== undefined) {
      const parsedOrder = Number(targetOrder);
      if (!isNaN(parsedOrder)) {
        updateData.displayOrder = parsedOrder;
      }
    }

    const updatedSkill = await prisma.skill.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json({
      success: true,
      message: 'Skill updated successfully',
      data: updatedSkill,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/skills/:id
 * @desc    Delete a skill record by ID
 * @access  Protected (Admin only)
 */
export const deleteSkill = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      throw new AppError('Invalid skill ID parameter', 400);
    }

    const existingSkill = await prisma.skill.findUnique({
      where: { id },
    });

    if (!existingSkill) {
      throw new AppError('Skill not found', 404);
    }

    await prisma.skill.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Skill deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
