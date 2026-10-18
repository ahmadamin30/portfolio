import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Copy,
  Check,
  ArrowUpRight,
  ArrowRight,
  Clock,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MessageSquare,
  Github,
  Linkedin,
} from 'lucide-react';
import { usePublicPortfolio } from '../../context/PublicPortfolioContext';
import ScrollRevealSection from './ScrollRevealSection';
import api from '../../services/api';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

interface ContactCopy {
  badge: string;
  title: string;
  subtitle: string;
  githubLabel: string;
  linkedinLabel: string;
  directEmailLabel: string;
  copyEmail: string;
  copied: string;
  sendMail: string;
  timezoneLabel: string;
  timezoneValue: string;
  responseTime: string;
  availabilityDefault: string;
  formTitle: string;
  formSubtitle: string;
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  subjectLabel: string;
  subjectPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
  sendButton: string;
  sendingButton: string;
  sentButton: string;
  nameRequired: string;
  emailRequired: string;
  emailInvalid: string;
  messageRequired: string;
  messageTooShort: string;
  sendFailed: string;
  successNotice: string;
}

const getContactCopy = (lang: string): ContactCopy => {
  if (lang === 'ar') {
    return {
      badge: '// تواصل معنا والمباشرة بالمشروع',
      title: 'دعنا نبني معاً شيئاً استثنائياً.',
      subtitle:
        'هل لديك فكرة منتج طموحة، أو تحتاج إلى استشارة معمارية متخصصة، أو تبحث عن شريك تقني معتمد؟ تواصل معي مباشرة لنناقش الأهداف والتنفيذ.',
      githubLabel: 'مستودع الأكواد البرمجية',
      linkedinLabel: 'الملف والشبكة المهنية',
      directEmailLabel: 'البريد الإلكتروني المباشر',
      copyEmail: 'نسخ البريد',
      copied: 'تم النسخ للحافظة!',
      sendMail: 'فتح تطبيق البريد',
      timezoneLabel: 'المنطقة الزمنية',
      timezoneValue: 'إسطنبول، تركيا (UTC+3)',
      responseTime: 'متوسط الرد خلال أقل من 12 ساعة',
      availabilityDefault: 'متاح لمشاريع واستشارات برمجية جديدة',
      formTitle: 'إرسال رسالة مباشرة',
      formSubtitle: 'املأ النموذج أدناه وسأقوم بالرد على استفسارك وتفاصيل مشروعك في أقرب وقت.',
      nameLabel: 'الاسم الكريم *',
      namePlaceholder: 'أحمد المحمد',
      emailLabel: 'البريد الإلكتروني *',
      emailPlaceholder: 'ahmad@example.com',
      subjectLabel: 'الموضوع / نطاق المشروع',
      subjectPlaceholder: 'تطوير تطبيق ويب متكامل / استشارة معمارية',
      messageLabel: 'نص الرسالة *',
      messagePlaceholder: 'اشرح تفاصيل وأهداف مشروعك، الجداول الزمنية المتوقعة، والمتطلبات التقنية...',
      sendButton: 'إرسال الرسالة',
      sendingButton: 'جارٍ إرسال الرسالة...',
      sentButton: 'تم إرسال الرسالة بنجاح!',
      nameRequired: 'يرجى إدخال الاسم.',
      emailRequired: 'يرجى إدخال البريد الإلكتروني.',
      emailInvalid: 'يرجى إدخال بريد إلكتروني صالح.',
      messageRequired: 'يرجى كتابة نص الرسالة.',
      messageTooShort: 'يجب أن تحتوي الرسالة على 5 أحرف على الأقل.',
      sendFailed: 'تعذر إرسال الرسالة. يرجى المحاولة لاحقاً أو المراسلة عبر البريد مباشرة.',
      successNotice: 'شكراً لتواصلك! تم استلام رسالتك بنجاح، وسأتواصل معك في أقرب وقت ممكن.',
    };
  }

  if (lang === 'tr') {
    return {
      badge: '// İLETİŞİME GEÇİN',
      title: 'Birlikte Olağanüstü Sistemler İnşa Edelim.',
      subtitle:
        'Yüksek etkili bir ürün fikriniz mi var, mimari danışmanlığa mı ihtiyacınız var veya teknik ortaklık mı arıyorsunuz? Doğrudan iletişime geçin.',
      githubLabel: 'GITHUB KOD DEPOSU',
      linkedinLabel: 'PROFESYONEL AĞ',
      directEmailLabel: 'DOĞRUDAN E-POSTA',
      copyEmail: 'E-Postayı Kopyala',
      copied: 'Panoya Kopyalandı!',
      sendMail: 'E-Posta İstemcisini Aç',
      timezoneLabel: 'YEREL SAAT DİLİMİ',
      timezoneValue: 'İstanbul, TR (UTC+3)',
      responseTime: 'Ortalama yanıt süresi 12 saat içinde',
      availabilityDefault: 'Yeni Proje ve Danışmanlıklara Açık',
      formTitle: 'Doğrudan Mesaj Gönderin',
      formSubtitle: 'Aşağıdaki formu doldurun, projenizin detayları hakkında en kısa sürede geri dönüş yapayım.',
      nameLabel: 'Adınız Soyadınız *',
      namePlaceholder: 'Ahmet Yılmaz',
      emailLabel: 'E-Posta Adresiniz *',
      emailPlaceholder: 'ahmet@sirket.com',
      subjectLabel: 'Konu / Proje Kapsamı',
      subjectPlaceholder: 'Full-Stack Web Uygulaması / Mimari Danışmanlık',
      messageLabel: 'Mesajınız *',
      messagePlaceholder: 'Proje hedeflerinizi, zaman çizelgenizi ve teknik gereksinimlerinizi belirtin...',
      sendButton: 'Mesajı Gönder',
      sendingButton: 'Mesaj İletiliyor...',
      sentButton: 'Mesaj Başarıyla Gönderildi!',
      nameRequired: 'Lütfen adınızı girin.',
      emailRequired: 'Lütfen e-posta adresinizi girin.',
      emailInvalid: 'Lütfen geçerli bir e-posta adresi girin.',
      messageRequired: 'Lütfen mesajınızı yazın.',
      messageTooShort: 'Mesaj en az 5 karakter olmalıdır.',
      sendFailed: 'Mesaj gönderilemedi. Lütfen tekrar deneyin veya doğrudan e-posta atın.',
      successNotice: 'İletişime geçtiğiniz için teşekkürler! Mesajınız başarıyla iletildi, en kısa sürede dönüş yapılacaktır.',
    };
  }

  return {
    badge: '// INITIATE CONTACT',
    title: "Let's Build Something Exceptional Together.",
    subtitle:
      'Have a high-impact product idea, need architectural consultation, or exploring strategic technical partnership? Reach out directly.',
    githubLabel: 'GITHUB REPOSITORY & CODE',
    linkedinLabel: 'PROFESSIONAL NETWORK',
    directEmailLabel: 'DIRECT INBOX',
    copyEmail: 'Copy Email',
    copied: 'Copied to Clipboard!',
    sendMail: 'Open Mail Client',
    timezoneLabel: 'LOCAL TIMEZONE',
    timezoneValue: 'Istanbul, TR (UTC+3)',
    responseTime: 'Average response within 12 hours',
    availabilityDefault: 'Available for New Projects & Consulting',
    formTitle: 'Send a Direct Transmission',
    formSubtitle: 'Fill out the form below and I will respond to your inquiry promptly with technical clarity.',
    nameLabel: 'Your Name *',
    namePlaceholder: 'Alex Vance',
    emailLabel: 'Email Address *',
    emailPlaceholder: 'alex@company.com',
    subjectLabel: 'Subject / Project Scope',
    subjectPlaceholder: 'Full-Stack Architecture / Web Application',
    messageLabel: 'Your Message *',
    messagePlaceholder: 'Describe your project goals, timelines, and technical requirements...',
    sendButton: 'Send Message',
    sendingButton: 'Transmitting Message...',
    sentButton: 'Message Sent Successfully!',
    nameRequired: 'Please enter your name.',
    emailRequired: 'Please enter your email address.',
    emailInvalid: 'Please enter a valid email address.',
    messageRequired: 'Please provide your message.',
    messageTooShort: 'Message must be at least 5 characters.',
    sendFailed: 'Failed to send message. Please try again or email directly.',
    successNotice: 'Thank you for reaching out! Your transmission has been recorded, and I will be in touch shortly.',
  };
};

