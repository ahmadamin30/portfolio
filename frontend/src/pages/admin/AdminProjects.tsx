import React, { useState, useEffect, useRef } from 'react';
import {
  Briefcase,
  Plus,
  Pencil,
  Trash2,
  Star,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Github,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  X,
  Languages,
  Check,
} from 'lucide-react';
import api from '../../services/api';

export interface ProjectData {
  id: number;
  titleAr: string;
  titleEn: string;
  titleTr: string;
  descriptionAr: string;
  descriptionEn: string;
  descriptionTr: string;
  imageUrl: string;
  liveUrl?: string | null;
  githubUrl?: string | null;
  tags: string[];
  isFeatured: boolean;
  orderIndex: number;
  createdAt?: string;
  updatedAt?: string;
}

interface ParsedProjectMetadata {
  role: string;
  year: string;
  isPublished: boolean;
  cleanTags: string[];
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

export const AdminProjects: React.FC = () => {
  // Main Data States
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [displayLanguage, setDisplayLanguage] = useState<'en' | 'ar' | 'tr'>('en');

  // Copywriting State
  const [copywriting, setCopywriting] = useState<SectionCopywritingData>({
    badgeEn: 'Portfolio Showcase',
    badgeAr: 'معرض الأعمال',
    badgeTr: 'Proje Galerisi',
    titleEn: 'Featured Projects',
    titleAr: 'أحدث المشاريع المنجزة',
    titleTr: 'Öne Çıkan Projeler',
    subtitleEn: 'A selection of full-stack engineering work and high-performance applications',
    subtitleAr: 'مجموعة من الحلول البرمجية المتكاملة وتطبيقات الويب عالية الأداء',
    subtitleTr: 'Tam kapsamlı yazılım çözümleri ve yüksek performanslı web uygulamaları',
  });
  const [savingCopywriting, setSavingCopywriting] = useState<boolean>(false);

  // Notification State
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [modalTab, setModalTab] = useState<'en' | 'ar' | 'tr'>('en');
  const [submittingModal, setSubmittingModal] = useState<boolean>(false);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal Form State
  const [formData, setFormData] = useState({
    titleEn: '',
    titleAr: '',
    titleTr: '',
    descriptionEn: '',
    descriptionAr: '',
    descriptionTr: '',
    imageUrl: '',
    role: 'Full-Stack Developer',
    year: new Date().getFullYear().toString(),
    liveUrl: '',
    githubUrl: '',
    tagInput: '',
    tags: [] as string[],
    isFeatured: false,
    isPublished: true,
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4000);
  };

  // Helper to parse metadata from tags array
  const parseProjectMetadata = (tags: string[], createdAt?: string): ParsedProjectMetadata => {
    let role = 'Full-Stack Developer';
    let year = createdAt ? new Date(createdAt).getFullYear().toString() : '2025';
    let isPublished = true;
    const cleanTags: string[] = [];

    tags.forEach((tag) => {
      if (tag.startsWith('role:')) {
        role = tag.replace('role:', '').trim() || role;
      } else if (tag.startsWith('year:')) {
        year = tag.replace('year:', '').trim() || year;
      } else if (tag === 'status:draft') {
        isPublished = false;
      } else if (tag === 'status:published') {
        isPublished = true;
      } else {
        cleanTags.push(tag);
      }
    });

    return { role, year, isPublished, cleanTags };
  };

  // Helper to slugify title
  const generateSlug = (titleEn: string): string => {
    const slug = titleEn
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    return slug ? `/projects/${slug}` : '/projects/case-study';
  };

  // Initial Fetch: Projects & Copywriting
  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectsRes, settingsRes] = await Promise.all([
        api.get('/projects'),
        api.get('/settings'),
      ]);

      if (Array.isArray(projectsRes.data?.data)) {
        setProjects(projectsRes.data.data);
      }

