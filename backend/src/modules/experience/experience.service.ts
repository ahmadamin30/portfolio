import prisma from '../../config/db';
import { Experience } from '@prisma/client';

export type ExperienceType = 'EDUCATION' | 'WORK' | 'MILESTONE' | string;

export interface CreateExperienceDto {
  type: ExperienceType;
  degreeOrRoleAr?: string;
  degreeOrRoleEn: string;
  degreeOrRoleTr?: string;
  institutionOrCompanyAr?: string;
  institutionOrCompanyEn: string;
  institutionOrCompanyTr?: string;
  startDate: string;
  endDate?: string | null;
  locationAr?: string;
  locationEn?: string;
  locationTr?: string;
  icon?: string | null;
  nodeColor?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  descriptionTr?: string;
  orderIndex?: number;
}

export interface UpdateExperienceDto {
  type?: ExperienceType;
  degreeOrRoleAr?: string;
  degreeOrRoleEn?: string;
  degreeOrRoleTr?: string;
  institutionOrCompanyAr?: string;
  institutionOrCompanyEn?: string;
  institutionOrCompanyTr?: string;
  startDate?: string;
  endDate?: string | null;
  locationAr?: string;
  locationEn?: string;
  locationTr?: string;
  icon?: string | null;
  nodeColor?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  descriptionTr?: string;
  orderIndex?: number;
}

export const getAllExperiences = async (typeFilter?: string): Promise<Experience[]> => {
  return await prisma.experience.findMany({
    where: typeFilter ? { type: typeFilter.toUpperCase() } : undefined,
    orderBy: [
      { orderIndex: 'asc' },
      { createdAt: 'desc' },
    ],
  });
};

export const getExperienceById = async (id: number): Promise<Experience | null> => {
  return await prisma.experience.findUnique({
    where: { id },
  });
};

export const createExperience = async (data: CreateExperienceDto): Promise<Experience> => {
  return await prisma.experience.create({
    data: {
      type: data.type.toUpperCase(),
      degreeOrRoleAr: data.degreeOrRoleAr?.trim() ?? '',
      degreeOrRoleEn: data.degreeOrRoleEn.trim(),
      degreeOrRoleTr: data.degreeOrRoleTr?.trim() ?? '',
      institutionOrCompanyAr: data.institutionOrCompanyAr?.trim() ?? '',
      institutionOrCompanyEn: data.institutionOrCompanyEn.trim(),
      institutionOrCompanyTr: data.institutionOrCompanyTr?.trim() ?? '',
      startDate: data.startDate.trim(),
      endDate: data.endDate ? data.endDate.trim() : null,
      locationAr: data.locationAr?.trim() ?? '',
      locationEn: data.locationEn?.trim() ?? '',
      locationTr: data.locationTr?.trim() ?? '',
      icon: data.icon ?? null,
      nodeColor: data.nodeColor?.trim() || '#3B82F6',
      descriptionAr: data.descriptionAr?.trim() ?? '',
      descriptionEn: data.descriptionEn?.trim() ?? '',
      descriptionTr: data.descriptionTr?.trim() ?? '',
      orderIndex: data.orderIndex !== undefined ? Number(data.orderIndex) : 0,
    },
  });
};

export const updateExperience = async (
  id: number,
  data: UpdateExperienceDto
): Promise<Experience> => {
  const updateData: Partial<CreateExperienceDto> = {};

  if (data.type !== undefined) updateData.type = data.type.toUpperCase();
  if (data.degreeOrRoleAr !== undefined) updateData.degreeOrRoleAr = data.degreeOrRoleAr.trim();
  if (data.degreeOrRoleEn !== undefined) updateData.degreeOrRoleEn = data.degreeOrRoleEn.trim();
  if (data.degreeOrRoleTr !== undefined) updateData.degreeOrRoleTr = data.degreeOrRoleTr.trim();
  if (data.institutionOrCompanyAr !== undefined) updateData.institutionOrCompanyAr = data.institutionOrCompanyAr.trim();
  if (data.institutionOrCompanyEn !== undefined) updateData.institutionOrCompanyEn = data.institutionOrCompanyEn.trim();
  if (data.institutionOrCompanyTr !== undefined) updateData.institutionOrCompanyTr = data.institutionOrCompanyTr.trim();
  if (data.startDate !== undefined) updateData.startDate = data.startDate.trim();
  if (data.endDate !== undefined) updateData.endDate = data.endDate ? data.endDate.trim() : null;
  if (data.locationAr !== undefined) updateData.locationAr = data.locationAr.trim();
  if (data.locationEn !== undefined) updateData.locationEn = data.locationEn.trim();
  if (data.locationTr !== undefined) updateData.locationTr = data.locationTr.trim();
  if (data.icon !== undefined) updateData.icon = data.icon;
  if (data.nodeColor !== undefined) updateData.nodeColor = data.nodeColor.trim();
  if (data.descriptionAr !== undefined) updateData.descriptionAr = data.descriptionAr.trim();
  if (data.descriptionEn !== undefined) updateData.descriptionEn = data.descriptionEn.trim();
  if (data.descriptionTr !== undefined) updateData.descriptionTr = data.descriptionTr.trim();
  if (data.orderIndex !== undefined) updateData.orderIndex = Number(data.orderIndex);

  return await prisma.experience.update({
    where: { id },
    data: updateData,
  });
};

export const deleteExperience = async (id: number): Promise<Experience> => {
  return await prisma.experience.delete({
    where: { id },
  });
};

export default {
  getAllExperiences,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
};
