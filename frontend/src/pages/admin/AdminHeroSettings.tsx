import React, { useState, useEffect, useRef } from 'react';
import {
  Save,
  Loader2,
  User,
  Image as ImageIcon,
  Plus,
  Trash2,
  FileText,
  Palette,
  Type,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  Languages,
  LayoutGrid,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import api from '../../services/api';

interface SectionCopywritingItem {
  badgeAr?: string;
  badgeEn?: string;
  badgeTr?: string;
  titleAr?: string;
  titleEn?: string;
  titleTr?: string;
  subtitleAr?: string;
  subtitleEn?: string;
  subtitleTr?: string;
  [key: string]: string | undefined;
}

type SectionCopywritingMap = Record<string, SectionCopywritingItem>;

interface SiteSettingsFormData {
  id: number;
  primaryColor: string;
  fontFamily: string;
  headingFontFamily: string;
  logoUrl: string | null;
  faviconUrl: string | null;
  resumeUrl: string | null;
  avatarUrl: string | null;
  profilePhotoUrl: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  twitterUrl: string | null;
  emailContact: string | null;
  contactEmail: string | null;

  displayNameAr: string;
  displayNameEn: string;
  displayNameTr: string;

  heroHeadlineAr: string;
  heroHeadlineEn: string;
  heroHeadlineTr: string;

  availabilityStatusAr: string;
  availabilityStatusEn: string;
  availabilityStatusTr: string;

  locationAr: string;
  locationEn: string;
  locationTr: string;

  bioAr: string;
  bioEn: string;
  bioTr: string;

  aboutTextAr: string;
  aboutTextEn: string;
  aboutTextTr: string;

  aboutParagraph2Ar: string | null;
  aboutParagraph2En: string | null;
  aboutParagraph2Tr: string | null;

  sectionCopywriting: SectionCopywritingMap | null;

  siteName: string;
  canonicalUrl: string | null;
  defaultTitle: string;
  metaDescription: string | null;
  titleTemplate: string;
  robotsDirectives: string;
  keywords: string;
}

interface SocialLinkItem {
  id: number;
  platform: string;
  url: string;
  orderIndex: number;
}

const AVAILABLE_FONTS = [
  'Inter',
  'Outfit',
  'Plus Jakarta Sans',
  'Poppins',
  'Roboto',
  'Fira Code',
  'Space Grotesk',
  'Playfair Display',
];

const COLOR_PRESETS = [
  { name: 'Emerald', value: '#10B981' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Cyan', value: '#06B6D4' },
  { name: 'Amber', value: '#F59E0B' },
  { name: 'Rose', value: '#F43F5E' },
];

const SECTIONS_CONFIG: Array<{ key: string; label: string; defaultBadge: string }> = [
  { key: 'projects', label: 'Projects Section', defaultBadge: 'Portfolio' },
  { key: 'skills', label: 'Skills Section', defaultBadge: 'Expertise' },
  { key: 'workflow', label: 'Workflow Section', defaultBadge: 'Process' },
  { key: 'experience', label: 'Experience Section', defaultBadge: 'Timeline' },
  { key: 'services', label: 'Services Section', defaultBadge: 'Solutions' },
  { key: 'faqs', label: 'FAQs Section', defaultBadge: 'Questions' },
  { key: 'about', label: 'About Section', defaultBadge: 'About Me' },
];

export const AdminHeroSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'copywriting' | 'appearance'>('profile');
  const [activeSectionKey, setActiveSectionKey] = useState<string>('projects');
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [uploadingAvatar, setUploadingAvatar] = useState<boolean>(false);
  const [uploadingLogo, setUploadingLogo] = useState<boolean>(false);
  const [uploadingResume, setUploadingResume] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  // Settings State
  const [settings, setSettings] = useState<SiteSettingsFormData>({
    id: 1,
    primaryColor: '#3B82F6',
    fontFamily: 'Inter',
    headingFontFamily: 'Inter',
    logoUrl: null,
    faviconUrl: null,
    resumeUrl: null,
    avatarUrl: null,
    profilePhotoUrl: null,
    githubUrl: null,
    linkedinUrl: null,
    twitterUrl: null,
    emailContact: null,
    contactEmail: null,
    displayNameAr: '',
    displayNameEn: '',
    displayNameTr: '',
    heroHeadlineAr: '',
    heroHeadlineEn: '',
    heroHeadlineTr: '',
    availabilityStatusAr: '',
    availabilityStatusEn: '',
    availabilityStatusTr: '',
    locationAr: '',
    locationEn: '',
    locationTr: '',
    bioAr: '',
    bioEn: '',
    bioTr: '',
    aboutTextAr: '',
    aboutTextEn: '',
    aboutTextTr: '',
    aboutParagraph2Ar: null,
    aboutParagraph2En: null,
    aboutParagraph2Tr: null,
    sectionCopywriting: null,
    siteName: 'Portfolio',
    canonicalUrl: null,
    defaultTitle: 'Portfolio',
    metaDescription: '',
    titleTemplate: '%s | Portfolio',
    robotsDirectives: 'index, follow',
    keywords: '',
  });

  // Social Links State
  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>([]);
  const [newPlatform, setNewPlatform] = useState<string>('');
  const [newUrl, setNewUrl] = useState<string>('');
  const [addingLink, setAddingLink] = useState<boolean>(false);

  // Initial Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [settingsRes, socialRes] = await Promise.all([
          api.get('/settings'),
          api.get('/social-links'),
        ]);

        if (settingsRes.data?.data) {
          setSettings((prev) => ({
            ...prev,
            ...settingsRes.data.data,
          }));
        }

        if (Array.isArray(socialRes.data?.data)) {
          setSocialLinks(socialRes.data.data);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to fetch settings';
        setNotification({ type: 'error', message: msg });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4000);
  };

  const handleInputChange = (field: keyof SiteSettingsFormData, value: unknown) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCopywritingChange = (
    sectionKey: string,
    field: keyof SectionCopywritingItem,
    value: string
  ) => {
    setSettings((prev) => {
      const currentMap = prev.sectionCopywriting || {};
      const currentSection = currentMap[sectionKey] || {};
      return {
        ...prev,
        sectionCopywriting: {
          ...currentMap,
          [sectionKey]: {
            ...currentSection,
            [field]: value,
          },
        },
      };
    });
  };

  // Upload Asset Handler
  const handleUploadFile = async (
    file: File,
    target: 'avatar' | 'logo' | 'resume'
  ): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      if (target === 'avatar') setUploadingAvatar(true);
      if (target === 'logo') setUploadingLogo(true);
      if (target === 'resume') setUploadingResume(true);

      const res = await api.post('/settings/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const uploadedUrl = res.data?.data?.url;
      if (!uploadedUrl) {
        throw new Error('Upload succeeded but no URL was returned');
      }

      if (target === 'avatar') {
        handleInputChange('avatarUrl', uploadedUrl);
        handleInputChange('profilePhotoUrl', uploadedUrl);
        showNotification('success', 'Profile avatar uploaded successfully');
      } else if (target === 'logo') {
        handleInputChange('logoUrl', uploadedUrl);
        showNotification('success', 'Logo uploaded successfully');
      } else if (target === 'resume') {
        handleInputChange('resumeUrl', uploadedUrl);
        showNotification('success', 'Resume PDF uploaded successfully');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'File upload failed';
      showNotification('error', msg);
    } finally {
      if (target === 'avatar') setUploadingAvatar(false);
      if (target === 'logo') setUploadingLogo(false);
      if (target === 'resume') setUploadingResume(false);
    }
  };

  // Save Settings Handler
  const handleSaveSettings = async (): Promise<void> => {
    try {
      setSaving(true);
      const payload = {
        primaryColor: settings.primaryColor,
        fontFamily: settings.fontFamily,
        headingFontFamily: settings.headingFontFamily,
        logoUrl: settings.logoUrl,
        faviconUrl: settings.faviconUrl,
        resumeUrl: settings.resumeUrl,
        avatarUrl: settings.avatarUrl || settings.profilePhotoUrl,
        profilePhotoUrl: settings.profilePhotoUrl || settings.avatarUrl,
        contactEmail: settings.contactEmail || settings.emailContact,
        emailContact: settings.contactEmail || settings.emailContact,
        displayNameAr: settings.displayNameAr,
        displayNameEn: settings.displayNameEn,
        displayNameTr: settings.displayNameTr,
        heroHeadlineAr: settings.heroHeadlineAr,
        heroHeadlineEn: settings.heroHeadlineEn,
        heroHeadlineTr: settings.heroHeadlineTr,
        availabilityStatusAr: settings.availabilityStatusAr,
        availabilityStatusEn: settings.availabilityStatusEn,
        availabilityStatusTr: settings.availabilityStatusTr,
        locationAr: settings.locationAr,
        locationEn: settings.locationEn,
        locationTr: settings.locationTr,
        bioAr: settings.bioAr,
        bioEn: settings.bioEn,
        bioTr: settings.bioTr,
        aboutTextAr: settings.aboutTextAr,
        aboutTextEn: settings.aboutTextEn,
        aboutTextTr: settings.aboutTextTr,
        aboutParagraph2Ar: settings.aboutParagraph2Ar,
        aboutParagraph2En: settings.aboutParagraph2En,
        aboutParagraph2Tr: settings.aboutParagraph2Tr,
        sectionCopywriting: settings.sectionCopywriting,
        siteName: settings.siteName,
        canonicalUrl: settings.canonicalUrl,
        defaultTitle: settings.defaultTitle,
        metaDescription: settings.metaDescription,
        titleTemplate: settings.titleTemplate,
        robotsDirectives: settings.robotsDirectives,
        keywords: settings.keywords,
      };

      await api.put('/settings', payload);
      showNotification('success', 'Portfolio settings saved successfully');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save settings';
      showNotification('error', msg);
    } finally {
      setSaving(false);
    }
  };

  // Social Links Handlers
  const handleAddSocialLink = async (): Promise<void> => {
    if (!newPlatform.trim() || !newUrl.trim()) {
      showNotification('error', 'Please provide both platform name and URL');
      return;
    }

    try {
      setAddingLink(true);
      const res = await api.post('/social-links', {
        platform: newPlatform.trim(),
        url: newUrl.trim(),
        orderIndex: socialLinks.length,
      });

      if (res.data?.data) {
        setSocialLinks((prev) => [...prev, res.data.data]);
        setNewPlatform('');
        setNewUrl('');
        showNotification('success', 'Social link added successfully');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to add social link';
      showNotification('error', msg);
    } finally {
      setAddingLink(false);
    }
  };

  const handleDeleteSocialLink = async (id: number): Promise<void> => {
    try {
      await api.delete(`/social-links/${id}`);
      setSocialLinks((prev) => prev.filter((item) => item.id !== id));
      showNotification('success', 'Social link removed');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete link';
      showNotification('error', msg);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Loading CMS configuration...</p>
      </div>
    );
  }

  const currentSectionCopywriting =
    settings.sectionCopywriting?.[activeSectionKey] || {};

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80 shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Portfolio Settings & UI Control
            </h1>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Full control over texts, multilingual content, themes, typography, and card appearances.
          </p>
        </div>

        {/* Emerald Save Settings Action */}
        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 transition-all duration-150 shadow-lg shadow-emerald-500/20 active:scale-95"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4 text-slate-950" />
              <span>Save Settings</span>
            </>
          )}
        </button>
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

      {/* Navigation Tab Bar */}
      <div className="flex border-b border-slate-800 space-x-1 sm:space-x-2">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 sm:px-6 py-3 font-semibold text-xs sm:text-sm rounded-t-xl transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'border-emerald-400 text-white bg-slate-900/80 shadow-sm'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile & Hero</span>
        </button>

        <button
          onClick={() => setActiveTab('copywriting')}
          className={`px-4 sm:px-6 py-3 font-semibold text-xs sm:text-sm rounded-t-xl transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'copywriting'
              ? 'border-emerald-400 text-white bg-slate-900/80 shadow-sm'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
          }`}
        >
          <Languages className="w-4 h-4" />
          <span>Section Copywriting (EN, AR, TR)</span>
        </button>

        <button
          onClick={() => setActiveTab('appearance')}
          className={`px-4 sm:px-6 py-3 font-semibold text-xs sm:text-sm rounded-t-xl transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'appearance'
              ? 'border-emerald-400 text-white bg-slate-900/80 shadow-sm'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Appearance & UI Styling</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: Profile & Hero                                          */}
      {/* ============================================================== */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left/Center Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
                <LayoutGrid className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-bold text-white tracking-wide">
                  General Information & Hero
                </h2>
              </div>

              {/* Display Name Across 3 Languages */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Display Name
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 mb-1 block">English</span>
                    <input
                      type="text"
                      value={settings.displayNameEn}
                      onChange={(e) => handleInputChange('displayNameEn', e.target.value)}
                      placeholder="e.g. Ahmad Al-Hassan"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 mb-1 block">العربية (RTL)</span>
                    <input
                      type="text"
                      dir="rtl"
                      value={settings.displayNameAr}
                      onChange={(e) => handleInputChange('displayNameAr', e.target.value)}
                      placeholder="مثال: أحمد الحسن"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 mb-1 block">Türkçe</span>
                    <input
                      type="text"
                      value={settings.displayNameTr}
                      onChange={(e) => handleInputChange('displayNameTr', e.target.value)}
                      placeholder="Örn: Ahmet Hasan"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Email & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 block">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={settings.contactEmail || settings.emailContact || ''}
                    onChange={(e) => {
                      handleInputChange('contactEmail', e.target.value);
                      handleInputChange('emailContact', e.target.value);
                    }}
                    placeholder="developer@example.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 block">
                    Location (English)
                  </label>
                  <input
                    type="text"
                    value={settings.locationEn}
                    onChange={(e) => handleInputChange('locationEn', e.target.value)}
                    placeholder="e.g. Istanbul, Turkey"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              {/* Multilingual Location (AR & TR) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 block">
                    الموقع بالعربية (RTL)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={settings.locationAr}
                    onChange={(e) => handleInputChange('locationAr', e.target.value)}
                    placeholder="مثال: إسطنبول، تركيا"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 block">
                    Konum (Türkçe)
                  </label>
                  <input
                    type="text"
                    value={settings.locationTr}
                    onChange={(e) => handleInputChange('locationTr', e.target.value)}
                    placeholder="Örn: İstanbul, Türkiye"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              {/* Availability Status */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Availability Status
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 mb-1 block">English</span>
                    <input
                      type="text"
                      value={settings.availabilityStatusEn}
                      onChange={(e) => handleInputChange('availabilityStatusEn', e.target.value)}
                      placeholder="e.g. Available for select freelance projects"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 mb-1 block">العربية (RTL)</span>
                    <input
                      type="text"
                      dir="rtl"
                      value={settings.availabilityStatusAr}
                      onChange={(e) => handleInputChange('availabilityStatusAr', e.target.value)}
                      placeholder="مثال: متاح للعمل على مشاريع مميزة"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 mb-1 block">Türkçe</span>
                    <input
                      type="text"
                      value={settings.availabilityStatusTr}
                      onChange={(e) => handleInputChange('availabilityStatusTr', e.target.value)}
                      placeholder="Örn: Seçkin projelere açık"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                </div>
              </div>

              {/* Hero Headline */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Hero Headline
                </label>
                <div className="space-y-3">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 mb-1 block">English</span>
                    <input
                      type="text"
                      value={settings.heroHeadlineEn}
                      onChange={(e) => handleInputChange('heroHeadlineEn', e.target.value)}
                      placeholder="e.g. Full-Stack Engineer Crafting Scalable Web Experiences"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 mb-1 block">العربية (RTL)</span>
                    <input
                      type="text"
                      dir="rtl"
                      value={settings.heroHeadlineAr}
                      onChange={(e) => handleInputChange('heroHeadlineAr', e.target.value)}
                      placeholder="مثال: مهندس برمجيات متخصص في بناء تجارب رقمية مميزة"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 mb-1 block">Türkçe</span>
                    <input
                      type="text"
                      value={settings.heroHeadlineTr}
                      onChange={(e) => handleInputChange('heroHeadlineTr', e.target.value)}
                      placeholder="Örn: Ölçeklenebilir Web Deneyimleri Üreten Yazılım Mühendisi"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                </div>
              </div>

              {/* Biography / Short Summary */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Biography / Short Summary
                </label>
                <div className="space-y-3">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 mb-1 block">English</span>
                    <textarea
                      rows={3}
                      value={settings.bioEn}
                      onChange={(e) => handleInputChange('bioEn', e.target.value)}
                      placeholder="Brief overview shown under the hero headline..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 mb-1 block">العربية (RTL)</span>
                    <textarea
                      rows={3}
                      dir="rtl"
                      value={settings.bioAr}
                      onChange={(e) => handleInputChange('bioAr', e.target.value)}
                      placeholder="نبذة مختصرة تظهر أسفل العنوان الرئيسي..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 mb-1 block">Türkçe</span>
                    <textarea
                      rows={3}
                      value={settings.bioTr}
                      onChange={(e) => handleInputChange('bioTr', e.target.value)}
                      placeholder="Ana başlık altında gösterilen kısa özet..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Profile Photo Card & Social Links Card */}
          <div className="space-y-6">
            {/* Profile Photo Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <ImageIcon className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Profile Photo
                </h3>
              </div>

              <div className="flex flex-col items-center justify-center py-4 space-y-4">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-950 border-2 border-slate-700/80 shadow-2xl flex items-center justify-center">
                    {settings.profilePhotoUrl || settings.avatarUrl ? (
                      <img
                        src={settings.profilePhotoUrl || settings.avatarUrl || ''}
                        alt="Profile Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-slate-600" />
                    )}
                  </div>

                  {uploadingAvatar && (
                    <div className="absolute inset-0 bg-slate-950/80 rounded-full flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  ref={avatarInputRef}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleUploadFile(e.target.files[0], 'avatar');
                    }
                  }}
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <UploadCloud className="w-4 h-4 text-emerald-400" />
                  <span>{uploadingAvatar ? 'Uploading...' : 'Change Photo'}</span>
                </button>

                <p className="text-[11px] text-slate-400 text-center">
                  Recommended: WEBP, PNG or JPG (Square ratio, max 10MB)
                </p>
              </div>
            </div>

            {/* Social Links Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    Social Links
                  </h3>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-semibold">
                  {socialLinks.length}
                </span>
              </div>

              {/* Add New Social Link Form */}
              <div className="space-y-2 p-3 bg-slate-950/60 rounded-xl border border-slate-800/80">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newPlatform}
                    onChange={(e) => setNewPlatform(e.target.value)}
                    placeholder="Platform (e.g. GitHub)"
                    className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <input
                    type="url"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="URL (https://...)"
                    className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddSocialLink}
                  disabled={addingLink}
                  className="w-full mt-2 py-1.5 px-3 rounded-lg text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  {addingLink ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                  <span>Add Social Link</span>
                </button>
              </div>

              {/* List of Existing Social Links */}
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {socialLinks.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">
                    No social links added yet.
                  </p>
                ) : (
                  socialLinks.map((link) => (
                    <div
                      key={link.id}
                      className="flex items-center justify-between p-2.5 bg-slate-950/40 border border-slate-800/60 rounded-xl text-xs group"
                    >
                      <div className="min-w-0 pr-2">
                        <span className="font-semibold text-white block">
                          {link.platform}
                        </span>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-400 hover:text-emerald-400 truncate block text-[11px]"
                        >
                          {link.url}
                        </a>
                      </div>
                      <button
                        onClick={() => handleDeleteSocialLink(link.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                        title="Delete social link"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: Section Copywriting (EN, AR, TR)                        */}
      {/* ============================================================== */}
      {activeTab === 'copywriting' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Section Selector Sidebar */}
          <div className="space-y-2">
            <div className="px-3 py-1 text-xs font-bold uppercase text-slate-400 tracking-wider">
              Sections to Customize
            </div>
            {SECTIONS_CONFIG.map((sec) => (
              <button
                key={sec.key}
                type="button"
                onClick={() => setActiveSectionKey(sec.key)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-between ${
                  activeSectionKey === sec.key
                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <span>{sec.label}</span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                  {sec.key}
                </span>
              </button>
            ))}
          </div>

          {/* Copywriting Editor Area */}
          <div className="lg:col-span-3">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white tracking-wide capitalize">
                    {activeSectionKey} Section Copywriting
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Customize badges, titles, and subtitles across Arabic, English, and Turkish.
                  </p>
                </div>
              </div>

              {/* 1. Badge Row */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Section Badge Label
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 mb-1 block">English</span>
                    <input
                      type="text"
                      value={currentSectionCopywriting.badgeEn || ''}
                      onChange={(e) =>
                        handleCopywritingChange(activeSectionKey, 'badgeEn', e.target.value)
                      }
                      placeholder="e.g. Featured Projects"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 mb-1 block">العربية (RTL)</span>
                    <input
                      type="text"
                      dir="rtl"
                      value={currentSectionCopywriting.badgeAr || ''}
                      onChange={(e) =>
                        handleCopywritingChange(activeSectionKey, 'badgeAr', e.target.value)
                      }
                      placeholder="مثال: معرض الأعمال"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 mb-1 block">Türkçe</span>
                    <input
                      type="text"
                      value={currentSectionCopywriting.badgeTr || ''}
                      onChange={(e) =>
                        handleCopywritingChange(activeSectionKey, 'badgeTr', e.target.value)
                      }
                      placeholder="Örn: Öne Çıkan Projeler"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Title Row */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Main Section Title
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 mb-1 block">English</span>
                    <input
                      type="text"
                      value={currentSectionCopywriting.titleEn || ''}
                      onChange={(e) =>
                        handleCopywritingChange(activeSectionKey, 'titleEn', e.target.value)
                      }
                      placeholder="e.g. Crafted with Precision"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 mb-1 block">العربية (RTL)</span>
                    <input
                      type="text"
                      dir="rtl"
                      value={currentSectionCopywriting.titleAr || ''}
                      onChange={(e) =>
                        handleCopywritingChange(activeSectionKey, 'titleAr', e.target.value)
                      }
                      placeholder="مثال: مصممة بدقة عالية"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 mb-1 block">Türkçe</span>
                    <input
                      type="text"
                      value={currentSectionCopywriting.titleTr || ''}
                      onChange={(e) =>
                        handleCopywritingChange(activeSectionKey, 'titleTr', e.target.value)
                      }
                      placeholder="Örn: Hassasiyetle Geliştirildi"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Subtitle Row */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Section Subtitle / Description
                </label>
                <div className="space-y-3">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 mb-1 block">English</span>
                    <textarea
                      rows={2}
                      value={currentSectionCopywriting.subtitleEn || ''}
                      onChange={(e) =>
                        handleCopywritingChange(activeSectionKey, 'subtitleEn', e.target.value)
                      }
                      placeholder="Secondary explanation for the section..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 mb-1 block">العربية (RTL)</span>
                    <textarea
                      rows={2}
                      dir="rtl"
                      value={currentSectionCopywriting.subtitleAr || ''}
                      onChange={(e) =>
                        handleCopywritingChange(activeSectionKey, 'subtitleAr', e.target.value)
                      }
                      placeholder="شرح إضافي يظهر أسفل العنوان الرئيسي للقسم..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 mb-1 block">Türkçe</span>
                    <textarea
                      rows={2}
                      value={currentSectionCopywriting.subtitleTr || ''}
                      onChange={(e) =>
                        handleCopywritingChange(activeSectionKey, 'subtitleTr', e.target.value)
                      }
                      placeholder="Bölüm ana başlığı altında görünen ek açıklama..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: Appearance & UI Styling                                 */}
      {/* ============================================================== */}
      {activeTab === 'appearance' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Brand Accent Color Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Palette className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white tracking-wide">
                Brand Accent Color
              </h3>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-semibold text-slate-300 block">
                Primary Brand Color (Buttons, Badges, Highlights)
              </label>

              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                  className="w-14 h-14 rounded-xl cursor-pointer bg-slate-950 border border-slate-800 p-1"
                />
                <input
                  type="text"
                  value={settings.primaryColor}
                  onChange={(e) => handleInputChange('primaryColor', e.target.value)}
                  placeholder="#3B82F6"
                  className="w-36 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono uppercase focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
                <div
                  className="w-10 h-10 rounded-xl shadow-md border border-slate-700/60"
                  style={{ backgroundColor: settings.primaryColor }}
                />
              </div>

              {/* Color Presets */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 block">
                  Quick Presets:
                </span>
                <div className="flex flex-wrap gap-2">
                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => handleInputChange('primaryColor', preset.value)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-800 hover:border-slate-700 flex items-center gap-2 transition-colors bg-slate-950/60"
                    >
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: preset.value }}
                      />
                      <span className="text-slate-300">{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Typography Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <Type className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white tracking-wide">
                Typography
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-2 block">
                  Body Font Family
                </label>
                <select
                  value={settings.fontFamily}
                  onChange={(e) => handleInputChange('fontFamily', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  {AVAILABLE_FONTS.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 mb-2 block">
                  Heading Font Family
                </label>
                <select
                  value={settings.headingFontFamily}
                  onChange={(e) => handleInputChange('headingFontFamily', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  {AVAILABLE_FONTS.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Logo & Branding Assets */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <UploadCloud className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white tracking-wide">
                Logo & Favicon
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-2 block">
                  Header Logo Image
                </label>
                <div className="flex items-center gap-4">
                  {settings.logoUrl && (
                    <div className="w-16 h-12 rounded-lg bg-slate-950 border border-slate-800 p-1 flex items-center justify-center overflow-hidden">
                      <img
                        src={settings.logoUrl}
                        alt="Site Logo"
                        className="max-h-full object-contain"
                      />
                    </div>
                  )}

                  <input
                    type="file"
                    ref={logoInputRef}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleUploadFile(e.target.files[0], 'logo');
                      }
                    }}
                    accept="image/*,.svg"
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={uploadingLogo}
                    className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <UploadCloud className="w-4 h-4 text-emerald-400" />
                    <span>{uploadingLogo ? 'Uploading...' : 'Upload Logo (SVG/PNG)'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Resume PDF File */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <FileText className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white tracking-wide">
                Resume / CV (PDF)
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 mb-2 block">
                  Downloadable Resume File
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <input
                    type="file"
                    ref={resumeInputRef}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleUploadFile(e.target.files[0], 'resume');
                      }
                    }}
                    accept="application/pdf"
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => resumeInputRef.current?.click()}
                    disabled={uploadingResume}
                    className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    <UploadCloud className="w-4 h-4 text-emerald-400" />
                    <span>{uploadingResume ? 'Uploading...' : 'Upload PDF Resume'}</span>
                  </button>

                  {settings.resumeUrl && (
                    <a
                      href={settings.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-emerald-400 hover:underline flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View Current PDF</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHeroSettings;
