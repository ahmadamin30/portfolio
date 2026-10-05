export interface SectionCopywritingItem {
  badgeAr?: string;
  badgeEn?: string;
  badgeTr?: string;
  titleAr?: string;
  titleEn?: string;
  titleTr?: string;
  subtitleAr?: string;
  subtitleEn?: string;
  subtitleTr?: string;
  [key: string]: string | undefined;
}

export type SectionCopywritingMap = Record<string, SectionCopywritingItem>;

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

  aboutParagraph2Ar?: string | null;
  aboutParagraph2En?: string | null;
  aboutParagraph2Tr?: string | null;

  displayNameAr: string;
  displayNameEn: string;
  displayNameTr: string;

  heroHeadlineAr: string;
  heroHeadlineEn: string;
  heroHeadlineTr: string;

  availabilityStatusAr: string;
  availabilityStatusEn: string;
  availabilityStatusTr: string;

  locationAr: string;
  locationEn: string;
  locationTr: string;

  profilePhotoUrl?: string | null;
  contactEmail?: string | null;

  sectionCopywriting?: SectionCopywritingMap | null;

  siteName: string;
  canonicalUrl?: string | null;
  defaultTitle: string;
  metaDescription?: string | null;
  titleTemplate: string;
  robotsDirectives: string;
  keywords: string;

  updatedAt?: string;
}

export type UpdateSettingsInput = Partial<Omit<SiteSettings, 'id' | 'updatedAt'>>;