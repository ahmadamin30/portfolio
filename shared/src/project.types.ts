export interface Project {
  id: number;
  titleAr: string;
  titleEn: string;
  titleTr: string;
  descriptionAr: string;
  descriptionEn: string;
  descriptionTr: string;
  imageUrl: string;
  liveUrl?: string | null;
  githubUrl?: string | null;
  tags: string[];
  isFeatured: boolean;
  orderIndex: number;
  createdAt?: string;
  updatedAt?: string;

  // Optional legacy fields for backwards compatibility
  title?: string;
  description?: string;
  featured?: boolean;
  displayOrder?: number;
}

export type CreateProjectInput = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>;