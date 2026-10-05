import prisma from '../../config/db';
import { TranslationKey } from '@prisma/client';

export interface CreateTranslationDto {
  key: string;
  valueAr?: string;
  valueEn: string;
  valueTr?: string;
  category?: string;
}

export interface UpdateTranslationDto {
  key?: string;
  valueAr?: string;
  valueEn?: string;
  valueTr?: string;
  category?: string;
}

export interface BulkImportTranslationItem {
  key: string;
  valueAr?: string;
  valueEn?: string;
  valueTr?: string;
  category?: string;
}

export const getAllTranslations = async (categoryFilter?: string): Promise<TranslationKey[]> => {
  return await prisma.translationKey.findMany({
    where: categoryFilter ? { category: categoryFilter } : undefined,
    orderBy: [
      { category: 'asc' },
      { key: 'asc' },
    ],
  });
};

export const getTranslationById = async (id: number): Promise<TranslationKey | null> => {
  return await prisma.translationKey.findUnique({
    where: { id },
  });
};

export const getTranslationByKey = async (key: string): Promise<TranslationKey | null> => {
  return await prisma.translationKey.findUnique({
    where: { key },
  });
};

export const createTranslation = async (data: CreateTranslationDto): Promise<TranslationKey> => {
  return await prisma.translationKey.create({
    data: {
      key: data.key.trim(),
      valueAr: data.valueAr?.trim() ?? '',
      valueEn: data.valueEn.trim(),
      valueTr: data.valueTr?.trim() ?? '',
      category: data.category?.trim() || 'general',
    },
  });
};

export const updateTranslation = async (
  id: number,
  data: UpdateTranslationDto
): Promise<TranslationKey> => {
  const updateData: Partial<CreateTranslationDto> = {};

  if (data.key !== undefined) updateData.key = data.key.trim();
  if (data.valueAr !== undefined) updateData.valueAr = data.valueAr.trim();
  if (data.valueEn !== undefined) updateData.valueEn = data.valueEn.trim();
  if (data.valueTr !== undefined) updateData.valueTr = data.valueTr.trim();
  if (data.category !== undefined) updateData.category = data.category.trim();

  return await prisma.translationKey.update({
    where: { id },
    data: updateData,
  });
};

export const deleteTranslation = async (id: number): Promise<TranslationKey> => {
  return await prisma.translationKey.delete({
    where: { id },
  });
};

export interface BulkImportResult {
  totalReceived: number;
  importedCount: number;
  errors: Array<{ key: string; reason: string }>;
}

export const bulkImport = async (
  items: BulkImportTranslationItem[]
): Promise<BulkImportResult> => {
  const result: BulkImportResult = {
    totalReceived: items.length,
    importedCount: 0,
    errors: [],
  };

  for (const item of items) {
    if (!item.key || typeof item.key !== 'string' || !item.key.trim()) {
      result.errors.push({ key: String(item.key), reason: 'Missing or invalid key' });
      continue;
    }

    const cleanKey = item.key.trim();
    const cleanAr = item.valueAr ? item.valueAr.trim() : '';
    const cleanEn = item.valueEn ? item.valueEn.trim() : '';
    const cleanTr = item.valueTr ? item.valueTr.trim() : '';
    const cleanCategory = item.category ? item.category.trim() : 'general';

    try {
      await prisma.translationKey.upsert({
        where: { key: cleanKey },
        update: {
          ...(item.valueAr !== undefined ? { valueAr: cleanAr } : {}),
          ...(item.valueEn !== undefined ? { valueEn: cleanEn } : {}),
          ...(item.valueTr !== undefined ? { valueTr: cleanTr } : {}),
          ...(item.category !== undefined ? { category: cleanCategory } : {}),
        },
        create: {
          key: cleanKey,
          valueAr: cleanAr,
          valueEn: cleanEn,
          valueTr: cleanTr,
          category: cleanCategory,
        },
      });
      result.importedCount++;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown database error';
      result.errors.push({ key: cleanKey, reason: message });
    }
  }

  return result;
};

export const exportTranslations = async (
  lang?: 'ar' | 'en' | 'tr'
): Promise<Record<string, unknown>> => {
  const all = await prisma.translationKey.findMany({
    orderBy: { key: 'asc' },
  });

  if (lang) {
    const singleLangMap: Record<string, string> = {};
    for (const item of all) {
      if (lang === 'ar') singleLangMap[item.key] = item.valueAr;
      else if (lang === 'tr') singleLangMap[item.key] = item.valueTr;
      else singleLangMap[item.key] = item.valueEn;
    }
    return singleLangMap;
  }

  const fullMap: Record<string, { ar: string; en: string; tr: string; category: string }> = {};
  for (const item of all) {
    fullMap[item.key] = {
      ar: item.valueAr,
      en: item.valueEn,
      tr: item.valueTr,
      category: item.category,
    };
  }
  return fullMap;
};

export default {
  getAllTranslations,
  getTranslationById,
  getTranslationByKey,
  createTranslation,
  updateTranslation,
  deleteTranslation,
  bulkImport,
  exportTranslations,
};
