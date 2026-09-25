import { Router } from 'express';
import {
  getAllSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
} from '../controllers/skill.controller';
import { authenticate as authenticateAdmin } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @route   GET /api/skills
 * @desc    Get all skills (ordered by category and displayOrder ASC)
 * @access  Public
 */
router.get('/', getAllSkills);

/**
 * @route   GET /api/skills/:id
 * @desc    Get single skill by ID
 * @access  Public
 */
router.get('/:id', getSkillById);

/**
 * @route   POST /api/skills
 * @desc    Create a new skill
 * @access  Protected (Admin only)
 */
router.post('/', authenticateAdmin, createSkill);

/**
 * @route   PUT /api/skills/:id
 * @desc    Update existing skill details
 * @access  Protected (Admin only)
 */
router.put('/:id', authenticateAdmin, updateSkill);

/**
 * @route   DELETE /api/skills/:id
 * @desc    Delete a skill record by ID
 * @access  Protected (Admin only)
 */
router.delete('/:id', authenticateAdmin, deleteSkill);

export default router;
