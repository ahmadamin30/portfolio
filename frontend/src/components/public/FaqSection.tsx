import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';
import {
  usePublicPortfolio,
  type PortfolioLanguage,
} from '../../context/PublicPortfolioContext';
import api from '../../services/api';

export interface FaqItem {
  id: number | string;
  category?: string;
  questionAr: string;
  questionEn: string;
  questionTr: string;
  answerAr: string;
  answerEn: string;
  answerTr: string;
  isPublished?: boolean;
}

interface SectionCopyItem {
  badgeAr?: string;
  badgeEn?: string;
  badgeTr?: string;
  titleAr?: string;
  titleEn?: string;
  titleTr?: string;
  subtitleAr?: string;
  subtitleEn?: string;
  subtitleTr?: string;
}

interface FaqCopy {
  badge: string;
  title: string;
  lead: string;
}

const DEFAULT_FAQS: FaqItem[] = [
  {
    id: 1,
    questionEn: 'What is your primary technology stack for full-stack projects?',
    questionAr: 'ما هي حزمة التقنيات الأساسية التي تعتمد عليها في تطوير المشاريع المتكاملة؟',
    questionTr: 'Tam kapsamlı projeler için temel teknoloji yığınınız nedir?',
    answerEn:
      'Our core production stack leverages React 19, Next.js, and TypeScript on the client side, powered by Node.js, Express/NestJS, and Prisma with PostgreSQL/MySQL and Redis on the backend. Every project is containerized via Docker for seamless CI/CD delivery.',
    answerAr:
      'حزمتنا الأساسية تعتمد على React 19 و Next.js و TypeScript في الواجهة الأمامية، مدعومة بـ Node.js و Express/NestJS و Prisma مع PostgreSQL و Redis في الواجهة الخلفية، مع استخدام Docker لضمان سلاسة النشر.',
    answerTr:
      'Temel üretim yığınımız istemci tarafında React 19, Next.js ve TypeScript; sunucu tarafında ise Node.js, Express/NestJS, Prisma, PostgreSQL/MySQL ve Redis kullanır. Tüm projeler Docker ile konteynerize edilir.',
  },
  {
    id: 2,
    questionEn: 'Do I own the full source code and intellectual property after completion?',
    questionAr: 'هل أمتلك كامل الكود المصدري وحقوق الملكية الفكرية بعد انتهاء المشروع؟',
    questionTr: 'Proje tamamlandığında kaynak kodların ve fikri mülkiyetin tamamına sahip olur muyum?',
    answerEn:
      'Yes, 100%. Upon final project delivery and handover, all source code, architecture documentation, configuration files, and database schemas become entirely your property with zero vendor lock-in.',
    answerAr:
      'نعم بنسبة 100%. عند تسليم المشروع النهائي، تصبح جميع الأكواد المصدرية والمستندات التقنية وإعدادات النشر وقواعد البيانات ملكية تامة وحصرية لك دون أي قيود أو ربط مسبق.',
    answerTr:
      'Evet, kesinlikle %100. Proje teslimatı tamamlandığında tüm kaynak kodlar, mimari dokümanlar ve veri şemaları tamamen sizin mülkiyetinize geçer; satıcı bağımlılığı yoktur.',
  },
  {
    id: 3,
    questionEn: 'How do you handle scalability and traffic spikes?',
    questionAr: 'كيف تضمن معمارية النظام التوسع وتحمل الزيادة المفاجئة في عدد الزوار؟',
    questionTr: 'Ölçeklenebilirlik ve yoğun trafik artışlarını nasıl yönetiyorsunuz?',
    answerEn:
      'We engineer systems with modular microservices, connection pooling, multi-tier Redis caching, and stateless authentication (JWT). This architecture allows individual services to scale horizontally with minimal latency degradation.',
    answerAr:
      'نقوم بتصميم الأنظمة عبر خدمات مصغرة معيارية، وتخزين مؤقت متعدد الطبقات باستخدام Redis، وحفظ الاتصالات المجمعة، مما يتيح التوسع الأفقي عند زيادة الحمل دون انخفاض في السرعة.',
    answerTr:
      'Sistemlerimizi modüler mikroservisler, bağlantı havuzları, çok katmanlı Redis önbellekleme ve durumsuz (stateless) kimlik doğrulama ile tasarlıyoruz; bu sayede sistem yatay olarak kolayca ölçeklenir.',
  },
  {
    id: 4,
    questionEn: 'What is the typical workflow and delivery timeline for a project?',
    questionAr: 'ما هي خطوات سير العمل والجدول الزمني المعتاد لتسليم المشاريع؟',
    questionTr: 'Tipik bir proje iş akışı ve teslimat süresi nedir?',
    answerEn:
      'Timelines typically range between 2 to 6 weeks depending on architectural scope. We follow an agile sprint cycle: Discovery & Architecture (Week 1), Core Sprints & Prototyping (Weeks 2-4), and Performance Hardening & Deployment (Weeks 5-6).',
    answerAr:
      'تتراوح المخططات الزمنية عادةً بين أسبوعين و6 أسابيع حسب متطلبات المشروع. نتبع دورات عمل مرنة: مرحلة التخطيط والمعمارية (الأسبوع الأول)، ثم البرمجة والاختبار التكراري، وأخيراً تدقيق الأداء والنشر.',
    answerTr:
      'Proje kapsamına bağlı olarak teslimat süreleri genellikle 2 ila 6 hafta arasındadır. Şeffaf sprint döngüleri ile keşif, temel geliştirme, test ve güvenli dağıtım aşamalarını sırayla yürütürüz.',
  },
  {
    id: 5,
    questionEn: 'Do you provide post-launch maintenance and support?',
    questionAr: 'هل توفرون خدمات الدعم الفني والصيانة بعد إطلاق المشروع؟',
    questionTr: 'Lansman sonrası bakım ve teknik destek sağlıyor musunuz?',
    answerEn:
      'Yes. Every engagement includes a standard 30-day post-launch warranty covering bug fixes, performance monitoring, and server stability audits. Extended maintenance and architecture consulting retainers are also available.',
    answerAr:
      'نعم، يشمل كل مشروع فترة ضمان قياسية لمدة 30 يوماً بعد الإطلاق لمعالجة أي ملاحظات ومراقبة استقرار الخادم والأداء، مع توفر عقود دعم واستشارات معمارية ممتدة.',
    answerTr:
      'Evet. Her proje, hata düzeltmeleri ve sistem kararlılığı denetimlerini içeren 30 günlük lansman sonrası garanti ile teslim edilir. Uzun vadeli bakım anlaşmaları da sunulmaktadır.',
  },
];

