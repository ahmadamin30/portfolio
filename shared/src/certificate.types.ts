export interface Certificate {
  id: number;
  titleAr: string;
  titleEn: string;
  titleTr: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string | null;
  imageUrl?: string | null;
  orderIndex: number;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateCertificateInput = Omit<Certificate, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateCertificateInput = Partial<CreateCertificateInput>;
