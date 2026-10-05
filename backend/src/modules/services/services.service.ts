import prisma from '../../config/db';
import { Service } from '@prisma/client';

export interface CreateServiceDto {
  serviceNumber?: string;
  titleAr?: string;
  titleEn: string;
  titleTr?: string;
  descriptionAr?: string;
  descriptionEn: string;
  descriptionTr?: string;
  icon?: string | null;
  isActive?: boolean;
  orderIndex?: number;
}

export interface UpdateServiceDto {
  serviceNumber?: string;
  titleAr?: string;
  titleEn?: string;
  titleTr?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  descriptionTr?: string;
  icon?: string | null;
  isActive?: boolean;
  orderIndex?: number;
}

export const getAllServices = async (activeOnly = false): Promise<Service[]> => {
  return await prisma.service.findMany({
    where: activeOnly ? { isActive: true } : undefined,
    orderBy: [
      { orderIndex: 'asc' },
      { createdAt: 'asc' },
    ],
  });
};

export const getServiceById = async (id: number): Promise<Service | null> => {
  return await prisma.service.findUnique({
    where: { id },
  });
};

export const createService = async (data: CreateServiceDto): Promise<Service> => {
  return await prisma.service.create({
    data: {
      serviceNumber: data.serviceNumber?.trim() ?? '',
      titleAr: data.titleAr?.trim() ?? '',
      titleEn: data.titleEn.trim(),
      titleTr: data.titleTr?.trim() ?? '',
      descriptionAr: data.descriptionAr?.trim() ?? '',
      descriptionEn: data.descriptionEn.trim(),
      descriptionTr: data.descriptionTr?.trim() ?? '',
      icon: data.icon ?? null,
      isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
      orderIndex: data.orderIndex !== undefined ? Number(data.orderIndex) : 0,
    },
  });
};

export const updateService = async (
  id: number,
  data: UpdateServiceDto
): Promise<Service> => {
  const updateData: Partial<CreateServiceDto> = {};

  if (data.serviceNumber !== undefined) updateData.serviceNumber = data.serviceNumber.trim();
  if (data.titleAr !== undefined) updateData.titleAr = data.titleAr.trim();
  if (data.titleEn !== undefined) updateData.titleEn = data.titleEn.trim();
  if (data.titleTr !== undefined) updateData.titleTr = data.titleTr.trim();
  if (data.descriptionAr !== undefined) updateData.descriptionAr = data.descriptionAr.trim();
  if (data.descriptionEn !== undefined) updateData.descriptionEn = data.descriptionEn.trim();
  if (data.descriptionTr !== undefined) updateData.descriptionTr = data.descriptionTr.trim();
  if (data.icon !== undefined) updateData.icon = data.icon;
  if (data.isActive !== undefined) updateData.isActive = Boolean(data.isActive);
  if (data.orderIndex !== undefined) updateData.orderIndex = Number(data.orderIndex);

  return await prisma.service.update({
    where: { id },
    data: updateData,
  });
};

export const deleteService = async (id: number): Promise<Service> => {
  return await prisma.service.delete({
    where: { id },
  });
};

export default {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