      const projectsCopywriting =
        settingsRes.data?.data?.sectionCopywriting?.projects;
      if (projectsCopywriting && typeof projectsCopywriting === 'object') {
        setCopywriting((prev) => ({
          ...prev,
          ...projectsCopywriting,
        }));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch projects data';
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
        section: 'projects',
        data: copywriting,
      });
      showNotification('success', 'Projects section copywriting updated successfully');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save copywriting';
      showNotification('error', msg);
    } finally {
      setSavingCopywriting(false);
    }
  };

  // Toggle Featured Status
  const handleToggleFeatured = async (project: ProjectData) => {
    const updatedStatus = !project.isFeatured;
    try {
      // Optimistic update
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, isFeatured: updatedStatus } : p))
      );

      await api.put(`/projects/${project.id}`, {
        isFeatured: updatedStatus,
      });

      showNotification(
        'success',
        `Project marked as ${updatedStatus ? 'Featured ★' : 'Standard'}`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update featured state';
      showNotification('error', msg);
      // Revert optimistic update
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, isFeatured: !updatedStatus } : p))
      );
    }
  };

  // Toggle Published / Draft Status
  const handleTogglePublished = async (project: ProjectData) => {
    const meta = parseProjectMetadata(project.tags, project.createdAt);
    const newIsPublished = !meta.isPublished;

    const newTags = [
      ...meta.cleanTags,
      `role:${meta.role}`,
      `year:${meta.year}`,
      newIsPublished ? 'status:published' : 'status:draft',
    ];

    try {
      // Optimistic update
      setProjects((prev) =>
        prev.map((p) => (p.id === project.id ? { ...p, tags: newTags } : p))
      );

      await api.put(`/projects/${project.id}`, {
        tags: newTags,
      });

      showNotification(
        'success',
        `Project status set to ${newIsPublished ? 'Published' : 'Draft'}`
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update status';
      showNotification('error', msg);
      fetchData();
    }
  };

  // Reorder Projects (Up / Down)
  const handleReorder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const updatedList = [...projects];
    const temp = updatedList[index];
    updatedList[index] = updatedList[targetIndex];
    updatedList[targetIndex] = temp;

    // Re-assign orderIndex sequentially
    const reorderedWithIndices = updatedList.map((proj, idx) => ({
      ...proj,
      orderIndex: idx,
    }));

    setProjects(reorderedWithIndices);

    try {
      // Persist the two swapped projects
      await Promise.all([
        api.put(`/projects/${reorderedWithIndices[index].id}`, {
          orderIndex: index,
        }),
        api.put(`/projects/${reorderedWithIndices[targetIndex].id}`, {
          orderIndex: targetIndex,
        }),
      ]);
      showNotification('success', 'Order updated successfully');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to persist order';
      showNotification('error', msg);
      fetchData();
    }
  };

  // Delete Project
  const handleDeleteProject = async (id: number) => {
    if (!window.confirm('Are you sure you want to permanently delete this project?')) {
      return;
    }

    try {
      await api.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      showNotification('success', 'Project deleted successfully');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete project';
      showNotification('error', msg);
    }
  };

  // Open Modal for Create
  const handleOpenCreateModal = () => {
    setEditingProjectId(null);
    setFormData({
      titleEn: '',
      titleAr: '',
      titleTr: '',
      descriptionEn: '',
      descriptionAr: '',
      descriptionTr: '',
      imageUrl: '',
      role: 'Full-Stack Developer',
      year: new Date().getFullYear().toString(),
      liveUrl: '',
      githubUrl: '',
      tagInput: '',
      tags: ['React', 'TypeScript', 'Node.js'],
      isFeatured: false,
      isPublished: true,
    });
    setModalTab('en');
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (project: ProjectData) => {
    const meta = parseProjectMetadata(project.tags, project.createdAt);
    setEditingProjectId(project.id);
    setFormData({
      titleEn: project.titleEn || '',
      titleAr: project.titleAr || '',
      titleTr: project.titleTr || '',
      descriptionEn: project.descriptionEn || '',
      descriptionAr: project.descriptionAr || '',
      descriptionTr: project.descriptionTr || '',
      imageUrl: project.imageUrl || '',
      role: meta.role,
      year: meta.year,
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || '',
      tagInput: '',
      tags: meta.cleanTags,
      isFeatured: project.isFeatured,
      isPublished: meta.isPublished,
    });
    setModalTab('en');
    setIsModalOpen(true);
  };

  // Upload Project Image
  const handleUploadImage = async (file: File) => {
    const data = new FormData();
    data.append('file', file);

    try {
      setUploadingImage(true);
      const res = await api.post('/settings/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const url = res.data?.data?.url;
      if (url) {
        setFormData((prev) => ({ ...prev, imageUrl: url }));
        showNotification('success', 'Project image uploaded');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Image upload failed';
      showNotification('error', msg);
    } finally {
      setUploadingImage(false);
    }
  };

  // Add Tag Pill
  const handleAddTag = () => {
    if (!formData.tagInput.trim()) return;
    const tag = formData.tagInput.trim();
    if (!formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
        tagInput: '',
      }));
    } else {
      setFormData((prev) => ({ ...prev, tagInput: '' }));
    }
  };

  // Remove Tag Pill
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove),
    }));
  };

  // Submit Modal (Create or Update)
  const handleSubmitModal = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.titleEn.trim() && !formData.titleAr.trim() && !formData.titleTr.trim()) {
      showNotification('error', 'Please provide a title in at least one language.');
      return;
    }

    if (!formData.imageUrl.trim()) {
      showNotification('error', 'Please upload or provide an image URL for the project.');
      return;
    }

    const encodedTags = [
      ...formData.tags,
      `role:${formData.role.trim() || 'Full-Stack Developer'}`,
      `year:${formData.year.trim() || new Date().getFullYear().toString()}`,
      formData.isPublished ? 'status:published' : 'status:draft',
    ];

    const payload = {
      titleEn: formData.titleEn.trim() || formData.titleAr.trim() || formData.titleTr.trim(),
      titleAr: formData.titleAr.trim() || formData.titleEn.trim(),
      titleTr: formData.titleTr.trim() || formData.titleEn.trim(),
      descriptionEn: formData.descriptionEn.trim(),
      descriptionAr: formData.descriptionAr.trim(),
      descriptionTr: formData.descriptionTr.trim(),
      imageUrl: formData.imageUrl.trim(),
      liveUrl: formData.liveUrl.trim() || null,
      githubUrl: formData.githubUrl.trim() || null,
      tags: encodedTags,
      isFeatured: formData.isFeatured,
      orderIndex: editingProjectId ? undefined : projects.length,
    };

    try {
      setSubmittingModal(true);
      if (editingProjectId) {
        const res = await api.put(`/projects/${editingProjectId}`, payload);
        const updated = res.data?.data;
        setProjects((prev) =>
          prev.map((p) => (p.id === editingProjectId ? { ...p, ...updated } : p))
        );
        showNotification('success', 'Project updated successfully');
      } else {
        const res = await api.post('/projects', payload);
        const created = res.data?.data;
        if (created) {
          setProjects((prev) => [...prev, created]);
          showNotification('success', 'Project created successfully');
        }
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save project';
      showNotification('error', msg);
    } finally {
      setSubmittingModal(false);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* ============================================================== */}
      {/* 1. Section Copywriting Card                                    */}
      {/* ============================================================== */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Languages className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-white tracking-wide">
                Projects Section Headings & Subtitle
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Edit the badge, main heading, and subtitle shown at the top of the Projects section on the homepage.
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

        {/* 3-Column Multilingual Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* English Column */}
          <div className="space-y-4 p-4 rounded-xl bg-slate-950/40 border border-slate-800/80">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-xs font-bold text-blue-400 uppercase tracking-wider">
              <span>English (EN)</span>
            </div>

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
                placeholder="e.g. Portfolio Showcase"
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
                placeholder="e.g. Featured Projects"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1.5 block">
                Subtitle / Description
              </label>
              <textarea
                rows={3}
                value={copywriting.subtitleEn || ''}
                onChange={(e) =>
                  setCopywriting((prev) => ({ ...prev, subtitleEn: e.target.value }))
                }
                placeholder="Subtitle explaining featured projects..."
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
                value={copywriting.badgeAr || ''}
                onChange={(e) =>
                  setCopywriting((prev) => ({ ...prev, badgeAr: e.target.value }))
                }
                placeholder="مثال: معرض الأعمال"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-right"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1.5 block text-right">
                العنوان الرئيسي للقسم
              </label>
              <input
                type="text"
                dir="rtl"
                value={copywriting.titleAr || ''}
                onChange={(e) =>
                  setCopywriting((prev) => ({ ...prev, titleAr: e.target.value }))
                }
                placeholder="مثال: أحدث المشاريع المنجزة"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-right"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1.5 block text-right">
                الوصف الفرعي
              </label>
              <textarea
                rows={3}
                dir="rtl"
                value={copywriting.subtitleAr || ''}
                onChange={(e) =>
                  setCopywriting((prev) => ({ ...prev, subtitleAr: e.target.value }))
                }
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
                value={copywriting.badgeTr || ''}
                onChange={(e) =>
                  setCopywriting((prev) => ({ ...prev, badgeTr: e.target.value }))
                }
                placeholder="Örn: Proje Galerisi"
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
                placeholder="Örn: Öne Çıkan Projeler"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 mb-1.5 block">
                Alt Açıklama
              </label>
              <textarea
                rows={3}
                value={copywriting.subtitleTr || ''}
                onChange={(e) =>
                  setCopywriting((prev) => ({ ...prev, subtitleTr: e.target.value }))
                }
                placeholder="Bölüm ana başlığı altında gösterilen açıklama..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
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
      {/* 2. Projects Action Bar & Structured Table                      */}
      {/* ============================================================== */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Top Action Bar */}
        <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Briefcase className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">Projects</h2>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
                {projects.length}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Manage your portfolio case studies.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Language view preview toggle */}
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

            {/* + New Project Button */}
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="text-slate-400 text-sm font-medium">Loading project showcase...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <Briefcase className="w-12 h-12 text-slate-700 mx-auto" />
            <p className="text-slate-300 font-semibold text-base">No projects found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Get started by adding your first project case study using the button above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-28">ORDER / الترتيب</th>
                  <th className="py-3.5 px-4">PROJECT</th>
                  <th className="py-3.5 px-4">ROLE</th>
                  <th className="py-3.5 px-4 text-center w-28">FEATURED</th>
                  <th className="py-3.5 px-4 text-center w-28">STATUS</th>
                  <th className="py-3.5 px-4 text-center w-24">YEAR</th>
                  <th className="py-3.5 px-4 text-right w-24">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs sm:text-sm">
                {projects.map((project, index) => {
                  const meta = parseProjectMetadata(project.tags, project.createdAt);
                  const displayTitle =
                    displayLanguage === 'ar'
                      ? project.titleAr || project.titleEn
                      : displayLanguage === 'tr'
                      ? project.titleTr || project.titleEn
                      : project.titleEn || project.titleAr;
                  const slug = generateSlug(project.titleEn);

                  return (
                    <tr
                      key={project.id}
                      className="hover:bg-slate-850/40 transition-colors group"
                    >
                      {/* 1. ORDER */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono text-xs font-semibold">
                            #{index + 1}
                          </span>
                          <div className="flex flex-col gap-0.5">
                            <button
                              type="button"
                              onClick={() => handleReorder(index, 'up')}
                              disabled={index === 0}
                              className="p-1 rounded text-slate-500 hover:text-white disabled:opacity-20 hover:bg-slate-800 transition-colors"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReorder(index, 'down')}
                              disabled={index === projects.length - 1}
                              className="p-1 rounded text-slate-500 hover:text-white disabled:opacity-20 hover:bg-slate-800 transition-colors"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* 2. PROJECT */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3.5">
                          {/* Thumbnail */}
                          <div className="w-12 h-10 rounded-lg overflow-hidden bg-slate-950 border border-slate-800 flex-shrink-0 flex items-center justify-center">
                            {project.imageUrl ? (
                              <img
                                src={project.imageUrl}
                                alt={displayTitle}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Briefcase className="w-5 h-5 text-slate-700" />
                            )}
                          </div>
                          {/* Title & Slug */}
                          <div className="min-w-0">
                            <span className="font-semibold text-white truncate block">
                              {displayTitle}
                            </span>
                            <span className="text-[11px] text-emerald-400 font-mono block truncate">
                              {slug}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 3. ROLE */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 font-medium text-xs">
                          {meta.role}
                        </span>
                      </td>

                      {/* 4. FEATURED */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(project)}
                          className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors inline-flex items-center justify-center"
                          title={project.isFeatured ? 'Featured (Click to unfeature)' : 'Mark as Featured'}
                        >
                          <Star
                            className={`w-4 h-4 transition-transform hover:scale-110 ${
                              project.isFeatured
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-slate-600 hover:text-slate-400'
                            }`}
                          />
                        </button>
                      </td>

                      {/* 5. STATUS */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleTogglePublished(project)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                            meta.isPublished
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/20'
                              : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-slate-200'
                          }`}
                          title="Click to toggle status"
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              meta.isPublished ? 'bg-emerald-400' : 'bg-slate-500'
                            }`}
                          />
                          <span>{meta.isPublished ? 'Published' : 'Draft'}</span>
                        </button>
                      </td>

                      {/* 6. YEAR */}
                      <td className="py-4 px-4 text-center text-slate-400 font-mono text-xs whitespace-nowrap">
                        {meta.year}
                      </td>

                      {/* 7. ACTIONS */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(project)}
                            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                            title="Edit Project"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteProject(project.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                            title="Delete Project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* 3. Create & Edit Project Modal                                 */}
      {/* ============================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Briefcase className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-base text-white">
                    {editingProjectId ? 'Edit Project' : 'New Project'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Configure showcase case study and multilingual descriptions.
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
              {/* Language Tabs for Title & Description */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Title & Description (Multilingual)
                  </label>
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
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block">
                        Project Title (EN) *
                      </label>
                      <input
                        type="text"
                        value={formData.titleEn}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, titleEn: e.target.value }))
                        }
                        placeholder="e.g. Next-Gen Enterprise E-Commerce"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block">
                        Project Description (EN)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.descriptionEn}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, descriptionEn: e.target.value }))
                        }
                        placeholder="Summary of architecture, features, and engineering achievements..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                )}

                {/* Arabic Content (dir="rtl") */}
                {modalTab === 'ar' && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block text-right">
                        عنوان المشروع بالعربية (AR)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={formData.titleAr}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, titleAr: e.target.value }))
                        }
                        placeholder="مثال: منصة التجارة الإلكترونية المتقدمة"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-right"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block text-right">
                        تفاصيل ووصف المشروع بالعربية
                      </label>
                      <textarea
                        rows={3}
                        dir="rtl"
                        value={formData.descriptionAr}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, descriptionAr: e.target.value }))
                        }
                        placeholder="تفاصيل حول التقنيات المستخدمة والحلول الهندسية المقدمة..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-right"
                      />
                    </div>
                  </div>
                )}

                {/* Turkish Content */}
                {modalTab === 'tr' && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block">
                        Proje Başlığı (TR)
                      </label>
                      <input
                        type="text"
                        value={formData.titleTr}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, titleTr: e.target.value }))
                        }
                        placeholder="Örn: Yeni Nesil E-Ticaret Platformu"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block">
                        Proje Açıklaması (TR)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.descriptionTr}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, descriptionTr: e.target.value }))
                        }
                        placeholder="Mimari, temel özellikler ve teknik detaylar..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Project Image & Upload */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Project Cover Image *
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="w-24 h-16 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {formData.imageUrl ? (
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UploadCloud className="w-6 h-6 text-slate-600" />
                    )}
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleUploadImage(e.target.files[0]);
                        }
                      }}
                      accept="image/*"
                      className="hidden"
                    />

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.imageUrl}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, imageUrl: e.target.value }))
                        }
                        placeholder="/uploads/... or https://..."
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-1.5 disabled:opacity-50"
                      >
                        {uploadingImage ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <UploadCloud className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                        <span>Upload</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Role & Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 mb-1.5 block">
                    Engineering Role / Position
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, role: e.target.value }))
                    }
                    placeholder="e.g. Full-Stack Developer"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 mb-1.5 block">
                    Project Year
                  </label>
                  <input
                    type="text"
                    value={formData.year}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, year: e.target.value }))
                    }
                    placeholder="e.g. 2025"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              {/* URLs: Live Demo & GitHub */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 mb-1.5 block">
                    Live Demo URL (optional)
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={formData.liveUrl}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, liveUrl: e.target.value }))
                      }
                      placeholder="https://my-app.com"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <ExternalLink className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 mb-1.5 block">
                    GitHub Repository URL (optional)
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={formData.githubUrl}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, githubUrl: e.target.value }))
                      }
                      placeholder="https://github.com/..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <Github className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  </div>
                </div>
              </div>

              {/* Dynamic Tags Input */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-300 block">
                  Tech Stack Tags
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.tagInput}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, tagInput: e.target.value }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    placeholder="Type a technology (e.g. Next.js) and press Enter"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-white"
                  >
                    Add
                  </button>
                </div>

                {/* Tag Pills Display */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-slate-400 hover:text-rose-400"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Checkboxes: Featured & Published */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer hover:bg-slate-950">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, isFeatured: e.target.checked }))
                    }
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 border-slate-700 bg-slate-900"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Featured Project ★</span>
                    <span className="text-[11px] text-slate-400 block">
                      Promote this project to the top hero showcase.
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer hover:bg-slate-950">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, isPublished: e.target.checked }))
                    }
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 border-slate-700 bg-slate-900"
                  />
                  <div>
                    <span className="text-xs font-bold text-white block">Publish Status</span>
                    <span className="text-[11px] text-slate-400 block">
                      Set to Published to make visible to public visitors.
                    </span>
                  </div>
                </label>
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
                      <span>{editingProjectId ? 'Update Project' : 'Create Project'}</span>
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

export default AdminProjects;
