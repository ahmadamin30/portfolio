import React, { useState, useEffect } from 'react';
import {
  Award,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  RotateCw,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Upload,
  Calendar,
  Building,
  Image as ImageIcon,
} from 'lucide-react';
import api from '../../services/api';

export interface CertificateItem {
  id: number;
  titleEn: string;
  titleAr: string;
  titleTr: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string | null;
  imageUrl?: string | null;
  orderIndex: number;
  createdAt?: string;
  updatedAt?: string;
}

export const AdminCertificates: React.FC = () => {
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [displayLanguage, setDisplayLanguage] = useState<'en' | 'ar' | 'tr'>('en');

  // Notification State
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingCertId, setEditingCertId] = useState<number | null>(null);
  const [modalTab, setModalTab] = useState<'en' | 'ar' | 'tr'>('en');
  const [submittingModal, setSubmittingModal] = useState<boolean>(false);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState({
    titleEn: '',
    titleAr: '',
    titleTr: '',
    issuer: '',
    issueDate: '',
    credentialUrl: '',
    imageUrl: '',
    orderIndex: 1,
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4000);
  };

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const res = await api.get('/certificates');
      if (Array.isArray(res.data?.data)) {
        setCertificates(res.data.data.sort((a: CertificateItem, b: CertificateItem) => a.orderIndex - b.orderIndex));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch certificates';
      showNotification('error', msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingCertId(null);
    setFormData({
      titleEn: '',
      titleAr: '',
      titleTr: '',
      issuer: '',
      issueDate: '',
      credentialUrl: '',
      imageUrl: '',
      orderIndex: certificates.length + 1,
    });
    setModalTab('en');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (cert: CertificateItem) => {
    setEditingCertId(cert.id);
    setFormData({
      titleEn: cert.titleEn || '',
      titleAr: cert.titleAr || '',
      titleTr: cert.titleTr || '',
      issuer: cert.issuer || '',
      issueDate: cert.issueDate || '',
      credentialUrl: cert.credentialUrl || '',
      imageUrl: cert.imageUrl || '',
      orderIndex: cert.orderIndex,
    });
    setModalTab('en');
    setIsModalOpen(true);
  };

  const handleDeleteCertificate = async (id: number, title: string) => {
    if (!window.confirm(`Are you sure you want to delete certificate "${title}"?`)) {
      return;
    }

    try {
      await api.delete(`/certificates/${id}`);
      setCertificates((prev) => prev.filter((c) => c.id !== id));
      showNotification('success', 'Certificate removed');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete certificate';
      showNotification('error', msg);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);

    try {
      setUploadingImage(true);
      const res = await api.post('/settings/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const fileUrl = res.data?.data?.fileUrl;
      if (fileUrl) {
        setFormData((prev) => ({ ...prev, imageUrl: fileUrl }));
        showNotification('success', 'Certificate badge image uploaded');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Image upload failed';
      showNotification('error', msg);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmitModal = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.titleEn.trim()) {
      showNotification('error', 'Certificate title in English is required');
      return;
    }
    if (!formData.issuer.trim()) {
      showNotification('error', 'Issuer authority is required');
      return;
    }
    if (!formData.issueDate.trim()) {
      showNotification('error', 'Issue date is required');
      return;
    }

    const payload = {
      titleEn: formData.titleEn.trim(),
      titleAr: formData.titleAr.trim() || formData.titleEn.trim(),
      titleTr: formData.titleTr.trim() || formData.titleEn.trim(),
      issuer: formData.issuer.trim(),
      issueDate: formData.issueDate.trim(),
      credentialUrl: formData.credentialUrl.trim() || null,
      imageUrl: formData.imageUrl.trim() || null,
      orderIndex: Number(formData.orderIndex) || 1,
    };

    try {
      setSubmittingModal(true);
      if (editingCertId) {
        const res = await api.put(`/certificates/${editingCertId}`, payload);
        const updated = res.data?.data;
        setCertificates((prev) =>
          prev.map((c) => (c.id === editingCertId ? { ...c, ...updated } : c))
        );
        showNotification('success', 'Certificate updated successfully');
      } else {
        const res = await api.post('/certificates', payload);
        const created = res.data?.data;
        if (created) {
          setCertificates((prev) => [...prev, created]);
          showNotification('success', 'Certificate created successfully');
        }
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save certificate';
      showNotification('error', msg);
    } finally {
      setSubmittingModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Loading Certificates & Accreditations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* Top Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80 shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Award className="w-5 h-5" />
            </span>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Certificates & Accreditations (الشهادات والاعتمادات)
            </h1>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Showcase verified cloud certifications, technical diplomas, and professional credentials.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Switcher */}
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

          <button
            type="button"
            onClick={fetchCertificates}
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
            <span>Add Certificate</span>
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
      {/* CERTIFICATES GRID DISPLAY                                      */}
      {/* ============================================================== */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Award className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-white tracking-wide">
              Credentials Portfolio ({certificates.length})
            </h2>
          </div>
        </div>

        {certificates.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <Award className="w-12 h-12 text-slate-700 mx-auto" />
            <p className="text-slate-300 font-semibold text-base">No certificates recorded</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Add your official certifications (AWS, Kubernetes, Cisco, Google Cloud) using the + Add Certificate button.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => {
              const displayTitle =
                displayLanguage === 'ar'
                  ? cert.titleAr || cert.titleEn
                  : displayLanguage === 'tr'
                  ? cert.titleTr || cert.titleEn
                  : cert.titleEn || cert.titleAr;

              return (
                <div
                  key={cert.id}
                  className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-md hover:shadow-xl flex flex-col justify-between space-y-4 group"
                >
                  {/* Top Bar: Order & Actions */}
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400 font-bold">
                      #{cert.orderIndex}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-slate-400 hover:text-emerald-400 rounded-lg hover:bg-slate-900 transition-colors"
                          title="View Verified Credential"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(cert)}
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors"
                        title="Edit Certificate"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCertificate(cert.id, cert.titleEn)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                        title="Delete Certificate"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Thumbnail / Badge Image */}
                  <div className="w-full h-36 rounded-xl bg-slate-900 border border-slate-800/80 overflow-hidden flex items-center justify-center relative">
                    {cert.imageUrl ? (
                      <img
                        src={cert.imageUrl}
                        alt={displayTitle}
                        className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-slate-600">
                        <Award className="w-10 h-10" />
                        <span className="text-[11px] font-medium">Verified Certificate</span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="space-y-2">
                    <h3
                      className="font-bold text-base text-white line-clamp-2"
                      dir={displayLanguage === 'ar' ? 'rtl' : 'ltr'}
                    >
                      {displayTitle}
                    </h3>

                    <div className="flex flex-col gap-1 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                        <Building className="w-3.5 h-3.5 text-slate-500" />
                        <span>{cert.issuer}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>Issued: {cert.issueDate}</span>
                      </div>
                    </div>

                    {/* Multilingual Title Tags */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500">
                      {displayLanguage !== 'en' && cert.titleEn && (
                        <span>
                          <strong className="text-slate-600 font-mono text-[10px]">EN:</strong> {cert.titleEn}
                        </span>
                      )}
                      {displayLanguage !== 'ar' && cert.titleAr && (
                        <span dir="rtl">
                          <strong className="text-slate-600 font-mono text-[10px]">AR:</strong> {cert.titleAr}
                        </span>
                      )}
                      {displayLanguage !== 'tr' && cert.titleTr && (
                        <span>
                          <strong className="text-slate-600 font-mono text-[10px]">TR:</strong> {cert.titleTr}
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
      {/* ADD / EDIT CERTIFICATE MODAL                                   */}
      {/* ============================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Award className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-base text-white">
                    {editingCertId ? 'Edit Certificate' : 'New Certificate'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Enter credential details, issuer organization, and upload badge image.
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
              {/* Image Upload Area */}
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 block">
                  Certificate Badge / Logo Image
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {formData.imageUrl ? (
                      <img src={formData.imageUrl} alt="Badge" className="w-full h-full object-contain p-1" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-600" />
                    )}
                  </div>
                  <div className="space-y-2 flex-1">
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer border border-slate-700 transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingImage ? 'Uploading...' : 'Upload Image File'}</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" disabled={uploadingImage} />
                    </label>
                    <input
                      type="text"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData((p) => ({ ...p, imageUrl: e.target.value }))}
                      placeholder="Or enter direct image URL..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Issuer and Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 block">
                    Issuing Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.issuer}
                    onChange={(e) => setFormData((p) => ({ ...p, issuer: e.target.value }))}
                    placeholder="e.g. Amazon Web Services, Google, Meta"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 block">
                    Issue Date *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.issueDate}
                    onChange={(e) => setFormData((p) => ({ ...p, issueDate: e.target.value }))}
                    placeholder="e.g. Aug 2023 or 2024"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Credential URL and Order */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 block">
                    Verification / Credential URL
                  </label>
                  <input
                    type="url"
                    value={formData.credentialUrl}
                    onChange={(e) => setFormData((p) => ({ ...p, credentialUrl: e.target.value }))}
                    placeholder="https://credly.com/badges/..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
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
              </div>

              {/* Multilingual Titles */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Certificate Title Across Languages
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
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Title (English) *</label>
                    <input
                      type="text"
                      value={formData.titleEn}
                      onChange={(e) => setFormData((p) => ({ ...p, titleEn: e.target.value }))}
                      placeholder="e.g. AWS Certified Solutions Architect - Associate"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                )}

                {modalTab === 'ar' && (
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 mb-1 block text-right">عنوان الشهادة (بالعربية)</label>
                    <input
                      type="text"
                      dir="rtl"
                      value={formData.titleAr}
                      onChange={(e) => setFormData((p) => ({ ...p, titleAr: e.target.value }))}
                      placeholder="مثال: مهندس حلول معتمد من أمازون ويب سيرفيسز"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-right"
                    />
                  </div>
                )}

                {modalTab === 'tr' && (
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 mb-1 block">Sertifika Başlığı (Türkçe)</label>
                    <input
                      type="text"
                      value={formData.titleTr}
                      onChange={(e) => setFormData((p) => ({ ...p, titleTr: e.target.value }))}
                      placeholder="Örn: AWS Sertifikalı Çözüm Mimarı"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
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
                    <span>{editingCertId ? 'Update Certificate' : 'Save Certificate'}</span>
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

export default AdminCertificates;