export const ContactSection: React.FC = () => {
  const { settings, socialLinks, language, dir } = usePublicPortfolio();
  const copy = useMemo(() => getContactCopy(language), [language]);

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

  // Dynamic Contact & Social Details
  const emailAddress = settings?.contactEmail || settings?.emailContact || 'contact@advax.dev';

  const githubUrl =
    settings?.githubUrl ||
    socialLinks.find((s) => s.platform.toLowerCase() === 'github')?.url ||
    'https://github.com/advax';

  const linkedinUrl =
    settings?.linkedinUrl ||
    socialLinks.find((s) => s.platform.toLowerCase() === 'linkedin')?.url ||
    'https://linkedin.com/in/ahmad-alamin';

  const availabilityText = useMemo(() => {
    if (language === 'ar') return settings?.availabilityStatusAr || copy.availabilityDefault;
    if (language === 'tr') return settings?.availabilityStatusTr || copy.availabilityDefault;
    return settings?.availabilityStatusEn || copy.availabilityDefault;
  }, [language, settings, copy.availabilityDefault]);

  const locationText = useMemo(() => {
    if (language === 'ar') return settings?.locationAr || copy.timezoneValue;
    if (language === 'tr') return settings?.locationTr || copy.timezoneValue;
    return settings?.locationEn || copy.timezoneValue;
  }, [language, settings, copy.timezoneValue]);

  const githubHandle = useMemo(() => {
    try {
      const match = githubUrl.match(/github\.com\/([^/?#]+)/i);
      return match ? `@${match[1]}` : '@advax';
    } catch {
      return '@advax';
    }
  }, [githubUrl]);

  const linkedinHandle = useMemo(() => {
    try {
      const match = linkedinUrl.match(/linkedin\.com\/in\/([^/?#]+)/i);
      return match ? `in/${match[1]}` : 'in/ahmad-alamin';
    } catch {
      return 'in/ahmad-alamin';
    }
  }, [linkedinUrl]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(emailAddress);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    } catch {
      const textArea = document.createElement('textarea');
      textArea.value = emailAddress;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2500);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validations
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = copy.nameRequired;
    if (!formData.email.trim()) {
      newErrors.email = copy.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = copy.emailInvalid;
    }
    if (!formData.message.trim()) {
      newErrors.message = copy.messageRequired;
    } else if (formData.message.trim().length < 5) {
      newErrors.message = copy.messageTooShort;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await api.post('/messages', {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        subject: formData.subject.trim() || undefined,
        message: formData.message.trim(),
      });

      if (res.data?.success) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus('error');
        setErrorMessage(res.data?.message || copy.sendFailed);
      }
    } catch (err: unknown) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : copy.sendFailed);
    }
  };

  return (
    <ScrollRevealSection id="contact" className="py-24 px-4 sm:px-8 max-w-6xl mx-auto w-full">
      {/* SECTION INTRO */}
      <div className="flex flex-col items-start mb-16 relative">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium mb-4 shadow-[0_0_20px_rgba(16,185,129,0.12)]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{copy.badge}</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight mb-5">
          {copy.title}
        </h2>

        <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl">
          {copy.subtitle}
        </p>
      </div>

      {/* SPLIT 2-COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* DIRECT CHANNELS COLUMN */}
        <div className="lg:col-span-5 space-y-4">
          {/* GitHub Card */}
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700/80 shadow-sm dark:shadow-none transition-all duration-300 group block backdrop-blur-sm relative overflow-hidden"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/50 text-zinc-900 dark:text-white group-hover:scale-105 transition-all">
                  <Github className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                    {copy.githubLabel}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {githubHandle}
                  </span>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
          </a>

          {/* LinkedIn Card */}
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-5 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 hover:border-blue-400 dark:hover:border-blue-500/40 shadow-sm dark:shadow-none transition-all duration-300 group block backdrop-blur-sm relative overflow-hidden"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 group-hover:scale-105 transition-all">
                  <Linkedin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                    {copy.linkedinLabel}
                  </span>
                  <span className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {linkedinHandle}
                  </span>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </div>
          </a>

          {/* Direct Email Card */}
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 hover:border-emerald-400 dark:hover:border-emerald-500/40 shadow-sm dark:shadow-none transition-all duration-300 backdrop-blur-sm relative overflow-hidden">
            <div className="flex items-center gap-3.5 mb-3">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                  {copy.directEmailLabel}
                </span>
                <span className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white font-mono break-all select-all">
                  {emailAddress}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-800/60">
              <button
                type="button"
                onClick={handleCopyEmail}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/60 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-all active:scale-95"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">{copy.copied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    <span>{copy.copyEmail}</span>
                  </>
                )}
              </button>

              <a
                href={`mailto:${emailAddress}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/60 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/60 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white transition-all active:scale-95"
              >
                <Send className="w-3.5 h-3.5 text-zinc-400" />
                <span>{copy.sendMail}</span>
              </a>
            </div>
          </div>

          {/* Availability & Timezone Badge */}
          <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800/80 shadow-sm dark:shadow-none space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_12px_rgba(52,211,153,0.8)] shrink-0" />
              <span className="text-xs font-mono font-medium text-zinc-800 dark:text-zinc-200">
                {availabilityText}
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pt-2 border-t border-zinc-200 dark:border-zinc-800/60">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                <span>{locationText}</span>
              </span>
              <span className="text-zinc-500">{copy.responseTime}</span>
            </div>
          </div>
        </div>

        {/* INTERACTIVE MESSAGE FORM */}
        <div className="lg:col-span-7">
          <div className="p-7 sm:p-9 rounded-3xl bg-white/95 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 backdrop-blur-xl relative overflow-hidden shadow-xl shadow-zinc-200/50 dark:shadow-2xl">
            {/* Ambient Top Glow */}
            <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent pointer-events-none" />

            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">
                {copy.formTitle}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mb-6">
              {copy.formSubtitle}
            </p>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Name & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-mono text-zinc-700 dark:text-zinc-400 mb-1.5">
                    {copy.nameLabel}
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={copy.namePlaceholder}
                    disabled={status === 'loading'}
                    className={`w-full bg-zinc-50 dark:bg-zinc-950/70 border rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 outline-none transition-all focus:bg-white dark:focus:bg-zinc-950 ${
                      errors.name
                        ? 'border-red-500/70 focus:border-red-500 focus:ring-1 focus:ring-red-500/40'
                        : 'border-zinc-200 dark:border-zinc-800 focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/40'
                    }`}
                  />
                  {errors.name && (
                    <span className="text-[11px] text-red-400 mt-1 block font-mono">{errors.name}</span>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-mono text-zinc-700 dark:text-zinc-400 mb-1.5">
                    {copy.emailLabel}
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    dir="ltr"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={copy.emailPlaceholder}
                    disabled={status === 'loading'}
                    className={`w-full bg-zinc-50 dark:bg-zinc-950/70 border rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 outline-none transition-all focus:bg-white dark:focus:bg-zinc-950 ${
                      errors.email
                        ? 'border-red-500/70 focus:border-red-500 focus:ring-1 focus:ring-red-500/40'
                        : 'border-zinc-800 focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/40'
                    }`}
                  />
                  {errors.email && (
                    <span className="text-[11px] text-red-400 mt-1 block font-mono">{errors.email}</span>
                  )}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="contact-subject" className="block text-xs font-mono text-zinc-700 dark:text-zinc-400 mb-1.5">
                  {copy.subjectLabel}
                </label>
                <input
                  id="contact-subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder={copy.subjectPlaceholder}
                  disabled={status === 'loading'}
                  className="w-full bg-zinc-50 dark:bg-zinc-950/70 border border-zinc-200 dark:border-zinc-800 focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/40 rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 outline-none transition-all focus:bg-white dark:focus:bg-zinc-950"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="contact-message" className="block text-xs font-mono text-zinc-700 dark:text-zinc-400 mb-1.5">
                  {copy.messageLabel}
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder={copy.messagePlaceholder}
                  disabled={status === 'loading'}
                  className={`w-full bg-zinc-50 dark:bg-zinc-950/70 border rounded-xl px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-600 outline-none transition-all focus:bg-white dark:focus:bg-zinc-950 resize-y min-h-[110px] ${
                    errors.message
                      ? 'border-red-500/70 focus:border-red-500 focus:ring-1 focus:ring-red-500/40'
                      : 'border-zinc-800 focus:border-cyan-500/80 focus:ring-1 focus:ring-cyan-500/40'
                  }`}
                />
                {errors.message && (
                  <span className="text-[11px] text-red-400 mt-1 block font-mono">{errors.message}</span>
                )}
              </div>

              {/* Success Feedback Alert */}
              <AnimatePresence>
                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm flex items-start gap-2.5"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{copy.successNotice}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error Feedback Alert */}
              <AnimatePresence>
                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs sm:text-sm flex items-start gap-2.5"
                  >
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <span>{errorMessage || copy.sendFailed}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full mt-2 py-3.5 px-6 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed group cursor-pointer"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white dark:text-zinc-950" />
                    <span>{copy.sendingButton}</span>
                  </>
                ) : status === 'success' ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600 font-bold" />
                    <span className="text-emerald-700">{copy.sentButton}</span>
                  </>
                ) : (
                  <>
                    <span>{copy.sendButton}</span>
                    <ArrowRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${dir === 'rtl' ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </ScrollRevealSection>
  );
};

export default ContactSection;
