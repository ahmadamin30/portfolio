export interface TranslationKey {
  id: number;
  key: string;
  valueAr: string;
  valueEn: string;
  valueTr: string;
  category: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateTranslationInput = Omit<TranslationKey, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTranslationInput = Partial<CreateTranslationInput>;
export type BulkImportTranslationInput = CreateTranslationInput[];