const EASE_EDITORIAL: [number, number, number, number] = [0.16, 1, 0.3, 1];

const headerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

const listContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: EASE_EDITORIAL,
    },
  },
};

const getLocalizedFaqField = (
  item: FaqItem,
  field: 'question' | 'answer',
  lang: PortfolioLanguage
): string => {
  if (field === 'question') {
    if (lang === 'ar' && item.questionAr?.trim()) return item.questionAr.trim();
    if (lang === 'tr' && item.questionTr?.trim()) return item.questionTr.trim();
    return item.questionEn;
  }
  if (lang === 'ar' && item.answerAr?.trim()) return item.answerAr.trim();
  if (lang === 'tr' && item.answerTr?.trim()) return item.answerTr.trim();
  return item.answerEn;
};

export const FaqSection: React.FC = () => {
  const { language, dir, settings } = usePublicPortfolio();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [apiFaqs, setApiFaqs] = useState<FaqItem[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchFaqs = async (): Promise<void> => {
      try {
        const res = await api
          .get('/faqs?publishedOnly=true')
          .catch(() => ({ data: { data: [] as FaqItem[] } }));

        if (isMounted && Array.isArray(res.data?.data) && res.data.data.length > 0) {
          setApiFaqs(res.data.data as FaqItem[]);
        }
      } catch {
        // Fallback to DEFAULT_FAQS seamlessly
      }
    };

    fetchFaqs();
    return () => {
      isMounted = false;
    };
  }, []);

  const faqs = useMemo<FaqItem[]>(() => {
    return apiFaqs.length > 0 ? apiFaqs : DEFAULT_FAQS;
  }, [apiFaqs]);

  const copy = useMemo<FaqCopy>(() => {
    const langSuffix: 'Ar' | 'Tr' | 'En' =
      language === 'ar' ? 'Ar' : language === 'tr' ? 'Tr' : 'En';

    const rawCopywriting = settings?.sectionCopywriting;
    const faqCopywriting: SectionCopyItem | undefined =
      rawCopywriting && typeof rawCopywriting === 'object' && 'faqs' in rawCopywriting
        ? (rawCopywriting.faqs as SectionCopyItem)
        : undefined;

    const customBadge = faqCopywriting?.[`badge${langSuffix}`]?.trim();
    const customTitle = faqCopywriting?.[`title${langSuffix}`]?.trim();
    const customLead = faqCopywriting?.[`subtitle${langSuffix}`]?.trim();

    if (language === 'ar') {
      return {
        badge: customBadge || 'الاستفسارات الشائعة',
        title: customTitle || 'الأسئلة الأكثر تكراراً',
        lead:
          customLead ||
          'كل ما تحتاج لمعرفته حول ملكية الكود المصدري، والمعايير التقنية، وضمانات ما بعد الإطلاق.',
      };
    }

    if (language === 'tr') {
      return {
        badge: customBadge || 'SIKÇA SORULAN SORULAR',
        title: customTitle || 'Merak Edilen Sorular ve Yanıtlar',
        lead:
          customLead ||
          'Kaynak kod mülkiyeti, teknoloji tercihleri ve lansman sonrası garantiler hakkında bilmeniz gerekenler.',
      };
    }

    return {
      badge: customBadge || 'COMMON INQUIRIES',
      title: customTitle || 'Frequently Asked Questions.',
      lead:
        customLead ||
        'Key answers covering code ownership, technology decisions, infrastructure resilience, and post-launch guarantees.',
    };
  }, [language, settings]);

  const toggleFaq = (index: number): void => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="faq"
      dir={dir}
      aria-labelledby="faq-heading"
      className="relative w-full py-24 sm:py-32 px-6 sm:px-12 lg:px-20 overflow-hidden bg-zinc-50 dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors duration-300"
    >
      {/* Atmosphere 1: Ambient Radial Glows */}
      <div aria-hidden="true" className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 end-1/4 w-[520px] h-[520px] rounded-full opacity-[0.03] dark:opacity-[0.045] blur-[150px] bg-sky-500" />
        <div className="absolute bottom-1/4 start-1/4 w-[460px] h-[460px] rounded-full opacity-[0.025] dark:opacity-[0.035] blur-[140px] bg-indigo-500" />
      </div>

      {/* Atmosphere 2: Unified SVG Film Grain Overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 w-full h-full opacity-[0.14] dark:opacity-[0.18] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='faqNoiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23faqNoiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        {/* Section Editorial Header */}
        <motion.div
          variants={headerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2, margin: '-40px' }}
          className="flex flex-col items-start text-start mb-14 sm:mb-16"
        >
          <motion.div
            variants={fadeUpVariants}
            className="inline-flex items-center gap-2.5 mb-5 px-3.5 py-1.5 rounded-full bg-zinc-900/[0.03] dark:bg-white/[0.03] border border-zinc-300/70 dark:border-zinc-800/80 backdrop-blur-sm text-[11px] font-mono uppercase tracking-[0.22em] text-zinc-600 dark:text-zinc-400"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400 shrink-0" />
            <span>05 // {copy.badge.replace(/^\/\/\s*/, '')}</span>
          </motion.div>

          <motion.h2
            id="faq-heading"
            variants={fadeUpVariants}
            className="text-3xl sm:text-5xl lg:text-6xl font-serif font-editorial font-normal tracking-tight leading-[1.08] text-zinc-900 dark:text-zinc-100 mb-4"
          >
            {copy.title}
          </motion.h2>

          <motion.p
            variants={fadeUpVariants}
            className="text-xs sm:text-sm md:text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400 max-w-2xl"
          >
            {copy.lead}
          </motion.p>
        </motion.div>

        {/* Staggered Accordion Items with whileInView Reveals */}
        <motion.div
          variants={listContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15, margin: '-40px' }}
          className="space-y-3.5"
        >
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            const question = getLocalizedFaqField(faq, 'question', language);
            const answer = getLocalizedFaqField(faq, 'answer', language);
            const indexLabel = String(index + 1).padStart(2, '0');

            return (
              <motion.div
                key={faq.id || index}
                variants={fadeUpVariants}
                className={`rounded-2xl border backdrop-blur-md transition-colors duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-white/90 dark:bg-zinc-900/70 border-zinc-300 dark:border-zinc-700/80 shadow-lg dark:shadow-[0_10px_40px_rgba(0,0,0,0.45)]'
                    : 'bg-white/60 dark:bg-zinc-900/30 border-zinc-200/80 dark:border-zinc-800/70 hover:border-zinc-300 dark:hover:border-zinc-700/70'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={isOpen}
                  className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-start select-none cursor-pointer group"
                >
                  <div className="flex items-baseline gap-4 min-w-0">
                    <span
                      className={`text-xs font-mono tracking-[0.2em] shrink-0 transition-colors duration-300 ${
                        isOpen
                          ? 'text-sky-600 dark:text-sky-400'
                          : 'text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-600 dark:group-hover:text-zinc-400'
                      }`}
                    >
                      {indexLabel}
                    </span>
                    <span className="text-sm sm:text-base font-medium tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-700 dark:group-hover:text-white transition-colors">
                      {question}
                    </span>
                  </div>

                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${
                      isOpen
                        ? 'bg-sky-500/10 border-sky-500/30 text-sky-600 dark:text-sky-400 rotate-180'
                        : 'bg-zinc-100/80 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 group-hover:border-zinc-300 dark:group-hover:border-zinc-700'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="faq-answer"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE_EDITORIAL }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-6 sm:px-6 sm:pb-6 ps-5 sm:ps-14 pt-4 border-t border-zinc-200/70 dark:border-zinc-800/60 text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 text-start">
                        {answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default FaqSection;
