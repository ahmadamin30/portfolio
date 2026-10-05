export interface SocialLink {
  id: number;
  platform: string;
  url: string;
  orderIndex: number;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateSocialLinkInput = Omit<SocialLink, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateSocialLinkInput = Partial<CreateSocialLinkInput>;
