export interface Faq {
  id: number;
  category: string;
  questionAr: string;
  questionEn: string;
  questionTr: string;
  answerAr: string;
  answerEn: string;
  answerTr: string;
  isPublished: boolean;
  orderIndex: number;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateFaqInput = Omit<Faq, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateFaqInput = Partial<CreateFaqInput>;
