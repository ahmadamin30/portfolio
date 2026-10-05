import React, { useState, useEffect } from 'react';
import {
  User,
  Save,
  RotateCw,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Languages,
  FileText,
  Sparkles,
} from 'lucide-react';
import api from '../../services/api';

interface SectionCopywritingData {
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

interface AboutFormData {
  // Section Headers / Copywriting
  badgeEn: string;
  badgeAr: string;
  badgeTr: string;
  titleEn: string;
  titleAr: string;
  titleTr: string;
  subtitleEn: string;
  subtitleAr: string;
  subtitleTr: string;

  // Paragraph 1
  aboutTextEn: string;
  aboutTextAr: string;
  aboutTextTr: string;

  // Paragraph 2
  aboutParagraph2En: string;
  aboutParagraph2Ar: string;
  aboutParagraph2Tr: string;
}

export const AdminAbout: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const [formData, setFormData] = useState<AboutFormData>({
    badgeEn: 'About Me',
    badgeAr: 'نبذة عني',
    badgeTr: 'Hakkımda',
    titleEn: 'Software Engineer Crafting High-Impact Digital Experiences',
    titleAr: 'مهندس برمجيات متخصص في بناء تجارب رقمية مميزة',
    titleTr: 'Yüksek Etkili Dijital Deneyimler Üreten Yazılım Mühendisi',
    subtitleEn: 'Passionate about clean code, robust system architectures, and delightful UX',
    subtitleAr: 'شغف بالتطوير النظيف، البنى المعمارية القابلة للتوسع، والواجهات العصرية',
    subtitleTr: 'Temiz kod, sağlam sistem mimarisi ve modern arayüzlere tutkulu',

    aboutTextEn: '',
    aboutTextAr: '',
    aboutTextTr: '',

    aboutParagraph2En: '',
    aboutParagraph2Ar: '',
    aboutParagraph2Tr: '',
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4000);
  };

  const fetchAboutSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/settings');
      const data = res.data?.data;

