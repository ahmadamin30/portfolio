export interface WorkflowStep {
  id: number;
  stepNumber: number;
  titleAr: string;
  titleEn: string;
  titleTr: string;
  descriptionAr: string;
  descriptionEn: string;
  descriptionTr: string;
  orderIndex: number;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateWorkflowStepInput = Omit<WorkflowStep, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateWorkflowStepInput = Partial<CreateWorkflowStepInput>;
