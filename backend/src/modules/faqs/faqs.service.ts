import prisma from '../../config/db';
import { Faq } from '@prisma/client';

export interface CreateFaqDto {
  category?: string;
  questionAr?: string;
  questionEn: string;
  questionTr?: string;
  answerAr?: string;
  answerEn: string;
  answerTr?: string;
  isPublished?: boolean;
  orderIndex?: number;
}

export interface UpdateFaqDto {
  category?: string;
  questionAr?: string;
  questionEn?: string;
  questionTr?: string;
  answerAr?: string;
  answerEn?: string;
  answerTr?: string;
  isPublished?: boolean;
  orderIndex?: number;
}

export interface FaqFilterOptions {
  category?: string;
  publishedOnly?: boolean;
}

export const getAllFaqs = async (options?: FaqFilterOptions): Promise<Faq[]> => {
  return await prisma.faq.findMany({
    where: {
      ...(options?.category ? { category: options.category } : {}),
      ...(options?.publishedOnly ? { isPublished: true } : {}),
    },
    orderBy: [
      { orderIndex: 'asc' },
      { createdAt: 'asc' },
    ],
  });
};

export const getFaqById = async (id: number): Promise<Faq | null> => {
  return await prisma.faq.findUnique({
    where: { id },
  });
};

export const createFaq = async (data: CreateFaqDto): Promise<Faq> => {
  return await prisma.faq.create({
    data: {
      category: data.category?.trim() || 'Services & Scope',
      questionAr: data.questionAr?.trim() ?? '',
      questionEn: data.questionEn.trim(),
      questionTr: data.questionTr?.trim() ?? '',
      answerAr: data.answerAr?.trim() ?? '',
      answerEn: data.answerEn.trim(),
      answerTr: data.answerTr?.trim() ?? '',
      isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
      orderIndex: data.orderIndex !== undefined ? Number(data.orderIndex) : 0,
    },
  });
};

export const updateFaq = async (
  id: number,
  data: UpdateFaqDto
): Promise<Faq> => {
  const updateData: Partial<CreateFaqDto> = {};

  if (data.category !== undefined) updateData.category = data.category.trim();
  if (data.questionAr !== undefined) updateData.questionAr = data.questionAr.trim();
  if (data.questionEn !== undefined) updateData.questionEn = data.questionEn.trim();
  if (data.questionTr !== undefined) updateData.questionTr = data.questionTr.trim();
  if (data.answerAr !== undefined) updateData.answerAr = data.answerAr.trim();
  if (data.answerEn !== undefined) updateData.answerEn = data.answerEn.trim();
  if (data.answerTr !== undefined) updateData.answerTr = data.answerTr.trim();
  if (data.isPublished !== undefined) updateData.isPublished = Boolean(data.isPublished);
  if (data.orderIndex !== undefined) updateData.orderIndex = Number(data.orderIndex);

  return await prisma.faq.update({
    where: { id },
    data: updateData,
  });
};

export const deleteFaq = async (id: number): Promise<Faq> => {
  return await prisma.faq.delete({
    where: { id },
  });
};

export default {
  getAllFaqs,
  getFaqById,
  createFaq,
  updateFaq,
  deleteFaq,
};
