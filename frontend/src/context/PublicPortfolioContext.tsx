import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import api from '../services/api';
import { SiteSettings, SocialLink } from '@portfolio/shared';

export type PortfolioLanguage = 'en' | 'ar' | 'tr';

export interface PublicPortfolioContextType {
  language: PortfolioLanguage;
  currentLanguage: PortfolioLanguage;
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
    'about.statementLead': "I'm Ahmad Alamin—",
    'about.statementRole': 'a computer engineer building full-stack web apps and backend systems.',
    'about.editorialBody': 'I build full-stack web apps and backend systems with clean architecture and practical trade-offs. For teams and products that need reliable engineering without unnecessary complexity.',
    'about.timeline.heading': 'How I got here',
    'about.timeline.m1.title': 'Computer Engineering Student',
    'about.timeline.m1.meta': 'Biruni University · Istanbul, Turkey',
    'about.timeline.m1.desc': 'Started my computer engineering degree in 2023, building my foundation in programming, algorithms, data structures, and how software systems are put together in practice alongside coursework.',
    'about.timeline.m2.title': 'Frontend Developer (Freelance)',
    'about.timeline.m2.meta': 'Independent / Freelance · Remote',
    'about.timeline.m2.desc': 'Took on freelance work focused on turning UI ideas and layouts into responsive, well-structured web interfaces, paying close attention to usability, component structure, and clean frontend code.',
    'about.timeline.m3.title': 'Co-Founder & Lead Frontend Engineer',
    'about.timeline.m3.meta': 'VecMenu · Istanbul, Turkey',
    'about.timeline.m3.desc': 'Co-built VecMenu in 2025, a QR digital menu platform tailored for restaurants. Led the frontend side—including multi-language interfaces and practical user flows—while taking the product from early builds to live usage.',
    'about.timeline.m4.title': 'Full-Stack & Systems Engineer',
    'about.timeline.m4.meta': 'Enterprise & CRM Solutions · Remote',
    'about.timeline.m4.desc': 'Worked in 2025 on full-stack business and CRM web applications, covering backend APIs, database structure, role-based access, and practical workflow logic built for day-to-day operational use.',
    'about.timeline.m5.title': 'Full-Stack Software Engineering Intern',
    'about.timeline.m5.meta': 'Scramblebit Pazarlama Programlama Ltd. Şti. · Istanbul, Turkey (On-site)',
    'about.timeline.m5.desc': 'Joined the engineering team on-site in Istanbul to help build and maintain web features and backend APIs, working on everyday bug fixes, query/code improvements, and shipping reliable updates with the team.',
    'about.p1': "I'm Ahmad Alamin—a computer engineer building full-stack web apps and backend systems.",
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
    'about.statementLead': 'أنا أحمد الأمين—',
    'about.statementRole': 'مهندس حاسوب أبني تطبيقات ويب متكاملة وأنظمة خلفية.',
    'about.editorialBody': 'أبني تطبيقات ويب متكاملة وأنظمة خلفية بمعمارية نظيفة وموازنات عملية مدروسة. للفرق والمنتجات التي تحتاج إلى هندسة موثوقة دون تعقيد غير ضروري.',
    'about.timeline.heading': 'كيف وصلت إلى هنا',
    'about.timeline.m1.title': 'طالب هندسة حاسوب',
    'about.timeline.m1.meta': 'جامعة بيروني · إسطنبول، تركيا',
    'about.timeline.m1.desc': 'بدأت دراسة هندسة الحاسوب في عام 2023، وبنيت أساسي في البرمجة والخوارزميات وهياكل البيانات وفهم كيفية تركيب الأنظمة البرمجية عملياً إلى جانب المساقات الجامعية.',
    'about.timeline.m2.title': 'مطور واجهات أمامية (عمل حر)',
    'about.timeline.m2.meta': 'عمل مستقل · عن بُعد',
    'about.timeline.m2.desc': 'عملت على مشاريع حرة تركز على تحويل أفكار وتصاميم الواجهات إلى صفحات ويب متجاوبة ومنظمة، مع اهتمام دقيق بسهولة الاستخدام وبنية المكونات ونظافة كود الواجهة الأمامية.',
    'about.timeline.m3.title': 'شريك مؤسس وقائد تطوير الواجهة الأمامية',
    'about.timeline.m3.meta': 'VecMenu · إسطنبول، تركيا',
    'about.timeline.m3.desc': 'شاركت في بناء منصة VecMenu عام 2025، وهي منصة قوائم طعام رقمية عبر رمز QR مخصصة للمطاعم. توليت قيادة الواجهة الأمامية—بما في ذلك دعم تعدد اللغات وتدفقات الاستخدام العملية—ومرافقة المنتج من النسخ الأولى حتى التشغيل الفعلي.',
    'about.timeline.m4.title': 'مهندس Full-Stack وأنظمة',
    'about.timeline.m4.meta': 'حلول الأعمال وإدارة علاقات العملاء (CRM) · عن بُعد',
    'about.timeline.m4.desc': 'عملت في عام 2025 على تطبيقات ويب متكاملة للأعمال وأنظمة CRM، شملت تطوير واجهات البرمجة الخلفية وهيكلة قواعد البيانات وصلاحيات المستخدمين ومنطق سير العمل المصمم للاستخدام التشغيلي اليومي.',
    'about.timeline.m5.title': 'متدرب هندسة برمجيات Full-Stack',
    'about.timeline.m5.meta': 'Scramblebit Pazarlama Programlama Ltd. Şti. · إسطنبول، تركيا (حضوري)',
    'about.timeline.m5.desc': 'انضممت إلى الفريق الهندسي حضورياً في إسطنبول للمساهمة في بناء وصيانة ميزات الويب وواجهات البرمجة الخلفية، والعمل على إصلاح الأعطال اليومية وتحسين الاستعلامات والكود وإطلاق تحديثات موثوقة مع الفريق.',
    'about.p1': 'أنا أحمد الأمين—مهندس حاسوب أبني تطبيقات ويب متكاملة وأنظمة خلفية.',
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
    'about.statementLead': 'Ben Ahmad Alamin—',
    'about.statementRole': 'uçtan uca web uygulamaları ve backend sistemleri geliştiren bir bilgisayar mühendisiyim.',
    'about.editorialBody': 'Temiz mimari ve pratik mühendislik dengeleriyle uçtan uca web uygulamaları ve backend sistemleri geliştiriyorum. Gereksiz karmaşıklık olmadan güvenilir mühendisliğe ihtiyaç duyan ekipler ve ürünler için.',
    'about.timeline.heading': 'Buraya nasıl geldim',
    'about.timeline.m1.title': 'Bilgisayar Mühendisliği Öğrencisi',
    'about.timeline.m1.meta': 'Biruni Üniversitesi · İstanbul, Türkiye',
    'about.timeline.m1.desc': '2023 yılında bilgisayar mühendisliği lisans eğitimime başladım; derslerin yanı sıra programlama, algoritmalar, veri yapıları ve yazılım sistemlerinin pratikte nasıl kurulduğu üzerine temellerimi oluşturdum.',
    'about.timeline.m2.title': 'Frontend Geliştirici (Freelance)',
    'about.timeline.m2.meta': 'Bağımsız / Freelance · Uzaktan',
    'about.timeline.m2.desc': 'Arayüz fikirlerini ve tasarımları duyarlı, düzenli web arayüzlerine dönüştürmeye odaklanan serbest projeler üstlendim; kullanılabilirliğe, bileşen yapısına ve temiz frontend koduna özen gösterdim.',
    'about.timeline.m3.title': 'Kurucu Ortak & Kıdemli Frontend Mühendisi',
    'about.timeline.m3.meta': 'VecMenu · İstanbul, Türkiye',
    'about.timeline.m3.desc': "2025 yılında restoranlar için geliştirilen QR dijital menü platformu VecMenu'nun kurucu ekibinde yer aldım. Çok dilli arayüzler ve pratik kullanıcı akışları dahil olmak üzere frontend tarafına liderlik ederek ürünü ilk sürümlerden canlı kullanıma taşıdım.",
    'about.timeline.m4.title': 'Full-Stack & Sistem Mühendisi',
    'about.timeline.m4.meta': 'Kurumsal & CRM Çözümleri · Uzaktan',
    'about.timeline.m4.desc': "2025 yılında kurumsal iş ve CRM web uygulamaları üzerinde çalıştım; günlük operasyonel kullanım için backend API'leri, veritabanı yapısı, rol tabanlı yetkilendirme ve pratik iş akışı mantığı geliştirdim.",
    'about.timeline.m5.title': 'Full-Stack Yazılım Mühendisliği Stajyeri',
    'about.timeline.m5.meta': 'Scramblebit Pazarlama Programlama Ltd. Şti. · İstanbul, Türkiye (Ofisten)',
    'about.timeline.m5.desc': "Web özelliklerini ve backend API'lerini geliştirip sürdürmek üzere İstanbul'da ofiste mühendislik ekibine katıldım; günlük hata düzeltmeleri, sorgu ve kod iyileştirmeleri yaparak ekiple birlikte güvenilir güncellemeler yayınladım.",
    'about.p1': 'Ben Ahmad Alamin—uçtan uca web uygulamaları ve backend sistemleri geliştiren bir bilgisayar mühendisiyim.',
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
      currentLanguage: language,
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
