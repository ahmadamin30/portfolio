import React, { useState, useEffect, useMemo } from 'react';
import {
  Code2,
  Server,
  Database,
  Terminal,
  Zap,
  ShieldCheck,
  Cpu,
  CheckCircle2,
  Sparkles,
  Lock,
  Workflow,
  Clock,
  Smartphone,
} from 'lucide-react';
import { usePublicPortfolio } from '../../context/PublicPortfolioContext';
import ScrollRevealSection from './ScrollRevealSection';
import api from '../../services/api';

export interface ServiceItem {
  id: number | string;
  serviceNumber?: string;
  titleAr: string;
  titleEn: string;
  titleTr: string;
  descriptionAr: string;
  descriptionEn: string;
  descriptionTr: string;
  icon?: string;
  deliverablesEn?: string[];
  deliverablesAr?: string[];
  deliverablesTr?: string[];
  techStack?: string[];
  isActive?: boolean;
}

export interface WorkflowStepItem {
  id: number | string;
  stepNumber: number;
  titleAr: string;
  titleEn: string;
  titleTr: string;
  descriptionAr: string;
  descriptionEn: string;
  descriptionTr: string;
}

export interface PillarItem {
  titleEn: string;
  titleAr: string;
  titleTr: string;
  descEn: string;
  descAr: string;
  descTr: string;
  metric: string;
  icon: React.ReactNode;
}

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 1,
    serviceNumber: '01',
    icon: 'Code2',
    titleEn: 'Full-Stack Web Architecture',
    titleAr: 'تطوير معمارية الويب المتكاملة',
    titleTr: 'Uçtan Uca Web Mimarisi',
    descriptionEn:
      'Custom enterprise web applications, real-time dashboards, and resilient client-facing platforms engineered with modern frontend frameworks and scalable microservices.',
    descriptionAr:
      'تطوير تطبيقات الويب المتكاملة، ولوحات التحكم اللحظية، ومنصات المؤسسات المصممة بأحدث أطر عمل الواجهات والأنظمة الموزعة عالية الأداء.',
    descriptionTr:
      'Yüksek performanslı web mimarileri, gerçek zamanlı kontrol panelleri ve modern mikroservislerle güçlendirilmiş kurumsal ölçekli web uygulamaları.',
    deliverablesEn: [
      'Production-Ready Source Code',
      'Database & Schema Modeling',
      'End-to-End Type Safety',
      'API Swagger Documentation',
    ],
    deliverablesAr: [
      'كود مصدري نظيف وجاهز للإنتاج',
      'تصميم ونمذجة قواعد البيانات',
      'أمان برمجي شامل (Type Safety)',
      'توثيق شامل للواجهات البرمجية',
    ],
    deliverablesTr: [
      'Üretime Hazır Kaynak Kod',
      'Veritabanı ve Şema Modelleme',
      'Uçtan Uca Tip Güvenliği',
      'Kapsamlı API Dokümantasyonu',
    ],
    techStack: ['React 19', 'Next.js 15', 'TypeScript', 'Tailwind CSS', 'Node.js'],
  },
  {
    id: 2,
    serviceNumber: '02',
    icon: 'Server',
    titleEn: 'High-Throughput Backend & APIs',
    titleAr: 'واجهات خلفية وأنظمة API فائقة السرعة',
    titleTr: 'Yüksek Verimli Arka Uç ve API Sistemleri',
    descriptionEn:
      'Fault-tolerant distributed backends, RESTful & GraphQL APIs, in-memory caching systems, and asynchronous worker queues configured for sub-second response times.',
    descriptionAr:
      'بناء واجهات خلفية مرنة وموزعة، وبوابات REST و GraphQL، وأنظمة تخزين مؤقت فائقة السرعة، وقوائم معالجة غير متزامنة بزمن استجابة أقل من ثانية.',
    descriptionTr:
      'Hata toleranslı dağıtık arka uç sistemleri, RESTful & GraphQL API’leri, bellek içi önbellekleme ve milisaniye yanıt süreleri için optimize edilmiş kuyruklar.',
    deliverablesEn: [
      'High-Concurrency REST/GraphQL APIs',
      'Redis In-Memory Caching',
      'JWT / OAuth2 Security Protocols',
      'Automated Health & Uptime Audits',
    ],
    deliverablesAr: [
      'واجهات برمجية عالية الاستيعاب',
      'تخزين مؤقت سريع عبر Redis',
      'بروتوكولات أمان JWT و OAuth2',
      'فحص دوري لحالة واستقرار الخادم',
    ],
    deliverablesTr: [
      'Yüksek Eşzamanlı REST/GraphQL API',
      'Redis Bellek İçi Önbellekleme',
      'JWT & OAuth2 Güvenlik Protokolleri',
      'Otomatik Sistem Sağlık Denetimleri',
    ],
    techStack: ['Node.js', 'Express', 'NestJS', 'PostgreSQL', 'Redis'],
  },
  {
    id: 3,
    serviceNumber: '03',
    icon: 'Database',
    titleEn: 'Database Architecture & ORM',
    titleAr: 'هندسة قواعد البيانات وإدارة ORM',
    titleTr: 'Veritabanı Mimarisi ve ORM Optimizasyonu',
    descriptionEn:
      'Relational and NoSQL storage architectures tailored for consistency, ACID compliance, index optimization, zero-downtime migrations, and horizontal scalability.',
    descriptionAr:
      'تصميم وإدارة قواعد البيانات العلائقية وغير العلائقية بدقة، مع تحسين الفهارس، ومزامنة واستعلامات خالية من التوقف، وتجهيزها للتوسع الأفقي.',
    descriptionTr:
      'Yüksek tutarlılık, indeks optimizasyonu, kesintisiz veritabanı geçişleri ve yatay ölçeklenebilirlik için tasarlanmış ilişkisel ve NoSQL veri mimarileri.',
    deliverablesEn: [
      'Optimized Query Execution Plans',
      'Automated Migration Workflows',
      'Normalized Relational Schemas',
      'Connection Pooling & Sharding Ready',
    ],
    deliverablesAr: [
      'خطط تنفيذ استعلامات محسنة',
      'إجراءات ترحيل وهجرة بيانات مؤتمتة',
      'مخططات علائقية منظمة وخالية من التكرار',
      'جاهزية لتجميع الاتصالات والتجزئة',
    ],
    deliverablesTr: [
      'Optimize Edilmiş Sorgu Planları',
      'Otomatik Geçiş ve Şema Yönetimi',
      'Normalize İlişkisel Şemalar',
      'Bağlantı Havuzu ve Ölçekleme Desteği',
    ],
    techStack: ['PostgreSQL', 'MySQL', 'Prisma ORM', 'Redis', 'MongoDB'],
  },
  {
    id: 4,
    serviceNumber: '04',
    icon: 'Terminal',
    titleEn: 'DevOps, Containers & CI/CD',
    titleAr: 'عمليات DevOps والحاويات والنشر المؤتمت',
    titleTr: 'DevOps, Konteynerizasyon ve CI/CD',
    descriptionEn:
      'Reproducible container environments, automated deployment pipelines, reverse proxy configurations, and hardened Unix server infrastructure.',
    descriptionAr:
      'بيئات عمل حاويات قابلة للتكرار (Docker)، وخطوط نشر واختبار مؤتمتة (CI/CD)، وضبط خوادم Nginx، وتأمين البنية التحتية للخوادم السحابية.',
    descriptionTr:
      'Tekrarlanabilir Docker konteynerleri, otomatik CI/CD dağıtım boru hatları, Nginx ters proxy yapılandırması ve güçlendirilmiş Linux altyapısı.',
    deliverablesEn: [
      'Dockerized Deployment Bundles',
      'GitHub Actions CI/CD Pipeline',
      'Nginx Reverse Proxy & SSL Config',
      'Automated Backup & Failover Plans',
    ],
    deliverablesAr: [
      'حزم تشغيل مبنية على Docker',
      'خطوط نشر مؤتمتة عبر GitHub Actions',
      'تهيئة Nginx Proxy وشهادات SSL',
      'خطط نسخ احتياطي واستعادة تلقائية',
    ],
    deliverablesTr: [
      'Docker Dağıtım Paketleri',
      'GitHub Actions CI/CD Hatları',
      'Nginx Ters Proxy ve SSL Kurulumu',
      'Otomatik Yedekleme ve Kurtarma',
    ],
    techStack: ['Docker', 'Linux', 'GitHub Actions', 'Nginx', 'Cloud VPS'],
  },
  {
    id: 5,
    serviceNumber: '05',
    icon: 'Zap',
    titleEn: 'API Integrations & Payment Gateways',
    titleAr: 'تكامل الواجهات البرمجية وبوابات الدفع',
    titleTr: 'API Entegrasyonları ve Ödeme Sistemleri',
    descriptionEn:
      'Seamless enterprise integrations with payment gateways (Stripe, PayPal, PayTR), SMS & transactional email systems, headless CMS backbones, and external webhooks.',
    descriptionAr:
      'تكامل سلس مع بوابات الدفع الإلكتروني، وأنظمة الرسائل والبريد المؤتمت، وربط أنظمة إدارة المحتوى المتقدمة، وإدارة الإشعارات اللحظية عبر Webhooks.',
    descriptionTr:
      'Ödeme ağ geçitleri (Stripe, PayTR), işlem e-postaları/SMS sistemleri, headless CMS altyapıları ve web kancaları ile kusursuz entegrasyonlar.',
    deliverablesEn: [
      'Idempotent Payment Webhooks',
      'Transactional Email/SMS Triggers',
      'Zero-Latency Event Listeners',
      'Sandboxed Test Environments',
    ],
    deliverablesAr: [
      'معالجات دفع إلكتروني متكررة وآمنة',
      'إشعارات بريد ورسائل لحظية',
      'مستمعات أحداث بأقل زمن استجابة',
      'بيئات فحص تجريبية معزولة',
    ],
    deliverablesTr: [
      'Güvenli Ödeme Web Kancaları',
      'Otomatik Bildirim & E-Posta Tetikleyicileri',
      'Düşük Gecikmeli Olay Dinleyicileri',
      'İzole Test Ortamları',
    ],
    techStack: ['Stripe API', 'Webhooks', 'OAuth2', 'REST', 'Microservices'],
  },
  {
    id: 6,
    serviceNumber: '06',
    icon: 'ShieldCheck',
    titleEn: 'Performance Audits & Security Hardening',
    titleAr: 'تدقيق الأداء والتحصين الأمني',
    titleTr: 'Performans Denetimi ve Güvenlik Güçlendirme',
    descriptionEn:
      'Comprehensive codebase and network audits, SQL injection prevention, strict CORS policies, rate-limiting layers, and frontend Core Web Vitals optimization.',
    descriptionAr:
      'مراجعات فنية متقدمة للأمان والأداء، وحماية من ثغرات SQLi و XSS، وضبط سياسات CORS وحصص الاستعلام (Rate Limiting)، وتحسين مؤشرات Core Web Vitals.',
    descriptionTr:
      'Kapsamlı kod ve ağ güvenlik denetimleri, SQL enjeksiyon koruması, sıkı CORS politikaları, hız sınırlama katmanları ve Core Web Vitals optimizasyonu.',
    deliverablesEn: [
      'OWASP Top 10 Security Checklist',
      'Sub-100ms API Response Benchmark',
      'Lighthouse 95+ Audit Score',
      'Rate Limiting & DDoS Shield',
    ],
    deliverablesAr: [
      'قائمة تدقيق أمني بمعايير OWASP',
      'معيار استجابة أقل من 100 ملي ثانية',
      'تقييم أداء Lighthouse يتجاوز 95+',
      'طبقات حماية من الهجمات وحصص الطلب',
    ],
    deliverablesTr: [
      'OWASP Güvenlik Kontrol Listesi',
      '100ms Altı API Yanıt Kriteri',
      'Lighthouse 95+ Performans Skoru',
      'Hız Sınırlama ve İstek Kalkanı',
    ],
    techStack: ['OWASP', 'Helmet', 'Express Rate Limit', 'Lighthouse', 'CORS'],
  },
];

