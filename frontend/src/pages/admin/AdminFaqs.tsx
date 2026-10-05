import React, { useState, useEffect, useMemo } from 'react';
import {
  HelpCircle,
  Plus,
  Pencil,
  Trash2,
  Save,
  RotateCw,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Languages,
  Search,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import api from '../../services/api';

export interface FaqItem {
  id: number;
  category: string;
  questionEn: string;
  questionAr: string;
  questionTr: string;
  answerEn: string;
  answerAr: string;
  answerTr: string;
  isPublished: boolean;
  orderIndex: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface FaqsSectionCopywriting {
  badgeEn?: string;
  badgeAr?: string;
  badgeTr?: string;
  titleEn?: string;
  titleAr?: string;
  titleTr?: string;
  subtitleEn?: string;
  subtitleAr?: string;
  subtitleTr?: string;
}

export const FAQ_CATEGORIES = [
  'Services & Scope',
  'Process & Timeline',
  'Tech Stack',
  'Working Together',
];

export const AdminFaqs: React.FC = () => {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [displayLanguage, setDisplayLanguage] = useState<'en' | 'ar' | 'tr'>('en');
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(null);

  // Copywriting State
  const [copywriting, setCopywriting] = useState<FaqsSectionCopywriting>({
    badgeEn: 'Frequently Asked Questions',
    badgeAr: 'الأسئلة الشائعة',
    badgeTr: 'Sıkça Sorulan Sorular',
    titleEn: 'Everything You Need To Know Before Collaboration',
    titleAr: 'كل ما تحتاج معرفته حول آليات التعاقد والتطوير الهندسي',
    titleTr: 'İş Birliği Öncesinde Bilmeniz Gereken Her Şey',
    subtitleEn: 'Clear answers on project estimation, architectural workflows, and ongoing technical support.',
    subtitleAr: 'إجابات واضحة حول تقدير المشاريع، المنهجيات الهندسية، وخطط الدعم التقني المستمر.',
    subtitleTr: 'Proje tahminleri, mühendislik süreçleri ve teknik destek hakkında net yanıtlar.',
  });
  const [savingCopywriting, setSavingCopywriting] = useState<boolean>(false);

  // Notification State
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingFaqId, setEditingFaqId] = useState<number | null>(null);
  const [modalTab, setModalTab] = useState<'en' | 'ar' | 'tr'>('en');
  const [submittingModal, setSubmittingModal] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState({
    category: 'Services & Scope',
    customCategory: '',
    questionEn: '',
    questionAr: '',
    questionTr: '',
    answerEn: '',
    answerAr: '',
    answerTr: '',
    isPublished: true,
    orderIndex: 1,
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4000);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [faqsRes, settingsRes] = await Promise.all([
        api.get('/faqs'),
        api.get('/settings'),
      ]);

      if (Array.isArray(faqsRes.data?.data)) {
        setFaqs(faqsRes.data.data.sort((a: FaqItem, b: FaqItem) => a.orderIndex - b.orderIndex));
      }

      const faqsCopywriting = settingsRes.data?.data?.sectionCopywriting?.faqs;
      if (faqsCopywriting && typeof faqsCopywriting === 'object') {
        setCopywriting((prev) => ({
          ...prev,
          ...faqsCopywriting,
        }));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch FAQs';
      showNotification('error', msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveCopywriting = async () => {
    try {
      setSavingCopywriting(true);
      await api.patch('/settings/copywriting', {
        section: 'faqs',
        data: copywriting,
      });
      showNotification('success', 'FAQ section copywriting saved successfully');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save copywriting';
      showNotification('error', msg);
    } finally {
      setSavingCopywriting(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingFaqId(null);
    setFormData({
      category: 'Services & Scope',
      customCategory: '',
      questionEn: '',
      questionAr: '',
      questionTr: '',
      answerEn: '',
      answerAr: '',
      answerTr: '',
      isPublished: true,
      orderIndex: faqs.length + 1,
    });
    setModalTab('en');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (faq: FaqItem) => {
    setEditingFaqId(faq.id);
    const isStandard = FAQ_CATEGORIES.includes(faq.category);
    setFormData({
      category: isStandard ? faq.category : 'Custom',
      customCategory: isStandard ? '' : faq.category,
      questionEn: faq.questionEn || '',
      questionAr: faq.questionAr || '',
      questionTr: faq.questionTr || '',
      answerEn: faq.answerEn || '',
      answerAr: faq.answerAr || '',
      answerTr: faq.answerTr || '',
      isPublished: faq.isPublished ?? true,
      orderIndex: faq.orderIndex,
    });
    setModalTab('en');
    setIsModalOpen(true);
  };

  const handleDeleteFaq = async (id: number, question: string) => {
    if (!window.confirm(`Are you sure you want to delete FAQ "${question}"?`)) {
      return;
    }

    try {
      await api.delete(`/faqs/${id}`);
      setFaqs((prev) => prev.filter((f) => f.id !== id));
      showNotification('success', 'FAQ question deleted');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete FAQ';
      showNotification('error', msg);
    }
  };

  const handleTogglePublished = async (faq: FaqItem) => {
    const nextPublished = !faq.isPublished;
    try {
      await api.put(`/faqs/${faq.id}`, { isPublished: nextPublished });
      setFaqs((prev) =>
        prev.map((f) => (f.id === faq.id ? { ...f, isPublished: nextPublished } : f))
      );
      showNotification('success', `Question is now ${nextPublished ? 'published' : 'draft'}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to toggle status';
      showNotification('error', msg);
    }
  };

  const handleSubmitModal = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.questionEn.trim()) {
      showNotification('error', 'Question in English is required');
      return;
    }

    if (!formData.answerEn.trim()) {
      showNotification('error', 'Answer in English is required');
      return;
    }

    const resolvedCategory =
      formData.category === 'Custom'
        ? formData.customCategory.trim() || 'General'
        : formData.category;

    const payload = {
      category: resolvedCategory,
      questionEn: formData.questionEn.trim(),
      questionAr: formData.questionAr.trim() || formData.questionEn.trim(),
      questionTr: formData.questionTr.trim() || formData.questionEn.trim(),
      answerEn: formData.answerEn.trim(),
      answerAr: formData.answerAr.trim() || formData.answerEn.trim(),
      answerTr: formData.answerTr.trim() || formData.answerEn.trim(),
      isPublished: formData.isPublished,
      orderIndex: Number(formData.orderIndex) || 1,
    };

    try {
      setSubmittingModal(true);
      if (editingFaqId) {
        const res = await api.put(`/faqs/${editingFaqId}`, payload);
        const updated = res.data?.data;
        setFaqs((prev) =>
          prev.map((f) => (f.id === editingFaqId ? { ...f, ...updated } : f))
        );
        showNotification('success', 'FAQ updated successfully');
      } else {
        const res = await api.post('/faqs', payload);
        const created = res.data?.data;
        if (created) {
          setFaqs((prev) => [...prev, created]);
          showNotification('success', 'FAQ created successfully');
        }
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save FAQ';
      showNotification('error', msg);
    } finally {
      setSubmittingModal(false);
    }
  };

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesCategory =
        activeCategoryFilter === 'ALL' ||
        faq.category.toLowerCase() === activeCategoryFilter.toLowerCase();
      const matchesSearch =
        faq.questionEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.questionAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.questionTr.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answerEn.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [faqs, activeCategoryFilter, searchQuery]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Loading Frequently Asked Questions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80 shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <HelpCircle className="w-5 h-5" />
            </span>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Frequently Asked Questions (الأسئلة الشائعة)
            </h1>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Manage inquiries, technical onboarding details, delivery timelines, and project scopes across 3 languages.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchData}
            className="p-2.5 rounded-xl text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white transition-all border border-slate-700/80"
            title="Reload"
          >
            <RotateCw className="w-4 h-4 text-slate-400" />
          </button>
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Question</span>
          </button>
        </div>
      </div>

      {/* Floating Notification */}
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

      {/* Copywriting Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Languages className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                FAQ Section Headings & Subtitle (عناوين السكشن والشعارات)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Customize badge, main headline, and subtitle shown above the accordion.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveCopywriting}
            disabled={savingCopywriting}
            className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 transition-all shadow-md shadow-emerald-500/20 active:scale-95 flex-shrink-0"
          >
            {savingCopywriting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Section Text</span>
              </>
            )}
          </button>
        </div>

        {/* 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* English */}
          <div className="space-y-4 p-4 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block pb-2 border-b border-slate-800">
              English (EN)
            </span>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1.5 block">Badge Text</label>
              <input
                type="text"
                value={copywriting.badgeEn || ''}
                onChange={(e) => setCopywriting((p) => ({ ...p, badgeEn: e.target.value }))}
                placeholder="e.g. Frequently Asked Questions"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1.5 block">Main Heading</label>
              <input
                type="text"
                value={copywriting.titleEn || ''}
                onChange={(e) => setCopywriting((p) => ({ ...p, titleEn: e.target.value }))}
                placeholder="e.g. Everything You Need To Know"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1.5 block">Subtitle</label>
              <textarea
                rows={2}
                value={copywriting.subtitleEn || ''}
                onChange={(e) => setCopywriting((p) => ({ ...p, subtitleEn: e.target.value }))}
                placeholder="Clear answers on estimations and workflows..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Arabic */}
          <div className="space-y-4 p-4 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block pb-2 border-b border-slate-800 text-right">
              العربية (AR)
            </span>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1.5 block text-right">شارة القسم (Badge)</label>
              <input
                type="text"
                dir="rtl"
                value={copywriting.badgeAr || ''}
                onChange={(e) => setCopywriting((p) => ({ ...p, badgeAr: e.target.value }))}
                placeholder="مثال: الأسئلة الشائعة"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-right"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1.5 block text-right">العنوان الرئيسي</label>
              <input
                type="text"
                dir="rtl"
                value={copywriting.titleAr || ''}
                onChange={(e) => setCopywriting((p) => ({ ...p, titleAr: e.target.value }))}
                placeholder="مثال: كل ما تحتاج معرفته حول التعاون البرمجي"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-right"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1.5 block text-right">الوصف الفرعي</label>
              <textarea
                rows={2}
                dir="rtl"
                value={copywriting.subtitleAr || ''}
                onChange={(e) => setCopywriting((p) => ({ ...p, subtitleAr: e.target.value }))}
                placeholder="إجابات واضحة حول تقدير المشاريع، المنهجيات الهندسية..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-right"
              />
            </div>
          </div>

          {/* Turkish */}
          <div className="space-y-4 p-4 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block pb-2 border-b border-slate-800">
              Türkçe (TR)
            </span>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1.5 block">Rozet Metni</label>
              <input
                type="text"
                value={copywriting.badgeTr || ''}
                onChange={(e) => setCopywriting((p) => ({ ...p, badgeTr: e.target.value }))}
                placeholder="Örn: Sıkça Sorulan Sorular"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1.5 block">Ana Başlık</label>
              <input
                type="text"
                value={copywriting.titleTr || ''}
                onChange={(e) => setCopywriting((p) => ({ ...p, titleTr: e.target.value }))}
                placeholder="Örn: İş Birliği Öncesinde Bilmeniz Gerekenler"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1.5 block">Alt Açıklama</label>
              <textarea
                rows={2}
                value={copywriting.subtitleTr || ''}
                onChange={(e) => setCopywriting((p) => ({ ...p, subtitleTr: e.target.value }))}
                placeholder="Proje tahminleri ve süreçler hakkında net yanıtlar..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>
      {/* ============================================================== */}
      {/* FAQS LIST & CATEGORY FILTERS                                   */}
      {/* ============================================================== */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
        {/* Top Filter and Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveCategoryFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeCategoryFilter === 'ALL'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              All Questions ({faqs.length})
            </button>
            {FAQ_CATEGORIES.map((cat) => {
              const count = faqs.filter((f) => f.category.toLowerCase() === cat.toLowerCase()).length;
              const isSelected = activeCategoryFilter.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategoryFilter(cat)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isSelected ? 'bg-slate-950/30 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input & Language Switcher */}
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-56">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs flex-shrink-0">
              <button
                type="button"
                onClick={() => setDisplayLanguage('en')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  displayLanguage === 'en' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setDisplayLanguage('ar')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  displayLanguage === 'ar' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                عربي
              </button>
              <button
                type="button"
                onClick={() => setDisplayLanguage('tr')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  displayLanguage === 'tr' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                TR
              </button>
            </div>
          </div>
        </div>

        {/* FAQs List Items */}
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <HelpCircle className="w-12 h-12 text-slate-700 mx-auto" />
            <p className="text-slate-300 font-semibold text-base">No questions found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Create comprehensive answers for client inquiries using the + Add Question button.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFaqs.map((faq) => {
              const isExpanded = expandedFaqId === faq.id;
              const displayQuestion =
                displayLanguage === 'ar'
                  ? faq.questionAr || faq.questionEn
                  : displayLanguage === 'tr'
                  ? faq.questionTr || faq.questionEn
                  : faq.questionEn || faq.questionAr;

              const displayAnswer =
                displayLanguage === 'ar'
                  ? faq.answerAr || faq.answerEn
                  : displayLanguage === 'tr'
                  ? faq.answerTr || faq.answerEn
                  : faq.answerEn || faq.answerAr;

              return (
                <div
                  key={faq.id}
                  className="bg-slate-950/70 border border-slate-800 rounded-2xl overflow-hidden transition-all hover:border-slate-700"
                >
                  {/* Card Header Accordion */}
                  <div className="p-4 sm:p-5 flex items-start justify-between gap-4">
                    <div
                      className="flex-1 cursor-pointer flex items-start gap-3"
                      onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                    >
                      <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400 font-bold mt-0.5">
                        #{faq.orderIndex}
                      </span>

                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {faq.category}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTogglePublished(faq);
                            }}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border transition-all ${
                              faq.isPublished
                                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                : 'bg-slate-800 text-slate-500 border-slate-700/60'
                            }`}
                          >
                            {faq.isPublished ? 'Published' : 'Draft'}
                          </button>
                        </div>

                        <h3
                          className="font-bold text-sm sm:text-base text-white tracking-tight"
                          dir={displayLanguage === 'ar' ? 'rtl' : 'ltr'}
                        >
                          {displayQuestion}
                        </h3>
                      </div>
                    </div>

                    {/* Actions and Expand chevron */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(faq)}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors"
                        title="Edit Question"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteFaq(faq.id, faq.questionEn)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                        title="Delete Question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Answer Preview / Expanded Body */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 border-t border-slate-850 space-y-3">
                      <p
                        className="text-xs sm:text-sm text-slate-300 leading-relaxed"
                        dir={displayLanguage === 'ar' ? 'rtl' : 'ltr'}
                      >
                        {displayAnswer}
                      </p>

                      {/* Multilingual Question Preview */}
                      <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-900 text-[11px] text-slate-500">
                        {displayLanguage !== 'en' && faq.questionEn && (
                          <span>
                            <strong className="text-slate-600 font-mono text-[10px]">EN:</strong> {faq.questionEn}
                          </span>
                        )}
                        {displayLanguage !== 'ar' && faq.questionAr && (
                          <span dir="rtl">
                            <strong className="text-slate-600 font-mono text-[10px]">AR:</strong> {faq.questionAr}
                          </span>
                        )}
                        {displayLanguage !== 'tr' && faq.questionTr && (
                          <span>
                            <strong className="text-slate-600 font-mono text-[10px]">TR:</strong> {faq.questionTr}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* ADD / EDIT FAQ MODAL                                           */}
      {/* ============================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <HelpCircle className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-base text-white">
                    {editingFaqId ? 'Edit FAQ Item' : 'New FAQ Item'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Define category, published status, questions, and answers across languages.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitModal} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Category, Order, Published */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 block">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    {FAQ_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="Custom">+ Custom Category...</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 block">Order Index</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.orderIndex}
                    onChange={(e) => setFormData((p) => ({ ...p, orderIndex: parseInt(e.target.value, 10) || 1 }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPublished}
                      onChange={(e) => setFormData((p) => ({ ...p, isPublished: e.target.checked }))}
                      className="rounded border-slate-800 text-emerald-500 focus:ring-0"
                    />
                    <span className="text-xs font-semibold text-slate-300">Published</span>
                  </label>
                </div>
              </div>

              {formData.category === 'Custom' && (
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 block">Custom Category Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.customCategory}
                    onChange={(e) => setFormData((p) => ({ ...p, customCategory: e.target.value }))}
                    placeholder="e.g. Security & Compliance"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              )}

              {/* Multilingual Tabs */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Question & Answer Across Languages
                  </span>
                  <div className="flex gap-1 bg-slate-950 p-1 rounded-xl text-xs">
                    <button
                      type="button"
                      onClick={() => setModalTab('en')}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                        modalTab === 'en' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      EN
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalTab('ar')}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                        modalTab === 'ar' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      عربي
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalTab('tr')}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                        modalTab === 'tr' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      TR
                    </button>
                  </div>
                </div>

                {modalTab === 'en' && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Question (English) *</label>
                      <input
                        type="text"
                        value={formData.questionEn}
                        onChange={(e) => setFormData((p) => ({ ...p, questionEn: e.target.value }))}
                        placeholder="e.g. How do you approach architectural discovery and sprints?"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Answer (English) *</label>
                      <textarea
                        rows={4}
                        value={formData.answerEn}
                        onChange={(e) => setFormData((p) => ({ ...p, answerEn: e.target.value }))}
                        placeholder="Clear answer explaining sprints, milestones, and testing..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                )}

                {modalTab === 'ar' && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block text-right">السؤال (بالعربية)</label>
                      <input
                        type="text"
                        dir="rtl"
                        value={formData.questionAr}
                        onChange={(e) => setFormData((p) => ({ ...p, questionAr: e.target.value }))}
                        placeholder="مثال: كيف تدير مراحل التخطيط المعماري وتسليم المشاريع؟"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-right"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block text-right">الإجابة (بالعربية)</label>
                      <textarea
                        rows={4}
                        dir="rtl"
                        value={formData.answerAr}
                        onChange={(e) => setFormData((p) => ({ ...p, answerAr: e.target.value }))}
                        placeholder="إجابة واضحة تشرح الخطوات، الفحوصات البرمجية، ومرونة التطوير..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-right"
                      />
                    </div>
                  </div>
                )}

                {modalTab === 'tr' && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Soru (Türkçe)</label>
                      <input
                        type="text"
                        value={formData.questionTr}
                        onChange={(e) => setFormData((p) => ({ ...p, questionTr: e.target.value }))}
                        placeholder="Örn: Mimari planlama ve geliştirme sürecini nasıl yönetiyorsunuz?"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Cevap (Türkçe)</label>
                      <textarea
                        rows={4}
                        value={formData.answerTr}
                        onChange={(e) => setFormData((p) => ({ ...p, answerTr: e.target.value }))}
                        placeholder="Süreç adımlarını, testleri ve teslimat modelini açıklayan net yanıt..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingModal}
                  className="flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 rounded-xl transition-all shadow-md shadow-emerald-500/20"
                >
                  {submittingModal ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingFaqId ? 'Update Question' : 'Save Question'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFaqs;
