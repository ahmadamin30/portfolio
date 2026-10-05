export type ExperienceType = 'EDUCATION' | 'WORK' | 'MILESTONE' | string;

export interface Experience {
  id: number;
  type: ExperienceType;
  degreeOrRoleAr: string;
  degreeOrRoleEn: string;
  degreeOrRoleTr: string;
  institutionOrCompanyAr: string;
  institutionOrCompanyEn: string;
  institutionOrCompanyTr: string;
  startDate: string;
  endDate?: string | null;
  locationAr: string;
  locationEn: string;
  locationTr: string;
  icon?: string | null;
  nodeColor: string;
  descriptionAr: string;
  descriptionEn: string;
  descriptionTr: string;
  orderIndex: number;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateExperienceInput = Omit<Experience, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateExperienceInput = Partial<CreateExperienceInput>;
