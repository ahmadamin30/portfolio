import prisma from '../../config/db';
import { SiteSettings, Prisma } from '@prisma/client';

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

  aboutParagraph2Ar?: string | null;
  aboutParagraph2En?: string | null;
  aboutParagraph2Tr?: string | null;

  // Profile & Hero (Enterprise CMS)
  displayNameAr?: string;
  displayNameEn?: string;
  displayNameTr?: string;

  heroHeadlineAr?: string;
  heroHeadlineEn?: string;
  heroHeadlineTr?: string;

  availabilityStatusAr?: string;
  availabilityStatusEn?: string;
  availabilityStatusTr?: string;

  locationAr?: string;
  locationEn?: string;
  locationTr?: string;

  profilePhotoUrl?: string | null;
  contactEmail?: string | null;

  // Section Headings Copywriting
  sectionCopywriting?: Prisma.InputJsonValue;

  // SEO Hub
  siteName?: string;
  canonicalUrl?: string | null;
  defaultTitle?: string;
  metaDescription?: string | null;
  titleTemplate?: string;
  robotsDirectives?: string;
  keywords?: string;
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
  aboutParagraph2Ar: null,
  aboutParagraph2En: null,
  aboutParagraph2Tr: null,

  displayNameAr: '',
  displayNameEn: '',
  displayNameTr: '',
  heroHeadlineAr: '',
  heroHeadlineEn: '',
  heroHeadlineTr: '',
  availabilityStatusAr: '',
  availabilityStatusEn: '',
  availabilityStatusTr: '',
  locationAr: '',
  locationEn: '',
  locationTr: '',
  profilePhotoUrl: null,
  contactEmail: null,

  sectionCopywriting: {
    projects: {
      badgeAr: 'معرض الأعمال',
      badgeEn: 'Portfolio Showcase',
      badgeTr: 'Proje Galerisi',
      titleAr: 'أحدث المشاريع المنجزة',
      titleEn: 'Featured Projects',
      titleTr: 'Öne Çıkan Projeler',
      subtitleAr: 'مجموعة من الحلول البرمجية المتكاملة وتطبيقات الويب عالية الأداء',
      subtitleEn: 'A selection of full-stack engineering work and high-performance applications',
      subtitleTr: 'Tam kapsamlı yazılım çözümleri ve yüksek performanslı web uygulamaları',
    },
    skills: {
      badgeAr: 'المهارات التقنية',
      badgeEn: 'Technical Skills',
      badgeTr: 'Teknik Beceriler',
      titleAr: 'الأدوات والتقنيات الأساسية',
      titleEn: 'Core Stack & Expertise',
      titleTr: 'Temel Uzmanlıklar',
      subtitleAr: 'تقنيات حديثة لبناء حلول سريعة وقابلة للتوسع',
      subtitleEn: 'Modern frameworks and tools enabling reliable scalability',
      subtitleTr: 'Ölçeklenebilir ve güvenilir modern teknolojiler',
    },
    workflow: {
      badgeAr: 'منهجية العمل',
      badgeEn: 'Workflow & Process',
      badgeTr: 'Çalışma Metodolojisi',
      titleAr: 'كيف أحول الأفكار إلى منتجات واقعية',
      titleEn: 'How I Bring Ideas To Life',
      titleTr: 'Fikirleri Hayata Geçirme Sürecim',
      subtitleAr: 'خطوات واضحة ومدروسة تبدأ من التخطيط وحتى النشر والمتابعة',
      subtitleEn: 'A structured engineering process from architectural design to deployment',
      subtitleTr: 'Planlamadan yayına kadar yapılandırılmış geliştirme adımları',
    },
    experience: {
      badgeAr: 'المسار المهني',
      badgeEn: 'Career Timeline',
      badgeTr: 'Kariyer Yolculuğu',
      titleAr: 'الخبرات والتعليم',
      titleEn: 'Experience & Education',
      titleTr: 'Deneyim ve Eğitim',
      subtitleAr: 'رحلة من التطوير المستمر والعمل على مشاريع متنوعة',
      subtitleEn: 'Track record of building software solutions across diverse domains',
      subtitleTr: 'Çeşitli alanlarda yazılım geliştirme ve öğrenim serüvenim',
    },
    services: {
      badgeAr: 'الخدمات الاحترافية',
      badgeEn: 'Services Offered',
      badgeTr: 'Sunulan Hizmetler',
      titleAr: 'ما الذي يمكنني تقديمه لمشروعك',
      titleEn: 'Solutions & Engineering Services',
      titleTr: 'Projeniz İçin Neler Sunabilirim',
      subtitleAr: 'تطوير تطبيقات الويب، واجهات برمجة التطبيقات، واستشارات تقنية',
      subtitleEn: 'Full-stack engineering, API design, performance optimization, and consulting',
      subtitleTr: 'Full-stack geliştirme, API mimarisi ve teknik danışmanlık',
    },
    faqs: {
      badgeAr: 'الأسئلة الشائعة',
      badgeEn: 'Frequently Asked Questions',
      badgeTr: 'Sıkça Sorulan Sorular',
      titleAr: 'كل ما تحتاج لمعرفته قبل بدء العمل',
      titleEn: 'Everything You Need To Know',
      titleTr: 'Birlikte Çalışmadan Önce Bilmeniz Gerekenler',
      subtitleAr: 'إجابات على أكثر الاستفسارات المتعلقة بالمشاريع ونطاق العمل',
      subtitleEn: 'Clear answers regarding scope, timelines, workflow, and technology choices',
      subtitleTr: 'Süreç, zaman çizelgesi ve teknoloji tercihleri hakkında yanıtlar',
    },
    about: {
      badgeAr: 'نبذة عني',
      badgeEn: 'About Me',
      badgeTr: 'Hakkımda',
      titleAr: 'مهندس برمجيات متخصص في بناء تجارب رقمية مميزة',
      titleEn: 'Software Engineer Crafting High-Impact Digital Experiences',
      titleTr: 'Yüksek Etkili Dijital Deneyimler Üreten Yazılım Mühendisi',
      subtitleAr: 'شغف بالتطوير النظيف، البنى المعمارية القابلة للتوسع، والواجهات العصرية',
      subtitleEn: 'Passionate about clean code, robust system architectures, and delightful UX',
      subtitleTr: 'Temiz kod, sağlam sistem mimarisi ve modern arayüzlere tutkulu',
    },
  },

  siteName: 'Portfolio',
  canonicalUrl: null,
  defaultTitle: 'Portfolio',
  metaDescription: 'Personal portfolio and dynamic CMS powered by Node.js, TypeScript and React.',
  titleTemplate: '%s | Portfolio',
  robotsDirectives: 'index, follow',
  keywords: 'software engineer, developer portfolio, react, typescript, nodejs',
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

/**
 * Updates individual section copywriting within the sectionCopywriting JSON field
 */
export const updateSectionCopywriting = async (
  section: string,
  copywritingData: SectionCopywritingItem
): Promise<SiteSettings> => {
  const currentSettings = await getSettings();
  const currentCopywriting =
    currentSettings.sectionCopywriting &&
    typeof currentSettings.sectionCopywriting === 'object' &&
    !Array.isArray(currentSettings.sectionCopywriting)
      ? (currentSettings.sectionCopywriting as Record<string, unknown>)
      : {};

  const existingSection =
    currentCopywriting[section] &&
    typeof currentCopywriting[section] === 'object' &&
    !Array.isArray(currentCopywriting[section])
      ? (currentCopywriting[section] as Record<string, unknown>)
      : {};

  const mergedSection = {
    ...existingSection,
    ...copywritingData,
  };

  const updatedCopywriting = {
    ...currentCopywriting,
    [section]: mergedSection,
  };

  return await prisma.siteSettings.update({
    where: { id: 1 },
    data: {
      sectionCopywriting: updatedCopywriting as Prisma.InputJsonValue,
    },
  });
};

export default {
  getSettings,
  updateSettings,
  updateSectionCopywriting,
};