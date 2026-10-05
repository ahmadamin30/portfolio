import React, { useState, useEffect, useMemo } from 'react';
import {
  GraduationCap,
  Briefcase,
  Award,
  Code,
  Laptop,
  Sparkles,
  Building,
  BookOpen,
  Calendar,
  MapPin,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  RotateCw,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Check,
} from 'lucide-react';
import api from '../../services/api';

export type ExperienceType = 'EDUCATION' | 'WORK' | 'MILESTONE';

export interface ExperienceItem {
  id: number;
  type: ExperienceType | string;
  degreeOrRoleAr: string;
  degreeOrRoleEn: string;
  degreeOrRoleTr: string;
  institutionOrCompanyAr: string;
  institutionOrCompanyEn: string;
  institutionOrCompanyTr: string;
  startDate: string;
  endDate?: string | null;
  locationAr: string;
  locationEn: string;
  locationTr: string;
  icon?: string | null;
  nodeColor: string;
  descriptionAr: string;
  descriptionEn: string;
  descriptionTr: string;
  orderIndex: number;
  createdAt?: string;
  updatedAt?: string;
}

export const COLOR_OPTIONS = [
  { name: 'Amber', hex: '#F59E0B', ring: 'ring-amber-500', bg: 'bg-amber-500' },
  { name: 'Coral', hex: '#F43F5E', ring: 'ring-rose-500', bg: 'bg-rose-500' },
  { name: 'Teal', hex: '#14B8A6', ring: 'ring-teal-500', bg: 'bg-teal-500' },
  { name: 'Blue', hex: '#3B82F6', ring: 'ring-blue-500', bg: 'bg-blue-500' },
  { name: 'Purple', hex: '#8B5CF6', ring: 'ring-purple-500', bg: 'bg-purple-500' },
  { name: 'Emerald', hex: '#10B981', ring: 'ring-emerald-500', bg: 'bg-emerald-500' },
];

export const ICON_OPTIONS = [
  { id: 'graduation-cap', label: 'Education', icon: GraduationCap },
  { id: 'briefcase', label: 'Career', icon: Briefcase },
  { id: 'award', label: 'Milestone', icon: Award },
  { id: 'code', label: 'Code', icon: Code },
  { id: 'laptop', label: 'Tech', icon: Laptop },
  { id: 'sparkles', label: 'Achievement', icon: Sparkles },
  { id: 'building', label: 'Company', icon: Building },
  { id: 'book-open', label: 'Academic', icon: BookOpen },
];

