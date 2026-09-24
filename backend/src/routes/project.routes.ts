import { Router } from 'express';
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/project.controller';
import { authenticate as authenticateAdmin } from '../middlewares/auth.middleware';
import { uploadProjectImage } from '../middlewares/upload.middleware';

const router = Router();

/**
 * @route   GET /api/projects
 * @desc    Get all projects
 * @access  Public
 */
router.get('/', getAllProjects);

/**
 * @route   GET /api/projects/:id
 * @desc    Get single project by ID
 * @access  Public
 */
router.get('/:id', getProjectById);

/**
 * @route   POST /api/projects
 * @desc    Create a new project with image upload
 * @access  Protected (Admin only)
 */
router.post('/', authenticateAdmin, uploadProjectImage, createProject);

/**
 * @route   PUT /api/projects/:id
 * @desc    Update an existing project with optional image upload
 * @access  Protected (Admin only)
 */
router.put('/:id', authenticateAdmin, uploadProjectImage, updateProject);

/**
 * @route   DELETE /api/projects/:id
 * @desc    Delete a project and its image asset
 * @access  Protected (Admin only)
 */
router.delete('/:id', authenticateAdmin, deleteProject);

export default router;
