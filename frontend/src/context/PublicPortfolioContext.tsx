import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import api from '../services/api';
import { SiteSettings, SocialLink } from '@portfolio/shared';

export type PortfolioLanguage = 'en' | 'ar' | 'tr';

export interface PublicPortfolioContextType {
  language: PortfolioLanguage;
  setLanguage: (lang: PortfolioLanguage) => void;
  dir: 'ltr' | 'rtl';
  settings: SiteSettings | null;
  socialLinks: SocialLink[];
  loading: boolean;
  error: string | null;
  t: (key: string) => string;
}

const UI_DICTIONARY: Record<PortfolioLanguage, Record<string, string>> = {
  en: {
    'nav.about': 'About',
    'nav.workflow': 'Workflow',
    'nav.projects': 'Projects',
    'nav.skills': 'Skills',
    'nav.experience': 'Experience',
    'nav.services': 'Services',
    'nav.faq': 'FAQ',
    'nav.contact': 'Contact',
    'hero.badge': 'AVAILABLE FOR OPPORTUNITIES',
    'hero.cta.primary': 'Have a Project Idea? →',
    'hero.cta.secondary': 'Explore Works',
    'hero.cta.resume': 'Download Resume',
    'hero.stats.exp.value': '4+ Years',
    'hero.stats.exp.label': 'Systems Architecture',
    'hero.stats.projects.value': '15+ Projects',
    'hero.stats.projects.label': 'Delivered Globally',
    'hero.stats.precision.value': '99.9%',
    'hero.stats.precision.label': 'System Precision',
    'hero.defaultHeadline': 'Engineering Scalable Systems & High-Impact Digital Experiences',
    'hero.defaultBio': 'Full-stack software architect specializing in modern high-performance cloud architectures, reactive distributed systems, and refined human interfaces.',
    'about.badge': '// ABOUT ME',
    'about.heading': 'Building Scalable Software with Modern Precision.',
    'about.p1': 'I am Ahmad Alamin, a Computer Engineer and Full-Stack Developer. I specialize in building robust backend architectures, high-performance web applications, and modern digital experiences under the ADVAX ethos.',
    'about.p2': 'I focus on engineering sustainable, fault-tolerant solutions.',
    'about.roleBadge': 'Computer Engineer // Full-Stack',
    'about.feat.arch': 'Architecture',
    'about.feat.archDesc': 'Distributed & Resilient',
    'about.feat.perf': 'Performance',
    'about.feat.perfDesc': 'Sub-second Latency',
    'about.feat.prec': 'Precision',
    'about.feat.precDesc': 'End-to-End Type Safety',
    'about.cta.connect': "Let's Connect",
    'about.cta.resume': 'Download Resume',
  },
  ar: {
    'nav.about': 'نبذة',
    'nav.workflow': 'منهجية العمل',
    'nav.projects': 'المشاريع',
    'nav.skills': 'المهارات',
    'nav.experience': 'الخبرات',
    'nav.services': 'الخدمات',
    'nav.faq': 'الأسئلة الشائعة',
    'nav.contact': 'تواصل معي',
    'hero.badge': 'متاح للفرص والمشاريع البرمجية المبتكرة',
    'hero.cta.primary': 'لديك فكرة مشروع؟ لنبدأ ←',
    'hero.cta.secondary': 'استكشف الأعمال',
    'hero.cta.resume': 'تحميل السيرة الذاتية',
    'hero.stats.exp.value': '+4 سنوات',
    'hero.stats.exp.label': 'في هندسة وتطوير الأنظمة',
    'hero.stats.projects.value': '+15 مشروعاً',
    'hero.stats.projects.label': 'تم إنجازها وتسليمها بنجاح',
    'hero.stats.precision.value': '99.9%',
    'hero.stats.precision.label': 'دقة المعمارية البرمجية',
    'hero.defaultHeadline': 'هندسة أنظمة برمجية قابلة للتوسع وتجارب رقمية ذات أثر فائق',
    'hero.defaultBio': 'مهندس برمجيات وحلول رقمية متكاملة متخصص في البنى السحابية عالية الأداء، الأنظمة الموزعة التفاعلية، وتصميم واجهات المستخدم الأنيقة وسريعة الاستجابة.',
    'about.badge': '// نبذة عني',
    'about.heading': 'بناء برمجيات متكاملة بأداء عالٍ ودقة هندسية.',
    'about.p1': 'أنا أحمد الأمين، مهندس حاسوب ومطور Full-Stack. أركز على تطوير معمارية برمجية قوية، وتطبيقات ويب سريعة، وتجارب رقمية متطورة تلبي أعلى المعايير الهندسية.',
    'about.p2': 'أركز على هندسة حلول برمجية مستدامة وقادرة على تحمل الأخطاء.',
    'about.roleBadge': 'مهندس حاسوب // Full-Stack',
    'about.feat.arch': 'معمارية الأنظمة',
    'about.feat.archDesc': 'أنظمة موزعة ومرنة',
    'about.feat.perf': 'الأداء الفائق',
    'about.feat.perfDesc': 'سرعة استجابة فورية',
    'about.feat.prec': 'الدقة الهندسية',
    'about.feat.precDesc': 'أمان برمجي شامل',
    'about.cta.connect': 'لنبدأ التواصل',
    'about.cta.resume': 'تحميل السيرة الذاتية',
  },
  tr: {
    'nav.about': 'Hakkımda',
    'nav.workflow': 'İş Akışı',
    'nav.projects': 'Projeler',
    'nav.skills': 'Yetenekler',
    'nav.experience': 'Deneyim',
    'nav.services': 'Hizmetler',
    'nav.faq': 'SSS',
    'nav.contact': 'İletişim',
    'hero.badge': 'YENİ PROJE VE FIRSATLARA AÇIK',
    'hero.cta.primary': 'Proje Fikriniz mi Var? →',
    'hero.cta.secondary': 'Projeleri İncele',
    'hero.cta.resume': 'Özgeçmişi İndir',
    'hero.stats.exp.value': '4+ Yıl',
    'hero.stats.exp.label': 'Sistem Mimarisi',
    'hero.stats.projects.value': '15+ Proje',
    'hero.stats.projects.label': 'Küresel Teslimat',
    'hero.stats.precision.value': '%99.9',
    'hero.stats.precision.label': 'Sistem Hassasiyeti',
    'hero.defaultHeadline': 'Ölçeklenebilir Sistemler ve Yüksek Etkili Dijital Deneyimler',
    'hero.defaultBio': 'Yüksek performanslı modern bulut mimarileri, reaktif dağıtık sistemler ve kusursuz kullanıcı arayüzleri geliştirmede uzmanlaşmış yazılım mühendisi.',
    'about.badge': '// HAKKIMDA',
    'about.heading': 'Yüksek Performanslı ve Ölçeklenebilir Sistemler Geliştiriyorum.',
    'about.p1': 'Ben Ahmad Alamin, Bilgisayar Mühendisi ve Full-Stack Geliştiriciyim. Modern mimariler, hızlı web uygulamaları ve güvenilir dijital sistemler inşa etmeye odaklanıyorum.',
    'about.p2': 'Sürdürülebilir ve hataya dayanıklı çözümler geliştirmeye odaklanıyorum.',
    'about.roleBadge': 'Bilgisayar Mühendisi // Full-Stack',
    'about.feat.arch': 'Sistem Mimarisi',
    'about.feat.archDesc': 'Dağıtık ve Dayanıklı',
    'about.feat.perf': 'Yüksek Performans',
    'about.feat.perfDesc': 'Milisaniye Gecikme',
    'about.feat.prec': 'Mühendislik Hassasiyeti',
    'about.feat.precDesc': 'Uçtan Uca Tip Güvenliği',
    'about.cta.connect': 'İletişime Geçin',
    'about.cta.resume': 'Özgeçmişi İndir',
  },
};