      if (data) {
        const aboutCopywriting: SectionCopywritingData =
          data.sectionCopywriting?.about || {};

        setFormData({
          badgeEn: aboutCopywriting.badgeEn || 'About Me',
          badgeAr: aboutCopywriting.badgeAr || 'نبذة عني',
          badgeTr: aboutCopywriting.badgeTr || 'Hakkımda',
          titleEn:
            aboutCopywriting.titleEn ||
            'Software Engineer Crafting High-Impact Digital Experiences',
          titleAr:
            aboutCopywriting.titleAr ||
            'مهندس برمجيات متخصص في بناء تجارب رقمية مميزة',
          titleTr:
            aboutCopywriting.titleTr ||
            'Yüksek Etkili Dijital Deneyimler Üreten Yazılım Mühendisi',
          subtitleEn:
            aboutCopywriting.subtitleEn ||
            'Passionate about clean code, robust system architectures, and delightful UX',
          subtitleAr:
            aboutCopywriting.subtitleAr ||
            'شغف بالتطوير النظيف، البنى المعمارية القابلة للتوسع، والواجهات العصرية',
          subtitleTr:
            aboutCopywriting.subtitleTr ||
            'Temiz kod, sağlam sistem mimarisi ve modern arayüzlere tutkulu',

          aboutTextEn: data.aboutTextEn || '',
          aboutTextAr: data.aboutTextAr || '',
          aboutTextTr: data.aboutTextTr || '',

          aboutParagraph2En: data.aboutParagraph2En || '',
          aboutParagraph2Ar: data.aboutParagraph2Ar || '',
          aboutParagraph2Tr: data.aboutParagraph2Tr || '',
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load About settings';
      showNotification('error', msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutSettings();
  }, []);

  const handleInputChange = (field: keyof AboutFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);

      const aboutCopywritingPayload: SectionCopywritingData = {
        badgeEn: formData.badgeEn.trim(),
        badgeAr: formData.badgeAr.trim(),
        badgeTr: formData.badgeTr.trim(),
        titleEn: formData.titleEn.trim(),
        titleAr: formData.titleAr.trim(),
        titleTr: formData.titleTr.trim(),
        subtitleEn: formData.subtitleEn.trim(),
        subtitleAr: formData.subtitleAr.trim(),
        subtitleTr: formData.subtitleTr.trim(),
      };

      // 1. Update Section Copywriting
      await api.patch('/settings/copywriting', {
        section: 'about',
        data: aboutCopywritingPayload,
      });

      // 2. Update Paragraph 1 and Paragraph 2 in SiteSettings
      await api.put('/settings', {
        aboutTextEn: formData.aboutTextEn.trim(),
        aboutTextAr: formData.aboutTextAr.trim(),
        aboutTextTr: formData.aboutTextTr.trim(),
        aboutParagraph2En: formData.aboutParagraph2En.trim(),
        aboutParagraph2Ar: formData.aboutParagraph2Ar.trim(),
        aboutParagraph2Tr: formData.aboutParagraph2Tr.trim(),
      });

      showNotification('success', 'About section and bio paragraphs saved successfully!');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save changes';
      showNotification('error', msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Loading About Section details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* ============================================================== */}
      {/* Top Header & Actions                                           */}
      {/* ============================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80 shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <User className="w-5 h-5" />
            </span>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              About Section Management (إدارة سكشن النبذة)
            </h1>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Complete multilingual control over headers, badges, and dual story bio paragraphs across English, Arabic, and Turkish.
          </p>
        </div>

        {/* Action Buttons: Reload & Save */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchAboutSettings}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white transition-all border border-slate-700/80"
          >
            <RotateCw className="w-4 h-4 text-slate-400" />
            <span>Reload</span>
          </button>

          <button
            type="button"
            onClick={handleSaveChanges}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-slate-950" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Floating Notification Banner */}
      {notification && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl border text-sm font-medium transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
              : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION 1: Section Headers (العناوين والشعارات)                */}
      {/* ============================================================== */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
          <Languages className="w-5 h-5 text-emerald-400" />
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">
              Section Headers & Copywriting (العناوين والشعارات)
            </h2>
            <p className="text-xs text-slate-400">
              Badge, main headline, and subtitle for the About section on the homepage.
            </p>
          </div>
        </div>

        {/* 3 Multilingual Columns for Section 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* English Column */}
          <div className="space-y-4 p-4 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-xs font-bold text-blue-400 uppercase tracking-wider">
              <span>English (EN)</span>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1.5 block">
                Badge Label
              </label>
              <input
                type="text"
                value={formData.badgeEn}
                onChange={(e) => handleInputChange('badgeEn', e.target.value)}
                placeholder="e.g. About Me"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1.5 block">
                Main Headline
              </label>
              <input
                type="text"
                value={formData.titleEn}
                onChange={(e) => handleInputChange('titleEn', e.target.value)}
                placeholder="e.g. Software Engineer Crafting Digital Experiences"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1.5 block">
                Subtitle
              </label>
              <textarea
                rows={2}
                value={formData.subtitleEn}
                onChange={(e) => handleInputChange('subtitleEn', e.target.value)}
                placeholder="Brief subtitle..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Arabic Column (dir="rtl") */}
          <div className="space-y-4 p-4 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <span>العربية (AR)</span>
              <span className="text-[10px] text-slate-500 lowercase font-normal">rtl</span>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1.5 block text-right">
                شارة القسم (Badge)
              </label>
              <input
                type="text"
                dir="rtl"
                value={formData.badgeAr}
                onChange={(e) => handleInputChange('badgeAr', e.target.value)}
                placeholder="مثال: نبذة عني"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-right"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1.5 block text-right">
                العنوان الرئيسي
              </label>
              <input
                type="text"
                dir="rtl"
                value={formData.titleAr}
                onChange={(e) => handleInputChange('titleAr', e.target.value)}
                placeholder="مثال: مهندس برمجيات متخصص في بناء تجارب رقمية مميزة"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-right"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1.5 block text-right">
                الوصف الفرعي
              </label>
              <textarea
                rows={2}
                dir="rtl"
                value={formData.subtitleAr}
                onChange={(e) => handleInputChange('subtitleAr', e.target.value)}
                placeholder="وصف فرعي يظهر أسفل العنوان الرئيسي..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-right"
              />
            </div>
          </div>

          {/* Turkish Column */}
          <div className="space-y-4 p-4 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <span>Türkçe (TR)</span>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1.5 block">
                Rozet Metni (Badge)
              </label>
              <input
                type="text"
                value={formData.badgeTr}
                onChange={(e) => handleInputChange('badgeTr', e.target.value)}
                placeholder="Örn: Hakkımda"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1.5 block">
                Ana Başlık
              </label>
              <input
                type="text"
                value={formData.titleTr}
                onChange={(e) => handleInputChange('titleTr', e.target.value)}
                placeholder="Örn: Dijital Deneyimler Üreten Yazılım Mühendisi"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1.5 block">
                Alt Açıklama
              </label>
              <textarea
                rows={2}
                value={formData.subtitleTr}
                onChange={(e) => handleInputChange('subtitleTr', e.target.value)}
                placeholder="Alt açıklama metni..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECTION 2: Bio Paragraphs (الفقرات التعريفية)                  */}
      {/* ============================================================== */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-8">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
          <FileText className="w-5 h-5 text-emerald-400" />
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">
              Bio Paragraphs (الفقرات التعريفية)
            </h2>
            <p className="text-xs text-slate-400">
              Dual detailed biographical paragraphs rendered in the About narrative on the site.
            </p>
          </div>
        </div>

        {/* PARAGRAPH 1 (الفقرة الأولى) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold uppercase">
              Paragraph 1 / الفقرة الأولى
            </span>
            <span className="text-xs text-slate-400">
              Introduction, background, and core mission.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* English */}
            <div>
              <span className="text-xs font-semibold text-slate-300 mb-1.5 block">English (EN)</span>
              <textarea
                rows={5}
                value={formData.aboutTextEn}
                onChange={(e) => handleInputChange('aboutTextEn', e.target.value)}
                placeholder="First detailed paragraph in English..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed"
              />
            </div>

            {/* Arabic */}
            <div>
              <span className="text-xs font-semibold text-slate-300 mb-1.5 block text-right">العربية (AR)</span>
              <textarea
                rows={5}
                dir="rtl"
                value={formData.aboutTextAr}
                onChange={(e) => handleInputChange('aboutTextAr', e.target.value)}
                placeholder="الفقرة الأولى باللغة العربية مع التركيز على الخبرات والرؤية البرمجية..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-right leading-relaxed"
              />
            </div>

            {/* Turkish */}
            <div>
              <span className="text-xs font-semibold text-slate-300 mb-1.5 block">Türkçe (TR)</span>
              <textarea
                rows={5}
                value={formData.aboutTextTr}
                onChange={(e) => handleInputChange('aboutTextTr', e.target.value)}
                placeholder="Türkçe birinci paragraf: deneyimler ve geliştirme vizyonu..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* PARAGRAPH 2 (الفقرة الثانية) */}
        <div className="space-y-4 pt-4 border-t border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase">
              Paragraph 2 / الفقرة الثانية
            </span>
            <span className="text-xs text-slate-400">
              Deep dive into architecture, problem-solving mindset, and collaboration.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* English */}
            <div>
              <span className="text-xs font-semibold text-slate-300 mb-1.5 block">English (EN)</span>
              <textarea
                rows={5}
                value={formData.aboutParagraph2En}
                onChange={(e) => handleInputChange('aboutParagraph2En', e.target.value)}
                placeholder="Second narrative paragraph covering architecture and engineering passion..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed"
              />
            </div>

            {/* Arabic */}
            <div>
              <span className="text-xs font-semibold text-slate-300 mb-1.5 block text-right">العربية (AR)</span>
              <textarea
                rows={5}
                dir="rtl"
                value={formData.aboutParagraph2Ar}
                onChange={(e) => handleInputChange('aboutParagraph2Ar', e.target.value)}
                placeholder="الفقرة الثانية باللغة العربية لتوضيح منهجية العمل وشغف الحلول التقنية..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-right leading-relaxed"
              />
            </div>

            {/* Turkish */}
            <div>
              <span className="text-xs font-semibold text-slate-300 mb-1.5 block">Türkçe (TR)</span>
              <textarea
                rows={5}
                value={formData.aboutParagraph2Tr}
                onChange={(e) => handleInputChange('aboutParagraph2Tr', e.target.value)}
                placeholder="Türkçe ikinci paragraf: mimari yaklaşım ve mühendislik disiplini..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Changes will immediately update the live portfolio About section.</span>
          </div>

          <button
            type="button"
            onClick={handleSaveChanges}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-slate-950" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAbout;
