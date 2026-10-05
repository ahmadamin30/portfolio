import prisma from '../../config/db';
import { WorkflowStep } from '@prisma/client';

export interface CreateWorkflowStepDto {
  stepNumber: number;
  titleAr?: string;
  titleEn: string;
  titleTr?: string;
  descriptionAr?: string;
  descriptionEn: string;
  descriptionTr?: string;
  orderIndex?: number;
}

export interface UpdateWorkflowStepDto {
  stepNumber?: number;
  titleAr?: string;
  titleEn?: string;
  titleTr?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  descriptionTr?: string;
  orderIndex?: number;
}

export const getAllSteps = async (): Promise<WorkflowStep[]> => {
  return await prisma.workflowStep.findMany({
    orderBy: [
      { orderIndex: 'asc' },
      { stepNumber: 'asc' },
      { createdAt: 'asc' },
    ],
  });
};

export const getStepById = async (id: number): Promise<WorkflowStep | null> => {
  return await prisma.workflowStep.findUnique({
    where: { id },
  });
};

export const createStep = async (data: CreateWorkflowStepDto): Promise<WorkflowStep> => {
  return await prisma.workflowStep.create({
    data: {
      stepNumber: data.stepNumber,
      titleAr: data.titleAr?.trim() ?? '',
      titleEn: data.titleEn.trim(),
      titleTr: data.titleTr?.trim() ?? '',
      descriptionAr: data.descriptionAr?.trim() ?? '',
      descriptionEn: data.descriptionEn.trim(),
      descriptionTr: data.descriptionTr?.trim() ?? '',
      orderIndex: data.orderIndex ?? 0,
    },
  });
};

export const updateStep = async (
  id: number,
  data: UpdateWorkflowStepDto
): Promise<WorkflowStep> => {
  const updateData: Partial<CreateWorkflowStepDto> = {};

  if (data.stepNumber !== undefined) updateData.stepNumber = Number(data.stepNumber);
  if (data.titleAr !== undefined) updateData.titleAr = data.titleAr.trim();
  if (data.titleEn !== undefined) updateData.titleEn = data.titleEn.trim();
  if (data.titleTr !== undefined) updateData.titleTr = data.titleTr.trim();
  if (data.descriptionAr !== undefined) updateData.descriptionAr = data.descriptionAr.trim();
  if (data.descriptionEn !== undefined) updateData.descriptionEn = data.descriptionEn.trim();
  if (data.descriptionTr !== undefined) updateData.descriptionTr = data.descriptionTr.trim();
  if (data.orderIndex !== undefined) updateData.orderIndex = Number(data.orderIndex);

  return await prisma.workflowStep.update({
    where: { id },
    data: updateData,
  });
};

export const deleteStep = async (id: number): Promise<WorkflowStep> => {
  return await prisma.workflowStep.delete({
    where: { id },
  });
};

export default {
  getAllSteps,
  getStepById,
  createStep,
  updateStep,
  deleteStep,
};
