import prisma from '../../config/db';
import { SocialLink } from '@prisma/client';

export interface CreateSocialLinkDto {
  platform: string;
  url: string;
  orderIndex?: number;
}

export interface UpdateSocialLinkDto {
  platform?: string;
  url?: string;
  orderIndex?: number;
}

export const getAllSocialLinks = async (): Promise<SocialLink[]> => {
  return await prisma.socialLink.findMany({
    orderBy: [
      { orderIndex: 'asc' },
      { createdAt: 'asc' },
    ],
  });
};

export const getSocialLinkById = async (id: number): Promise<SocialLink | null> => {
  return await prisma.socialLink.findUnique({
    where: { id },
  });
};

export const createSocialLink = async (data: CreateSocialLinkDto): Promise<SocialLink> => {
  return await prisma.socialLink.create({
    data: {
      platform: data.platform.trim(),
      url: data.url.trim(),
      orderIndex: data.orderIndex !== undefined ? Number(data.orderIndex) : 0,
    },
  });
};

export const updateSocialLink = async (
  id: number,
  data: UpdateSocialLinkDto
): Promise<SocialLink> => {
  const updateData: Partial<CreateSocialLinkDto> = {};

  if (data.platform !== undefined) updateData.platform = data.platform.trim();
  if (data.url !== undefined) updateData.url = data.url.trim();
  if (data.orderIndex !== undefined) updateData.orderIndex = Number(data.orderIndex);

  return await prisma.socialLink.update({
    where: { id },
    data: updateData,
  });
};

export const deleteSocialLink = async (id: number): Promise<SocialLink> => {
  return await prisma.socialLink.delete({
    where: { id },
  });
};

export default {
  getAllSocialLinks,
  getSocialLinkById,
  createSocialLink,
  updateSocialLink,
  deleteSocialLink,
};
