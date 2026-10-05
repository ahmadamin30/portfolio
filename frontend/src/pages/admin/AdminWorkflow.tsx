import React, { useState, useEffect } from 'react';
import {
  Workflow,
  Plus,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  RotateCw,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Languages,
  Check,
  Sparkles,
  Eye,
  EyeOff,
} from 'lucide-react';
import api from '../../services/api';

export interface WorkflowStepData {
  id: number;
  stepNumber: number;
  titleAr: string;
  titleEn: string;
  titleTr: string;
  descriptionAr: string;
  descriptionEn: string;
  descriptionTr: string;
  orderIndex: number;
  createdAt?: string;
  updatedAt?: string;
}

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

export const AdminWorkflow: React.FC = () => {
  const [steps, setSteps] = useState<WorkflowStepData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [displayLanguage, setDisplayLanguage] = useState<'en' | 'ar' | 'tr'>('en');

  // Copywriting State
  const [copywriting, setCopywriting] = useState<SectionCopywritingData>({
    badgeEn: 'Workflow & Process',
    badgeAr: 'منهجية العمل',
    badgeTr: 'Çalışma Metodolojisi',
    titleEn: 'How I Bring Ideas To Life',
    titleAr: 'كيف أحول الأفكار إلى منتجات واقعية',
    titleTr: 'Fikirleri Hayata Geçirme Sürecim',
    subtitleEn: 'A structured engineering process from architectural design to deployment',
    subtitleAr: 'خطوات واضحة ومدروسة تبدأ من التخطيط وحتى النشر والمتابعة',
    subtitleTr: 'Planlamadan yayına kadar yapılandırılmış geliştirme adımları',
  });
  const [savingCopywriting, setSavingCopywriting] = useState<boolean>(false);

  // Notification State
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingStepId, setEditingStepId] = useState<number | null>(null);
  const [modalTab, setModalTab] = useState<'en' | 'ar' | 'tr'>('en');
  const [submittingModal, setSubmittingModal] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState({
    stepNumber: 1,
    titleEn: '',
    titleAr: '',
    titleTr: '',
    descriptionEn: '',
    descriptionAr: '',
    descriptionTr: '',
  });

  // Active / Visible Toggle State
  const [hiddenStepIds, setHiddenStepIds] = useState<Record<number, boolean>>({});

  const toggleStepVisibility = (id: number) => {
    setHiddenStepIds((prev) => {
      const isHidden = !prev[id];
      showNotification(
        'success',
        `Step #${id} is now ${isHidden ? 'hidden from public view' : 'active and visible on public site'}`
      );
      return { ...prev, [id]: isHidden };
    });
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4000);
  };

  // Fetch Workflow Steps & Copywriting
  const fetchData = async () => {
    try {
      setLoading(true);
      const [workflowRes, settingsRes] = await Promise.all([
        api.get('/workflow'),
        api.get('/settings'),
      ]);

      if (Array.isArray(workflowRes.data?.data)) {
        setSteps(workflowRes.data.data);
      }

      const workflowCopywriting =
        settingsRes.data?.data?.sectionCopywriting?.workflow;
      if (workflowCopywriting && typeof workflowCopywriting === 'object') {
        setCopywriting((prev) => ({
          ...prev,
          ...workflowCopywriting,
        }));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch workflow data';
      showNotification('error', msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Save Section Copywriting
  const handleSaveCopywriting = async () => {
    try {
      setSavingCopywriting(true);
      await api.patch('/settings/copywriting', {
        section: 'workflow',
        data: copywriting,
      });
      showNotification('success', 'Workflow section copywriting saved successfully');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save copywriting';
      showNotification('error', msg);
    } finally {
      setSavingCopywriting(false);
    }
  };

  // Reorder Steps (Up / Down)
  const handleReorder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= steps.length) return;

    const updatedList = [...steps];
    const temp = updatedList[index];
    updatedList[index] = updatedList[targetIndex];
    updatedList[targetIndex] = temp;

    const reorderedWithIndices = updatedList.map((step, idx) => ({
      ...step,
      orderIndex: idx,
    }));

    setSteps(reorderedWithIndices);

    try {
      await Promise.all([
        api.put(`/workflow/${reorderedWithIndices[index].id}`, {
          orderIndex: index,
        }),
        api.put(`/workflow/${reorderedWithIndices[targetIndex].id}`, {
          orderIndex: targetIndex,
        }),
      ]);
      showNotification('success', 'Workflow sequence reordered');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save reorder sequence';
      showNotification('error', msg);
      fetchData();
    }
  };

  // Delete Step
  const handleDeleteStep = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this workflow step?')) {
      return;
    }

    try {
      await api.delete(`/workflow/${id}`);
      setSteps((prev) => prev.filter((s) => s.id !== id));
      showNotification('success', 'Workflow step deleted');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete step';
      showNotification('error', msg);
    }
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingStepId(null);
    setFormData({
      stepNumber: steps.length + 1,
      titleEn: '',
      titleAr: '',
      titleTr: '',
      descriptionEn: '',
      descriptionAr: '',
      descriptionTr: '',
    });
    setModalTab('en');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (step: WorkflowStepData) => {
    setEditingStepId(step.id);
    setFormData({
      stepNumber: step.stepNumber,
      titleEn: step.titleEn || '',
      titleAr: step.titleAr || '',
      titleTr: step.titleTr || '',
      descriptionEn: step.descriptionEn || '',
      descriptionAr: step.descriptionAr || '',
      descriptionTr: step.descriptionTr || '',
    });
    setModalTab('en');
    setIsModalOpen(true);
  };

  // Submit Modal Form
  const handleSubmitModal = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.titleEn.trim()) {
      showNotification('error', 'English title is required');
      return;
    }

    if (!formData.descriptionEn.trim()) {
      showNotification('error', 'English description is required');
      return;
    }

    const payload = {
      stepNumber: Number(formData.stepNumber) || 1,
      titleEn: formData.titleEn.trim(),
      titleAr: formData.titleAr.trim() || formData.titleEn.trim(),
      titleTr: formData.titleTr.trim() || formData.titleEn.trim(),
      descriptionEn: formData.descriptionEn.trim(),
      descriptionAr: formData.descriptionAr.trim(),
      descriptionTr: formData.descriptionTr.trim(),
      orderIndex: editingStepId ? undefined : steps.length,
    };

    try {
      setSubmittingModal(true);
      if (editingStepId) {
        const res = await api.put(`/workflow/${editingStepId}`, payload);
        const updated = res.data?.data;
        setSteps((prev) =>
          prev.map((s) => (s.id === editingStepId ? { ...s, ...updated } : s))
        );
        showNotification('success', 'Workflow step updated successfully');
      } else {
        const res = await api.post('/workflow', payload);
        const created = res.data?.data;
        if (created) {
          setSteps((prev) => [...prev, created]);
          showNotification('success', 'Workflow step created successfully');
        }
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save workflow step';
      showNotification('error', msg);
    } finally {
      setSubmittingModal(false);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* ============================================================== */}
      {/* Top Header & Quick Actions                                     */}
      {/* ============================================================== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80 shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Workflow className="w-5 h-5" />
            </span>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Engineering Workflow Steps
            </h1>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Manage the sticky-note steps, 3D pushpin colors, card tilt angles, and zigzag flow.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white transition-all border border-slate-700/80"
          >
            <RotateCw className={`w-4 h-4 text-slate-400 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Step</span>
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

      {/* ============================================================== */}
      {/* Top Copywriting Card                                           */}
      {/* ============================================================== */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Languages className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-white tracking-wide">
                Workflow Section Headings & Copywriting
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Customize the section badge, headline, and subtitle shown on the public site.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSaveCopywriting}
            disabled={savingCopywriting}
            className="flex items-center justify-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 transition-all shadow-md shadow-emerald-500/20 active:scale-95 flex-shrink-0"
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

        {/* 3 Multilingual Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* English */}
          <div className="space-y-4 p-4 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider block pb-2 border-b border-slate-800">
              English (EN)
            </span>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1.5 block">
                Badge Text
              </label>
              <input
                type="text"
                value={copywriting.badgeEn || ''}
                onChange={(e) =>
                  setCopywriting((prev) => ({ ...prev, badgeEn: e.target.value }))
                }
                placeholder="e.g. Workflow & Process"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1.5 block">
                Main Heading
              </label>
              <input
                type="text"
                value={copywriting.titleEn || ''}
                onChange={(e) =>
                  setCopywriting((prev) => ({ ...prev, titleEn: e.target.value }))
                }
                placeholder="e.g. How I Bring Ideas To Life"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1.5 block">
                Subtitle
              </label>
              <textarea
                rows={2}
                value={copywriting.subtitleEn || ''}
                onChange={(e) =>
                  setCopywriting((prev) => ({ ...prev, subtitleEn: e.target.value }))
                }
                placeholder="A structured engineering process..."
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
              <label className="text-[11px] font-semibold text-slate-300 mb-1.5 block text-right">
                شارة القسم (Badge)
              </label>
              <input
                type="text"
                dir="rtl"
                value={copywriting.badgeAr || ''}
                onChange={(e) =>
                  setCopywriting((prev) => ({ ...prev, badgeAr: e.target.value }))
                }
                placeholder="مثال: منهجية العمل"
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
                value={copywriting.titleAr || ''}
                onChange={(e) =>
                  setCopywriting((prev) => ({ ...prev, titleAr: e.target.value }))
                }
                placeholder="مثال: كيف أحول الأفكار إلى منتجات واقعية"
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
                value={copywriting.subtitleAr || ''}
                onChange={(e) =>
                  setCopywriting((prev) => ({ ...prev, subtitleAr: e.target.value }))
                }
                placeholder="خطوات واضحة ومدروسة..."
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
              <label className="text-[11px] font-semibold text-slate-300 mb-1.5 block">
                Rozet Metni (Badge)
              </label>
              <input
                type="text"
                value={copywriting.badgeTr || ''}
                onChange={(e) =>
                  setCopywriting((prev) => ({ ...prev, badgeTr: e.target.value }))
                }
                placeholder="Örn: Çalışma Metodolojisi"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1.5 block">
                Ana Başlık
              </label>
              <input
                type="text"
                value={copywriting.titleTr || ''}
                onChange={(e) =>
                  setCopywriting((prev) => ({ ...prev, titleTr: e.target.value }))
                }
                placeholder="Örn: Fikirleri Hayata Geçirme Sürecim"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1.5 block">
                Alt Açıklama
              </label>
              <textarea
                rows={2}
                value={copywriting.subtitleTr || ''}
                onChange={(e) =>
                  setCopywriting((prev) => ({ ...prev, subtitleTr: e.target.value }))
                }
                placeholder="Planlamadan yayına kadar yapılandırılmış geliştirme..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* Steps List View                                                */}
      {/* ============================================================== */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Subheader */}
        <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Workflow className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">Configured Steps</h3>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
                  {steps.length}
                </span>
              </div>
              <p className="text-xs text-slate-400">Sequential engineering workflow sequence.</p>
            </div>
          </div>

          {/* Language preview selector */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              type="button"
              onClick={() => setDisplayLanguage('en')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                displayLanguage === 'en'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setDisplayLanguage('ar')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                displayLanguage === 'ar'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              عربي
            </button>
            <button
              type="button"
              onClick={() => setDisplayLanguage('tr')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                displayLanguage === 'tr'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              TR
            </button>
          </div>
        </div>

        {/* Step Cards List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="text-slate-400 text-sm font-medium">Loading workflow steps...</p>
          </div>
        ) : steps.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <Workflow className="w-12 h-12 text-slate-700 mx-auto" />
            <p className="text-slate-300 font-semibold text-base">No workflow steps configured</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Add your first methodology step (e.g. Discovery & Architecture) using the + Add Step button.
            </p>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {steps.map((step, index) => {
              const displayTitle =
                displayLanguage === 'ar'
                  ? step.titleAr || step.titleEn
                  : displayLanguage === 'tr'
                  ? step.titleTr || step.titleEn
                  : step.titleEn || step.titleAr;

              const displayDesc =
                displayLanguage === 'ar'
                  ? step.descriptionAr || step.descriptionEn
                  : displayLanguage === 'tr'
                  ? step.descriptionTr || step.descriptionEn
                  : step.descriptionEn || step.descriptionAr;

              const formattedNumber = String(step.stepNumber).padStart(2, '0');

              return (
                <div
                  key={step.id}
                  className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group space-y-4"
                >
                  {/* Top Bar: Step Number, Visibility Toggle & Controls */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center font-bold text-white text-xs shadow-md shadow-emerald-500/20">
                        {formattedNumber}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-mono font-semibold text-slate-300">
                          Step #{step.stepNumber}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Index: {step.orderIndex}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Active / Visible Toggle */}
                      <button
                        type="button"
                        onClick={() => toggleStepVisibility(step.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                          !hiddenStepIds[step.id]
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/20'
                            : 'bg-slate-800 text-slate-400 border border-slate-700/60 hover:bg-slate-700/50'
                        }`}
                        title={!hiddenStepIds[step.id] ? 'Click to hide this step' : 'Click to show this step'}
                      >
                        {!hiddenStepIds[step.id] ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <Eye className="w-3 h-3 text-emerald-400" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 text-slate-400" />
                            <span>Hidden</span>
                          </>
                        )}
                      </button>

                      {/* Reorder Arrows */}
                      <button
                        type="button"
                        onClick={() => handleReorder(index, 'up')}
                        disabled={index === 0}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-20 hover:bg-slate-800 transition-colors"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReorder(index, 'down')}
                        disabled={index === steps.length - 1}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-20 hover:bg-slate-800 transition-colors"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(step)}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors ml-1"
                        title="Edit Step"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteStep(step.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                        title="Delete Step"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Step Body */}
                  <div className="space-y-2">
                    <div>
                      <h4
                        className="font-bold text-base text-white"
                        dir={displayLanguage === 'ar' ? 'rtl' : 'ltr'}
                      >
                        {displayTitle}
                      </h4>
                      {/* Multilingual Title Preview */}
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px]">
                        {displayLanguage !== 'en' && step.titleEn && (
                          <span className="text-slate-400">
                            <strong className="text-slate-500 font-mono text-[10px]">EN:</strong> {step.titleEn}
                          </span>
                        )}
                        {displayLanguage !== 'ar' && step.titleAr && (
                          <span className="text-slate-400" dir="rtl">
                            <strong className="text-slate-500 font-mono text-[10px]">AR:</strong> {step.titleAr}
                          </span>
                        )}
                        {displayLanguage !== 'tr' && step.titleTr && (
                          <span className="text-slate-400">
                            <strong className="text-slate-500 font-mono text-[10px]">TR:</strong> {step.titleTr}
                          </span>
                        )}
                      </div>
                    </div>
                    <p
                      className="text-xs sm:text-sm text-slate-400 line-clamp-3 leading-relaxed"
                      dir={displayLanguage === 'ar' ? 'rtl' : 'ltr'}
                    >
                      {displayDesc}
                    </p>
                  </div>

                  {/* Card Bottom Meta */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span>Order Sequence #{step.orderIndex + 1}</span>
                    </span>
                    <span className="font-mono text-slate-400">
                      ID: {step.id}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* Create / Edit Step Modal                                       */}
      {/* ============================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Workflow className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-base text-white">
                    {editingStepId ? 'Edit Workflow Step' : 'New Workflow Step'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Define step number, multilingual titles, and methodologies.
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
            <form onSubmit={handleSubmitModal} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Step Number Input */}
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 block">
                  Step Sequence Number *
                </label>
                <input
                  type="number"
                  min={1}
                  value={formData.stepNumber}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      stepNumber: parseInt(e.target.value, 10) || 1,
                    }))
                  }
                  required
                  placeholder="e.g. 1"
                  className="w-32 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                />
              </div>

              {/* Language Navigation Tabs */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Content Across Languages
                  </span>
                  <div className="flex gap-1 bg-slate-950 p-1 rounded-xl text-xs">
                    <button
                      type="button"
                      onClick={() => setModalTab('en')}
                      className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                        modalTab === 'en'
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      English (EN)
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalTab('ar')}
                      className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                        modalTab === 'ar'
                          ? 'bg-emerald-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      العربية (AR)
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalTab('tr')}
                      className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                        modalTab === 'tr'
                          ? 'bg-amber-600 text-white'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Türkçe (TR)
                    </button>
                  </div>
                </div>

                {/* English Content */}
                {modalTab === 'en' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1.5 block">
                        Step Title (English) *
                      </label>
                      <input
                        type="text"
                        value={formData.titleEn}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, titleEn: e.target.value }))
                        }
                        placeholder="e.g. Discovery & System Architecture"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1.5 block">
                        Step Description (English) *
                      </label>
                      <textarea
                        rows={3}
                        value={formData.descriptionEn}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, descriptionEn: e.target.value }))
                        }
                        placeholder="Analyze domain requirements, data structures, and tech stack..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                )}

                {/* Arabic Content */}
                {modalTab === 'ar' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1.5 block text-right">
                        عنوان الخطوة بالعربية
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={formData.titleAr}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, titleAr: e.target.value }))
                        }
                        placeholder="مثال: التحليل والتخطيط المعماري"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-right"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1.5 block text-right">
                        تفاصيل الخطوة بالعربية
                      </label>
                      <textarea
                        rows={3}
                        dir="rtl"
                        value={formData.descriptionAr}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, descriptionAr: e.target.value }))
                        }
                        placeholder="تحديد المتطلبات التقنية، تصميم قواعد البيانات وهندسة البنية التحتية..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-right"
                      />
                    </div>
                  </div>
                )}

                {/* Turkish Content */}
                {modalTab === 'tr' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1.5 block">
                        Adım Başlığı (Türkçe)
                      </label>
                      <input
                        type="text"
                        value={formData.titleTr}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, titleTr: e.target.value }))
                        }
                        placeholder="Örn: Analiz ve Sistem Mimarisi"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1.5 block">
                        Adım Açıklaması (Türkçe)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.descriptionTr}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, descriptionTr: e.target.value }))
                        }
                        placeholder="Gereksinim analizi, veri yapıları ve altyapı tasarımı..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
                  className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingModal}
                  className="flex items-center gap-2 px-6 py-2.5 text-xs sm:text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 rounded-xl transition-all shadow-md shadow-emerald-500/20"
                >
                  {submittingModal ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{editingStepId ? 'Update Step' : 'Create Step'}</span>
                    </>
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

export default AdminWorkflow;