export const AdminExperience: React.FC = () => {
  const [experiences, setExperiences] = useState<ExperienceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTypeFilter, setActiveTypeFilter] = useState<'ALL' | ExperienceType>('ALL');
  const [displayLanguage, setDisplayLanguage] = useState<'en' | 'ar' | 'tr'>('en');

  // Notification State
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingExpId, setEditingExpId] = useState<number | null>(null);
  const [modalTab, setModalTab] = useState<'en' | 'ar' | 'tr'>('en');
  const [submittingModal, setSubmittingModal] = useState<boolean>(false);
  const [isCurrentlyActive, setIsCurrentlyActive] = useState<boolean>(false);

  // Form State
  const [formData, setFormData] = useState({
    type: 'WORK' as ExperienceType,
    degreeOrRoleEn: '',
    degreeOrRoleAr: '',
    degreeOrRoleTr: '',
    institutionOrCompanyEn: '',
    institutionOrCompanyAr: '',
    institutionOrCompanyTr: '',
    startDate: '',
    endDate: '',
    locationEn: '',
    locationAr: '',
    locationTr: '',
    icon: 'briefcase',
    nodeColor: '#10B981',
    descriptionEn: '',
    descriptionAr: '',
    descriptionTr: '',
    orderIndex: 0,
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4000);
  };

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const res = await api.get('/experience');
      if (Array.isArray(res.data?.data)) {
        setExperiences(res.data.data);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch experience data';
      showNotification('error', msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  // Quick Open Modal helpers
  const handleOpenCreateModal = (type: ExperienceType = 'WORK') => {
    setEditingExpId(null);
    let defaultIcon = 'briefcase';
    let defaultColor = '#10B981';

    if (type === 'EDUCATION') {
      defaultIcon = 'graduation-cap';
      defaultColor = '#3B82F6';
    } else if (type === 'MILESTONE') {
      defaultIcon = 'award';
      defaultColor = '#F59E0B';
    }

    setFormData({
      type,
      degreeOrRoleEn: '',
      degreeOrRoleAr: '',
      degreeOrRoleTr: '',
      institutionOrCompanyEn: '',
      institutionOrCompanyAr: '',
      institutionOrCompanyTr: '',
      startDate: '',
      endDate: '',
      locationEn: '',
      locationAr: '',
      locationTr: '',
      icon: defaultIcon,
      nodeColor: defaultColor,
      descriptionEn: '',
      descriptionAr: '',
      descriptionTr: '',
      orderIndex: experiences.length + 1,
    });
    setIsCurrentlyActive(false);
    setModalTab('en');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (exp: ExperienceItem) => {
    setEditingExpId(exp.id);
    const isPresent = !exp.endDate || exp.endDate.toLowerCase() === 'present';
    setFormData({
      type: (exp.type?.toUpperCase() as ExperienceType) || 'WORK',
      degreeOrRoleEn: exp.degreeOrRoleEn || '',
      degreeOrRoleAr: exp.degreeOrRoleAr || '',
      degreeOrRoleTr: exp.degreeOrRoleTr || '',
      institutionOrCompanyEn: exp.institutionOrCompanyEn || '',
      institutionOrCompanyAr: exp.institutionOrCompanyAr || '',
      institutionOrCompanyTr: exp.institutionOrCompanyTr || '',
      startDate: exp.startDate || '',
      endDate: isPresent ? '' : exp.endDate || '',
      locationEn: exp.locationEn || '',
      locationAr: exp.locationAr || '',
      locationTr: exp.locationTr || '',
      icon: exp.icon || 'briefcase',
      nodeColor: exp.nodeColor || '#3B82F6',
      descriptionEn: exp.descriptionEn || '',
      descriptionAr: exp.descriptionAr || '',
      descriptionTr: exp.descriptionTr || '',
      orderIndex: exp.orderIndex,
    });
    setIsCurrentlyActive(isPresent);
    setModalTab('en');
    setIsModalOpen(true);
  };

  const handleDeleteExperience = async (id: number, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await api.delete(`/experience/${id}`);
      setExperiences((prev) => prev.filter((e) => e.id !== id));
      showNotification('success', 'Experience record removed');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete record';
      showNotification('error', msg);
    }
  };

  const handleReorder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= experiences.length) return;

    const updatedList = [...experiences];
    const temp = updatedList[index];
    updatedList[index] = updatedList[targetIndex];
    updatedList[targetIndex] = temp;

    const reorderedWithIndices = updatedList.map((item, idx) => ({
      ...item,
      orderIndex: idx + 1,
    }));

    setExperiences(reorderedWithIndices);

    try {
      await Promise.all([
        api.put(`/experience/${reorderedWithIndices[index].id}`, {
          orderIndex: index + 1,
        }),
        api.put(`/experience/${reorderedWithIndices[targetIndex].id}`, {
          orderIndex: targetIndex + 1,
        }),
      ]);
      showNotification('success', 'Timeline order updated');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update reorder';
      showNotification('error', msg);
      fetchExperiences();
    }
  };
  const handleSubmitModal = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.degreeOrRoleEn.trim()) {
      showNotification('error', 'Degree or Role in English is required');
      return;
    }

    if (!formData.institutionOrCompanyEn.trim()) {
      showNotification('error', 'Institution or Company in English is required');
      return;
    }

    if (!formData.startDate.trim()) {
      showNotification('error', 'Start Date is required');
      return;
    }

    const payload = {
      type: formData.type.toUpperCase(),
      degreeOrRoleEn: formData.degreeOrRoleEn.trim(),
      degreeOrRoleAr: formData.degreeOrRoleAr.trim() || formData.degreeOrRoleEn.trim(),
      degreeOrRoleTr: formData.degreeOrRoleTr.trim() || formData.degreeOrRoleEn.trim(),
      institutionOrCompanyEn: formData.institutionOrCompanyEn.trim(),
      institutionOrCompanyAr: formData.institutionOrCompanyAr.trim() || formData.institutionOrCompanyEn.trim(),
      institutionOrCompanyTr: formData.institutionOrCompanyTr.trim() || formData.institutionOrCompanyEn.trim(),
      startDate: formData.startDate.trim(),
      endDate: isCurrentlyActive ? null : formData.endDate.trim() || null,
      locationEn: formData.locationEn.trim(),
      locationAr: formData.locationAr.trim(),
      locationTr: formData.locationTr.trim(),
      icon: formData.icon,
      nodeColor: formData.nodeColor,
      descriptionEn: formData.descriptionEn.trim(),
      descriptionAr: formData.descriptionAr.trim(),
      descriptionTr: formData.descriptionTr.trim(),
      orderIndex: editingExpId ? undefined : experiences.length + 1,
    };

    try {
      setSubmittingModal(true);
      if (editingExpId) {
        const res = await api.put(`/experience/${editingExpId}`, payload);
        const updated = res.data?.data;
        setExperiences((prev) =>
          prev.map((item) => (item.id === editingExpId ? { ...item, ...updated } : item))
        );
        showNotification('success', 'Experience record updated successfully');
      } else {
        const res = await api.post('/experience', payload);
        const created = res.data?.data;
        if (created) {
          setExperiences((prev) => [...prev, created]);
          showNotification('success', 'Experience record added to timeline');
        }
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save experience record';
      showNotification('error', msg);
    } finally {
      setSubmittingModal(false);
    }
  };

  const filteredExperiences = useMemo(() => {
    let list = [...experiences];
    if (activeTypeFilter !== 'ALL') {
      list = list.filter(
        (e) => (e.type || '').toUpperCase() === activeTypeFilter.toUpperCase()
      );
    }
    return list.sort((a, b) => a.orderIndex - b.orderIndex);
  }, [experiences, activeTypeFilter]);

  const renderIconComponent = (iconId?: string | null) => {
    const matched = ICON_OPTIONS.find((opt) => opt.id === iconId);
    const IconComp = matched ? matched.icon : Briefcase;
    return <IconComp className="w-5 h-5 text-white" />;
  };

  const getTypeBadgeStyles = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'EDUCATION':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'WORK':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'MILESTONE':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Loading Experience & Timeline...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* Top Header & Quick Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80 shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <GraduationCap className="w-5 h-5" />
            </span>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Experience & Timeline (الخبرات والمسار المهني)
            </h1>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Manage academic degrees, career milestones, and professional roles with customizable accent nodes and icons.
          </p>
        </div>

        {/* 3 Quick Creation Buttons + Reload */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={fetchExperiences}
            className="p-2.5 rounded-xl text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white transition-all border border-slate-700/80"
            title="Reload Timeline"
          >
            <RotateCw className="w-4 h-4 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={() => handleOpenCreateModal('EDUCATION')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-blue-300 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 transition-all shadow-sm"
          >
            <GraduationCap className="w-4 h-4 text-blue-400" />
            <span>+ University / Education</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenCreateModal('WORK')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all shadow-sm"
          >
            <Briefcase className="w-4 h-4 text-emerald-400" />
            <span>+ Career Role</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenCreateModal('MILESTONE')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all shadow-sm"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span>+ Milestone</span>
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

      {/* Filter and Language Selector Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Type Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTypeFilter('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTypeFilter === 'ALL'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            All Timeline ({experiences.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTypeFilter('EDUCATION')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTypeFilter === 'EDUCATION'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            Education ({experiences.filter((e) => e.type?.toUpperCase() === 'EDUCATION').length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTypeFilter('WORK')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTypeFilter === 'WORK'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            Career Roles ({experiences.filter((e) => e.type?.toUpperCase() === 'WORK').length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTypeFilter('MILESTONE')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTypeFilter === 'MILESTONE'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            Milestones ({experiences.filter((e) => e.type?.toUpperCase() === 'MILESTONE').length})
          </button>
        </div>

        {/* Display Language Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Preview:</span>
          <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              type="button"
              onClick={() => setDisplayLanguage('en')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
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
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
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
              className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                displayLanguage === 'tr'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              TR
            </button>
          </div>
        </div>
      </div>
      {/* ============================================================== */}
      {/* TIMELINE LIST DISPLAY                                          */}
      {/* ============================================================== */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Calendar className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-white tracking-wide">
              Configured Career Milestones & Education
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {filteredExperiences.length} items shown
          </span>
        </div>

        {filteredExperiences.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <Briefcase className="w-12 h-12 text-slate-700 mx-auto" />
            <p className="text-slate-300 font-semibold text-base">No timeline records found</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Click one of the quick buttons above (+ University, + Career Role, or + Milestone) to add your first milestone.
            </p>
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
            {filteredExperiences.map((exp, index) => {
              const displayDegree =
                displayLanguage === 'ar'
                  ? exp.degreeOrRoleAr || exp.degreeOrRoleEn
                  : displayLanguage === 'tr'
                  ? exp.degreeOrRoleTr || exp.degreeOrRoleEn
                  : exp.degreeOrRoleEn || exp.degreeOrRoleAr;

              const displayInstitution =
                displayLanguage === 'ar'
                  ? exp.institutionOrCompanyAr || exp.institutionOrCompanyEn
                  : displayLanguage === 'tr'
                  ? exp.institutionOrCompanyTr || exp.institutionOrCompanyEn
                  : exp.institutionOrCompanyEn || exp.institutionOrCompanyAr;

              const displayLocation =
                displayLanguage === 'ar'
                  ? exp.locationAr || exp.locationEn
                  : displayLanguage === 'tr'
                  ? exp.locationTr || exp.locationEn
                  : exp.locationEn || exp.locationAr;

              const displayDesc =
                displayLanguage === 'ar'
                  ? exp.descriptionAr || exp.descriptionEn
                  : displayLanguage === 'tr'
                  ? exp.descriptionTr || exp.descriptionEn
                  : exp.descriptionEn || exp.descriptionAr;

              const dateDisplay = `${exp.startDate} - ${exp.endDate || 'Present'}`;

              return (
                <div key={exp.id} className="relative group">
                  {/* Circular Node Accent on the Timeline Line */}
                  <div
                    className="absolute -left-[27px] sm:-left-[35px] top-4 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110"
                    style={{
                      backgroundColor: `${exp.nodeColor || '#3B82F6'}20`,
                      border: `2px solid ${exp.nodeColor || '#3B82F6'}`,
                      boxShadow: `0 0 12px ${exp.nodeColor || '#3B82F6'}40`,
                    }}
                  >
                    <div style={{ color: exp.nodeColor || '#3B82F6' }}>
                      {renderIconComponent(exp.icon)}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="bg-slate-950/70 border border-slate-800/90 hover:border-slate-700/90 rounded-2xl p-5 sm:p-6 transition-all shadow-md hover:shadow-xl space-y-4">
                    {/* Card Top: Order Badge, Type Pill, Dates & Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/70">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Order Index */}
                        <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300 font-bold">
                          #{exp.orderIndex || index + 1}
                        </span>

                        {/* Category Pill */}
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider border ${getTypeBadgeStyles(
                            exp.type
                          )}`}
                        >
                          {exp.type}
                        </span>

                        {/* Visual Color Dot */}
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: exp.nodeColor || '#3B82F6' }}
                          title={`Accent: ${exp.nodeColor}`}
                        />
                      </div>

                      {/* Right controls: Dates, Reorder & Actions */}
                      <div className="flex items-center gap-2">
                        {/* Reorder Arrows */}
                        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                          <button
                            type="button"
                            onClick={() => handleReorder(index, 'up')}
                            disabled={index === 0}
                            className="p-1 text-slate-400 hover:text-white disabled:opacity-20 transition-colors"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReorder(index, 'down')}
                            disabled={index === experiences.length - 1}
                            className="p-1 text-slate-400 hover:text-white disabled:opacity-20 transition-colors"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(exp)}
                          className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
                          title="Edit Record"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteExperience(exp.id, exp.degreeOrRoleEn)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg bg-slate-900 border border-slate-800 hover:bg-rose-500/10 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Middle: Degree/Role, Institution/Company, Location, Dates */}
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <h3
                          className="text-base sm:text-lg font-bold text-white tracking-tight"
                          dir={displayLanguage === 'ar' ? 'rtl' : 'ltr'}
                        >
                          {displayDegree}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 flex-shrink-0">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{dateDisplay}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1 text-slate-300 font-medium">
                          <Building className="w-3.5 h-3.5 text-slate-500" />
                          <span>{displayInstitution}</span>
                        </span>
                        {displayLocation && (
                          <span className="flex items-center gap-1 text-slate-400">
                            <MapPin className="w-3.5 h-3.5 text-slate-500" />
                            <span>{displayLocation}</span>
                          </span>
                        )}
                      </div>

                      {/* Multilingual preview labels */}
                      <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500">
                        {displayLanguage !== 'en' && exp.degreeOrRoleEn && (
                          <span>
                            <strong className="text-slate-600 font-mono text-[10px]">EN:</strong> {exp.degreeOrRoleEn} ({exp.institutionOrCompanyEn})
                          </span>
                        )}
                        {displayLanguage !== 'ar' && exp.degreeOrRoleAr && (
                          <span dir="rtl">
                            <strong className="text-slate-600 font-mono text-[10px]">AR:</strong> {exp.degreeOrRoleAr} ({exp.institutionOrCompanyAr})
                          </span>
                        )}
                        {displayLanguage !== 'tr' && exp.degreeOrRoleTr && (
                          <span>
                            <strong className="text-slate-600 font-mono text-[10px]">TR:</strong> {exp.degreeOrRoleTr} ({exp.institutionOrCompanyTr})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Narrative Description */}
                    {displayDesc && (
                      <p
                        className="text-xs sm:text-sm text-slate-400 leading-relaxed pt-2 border-t border-slate-800/60"
                        dir={displayLanguage === 'ar' ? 'rtl' : 'ltr'}
                      >
                        {displayDesc}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {/* ============================================================== */}
      {/* CREATE / EDIT EXPERIENCE MODAL                                 */}
      {/* ============================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <GraduationCap className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-base text-white">
                    {editingExpId ? 'Edit Experience Record' : 'Add Experience / Milestone'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Define degree or role, organization, dates, accent colors, and trilingual descriptions.
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
              {/* Category / Type Selector */}
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 block">
                  Record Category / Type *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((p) => ({
                        ...p,
                        type: 'EDUCATION',
                        icon: 'graduation-cap',
                        nodeColor: '#3B82F6',
                      }));
                    }}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                      formData.type === 'EDUCATION'
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Education</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFormData((p) => ({
                        ...p,
                        type: 'WORK',
                        icon: 'briefcase',
                        nodeColor: '#10B981',
                      }));
                    }}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                      formData.type === 'WORK'
                        ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>Career / Work</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFormData((p) => ({
                        ...p,
                        type: 'MILESTONE',
                        icon: 'award',
                        nodeColor: '#F59E0B',
                      }));
                    }}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                      formData.type === 'MILESTONE'
                        ? 'bg-amber-600/20 border-amber-500 text-amber-300 shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Award className="w-4 h-4" />
                    <span>Milestone</span>
                  </button>
                </div>
              </div>

              {/* Visual Icon & Node Color Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                {/* Circular Badge Icon Selector */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-2 block">
                    Circular Badge Icon
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {ICON_OPTIONS.map((opt) => {
                      const IconC = opt.icon;
                      const isSelected = formData.icon === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setFormData((p) => ({ ...p, icon: opt.id }))}
                          className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                            isSelected
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                          title={opt.label}
                        >
                          <IconC className="w-4 h-4" />
                          <span className="text-[10px] truncate max-w-full font-medium">
                            {opt.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Node Accent Color Selector */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-2 block">
                    Node Accent Color (Glow & Border)
                  </label>
                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    {COLOR_OPTIONS.map((col) => {
                      const isSelected =
                        formData.nodeColor?.toLowerCase() === col.hex.toLowerCase();
                      return (
                        <button
                          key={col.hex}
                          type="button"
                          onClick={() => setFormData((p) => ({ ...p, nodeColor: col.hex }))}
                          className={`w-8 h-8 rounded-full ${col.bg} transition-all relative flex items-center justify-center ${
                            isSelected
                              ? 'ring-4 ring-white/30 scale-110 shadow-lg'
                              : 'hover:scale-105 opacity-80 hover:opacity-100'
                          }`}
                          title={col.name}
                        >
                          {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">Custom hex:</span>
                    <input
                      type="text"
                      value={formData.nodeColor}
                      onChange={(e) => setFormData((p) => ({ ...p, nodeColor: e.target.value }))}
                      placeholder="#3B82F6"
                      className="w-24 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Timeline Dates & Sequence */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                    Start Date *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData((p) => ({ ...p, startDate: e.target.value }))}
                    placeholder="e.g. Sep 2020 or 2020"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">End Date</label>
                    <label className="flex items-center gap-1.5 text-[11px] text-emerald-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isCurrentlyActive}
                        onChange={(e) => {
                          setIsCurrentlyActive(e.target.checked);
                          if (e.target.checked) {
                            setFormData((p) => ({ ...p, endDate: '' }));
                          }
                        }}
                        className="rounded border-slate-800 text-emerald-500 focus:ring-0"
                      />
                      <span>Present</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    disabled={isCurrentlyActive}
                    value={isCurrentlyActive ? 'Present' : formData.endDate}
                    onChange={(e) => setFormData((p) => ({ ...p, endDate: e.target.value }))}
                    placeholder="e.g. Jun 2024"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-600 disabled:opacity-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                    Display Order Index
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formData.orderIndex}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        orderIndex: parseInt(e.target.value, 10) || 1,
                      }))
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Multilingual Details Navigation Tabs */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Multilingual Role, Organization & Narrative
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

                {/* English Content */}
                {modalTab === 'en' && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block">
                        Degree / Role Title (English) *
                      </label>
                      <input
                        type="text"
                        value={formData.degreeOrRoleEn}
                        onChange={(e) => setFormData((p) => ({ ...p, degreeOrRoleEn: e.target.value }))}
                        placeholder="e.g. Senior Full-Stack Engineer or B.S. in Computer Science"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block">
                        Institution / Company (English) *
                      </label>
                      <input
                        type="text"
                        value={formData.institutionOrCompanyEn}
                        onChange={(e) => setFormData((p) => ({ ...p, institutionOrCompanyEn: e.target.value }))}
                        placeholder="e.g. HighTech Solutions or Istanbul University"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block">
                        Location (English)
                      </label>
                      <input
                        type="text"
                        value={formData.locationEn}
                        onChange={(e) => setFormData((p) => ({ ...p, locationEn: e.target.value }))}
                        placeholder="e.g. Remote / Istanbul, Turkey"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block">
                        Detailed Narrative & Responsibilities (English)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.descriptionEn}
                        onChange={(e) => setFormData((p) => ({ ...p, descriptionEn: e.target.value }))}
                        placeholder="Key responsibilities, technical stacks utilized, and significant impact..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                )}

                {/* Arabic Content */}
                {modalTab === 'ar' && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block text-right">
                        المسمى الوظيفي أو التخصص الأكاديمي (بالعربية)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={formData.degreeOrRoleAr}
                        onChange={(e) => setFormData((p) => ({ ...p, degreeOrRoleAr: e.target.value }))}
                        placeholder="مثال: مهندس برمجيات أول أو بكالوريوس هندسة الحاسوب"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-right"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block text-right">
                        الجامعة أو الشركة (بالعربية)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={formData.institutionOrCompanyAr}
                        onChange={(e) => setFormData((p) => ({ ...p, institutionOrCompanyAr: e.target.value }))}
                        placeholder="مثال: شركة التقنية المتقدمة أو جامعة إسطنبول"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-right"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block text-right">
                        الموقع أو المدينة (بالعربية)
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={formData.locationAr}
                        onChange={(e) => setFormData((p) => ({ ...p, locationAr: e.target.value }))}
                        placeholder="مثال: عن بُعد / إسطنبول، تركيا"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-right"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block text-right">
                        تفاصيل المهام والمسؤوليات والإنجازات (بالعربية)
                      </label>
                      <textarea
                        rows={3}
                        dir="rtl"
                        value={formData.descriptionAr}
                        onChange={(e) => setFormData((p) => ({ ...p, descriptionAr: e.target.value }))}
                        placeholder="أهم المسؤوليات، التقنيات المستخدمة، والإنجازات البارزة..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-right"
                      />
                    </div>
                  </div>
                )}

                {/* Turkish Content */}
                {modalTab === 'tr' && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block">
                        Pozisyon veya Akademik Derece (Türkçe)
                      </label>
                      <input
                        type="text"
                        value={formData.degreeOrRoleTr}
                        onChange={(e) => setFormData((p) => ({ ...p, degreeOrRoleTr: e.target.value }))}
                        placeholder="Örn: Kıdemli Yazılım Mühendisi veya Bilgisayar Mühendisliği Lisansı"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block">
                        Kurum veya Şirket (Türkçe)
                      </label>
                      <input
                        type="text"
                        value={formData.institutionOrCompanyTr}
                        onChange={(e) => setFormData((p) => ({ ...p, institutionOrCompanyTr: e.target.value }))}
                        placeholder="Örn: Teknoloji Çözümleri A.Ş. veya İstanbul Üniversitesi"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block">
                        Konum (Türkçe)
                      </label>
                      <input
                        type="text"
                        value={formData.locationTr}
                        onChange={(e) => setFormData((p) => ({ ...p, locationTr: e.target.value }))}
                        placeholder="Örn: Uzaktan / İstanbul, Türkiye"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 mb-1 block">
                        Sorumluluklar ve Açıklama (Türkçe)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.descriptionTr}
                        onChange={(e) => setFormData((p) => ({ ...p, descriptionTr: e.target.value }))}
                        placeholder="Ana sorumluluklar, kullanılan teknolojiler ve başarılar..."
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
                  className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingModal}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 rounded-xl transition-all shadow-md shadow-emerald-500/20"
                >
                  {submittingModal ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingExpId ? 'Update Record' : 'Save to Timeline'}</span>
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

export default AdminExperience;