const DEFAULT_WORKFLOW: WorkflowStepItem[] = [
  {
    id: 1,
    stepNumber: 1,
    titleEn: 'Discovery & Architecture',
    titleAr: 'الاستكشاف وتخطيط المعمارية',
    titleTr: 'Keşif ve Sistem Mimarisi',
    descriptionEn: 'Requirements breakdown, tech-stack evaluation, and database schema mapping.',
    descriptionAr: 'تحليل المتطلبات، وتقييم حزمة التقنيات المناسبة، وتخطيط بنية قواعد البيانات.',
    descriptionTr: 'Gereksinim analizi, teknoloji yığını seçimi ve veritabanı şema modellemesi.',
  },
  {
    id: 2,
    stepNumber: 2,
    titleEn: 'Core Engineering',
    titleAr: 'التطوير البرمجي الأساسي',
    titleTr: 'Temel Mühendislik Geliştirmesi',
    descriptionEn: 'Clean modular development, iterative sprints, and rapid prototyping.',
    descriptionAr: 'تطوير برمجي نظيف وقائم على الوحدات، مع فترات عمل سريعة ومجربة.',
    descriptionTr: 'Temiz modüler geliştirme, iteratif sprintler ve hızlı prototipleme.',
  },
  {
    id: 3,
    stepNumber: 3,
    titleEn: 'Performance & Stress Testing',
    titleAr: 'اختبارات الأداء والأمان والضغط',
    titleTr: 'Performans ve Güvenlik Testleri',
    descriptionEn: 'Security audits, latency optimization, and cross-platform verification.',
    descriptionAr: 'فحوصات الأمان المتقدمة، وضبط زمن الاستجابة، واختبار التوافق عبر المنصات.',
    descriptionTr: 'Güvenlik denetimleri, gecikme optimizasyonu ve çapraz platform doğrulaması.',
  },
  {
    id: 4,
    stepNumber: 4,
    titleEn: 'Production Deployment & Handover',
    titleAr: 'النشر الإنتاجي والتسليم النهائي',
    titleTr: 'Üretime Dağıtım ve Eksiksiz Teslimat',
    descriptionEn: 'CI/CD pipeline launch, full source-code handover, and documentation.',
    descriptionAr: 'إطلاق خطوط النشر المؤتمتة، وتسليم الكود المصدري بالكامل، وتوثيق شامل.',
    descriptionTr: 'CI/CD dağıtım hattı kurulumu, eksiksiz kaynak kod teslimi ve dokümantasyon.',
  },
];

