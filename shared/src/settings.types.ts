export interface SiteSettings {
  id: number;
  primaryColor: string;
  fontFamily: string;
  headingFontFamily: string;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  resumeUrl?: string | null;
  avatarUrl?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  emailContact?: string | null;

  fullNameAr: string;
  fullNameEn: string;
  fullNameTr: string;

  jobTitleAr: string;
  jobTitleEn: string;
  jobTitleTr: string;

  bioAr: string;
  bioEn: string;
  bioTr: string;

  aboutTextAr: string;
  aboutTextEn: string;
  aboutTextTr: string;

  updatedAt?: string;
}

export type UpdateSettingsInput = Partial<Omit<SiteSettings, 'id' | 'updatedAt'>>;