export const PublicPortfolioContext = createContext<PublicPortfolioContextType | undefined>(undefined);

export const PublicPortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<PortfolioLanguage>(() => {
    try {
      const saved = localStorage.getItem('advax_portfolio_lang');
      if (saved === 'ar' || saved === 'tr' || saved === 'en') {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'en';
  });

  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const dir: 'ltr' | 'rtl' = language === 'ar' ? 'rtl' : 'ltr';

  // Synchronize HTML dir and lang attributes
  useEffect(() => {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', language);
    try {
      localStorage.setItem('advax_portfolio_lang', language);
    } catch {
      // ignore
    }
  }, [language, dir]);

  const setLanguage = (lang: PortfolioLanguage) => {
    setLanguageState(lang);
  };

  useEffect(() => {
    let isMounted = true;
    const fetchPortfolioData = async () => {
      try {
        setLoading(true);
        const [settingsRes, socialRes] = await Promise.all([
          api.get('/settings').catch(() => ({ data: { data: null } })),
          api.get('/social-links').catch(() => ({ data: { data: [] } })),
        ]);

        if (isMounted) {
          if (settingsRes.data?.data) {
            setSettings(settingsRes.data.data);
          }
          if (Array.isArray(socialRes.data?.data)) {
            setSocialLinks(socialRes.data.data);
          }
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch public portfolio');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPortfolioData();

    return () => {
      isMounted = false;
    };
  }, []);

  const t = useMemo(() => {
    return (key: string): string => {
      return UI_DICTIONARY[language]?.[key] || UI_DICTIONARY.en[key] || key;
    };
  }, [language]);

  const value: PublicPortfolioContextType = useMemo(
    () => ({
      language,
      setLanguage,
      dir,
      settings,
      socialLinks,
      loading,
      error,
      t,
    }),
    [language, dir, settings, socialLinks, loading, error, t]
  );

  return (
    <PublicPortfolioContext.Provider value={value}>
      {children}
    </PublicPortfolioContext.Provider>
  );
};

export const usePublicPortfolio = (): PublicPortfolioContextType => {
  const context = useContext(PublicPortfolioContext);
  if (!context) {
    throw new Error('usePublicPortfolio must be used within a PublicPortfolioProvider');
  }
  return context;
};