const TECHNICAL_PILLARS: PillarItem[] = [
  {
    metric: '100%',
    titleEn: 'Code Ownership',
    titleAr: 'ملكية تامة للكود',
    titleTr: 'Tam Kod Mülkiyeti',
    descEn: 'Clean repositories, zero vendor lock-in, full handover.',
    descAr: 'مستودعات برمجية مستقلة دون أي قيود أو ربط مسبق.',
    descTr: 'Temiz repolar, bağımsız altyapı, tam mülkiyet.',
    icon: <Lock className="w-5 h-5 text-cyan-400" />,
  },
  {
    metric: '<1s',
    titleEn: 'Sub-Second Latency',
    titleAr: 'استجابة فائقة السرعة',
    titleTr: 'Milisaniye Yanıt Süresi',
    descEn: 'Optimized queries, lean bundles, and Redis caching.',
    descAr: 'استعلامات محسنة وحزم خفيفة وتخزين مؤقت سريع.',
    descTr: 'Optimize sorgular, hafif paketler ve hızlı önbellek.',
    icon: <Clock className="w-5 h-5 text-emerald-400" />,
  },
  {
    metric: '100%',
    titleEn: 'Cross-Platform Cohesion',
    titleAr: 'توافق عبر جميع المنصات',
    titleTr: 'Çapraz Platform Akıcılığı',
    descEn: 'Uniform visual precision across Web and Mobile viewports.',
    descAr: 'تجربة استخدام متسقة ومثالية على الويب وشاشات الجوال.',
    descTr: 'Web ve mobilde kusursuz akışkanlık ve görsel uyum.',
    icon: <Smartphone className="w-5 h-5 text-purple-400" />,
  },
  {
    metric: 'A+',
    titleEn: 'Production-Grade Security',
    titleAr: 'أمان بمعايير الإنتاج',
    titleTr: 'Kurumsal Güvenlik Standartları',
    descEn: 'OWASP-compliant data sanitation and stateless tokens.',
    descAr: 'حماية مطابقة لمعايير OWASP ومصادقة مشفرة بالكامل.',
    descTr: 'OWASP uyumlu veri güvenliği ve yetkilendirme standartları.',
    icon: <ShieldCheck className="w-5 h-5 text-amber-400" />,
  },
];

