import React, { useState, useEffect } from 'react';
import {
  Layers,
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
  Code,
  Server,
  Smartphone,
  Cloud,
  Shield,
  Cpu,
  Globe,
  Database,
} from 'lucide-react';
import api from '../../services/api';

export interface ServiceItem {
  id: number;
  serviceNumber: string;
  titleEn: string;
  titleAr: string;
  titleTr: string;
  descriptionEn: string;
  descriptionAr: string;
  descriptionTr: string;
  icon?: string | null;
  isActive: boolean;
  orderIndex: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServicesSectionCopywriting {
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

export const SERVICE_ICONS = [
  { id: 'code', label: 'Code', icon: Code },
  { id: 'server', label: 'Backend', icon: Server },
  { id: 'cloud', label: 'Cloud Architecture', icon: Cloud },
  { id: 'smartphone', label: 'Mobile Apps', icon: Smartphone },
  { id: 'shield', label: 'Security', icon: Shield },
  { id: 'cpu', label: 'System Design', icon: Cpu },
  { id: 'database', label: 'Database', icon: Database },
  { id: 'globe', label: 'Web Systems', icon: Globe },
];

export const AdminServices: React.FC = () => {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [displayLanguage, setDisplayLanguage] = useState<'en' | 'ar' | 'tr'>('en');

  // Copywriting State
  const [copywriting, setCopywriting] = useState<ServicesSectionCopywriting>({
    badgeEn: 'Services & Scope',
    badgeAr: 'الخدمات والحلول',
    badgeTr: 'Hizmetler ve Çözümler',
    titleEn: 'Engineering Capabilities Built For Scalable Growth',
    titleAr: 'حلول برمجية متقدمة مصممة لدفع النمو والتوسع التقني',
    titleTr: 'Ölçeklenebilir Büyüme İçin Geliştirilmiş Mühendislik Çözümleri',
    subtitleEn: 'From high-concurrency backend microservices to responsive modern frontend ecosystems.',
    subtitleAr: 'من البنى المعمارية عالية التزامن إلى الواجهات العصرية المتجاوبة وفائقة السرعة.',
    subtitleTr: 'Yüksek eşzamanlı arka uç mikroservislerinden modern arayüz ekosistemlerine kadar.',
  });
  const [savingCopywriting, setSavingCopywriting] = useState<boolean>(false);

  // Notification State
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [modalTab, setModalTab] = useState<'en' | 'ar' | 'tr'>('en');
  const [submittingModal, setSubmittingModal] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState({
    serviceNumber: '01',
    titleEn: '',
    titleAr: '',
    titleTr: '',
    descriptionEn: '',
    descriptionAr: '',
    descriptionTr: '',
    icon: 'code',
    isActive: true,
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
      const [servicesRes, settingsRes] = await Promise.all([
        api.get('/services'),
        api.get('/settings'),
      ]);

      if (Array.isArray(servicesRes.data?.data)) {
        setServices(servicesRes.data.data.sort((a: ServiceItem, b: ServiceItem) => a.orderIndex - b.orderIndex));
      }

      const servicesCopywriting = settingsRes.data?.data?.sectionCopywriting?.services;
      if (servicesCopywriting && typeof servicesCopywriting === 'object') {
        setCopywriting((prev) => ({
          ...prev,
          ...servicesCopywriting,
        }));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch services data';
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
        section: 'services',
        data: copywriting,
      });
      showNotification('success', 'Services copywriting saved successfully');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save section copywriting';
      showNotification('error', msg);
    } finally {
      setSavingCopywriting(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingServiceId(null);
    const nextNumber = String(services.length + 1).padStart(2, '0');
    setFormData({
      serviceNumber: nextNumber,
      titleEn: '',
      titleAr: '',
      titleTr: '',
      descriptionEn: '',
      descriptionAr: '',
      descriptionTr: '',
      icon: 'code',
      isActive: true,
      orderIndex: services.length + 1,
    });
    setModalTab('en');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (srv: ServiceItem) => {
    setEditingServiceId(srv.id);
    setFormData({
      serviceNumber: srv.serviceNumber || '01',
      titleEn: srv.titleEn || '',
      titleAr: srv.titleAr || '',
      titleTr: srv.titleTr || '',
      descriptionEn: srv.descriptionEn || '',
      descriptionAr: srv.descriptionAr || '',
      descriptionTr: srv.descriptionTr || '',
      icon: srv.icon || 'code',
      isActive: srv.isActive ?? true,
      orderIndex: srv.orderIndex,
    });
    setModalTab('en');
    setIsModalOpen(true);
  };

  const handleDeleteService = async (id: number, title: string) => {
    if (!window.confirm(`Are you sure you want to delete service "${title}"?`)) {
      return;
    }

    try {
      await api.delete(`/services/${id}`);
      setServices((prev) => prev.filter((s) => s.id !== id));
      showNotification('success', 'Service deleted successfully');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete service';
      showNotification('error', msg);
    }
  };

  const handleToggleActive = async (service: ServiceItem) => {
    const nextActive = !service.isActive;
    try {
      await api.put(`/services/${service.id}`, { isActive: nextActive });
      setServices((prev) =>
        prev.map((s) => (s.id === service.id ? { ...s, isActive: nextActive } : s))
      );
      showNotification('success', `Service is now ${nextActive ? 'active' : 'inactive'}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to toggle status';
      showNotification('error', msg);
    }
  };

  const handleSubmitModal = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.titleEn.trim()) {
      showNotification('error', 'Service title in English is required');
      return;
    }

    if (!formData.descriptionEn.trim()) {
      showNotification('error', 'Service description in English is required');
      return;
    }

    const payload = {
      serviceNumber: formData.serviceNumber.trim() || '01',
      titleEn: formData.titleEn.trim(),
      titleAr: formData.titleAr.trim() || formData.titleEn.trim(),
      titleTr: formData.titleTr.trim() || formData.titleEn.trim(),
      descriptionEn: formData.descriptionEn.trim(),
      descriptionAr: formData.descriptionAr.trim(),
      descriptionTr: formData.descriptionTr.trim(),
      icon: formData.icon,
      isActive: formData.isActive,
      orderIndex: Number(formData.orderIndex) || 1,
    };

    try {
      setSubmittingModal(true);
      if (editingServiceId) {
        const res = await api.put(`/services/${editingServiceId}`, payload);
        const updated = res.data?.data;
        setServices((prev) =>
          prev.map((s) => (s.id === editingServiceId ? { ...s, ...updated } : s))
        );
        showNotification('success', 'Service updated successfully');
      } else {
        const res = await api.post('/services', payload);
        const created = res.data?.data;
        if (created) {
          setServices((prev) => [...prev, created]);
          showNotification('success', 'Service created successfully');
        }
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save service';
      showNotification('error', msg);
    } finally {
      setSubmittingModal(false);
    }
  };

  const renderServiceIcon = (iconId?: string | null) => {
    const found = SERVICE_ICONS.find((i) => i.id === iconId);
    const Comp = found ? found.icon : Code;
    return <Comp className="w-5 h-5 text-emerald-400" />;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Loading Services & Offerings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80 shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Layers className="w-5 h-5" />
            </span>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Services & Technical Solutions (الخدمات والحلول)
            </h1>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Manage offerings, scope of work, technical architecture packages, and section copywriting across 3 languages.
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
            <span>Add Service</span>
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
      {/* SECTION COPYWRITING CARD (Services Headings & Subtitle)       */}
      {/* ============================================================== */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Languages className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Services Section Headings & Subtitle (عناوين وشعارات السكشن)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Customize badge, main headline, and subtitle shown at the top of the Services section.
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

        {/* 3 Multilingual Columns for Section Copywriting */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* English Column */}
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
                placeholder="e.g. Services & Scope"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1.5 block">Main Heading</label>
              <input
                type="text"
                value={copywriting.titleEn || ''}
                onChange={(e) => setCopywriting((p) => ({ ...p, titleEn: e.target.value }))}
                placeholder="e.g. Engineering Capabilities Built For Scale"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1.5 block">Subtitle</label>
              <textarea
                rows={2}
                value={copywriting.subtitleEn || ''}
                onChange={(e) => setCopywriting((p) => ({ ...p, subtitleEn: e.target.value }))}
                placeholder="From high-concurrency microservices..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Arabic Column */}
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
                placeholder="مثال: الخدمات والحلول"
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
                placeholder="مثال: حلول برمجية متقدمة مصممة لدفع النمو والتوسع"
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
                placeholder="من البنى المعمارية للخدمات المصغرة وحتى واجهات المستخدم..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-right"
              />
            </div>
          </div>

          {/* Turkish Column */}
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
                placeholder="Örn: Hizmetler ve Çözümler"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1.5 block">Ana Başlık</label>
              <input
                type="text"
                value={copywriting.titleTr || ''}
                onChange={(e) => setCopywriting((p) => ({ ...p, titleTr: e.target.value }))}
                placeholder="Örn: Ölçeklenebilir Büyüme İçin Çözümler"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1.5 block">Alt Açıklama</label>
              <textarea
                rows={2}
                value={copywriting.subtitleTr || ''}
                onChange={(e) => setCopywriting((p) => ({ ...p, subtitleTr: e.target.value }))}
                placeholder="Mikroservis mimarisinden modern arayüzlere..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>
      {/* ============================================================== */}
      {/* SERVICES LIST DISPLAY                                          */}
      {/* ============================================================== */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Layers className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-white tracking-wide">
              Configured Services & Solutions ({services.length})
            </h2>
          </div>

          {/* Language selector */}
          <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              type="button"
              onClick={() => setDisplayLanguage('en')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                displayLanguage === 'en' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setDisplayLanguage('ar')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                displayLanguage === 'ar' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              عربي
            </button>
            <button
              type="button"
              onClick={() => setDisplayLanguage('tr')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                displayLanguage === 'tr' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              TR
            </button>
          </div>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <Layers className="w-12 h-12 text-slate-700 mx-auto" />
            <p className="text-slate-300 font-semibold text-base">No services configured</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Add your engineering packages and client solutions via the + Add Service button.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((srv) => {
              const displayTitle =
                displayLanguage === 'ar'
                  ? srv.titleAr || srv.titleEn
                  : displayLanguage === 'tr'
                  ? srv.titleTr || srv.titleEn
                  : srv.titleEn || srv.titleAr;

              const displayDesc =
                displayLanguage === 'ar'
                  ? srv.descriptionAr || srv.descriptionEn
                  : displayLanguage === 'tr'
                  ? srv.descriptionTr || srv.descriptionEn
                  : srv.descriptionEn || srv.descriptionAr;

              return (
                <div
                  key={srv.id}
                  className="bg-slate-950/70 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all shadow-md hover:shadow-xl flex flex-col justify-between space-y-4 group"
                >
                  {/* Top Bar: Service Number Badge, Active Status & Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold tracking-wider">
                        SERVICE #{srv.serviceNumber || '01'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleActive(srv)}
                        className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border transition-all ${
                          srv.isActive
                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                            : 'bg-slate-800 text-slate-500 border-slate-700/60'
                        }`}
                        title="Click to toggle status"
                      >
                        {srv.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(srv)}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors"
                        title="Edit Service"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteService(srv.id, srv.titleEn)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                        title="Delete Service"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        {renderServiceIcon(srv.icon)}
                      </div>
                      <h3
                        className="font-bold text-base text-white tracking-tight leading-snug"
                        dir={displayLanguage === 'ar' ? 'rtl' : 'ltr'}
                      >
                        {displayTitle}
                      </h3>
                    </div>

                    <p
                      className="text-xs sm:text-sm text-slate-400 line-clamp-3 leading-relaxed"
                      dir={displayLanguage === 'ar' ? 'rtl' : 'ltr'}
                    >
                      {displayDesc}
                    </p>

                    {/* Multilingual Titles Preview */}
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-850 text-[11px] text-slate-500">
                      {displayLanguage !== 'en' && srv.titleEn && (
                        <span>
                          <strong className="text-slate-600 font-mono text-[10px]">EN:</strong> {srv.titleEn}
                        </span>
                      )}
                      {displayLanguage !== 'ar' && srv.titleAr && (
                        <span dir="rtl">
                          <strong className="text-slate-600 font-mono text-[10px]">AR:</strong> {srv.titleAr}
                        </span>
                      )}
                      {displayLanguage !== 'tr' && srv.titleTr && (
                        <span>
                          <strong className="text-slate-600 font-mono text-[10px]">TR:</strong> {srv.titleTr}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* ADD / EDIT SERVICE MODAL                                       */}
      {/* ============================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Layers className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-base text-white">
                    {editingServiceId ? 'Edit Service Offering' : 'New Service Offering'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Define service number, icon, and multilingual titles and descriptions.
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
              {/* Service Number, Active Checkbox, Order */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 block">
                    Service # *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.serviceNumber}
                    onChange={(e) => setFormData((p) => ({ ...p, serviceNumber: e.target.value }))}
                    placeholder="01"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 block">
                    Order Index
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.orderIndex}
                    onChange={(e) => setFormData((p) => ({ ...p, orderIndex: parseInt(e.target.value, 10) || 1 }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                      className="rounded border-slate-800 text-emerald-500 focus:ring-0"
                    />
                    <span className="text-xs font-semibold text-slate-300">Active / Published</span>
                  </label>
                </div>
              </div>

              {/* Icon Selector */}
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 block">
                  Service Icon
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {SERVICE_ICONS.map((opt) => {
                    const IconC = opt.icon;
                    const isSelected = formData.icon === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, icon: opt.id }))}
                        className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                          isSelected
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <IconC className="w-5 h-5" />
                        <span className="text-[10px] truncate max-w-full font-medium">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Multilingual Details Navigation Tabs */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Content Across Languages
                  </span>
                  <div className="flex gap-1 bg-slate-950 p-1 rounded-xl text-xs">
                    <button
                      type="button"
                      onClick={() => setModalTab('en')}
                      className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                        modalTab === 'en' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      English (EN)
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalTab('ar')}
                      className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                        modalTab === 'ar' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      العربية (AR)
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalTab('tr')}
                      className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                        modalTab === 'tr' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Türkçe (TR)
                    </button>
                  </div>
                </div>

                {modalTab === 'en' && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Title (English) *</label>
                      <input
                        type="text"
                        value={formData.titleEn}
                        onChange={(e) => setFormData((p) => ({ ...p, titleEn: e.target.value }))}
                        placeholder="e.g. Distributed Cloud Systems & Microservices"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Description (English) *</label>
                      <textarea
                        rows={3}
                        value={formData.descriptionEn}
                        onChange={(e) => setFormData((p) => ({ ...p, descriptionEn: e.target.value }))}
                        placeholder="Detailed scope, architecture patterns, and technologies..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                )}

                {modalTab === 'ar' && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block text-right">عنوان الخدمة (بالعربية)</label>
                      <input
                        type="text"
                        dir="rtl"
                        value={formData.titleAr}
                        onChange={(e) => setFormData((p) => ({ ...p, titleAr: e.target.value }))}
                        placeholder="مثال: هندسة الأنظمة السحابية والخدمات المصغرة"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-right"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block text-right">تفاصيل ونطاق الخدمة (بالعربية)</label>
                      <textarea
                        rows={3}
                        dir="rtl"
                        value={formData.descriptionAr}
                        onChange={(e) => setFormData((p) => ({ ...p, descriptionAr: e.target.value }))}
                        placeholder="وصف تفصيلي للخدمة، المعماريات المستخدمة، ونطاق التنفيذ..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-right"
                      />
                    </div>
                  </div>
                )}

                {modalTab === 'tr' && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Hizmet Başlığı (Türkçe)</label>
                      <input
                        type="text"
                        value={formData.titleTr}
                        onChange={(e) => setFormData((p) => ({ ...p, titleTr: e.target.value }))}
                        placeholder="Örn: Dağıtık Bulut Sistemleri ve Mikroservisler"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Hizmet Açıklaması (Türkçe)</label>
                      <textarea
                        rows={3}
                        value={formData.descriptionTr}
                        onChange={(e) => setFormData((p) => ({ ...p, descriptionTr: e.target.value }))}
                        placeholder="Hizmet kapsamı, mimari desenler ve sunulan çözümler..."
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
                    <span>{editingServiceId ? 'Update Service' : 'Save Service'}</span>
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

export default AdminServices;
