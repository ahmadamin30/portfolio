import prisma from '../../config/db';
import { Certificate } from '@prisma/client';

export interface CreateCertificateDto {
  titleAr?: string;
  titleEn: string;
  titleTr?: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string | null;
  imageUrl?: string | null;
  orderIndex?: number;
}

export interface UpdateCertificateDto {
  titleAr?: string;
  titleEn?: string;
  titleTr?: string;
  issuer?: string;
  issueDate?: string;
  credentialUrl?: string | null;
  imageUrl?: string | null;
  orderIndex?: number;
}

export const getAllCertificates = async (): Promise<Certificate[]> => {
  return await prisma.certificate.findMany({
    orderBy: [
      { orderIndex: 'asc' },
      { createdAt: 'desc' },
    ],
  });
};

export const getCertificateById = async (id: number): Promise<Certificate | null> => {
  return await prisma.certificate.findUnique({
    where: { id },
  });
};

export const createCertificate = async (data: CreateCertificateDto): Promise<Certificate> => {
  return await prisma.certificate.create({
    data: {
      titleAr: data.titleAr?.trim() ?? '',
      titleEn: data.titleEn.trim(),
      titleTr: data.titleTr?.trim() ?? '',
      issuer: data.issuer.trim(),
      issueDate: data.issueDate.trim(),
      credentialUrl: data.credentialUrl ? data.credentialUrl.trim() : null,
      imageUrl: data.imageUrl ? data.imageUrl.trim() : null,
      orderIndex: data.orderIndex !== undefined ? Number(data.orderIndex) : 0,
    },
  });
};

export const updateCertificate = async (
  id: number,
  data: UpdateCertificateDto
): Promise<Certificate> => {
  const updateData: Partial<CreateCertificateDto> = {};

  if (data.titleAr !== undefined) updateData.titleAr = data.titleAr.trim();
  if (data.titleEn !== undefined) updateData.titleEn = data.titleEn.trim();
  if (data.titleTr !== undefined) updateData.titleTr = data.titleTr.trim();
  if (data.issuer !== undefined) updateData.issuer = data.issuer.trim();
  if (data.issueDate !== undefined) updateData.issueDate = data.issueDate.trim();
  if (data.credentialUrl !== undefined) updateData.credentialUrl = data.credentialUrl ? data.credentialUrl.trim() : null;
  if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl ? data.imageUrl.trim() : null;
  if (data.orderIndex !== undefined) updateData.orderIndex = Number(data.orderIndex);

  return await prisma.certificate.update({
    where: { id },
    data: updateData,
  });
};

export const deleteCertificate = async (id: number): Promise<Certificate> => {
  return await prisma.certificate.delete({
    where: { id },
  });
};

export default {
  getAllCertificates,
  getCertificateById,
  createCertificate,
  updateCertificate,
  deleteCertificate,
};
