import React, { useState, useEffect, useMemo } from 'react';
import {
  Code2,
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
  Sparkles,
  Layers,
  ArrowUp,
  ArrowDown,
  Terminal,
  Cpu,
  Database,
  Wrench,
  Server,
} from 'lucide-react';
import api from '../../services/api';

export interface SkillItem {
  id: number;
  name: string;
  category: string;
  displayOrder: number;
  createdAt?: string;
}

export interface SkillsSectionNarrative {
  badgeEn: string;
  badgeAr: string;
  badgeTr: string;
  headingEn: string;
  headingAr: string;
  headingTr: string;
  paragraph1En: string;
  paragraph1Ar: string;
  paragraph1Tr: string;
  paragraph2En: string;
  paragraph2Ar: string;
  paragraph2Tr: string;
  bullet1TitleEn: string;
  bullet1TitleAr: string;
  bullet1TitleTr: string;
  bullet1DescEn: string;
  bullet1DescAr: string;
  bullet1DescTr: string;
}

const DEFAULT_CATEGORIES = ['Frontend', 'Backend', 'Database', 'DevOps', 'Tools'];

export const AdminSkills: React.FC = () => {
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [savingNarrative, setSavingNarrative] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('ALL');
  const [narrativeTab, setNarrativeTab] = useState<'en' | 'ar' | 'tr'>('en');

  // Notification State
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Section Narrative State
  const [narrative, setNarrative] = useState<SkillsSectionNarrative>({
    badgeEn: 'Technical Competencies',
    badgeAr: 'المهارات والتقنيات',
    badgeTr: 'Teknik Yetkinlikler',
    headingEn: 'Modern Stack Engineered For Scale & Resilience',
    headingAr: 'بنية تقنية عصرية مصممة للمرونة والتوسع العالي',
    headingTr: 'Ölçek ve Dayanıklılık İçin Tasarlanmış Modern Mimari',
    paragraph1En: 'Over 5+ years of hands-on expertise building production-grade distributed architectures and high-performance user interfaces.',
    paragraph1Ar: 'أكثر من 5 سنوات من الخبرة العملية في بناء وتطوير الأنظمة الموزعة والواجهات الرقمية فائقة الأداء.',
    paragraph1Tr: 'Üretim düzeyinde dağıtık mimariler ve yüksek performanslı modern kullanıcı arayüzleri geliştirmede 5 yılı aşkın deneyim.',
    paragraph2En: 'Specialized in TypeScript ecosystem, clean architectures, microservices, and reactive state management.',
    paragraph2Ar: 'تخصص معمق في بيئة تايب سكريبت، المعماريات النظيفة، الخدمات المصغرة، وإدارة الحالة التفاعلية.',
    paragraph2Tr: 'TypeScript ekosistemi, temiz mimari, mikroservisler ve reaktif durum yönetimi alanında uzmanlaşmış.',
    bullet1TitleEn: 'Architecture First Mindset',
    bullet1TitleAr: 'نهج معماري أولاً',
    bullet1TitleTr: 'Mimari Odaklı Yaklaşım',
    bullet1DescEn: 'Ensuring loose coupling, high cohesion, and verifiable zero-trust security across all layer abstractions.',
    bullet1DescAr: 'ضمان التفكك المرن، التماسك البرمجي العالي، ومعايير الأمان الموثوقة عبر كافة طبقات النظام.',
    bullet1DescTr: 'Tüm katmanlarda esnek bağlantı, yüksek uyumluluk ve sıfır güven güvenlik standartları sağlama.',
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingSkillId, setEditingSkillId] = useState<number | null>(null);
  const [submittingModal, setSubmittingModal] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Frontend',
    customCategory: '',
    displayOrder: 1,
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4000);
  };

  // Fetch Skills & Copywriting Narrative
  const fetchData = async () => {
    try {
      setLoading(true);
      const [skillsRes, settingsRes] = await Promise.all([
        api.get('/skills'),
        api.get('/settings'),
      ]);

      if (Array.isArray(skillsRes.data?.data)) {
        setSkills(skillsRes.data.data);
      }

      const skillsCopywriting = settingsRes.data?.data?.sectionCopywriting?.skills;
      if (skillsCopywriting && typeof skillsCopywriting === 'object') {
        setNarrative((prev) => ({
          ...prev,
          ...skillsCopywriting,
        }));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch skills data';
      showNotification('error', msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Save Narrative Copywriting
  const handleSaveNarrative = async () => {
    try {
      setSavingNarrative(true);
      await api.patch('/settings/copywriting', {
        section: 'skills',
        data: narrative,
      });
      showNotification('success', 'Skills section narrative saved successfully');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save section narrative';
      showNotification('error', msg);
    } finally {
      setSavingNarrative(false);
    }
  };

  // Open Create Modal
  const handleOpenCreateModal = (suggestedCategory?: string) => {
    setEditingSkillId(null);
    const categoryToUse = suggestedCategory || 'Frontend';
    const isStandard = DEFAULT_CATEGORIES.includes(categoryToUse);
    setFormData({
      name: '',
      category: isStandard ? categoryToUse : 'Custom',
      customCategory: isStandard ? '' : categoryToUse,
      displayOrder: skills.length + 1,
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (skill: SkillItem) => {
    setEditingSkillId(skill.id);
    const isStandard = DEFAULT_CATEGORIES.includes(skill.category);
    setFormData({
      name: skill.name,
      category: isStandard ? skill.category : 'Custom',
      customCategory: isStandard ? '' : skill.category,
      displayOrder: skill.displayOrder,
    });
    setIsModalOpen(true);
  };

  // Submit Modal
  const handleSubmitModal = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showNotification('error', 'Skill name is required');
      return;
    }

    const resolvedCategory =
      formData.category === 'Custom'
        ? formData.customCategory.trim() || 'General'
        : formData.category;

    const payload = {
      name: formData.name.trim(),
      category: resolvedCategory,
      displayOrder: Number(formData.displayOrder) || 0,
    };

    try {
      setSubmittingModal(true);
      if (editingSkillId) {
        const res = await api.put(`/skills/${editingSkillId}`, payload);
        const updated = res.data?.data;
        setSkills((prev) =>
          prev.map((s) => (s.id === editingSkillId ? { ...s, ...updated } : s))
        );
        showNotification('success', 'Skill updated successfully');
      } else {
        const res = await api.post('/skills', payload);
        const created = res.data?.data;
        if (created) {
          setSkills((prev) => [...prev, created]);
          showNotification('success', 'Skill created successfully');
        }
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save skill';
      showNotification('error', msg);
    } finally {
      setSubmittingModal(false);
    }
  };

  // Delete Skill
  const handleDeleteSkill = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      await api.delete(`/skills/${id}`);
      setSkills((prev) => prev.filter((s) => s.id !== id));
      showNotification('success', `"${name}" deleted successfully`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete skill';
      showNotification('error', msg);
    }
  };

  // Reorder Skill within its category
  const handleReorderSkill = async (
    skillId: number,
    categoryName: string,
    direction: 'up' | 'down'
  ) => {
    const categorySkills = skills
      .filter((s) => s.category.toLowerCase() === categoryName.toLowerCase())
      .sort((a, b) => a.displayOrder - b.displayOrder);

    const index = categorySkills.findIndex((s) => s.id === skillId);
    if (index === -1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categorySkills.length) return;

    const currentSkill = categorySkills[index];
    const targetSkill = categorySkills[targetIndex];

    const currentOrder = currentSkill.displayOrder;
    const targetOrder = targetSkill.displayOrder;

    // Optimistic state update
    setSkills((prev) =>
      prev.map((s) => {
        if (s.id === currentSkill.id) return { ...s, displayOrder: targetOrder };
        if (s.id === targetSkill.id) return { ...s, displayOrder: currentOrder };
        return s;
      })
    );

    try {
      await Promise.all([
        api.put(`/skills/${currentSkill.id}`, { displayOrder: targetOrder }),
        api.put(`/skills/${targetSkill.id}`, { displayOrder: currentOrder }),
      ]);
      showNotification('success', 'Skill reordered');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to reorder';
      showNotification('error', msg);
      fetchData();
    }
  };
  // Compute Categories and Grouped Skills
  const existingCategories = useMemo(() => {
    const cats = Array.from(new Set(skills.map((s) => s.category))).filter(Boolean);
    const standardSet = new Set(DEFAULT_CATEGORIES);
    const customCats = cats.filter((c) => !standardSet.has(c));
    return [...DEFAULT_CATEGORIES, ...customCats];
  }, [skills]);

  const filteredSkills = useMemo(() => {
    return skills.filter((s) => {
      const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat =
        activeCategoryFilter === 'ALL' ||
        s.category.toLowerCase() === activeCategoryFilter.toLowerCase();
      return matchesSearch && matchesCat;
    });
  }, [skills, searchQuery, activeCategoryFilter]);

  const groupedSkills = useMemo(() => {
    const groups: Record<string, SkillItem[]> = {};

    existingCategories.forEach((cat) => {
      groups[cat] = [];
    });

    filteredSkills.forEach((skill) => {
      if (!groups[skill.category]) {
        groups[skill.category] = [];
      }
      groups[skill.category].push(skill);
    });

    // Sort skills inside each category by displayOrder
    Object.keys(groups).forEach((cat) => {
      groups[cat].sort((a, b) => a.displayOrder - b.displayOrder);
    });

    return groups;
  }, [filteredSkills, existingCategories]);

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'frontend':
        return <Cpu className="w-4 h-4 text-cyan-400" />;
      case 'backend':
        return <Server className="w-4 h-4 text-emerald-400" />;
      case 'database':
        return <Database className="w-4 h-4 text-amber-400" />;
      case 'devops':
        return <Terminal className="w-4 h-4 text-purple-400" />;
      case 'tools':
        return <Wrench className="w-4 h-4 text-rose-400" />;
      default:
        return <Layers className="w-4 h-4 text-blue-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Loading Skills & Competencies...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80 shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Code2 className="w-5 h-5" />
            </span>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Skills & Technical Stack (المهارات والتقنيات)
            </h1>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Manage technical competencies, categories, and bilingual section narrative across English, Arabic, and Turkish.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white transition-all border border-slate-700/80"
          >
            <RotateCw className="w-4 h-4 text-slate-400" />
            <span>Reload</span>
          </button>
          <button
            type="button"
            onClick={() => handleOpenCreateModal()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Skill</span>
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
      {/* TOP CARD: Skills Section Narrative                             */}
      {/* ============================================================== */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Languages className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                Skills Section Narrative (العناوين والفقرات باللغات الثلاث)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage the main badge, headline, dual paragraphs, and highlighted bullet point.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher Tabs */}
            <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs">
              <button
                type="button"
                onClick={() => setNarrativeTab('en')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  narrativeTab === 'en'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                English (EN)
              </button>
              <button
                type="button"
                onClick={() => setNarrativeTab('ar')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  narrativeTab === 'ar'
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                العربية (AR)
              </button>
              <button
                type="button"
                onClick={() => setNarrativeTab('tr')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  narrativeTab === 'tr'
                    ? 'bg-amber-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Türkçe (TR)
              </button>
            </div>

            <button
              type="button"
              onClick={handleSaveNarrative}
              disabled={savingNarrative}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
            >
              {savingNarrative ? (
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
        </div>

        {/* Narrative Form Body based on active language tab */}
        <div className="space-y-6">
          {/* Badge & Main Heading */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`text-xs font-semibold text-slate-300 mb-1.5 block ${narrativeTab === 'ar' ? 'text-right' : ''}`}>
                Badge Text {narrativeTab === 'ar' ? '(شارة القسم)' : ''}
              </label>
              <input
                type="text"
                dir={narrativeTab === 'ar' ? 'rtl' : 'ltr'}
                value={
                  narrativeTab === 'en'
                    ? narrative.badgeEn
                    : narrativeTab === 'ar'
                    ? narrative.badgeAr
                    : narrative.badgeTr
                }
                onChange={(e) => {
                  const val = e.target.value;
                  setNarrative((prev) => ({
                    ...prev,
                    [narrativeTab === 'en'
                      ? 'badgeEn'
                      : narrativeTab === 'ar'
                      ? 'badgeAr'
                      : 'badgeTr']: val,
                  }));
                }}
                placeholder={
                  narrativeTab === 'ar'
                    ? 'مثال: المهارات التقنية'
                    : narrativeTab === 'tr'
                    ? 'Örn: Teknik Yetkinlikler'
                    : 'e.g. Technical Competencies'
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className={`text-xs font-semibold text-slate-300 mb-1.5 block ${narrativeTab === 'ar' ? 'text-right' : ''}`}>
                Main Heading {narrativeTab === 'ar' ? '(العنوان الرئيسي للسكشن)' : ''}
              </label>
              <input
                type="text"
                dir={narrativeTab === 'ar' ? 'rtl' : 'ltr'}
                value={
                  narrativeTab === 'en'
                    ? narrative.headingEn
                    : narrativeTab === 'ar'
                    ? narrative.headingAr
                    : narrative.headingTr
                }
                onChange={(e) => {
                  const val = e.target.value;
                  setNarrative((prev) => ({
                    ...prev,
                    [narrativeTab === 'en'
                      ? 'headingEn'
                      : narrativeTab === 'ar'
                      ? 'headingAr'
                      : 'headingTr']: val,
                  }));
                }}
                placeholder={
                  narrativeTab === 'ar'
                    ? 'مثال: بنية برمجية حديثة مصممة للمرونة والتوسع'
                    : narrativeTab === 'tr'
                    ? 'Örn: Ölçek ve Dayanıklılık İçin Modern Stack'
                    : 'e.g. Modern Stack Engineered For Scale & Resilience'
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Paragraph 1 & Paragraph 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Paragraph 1 {narrativeTab === 'ar' ? '(الفقرة الأولى)' : ''}
                </label>
                <span className="text-[11px] text-slate-500">Overview & experience years</span>
              </div>
              <textarea
                rows={3}
                dir={narrativeTab === 'ar' ? 'rtl' : 'ltr'}
                value={
                  narrativeTab === 'en'
                    ? narrative.paragraph1En
                    : narrativeTab === 'ar'
                    ? narrative.paragraph1Ar
                    : narrative.paragraph1Tr
                }
                onChange={(e) => {
                  const val = e.target.value;
                  setNarrative((prev) => ({
                    ...prev,
                    [narrativeTab === 'en'
                      ? 'paragraph1En'
                      : narrativeTab === 'ar'
                      ? 'paragraph1Ar'
                      : 'paragraph1Tr']: val,
                  }));
                }}
                placeholder="Detailed first paragraph..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Paragraph 2 {narrativeTab === 'ar' ? '(الفقرة الثانية)' : ''}
                </label>
                <span className="text-[11px] text-slate-500">Core technical focus</span>
              </div>
              <textarea
                rows={3}
                dir={narrativeTab === 'ar' ? 'rtl' : 'ltr'}
                value={
                  narrativeTab === 'en'
                    ? narrative.paragraph2En
                    : narrativeTab === 'ar'
                    ? narrative.paragraph2Ar
                    : narrative.paragraph2Tr
                }
                onChange={(e) => {
                  const val = e.target.value;
                  setNarrative((prev) => ({
                    ...prev,
                    [narrativeTab === 'en'
                      ? 'paragraph2En'
                      : narrativeTab === 'ar'
                      ? 'paragraph2Ar'
                      : 'paragraph2Tr']: val,
                  }));
                }}
                placeholder="Specialization, methodology, and reactive design..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed"
              />
            </div>
          </div>

          {/* Bullet Point 1 Title & Description */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Bullet Point 1 (نقطة التميّز المعمارية الأولى)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 mb-1.5 block">
                  Bullet Title
                </label>
                <input
                  type="text"
                  dir={narrativeTab === 'ar' ? 'rtl' : 'ltr'}
                  value={
                    narrativeTab === 'en'
                      ? narrative.bullet1TitleEn
                      : narrativeTab === 'ar'
                      ? narrative.bullet1TitleAr
                      : narrative.bullet1TitleTr
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    setNarrative((prev) => ({
                      ...prev,
                      [narrativeTab === 'en'
                        ? 'bullet1TitleEn'
                        : narrativeTab === 'ar'
                        ? 'bullet1TitleAr'
                        : 'bullet1TitleTr']: val,
                    }));
                  }}
                  placeholder="e.g. Architecture First Mindset"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-[11px] font-semibold text-slate-300 mb-1.5 block">
                  Bullet Description
                </label>
                <input
                  type="text"
                  dir={narrativeTab === 'ar' ? 'rtl' : 'ltr'}
                  value={
                    narrativeTab === 'en'
                      ? narrative.bullet1DescEn
                      : narrativeTab === 'ar'
                      ? narrative.bullet1DescAr
                      : narrative.bullet1DescTr
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    setNarrative((prev) => ({
                      ...prev,
                      [narrativeTab === 'en'
                        ? 'bullet1DescEn'
                        : narrativeTab === 'ar'
                        ? 'bullet1DescAr'
                        : 'bullet1DescTr']: val,
                    }));
                  }}
                  placeholder="e.g. Ensuring loose coupling, high cohesion, and zero-trust security..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ============================================================== */}
      {/* SKILLS CATALOG AREA                                             */}
      {/* ============================================================== */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden space-y-6 p-6">
        {/* Top Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Layers className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Skills Catalog by Category
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Organized by Frontend, Backend, Database, DevOps, and Tools.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-60">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search skill name..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Quick Add Button */}
            <button
              type="button"
              onClick={() => handleOpenCreateModal()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Skill</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pb-2">
          <button
            type="button"
            onClick={() => setActiveCategoryFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeCategoryFilter === 'ALL'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            All Categories ({skills.length})
          </button>
          {existingCategories.map((cat) => {
            const count = skills.filter((s) => s.category.toLowerCase() === cat.toLowerCase()).length;
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
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-slate-950/30 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Grouped Skills Display */}
        <div className="space-y-6">
          {existingCategories
            .filter((cat) =>
              activeCategoryFilter === 'ALL'
                ? true
                : cat.toLowerCase() === activeCategoryFilter.toLowerCase()
            )
            .map((category) => {
              const categorySkills = groupedSkills[category] || [];

              return (
                <div
                  key={category}
                  className="bg-slate-950/50 border border-slate-800/80 rounded-2xl p-5 space-y-4"
                >
                  {/* Category Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                    <div className="flex items-center gap-2.5">
                      <span className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                        {getCategoryIcon(category)}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white tracking-wide">
                            {category}
                          </h4>
                          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[11px] font-mono">
                            {categorySkills.length} skills
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenCreateModal(category)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 hover:text-white border border-slate-800 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Add to {category}</span>
                    </button>
                  </div>

                  {/* Skills Grid */}
                  {categorySkills.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 text-xs">
                      No skills found in {category}. Click "Add to {category}" to create one.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {categorySkills.map((skill, idx) => (
                        <div
                          key={skill.id}
                          className="group flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800/80 hover:border-slate-700 transition-all hover:shadow-md"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-6 h-6 rounded-lg bg-slate-950 text-slate-400 border border-slate-800 flex items-center justify-center text-[10px] font-mono font-bold flex-shrink-0">
                              #{skill.displayOrder || idx + 1}
                            </span>
                            <span className="font-semibold text-xs sm:text-sm text-white truncate">
                              {skill.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 flex-shrink-0">
                            {/* Reorder Arrows */}
                            <button
                              type="button"
                              onClick={() => handleReorderSkill(skill.id, category, 'up')}
                              disabled={idx === 0}
                              className="p-1 text-slate-500 hover:text-white disabled:opacity-20 transition-colors"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReorderSkill(skill.id, category, 'down')}
                              disabled={idx === categorySkills.length - 1}
                              className="p-1 text-slate-500 hover:text-white disabled:opacity-20 transition-colors"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>

                            {/* Edit Button */}
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(skill)}
                              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors ml-0.5"
                              title="Edit Skill"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => handleDeleteSkill(skill.id, skill.name)}
                              className="p-1 text-slate-400 hover:text-rose-400 rounded hover:bg-rose-500/10 transition-colors"
                              title="Delete Skill"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* Create / Edit Skill Modal                                      */}
      {/* ============================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Code2 className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-base text-white">
                    {editingSkillId ? 'Edit Skill' : 'Add New Skill'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Configure skill name, category, and display sequence.
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
            <form onSubmit={handleSubmitModal} className="p-6 space-y-4">
              {/* Skill Name */}
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 block">
                  Skill Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. TypeScript, React 19, Docker, PostgreSQL"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Category Selector */}
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 block">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {DEFAULT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="Custom">+ Custom Category...</option>
                </select>
              </div>

              {/* Custom Category Input if Custom Selected */}
              {formData.category === 'Custom' && (
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 block">
                    Custom Category Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customCategory}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, customCategory: e.target.value }))
                    }
                    placeholder="e.g. Mobile, Testing, Cloud Services"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              )}

              {/* Display Order */}
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 block">
                  Display Order Sequence
                </label>
                <input
                  type="number"
                  min={1}
                  value={formData.displayOrder}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      displayOrder: parseInt(e.target.value, 10) || 1,
                    }))
                  }
                  className="w-32 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
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
                    <span>{editingSkillId ? 'Update Skill' : 'Create Skill'}</span>
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

export default AdminSkills;
