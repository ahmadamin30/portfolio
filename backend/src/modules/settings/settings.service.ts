import prisma from '../../config/db';
import { SiteSettings } from '@prisma/client';

export interface UpdateSettingsDto {
  primaryColor?: string;
  fontFamily?: string;
  headingFontFamily?: string;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  resumeUrl?: string | null;
  avatarUrl?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  emailContact?: string | null;

  fullNameAr?: string;
  fullNameEn?: string;
  fullNameTr?: string;

  jobTitleAr?: string;
  jobTitleEn?: string;
  jobTitleTr?: string;

  bioAr?: string;
  bioEn?: string;
  bioTr?: string;

  aboutTextAr?: string;
  aboutTextEn?: string;
  aboutTextTr?: string;
}

export const DEFAULT_SITE_SETTINGS = {
  id: 1,
  primaryColor: '#3B82F6',
  fontFamily: 'Inter',
  headingFontFamily: 'Inter',
  logoUrl: null,
  faviconUrl: null,
  resumeUrl: null,
  avatarUrl: null,
  githubUrl: null,
  linkedinUrl: null,
  twitterUrl: null,
  emailContact: null,
  fullNameAr: '',
  fullNameEn: '',
  fullNameTr: '',
  jobTitleAr: '',
  jobTitleEn: '',
  jobTitleTr: '',
  bioAr: '',
  bioEn: '',
  bioTr: '',
  aboutTextAr: '',
  aboutTextEn: '',
  aboutTextTr: '',
};

/**
 * Fetches the singleton settings record (upserts default row id: 1 if missing)
 */
export const getSettings = async (): Promise<SiteSettings> => {
  return await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: DEFAULT_SITE_SETTINGS,
  });
};

/**
 * Validates and updates the singleton settings row (id: 1)
 */
export const updateSettings = async (data: UpdateSettingsDto): Promise<SiteSettings> => {
  // Ensure the default row exists first
  await getSettings();

  return await prisma.siteSettings.update({
    where: { id: 1 },
    data,
  });
};

export default {
  getSettings,
  updateSettings,
};