const renderServiceIcon = (iconName?: string) => {
  switch (iconName) {
    case 'Code2':
      return <Code2 className="w-5 h-5 text-cyan-400" />;
    case 'Server':
      return <Server className="w-5 h-5 text-emerald-400" />;
    case 'Database':
      return <Database className="w-5 h-5 text-amber-400" />;
    case 'Terminal':
      return <Terminal className="w-5 h-5 text-purple-400" />;
    case 'Zap':
      return <Zap className="w-5 h-5 text-yellow-400" />;
    case 'ShieldCheck':
      return <ShieldCheck className="w-5 h-5 text-blue-400" />;
    default:
      return <Cpu className="w-5 h-5 text-cyan-400" />;
  }
};

const getLocalized = (
  item: Record<string, unknown>,
  prefix: string,
  lang: string,
  fallback = ''
): string => {
  const capLang = lang.charAt(0).toUpperCase() + lang.slice(1);
  const key = `${prefix}${capLang}`;
  const val = item[key];
  if (typeof val === 'string' && val.trim()) return val;
  const enKey = `${prefix}En`;
  const enVal = item[enKey];
  if (typeof enVal === 'string' && enVal.trim()) return enVal;
  return fallback;
};

export const ServicesSection: React.FC = () => {
  const { language } = usePublicPortfolio();
  const [apiServices, setApiServices] = useState<ServiceItem[]>([]);
  const [apiWorkflow, setApiWorkflow] = useState<WorkflowStepItem[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchServicesData = async () => {
      try {
        const [servicesRes, workflowRes] = await Promise.all([
          api.get('/services?activeOnly=true').catch(() => ({ data: { data: [] } })),
          api.get('/workflow').catch(() => ({ data: { data: [] } })),
        ]);

        if (isMounted) {
          if (Array.isArray(servicesRes.data?.data) && servicesRes.data.data.length > 0) {
            setApiServices(servicesRes.data.data);
          }
          if (Array.isArray(workflowRes.data?.data) && workflowRes.data.data.length > 0) {
            setApiWorkflow(workflowRes.data.data);
          }
        }
      } catch {
        // Fallbacks will be rendered seamlessly
      }
    };

    fetchServicesData();
    return () => {
      isMounted = false;
    };
  }, []);

  const services: ServiceItem[] = useMemo(() => {
    return apiServices.length > 0 ? apiServices : DEFAULT_SERVICES;
  }, [apiServices]);

  const workflowSteps: WorkflowStepItem[] = useMemo(() => {
    return apiWorkflow.length > 0 ? apiWorkflow : DEFAULT_WORKFLOW;
  }, [apiWorkflow]);

  const copy = useMemo(() => {
    if (language === 'ar') {
      return {
        badge: '// المعمارية والقدرات التقنية',
        title: 'مصممة للأداء العالي. مبنية لإحداث أثر.',
        lead: 'نوازن بين متانة المعمارية السحابية، وسلاسة الواجهات عبر الويب والجوال، والدقة الهندسية الصارمة لنقدم حلولاً رقمية قابلة للتوسع ومصممة للنمو.',
        workflowBadge: '// منهجية الإنجاز والعمل',
        workflowTitle: 'من المفهوم المجرد إلى واقع برمجي متكامل',
        workflowLead: 'خارطة طريق واضحة وهندسية تضمن تسليم مشاريع خالية من العيوب وبأعلى معايير الاستقرار.',
        deliverablesTitle: 'مخرجات ونطاق العمل:',
        allRights: '100% تسليم كامل وحقوق ملكية حصرية',
      };
    }
    if (language === 'tr') {
      return {
        badge: '// YETENEKLER VE UZMANLIK ALANLARI',
        title: 'Ölçek İçin Tasarlandı. Etki İçin İnşa Edildi.',
        lead: 'Sağlam bulut mimarisi, çapraz platform akıcılığı ve modern mühendislik hassasiyetini birleştirerek kurumsal ölçekte dijital deneyimler üretiyoruz.',
        workflowBadge: '// NASIL ÇALIŞIYORUZ',
        workflowTitle: 'Fikirden Ölçeklenebilir Gerçekliğe',
        workflowLead: 'Hatasız kod tabanı ve zamanında teslimatı garanti eden şeffaf ve çevik mühendislik süreci.',
        deliverablesTitle: 'Teslim Edilenler & Kapsam:',
        allRights: '%100 Tam Mülkiyet ve Bağımsız Kod',
      };
    }
    return {
      badge: '// CAPABILITIES & SPECIALIZATION',
      title: 'Engineered for Scale. Built for Impact.',
      lead: 'Balancing robust backend architecture, cross-platform mobile fluidity, and modern design precision to engineer digital platforms built to endure and expand.',
      workflowBadge: '// HOW WE DELIVER',
      workflowTitle: 'From Concept to Scalable Reality',
      workflowLead: 'A transparent, structured execution blueprint engineered for reliability, agility, and on-time production launches.',
      deliverablesTitle: 'Deliverables & Scope:',
      allRights: '100% Source Code Ownership & Zero Lock-in',
    };
  }, [language]);

  return (
    <ScrollRevealSection id="services" className="py-24 px-4 sm:px-8 max-w-6xl mx-auto w-full">
      {/* SECTION INTRO */}
      <div className="flex flex-col items-start mb-16 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-medium mb-4 shadow-[0_0_20px_rgba(6,182,212,0.12)]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{copy.badge}</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight mb-5">
          {copy.title}
        </h2>

        <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl">
          {copy.lead}
        </p>
      </div>

      {/* PART 1: DETAILED SERVICES CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-24">
        {services.map((service, index) => {
          const serviceTitle = getLocalized(service as unknown as Record<string, unknown>, 'title', language, service.titleEn);
          const serviceDesc = getLocalized(service as unknown as Record<string, unknown>, 'description', language, service.descriptionEn);

          const deliverables =
            language === 'ar'
              ? service.deliverablesAr || service.deliverablesEn || []
              : language === 'tr'
              ? service.deliverablesTr || service.deliverablesEn || []
              : service.deliverablesEn || [];

          const techList = service.techStack || ['TypeScript', 'Full-Stack', 'Modern Architecture'];

          return (
            <div
              key={service.id || index}
              className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 hover:border-cyan-500/40 rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 relative group backdrop-blur-xl shadow-sm dark:shadow-none hover:shadow-[0_0_35px_rgba(6,182,212,0.08)]"
            >
              {/* Subtle top ambient accent */}
              <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div>
                {/* Top Row: Icon badge & Number */}
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700/60 shadow-inner group-hover:scale-105 group-hover:border-cyan-500/30 transition-all">
                    {renderServiceIcon(service.icon)}
                  </div>
                  <span className="text-xs font-mono text-zinc-500 group-hover:text-cyan-400/80 transition-colors">
                    {service.serviceNumber || `0${index + 1}`}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3 tracking-tight group-hover:text-cyan-500 dark:group-hover:text-cyan-300 transition-colors">
                  {serviceTitle}
                </h3>

                {/* Description */}
                <p className="text-zinc-600 dark:text-zinc-400 text-xs sm:text-sm leading-relaxed mb-6">
                  {serviceDesc}
                </p>

                {/* Scope & Deliverables Checklist */}
                {deliverables.length > 0 && (
                  <div className="mb-6 pt-4 border-t border-zinc-200 dark:border-zinc-800/60">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 block mb-2.5">
                      {copy.deliverablesTitle}
                    </span>
                    <ul className="space-y-2">
                      {deliverables.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex items-start gap-2 text-xs text-zinc-700 dark:text-zinc-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Footer Tech Stack Pills */}
              <div className="pt-4 border-t border-zinc-800/60 flex flex-wrap gap-1.5 mt-auto">
                {techList.map((tech, techIdx) => (
                  <span
                    key={techIdx}
                    className="px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200 group-hover:border-zinc-300 dark:group-hover:border-zinc-700/80 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* PART 2: THE ENGINEERING PROCESS & WORKFLOW */}
      <div className="mb-24 p-8 sm:p-12 rounded-3xl bg-white/80 dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800/70 shadow-sm dark:shadow-none relative overflow-hidden backdrop-blur-xl">
        <div className="flex flex-col items-start mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium mb-3">
            <Workflow className="w-3.5 h-3.5" />
            <span>{copy.workflowBadge}</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-2">
            {copy.workflowTitle}
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base max-w-2xl">
            {copy.workflowLead}
          </p>
        </div>

        {/* 4-Step Blueprint Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {workflowSteps.map((step, idx) => {
            const stepTitle = getLocalized(step as unknown as Record<string, unknown>, 'title', language, step.titleEn);
            const stepDesc = getLocalized(step as unknown as Record<string, unknown>, 'description', language, step.descriptionEn);

            return (
              <div
                key={step.id || idx}
                className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800/80 shadow-sm dark:shadow-none flex flex-col justify-between relative group hover:border-emerald-500/40 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold flex items-center justify-center">
                      0{step.stepNumber || idx + 1}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">STAGE {idx + 1}</span>
                  </div>

                  <h4 className="text-base font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-emerald-500 dark:group-hover:text-emerald-300 transition-colors">
                    {stepTitle}
                  </h4>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {stepDesc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PART 3: TECHNICAL PILLARS & GUARANTEES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {TECHNICAL_PILLARS.map((pillar, idx) => {
          const pTitle = language === 'ar' ? pillar.titleAr : language === 'tr' ? pillar.titleTr : pillar.titleEn;
          const pDesc = language === 'ar' ? pillar.descAr : language === 'tr' ? pillar.descTr : pillar.descEn;

          return (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/70 hover:border-zinc-300 dark:hover:border-zinc-700/80 shadow-sm dark:shadow-none flex flex-col justify-between transition-colors backdrop-blur-md"
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50">
                  {pillar.icon}
                </div>
                <span className="text-xl sm:text-2xl font-extrabold font-mono text-zinc-900 dark:text-white tracking-tight">
                  {pillar.metric}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-white mb-1">{pTitle}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{pDesc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollRevealSection>
  );
};

export default ServicesSection;
