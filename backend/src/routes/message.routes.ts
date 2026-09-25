import { Router } from 'express';
import {
  createMessage,
  getAllMessages,
  getMessageById,
  markMessageAsRead,
  deleteMessage,
} from '../controllers/message.controller';
import { authenticate as authenticateAdmin } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @route   POST /api/messages
 * @desc    Submit contact form
 * @access  Public
 */
router.post('/', createMessage);

/**
 * @route   GET /api/messages
 * @desc    Fetch all contact messages
 * @access  Protected (Admin only)
 */
router.get('/', authenticateAdmin, getAllMessages);

/**
 * @route   GET /api/messages/:id
 * @desc    Fetch single contact message by ID
 * @access  Protected (Admin only)
 */
router.get('/:id', authenticateAdmin, getMessageById);

/**
 * @route   PATCH /api/messages/:id/read
 * @desc    Mark a specific message as read
 * @access  Protected (Admin only)
 */
router.patch('/:id/read', authenticateAdmin, markMessageAsRead);

/**
 * @route   PUT /api/messages/:id/read
 * @desc    Mark a specific message as read (compat route)
 * @access  Protected (Admin only)
 */
router.put('/:id/read', authenticateAdmin, markMessageAsRead);

/**
 * @route   DELETE /api/messages/:id
 * @desc    Delete a contact message by ID
 * @access  Protected (Admin only)
 */
router.delete('/:id', authenticateAdmin, deleteMessage);

export default router;
