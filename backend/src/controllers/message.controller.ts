import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { AppError } from '../middlewares/error.middleware';

/**
 * Interface representing incoming contact message payload
 */
export interface CreateMessageDto {
  name?: string;
  senderName?: string;
  email?: string;
  senderEmail?: string;
  subject?: string;
  message?: string;
  messageBody?: string;
}

/**
 * @route   POST /api/messages
 * @desc    Submit a contact form message
 * @access  Public
 */
export const createMessage = async (
  req: Request<unknown, unknown, CreateMessageDto>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Accommodate both standard contact form field names and Prisma column names
    const senderName = req.body.senderName || req.body.name;
    const senderEmail = req.body.senderEmail || req.body.email;
    const messageBody = req.body.messageBody || req.body.message;
    const subject = req.body.subject;

    if (!senderName || typeof senderName !== 'string' || !senderName.trim()) {
      throw new AppError('Name is required', 400);
    }

    if (!senderEmail || typeof senderEmail !== 'string' || !senderEmail.trim()) {
      throw new AppError('Email address is required', 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmedEmail = senderEmail.trim().toLowerCase();
    if (!emailRegex.test(trimmedEmail)) {
      throw new AppError('Please provide a valid email address', 400);
    }

    if (!messageBody || typeof messageBody !== 'string' || !messageBody.trim()) {
      throw new AppError('Message content is required', 400);
    }

    const newMessage = await prisma.message.create({
      data: {
        senderName: senderName.trim(),
        senderEmail: trimmedEmail,
        subject: subject && typeof subject === 'string' && subject.trim() ? subject.trim() : null,
        messageBody: messageBody.trim(),
        isRead: false,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Your message has been sent successfully.',
      data: newMessage,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/messages
 * @desc    Fetch all contact messages ordered by createdAt DESC
 * @access  Protected (Admin only)
 */
export const getAllMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { unreadOnly, isRead } = req.query;

    interface MessageWhereFilter {
      isRead?: boolean;
    }

    const where: MessageWhereFilter = {};
    if (unreadOnly === 'true' || unreadOnly === '1') {
      where.isRead = false;
    } else if (isRead !== undefined) {
      where.isRead = isRead === 'true' || isRead === '1';
    }

    const messages = await prisma.message.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const unreadCount = await prisma.message.count({
      where: { isRead: false },
    });

    res.status(200).json({
      success: true,
      count: messages.length,
      unreadCount,
      data: messages,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/messages/:id
 * @desc    Fetch single contact message by ID
 * @access  Protected (Admin only)
 */
export const getMessageById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      throw new AppError('Invalid message ID parameter', 400);
    }

    const message = await prisma.message.findUnique({
      where: { id },
    });

    if (!message) {
      throw new AppError('Message not found', 404);
    }

    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/messages/:id/read
 * @route   PUT /api/messages/:id/read
 * @desc    Mark a specific message as read
 * @access  Protected (Admin only)
 */
export const markMessageAsRead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      throw new AppError('Invalid message ID parameter', 400);
    }

    const existingMessage = await prisma.message.findUnique({
      where: { id },
    });

    if (!existingMessage) {
      throw new AppError('Message not found', 404);
    }

    const updatedMessage = await prisma.message.update({
      where: { id },
      data: { isRead: true },
    });

    res.status(200).json({
      success: true,
      message: 'Message marked as read',
      data: updatedMessage,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/messages/:id
 * @desc    Delete a contact message by ID
 * @access  Protected (Admin only)
 */
export const deleteMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      throw new AppError('Invalid message ID parameter', 400);
    }

    const existingMessage = await prisma.message.findUnique({
      where: { id },
    });

    if (!existingMessage) {
      throw new AppError('Message not found', 404);
    }

    await prisma.message.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
