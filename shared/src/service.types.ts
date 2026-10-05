export interface Service {
  id: number;
  serviceNumber: string;
  titleAr: string;
  titleEn: string;
  titleTr: string;
  descriptionAr: string;
  descriptionEn: string;
  descriptionTr: string;
  icon?: string | null;
  isActive: boolean;
  orderIndex: number;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateServiceInput = Omit<Service, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateServiceInput = Partial<CreateServiceInput>;
