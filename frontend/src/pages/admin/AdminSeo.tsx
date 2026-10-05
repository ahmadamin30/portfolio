import React, { useState, useEffect } from 'react';
import {
  Globe,
  Save,
  RotateCw,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Search,
  Share2,
  FileCode,
  Eye,
  Check,
} from 'lucide-react';
import api from '../../services/api';

export interface SeoSettingsData {
  siteName: string;
  canonicalUrl: string;
  defaultTitle: string;
  metaDescription: string;
  titleTemplate: string;
  robotsDirectives: string;
  keywords: string;
}

export const AdminSeo: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'meta' | 'social' | 'schema' | 'preview'>('meta');

  // Notification State
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // SEO Form State
  const [formData, setFormData] = useState<SeoSettingsData>({
    siteName: 'Ahmad Alamin | Senior Software Engineer',
    canonicalUrl: 'https://ahmadalamin.dev',
    defaultTitle: 'Ahmad Alamin - Full-Stack & Distributed Systems Engineer',
    metaDescription: 'Senior Software Engineer specializing in high-concurrency microservices, cloud native architectures, and resilient modern web applications.',
    titleTemplate: '%s | Ahmad Alamin',
    robotsDirectives: 'index, follow',
    keywords: 'Software Engineer, Full-Stack, TypeScript, React, Node.js, Distributed Systems, Microservices, Cloud Native, MySQL, Docker',
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4000);
  };

  const fetchSeoSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/settings');
      const data = res.data?.data;
      if (data) {
        setFormData({
          siteName: data.siteName || '',
          canonicalUrl: data.canonicalUrl || '',
          defaultTitle: data.defaultTitle || '',
          metaDescription: data.metaDescription || '',
          titleTemplate: data.titleTemplate || '%s | Portfolio',
          robotsDirectives: data.robotsDirectives || 'index, follow',
          keywords: data.keywords || '',
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load SEO settings';
      showNotification('error', msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeoSettings();
  }, []);

  const handleSaveSeo = async () => {
    try {
      setSaving(true);
      await api.put('/settings', {
        siteName: formData.siteName.trim(),
        canonicalUrl: formData.canonicalUrl.trim(),
        defaultTitle: formData.defaultTitle.trim(),
        metaDescription: formData.metaDescription.trim(),
        titleTemplate: formData.titleTemplate.trim(),
        robotsDirectives: formData.robotsDirectives.trim(),
        keywords: formData.keywords.trim(),
      });
      showNotification('success', 'SEO configuration saved and published successfully');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save SEO settings';
      showNotification('error', msg);
    } finally {
      setSaving(false);
    }
  };

  // Helper counters
  const titleCharCount = formData.defaultTitle.length;
  const descCharCount = formData.metaDescription.length;

  const isDescIdeal = descCharCount >= 140 && descCharCount <= 160;
  const isTitleIdeal = titleCharCount >= 50 && titleCharCount <= 60;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Loading SEO Hub parameters...</p>
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
              <Globe className="w-5 h-5" />
            </span>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              100% Controllable SEO Hub (إدارة محركات البحث والأرشفة)
            </h1>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Configure metadata, Google search snippets, OpenGraph social cards, canonical routing, and structured JSON-LD schemas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchSeoSettings}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white transition-all border border-slate-700/80"
          >
            <RotateCw className="w-4 h-4 text-slate-400" />
            <span>Reload</span>
          </button>
          <button
            type="button"
            onClick={handleSaveSeo}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                <span>Saving SEO...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-slate-950" />
                <span>Save SEO</span>
              </>
            )}
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

      {/* Tabs Navigation */}
      <div className="flex bg-slate-900 border border-slate-800 rounded-2xl p-1.5 shadow-md">
        <button
          type="button"
          onClick={() => setActiveTab('meta')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'meta'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Meta & Indexing</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('social')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'social'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>OpenGraph & Social</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('schema')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'schema'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileCode className="w-4 h-4" />
          <span>Structured Data (JSON-LD)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'preview'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Live Previews</span>
        </button>
      </div>
      {/* ============================================================== */}
      {/* TAB 1: META & INDEXING                                         */}
      {/* ============================================================== */}
      {activeTab === 'meta' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Site / Brand Name */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 block">
                Site / Brand Name *
              </label>
              <input
                type="text"
                value={formData.siteName}
                onChange={(e) => setFormData((p) => ({ ...p, siteName: e.target.value }))}
                placeholder="e.g. Ahmad Alamin | Portfolio"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Root site name for bookmarks and search indexing.</span>
            </div>

            {/* Canonical Base URL */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 block">
                Canonical Base URL *
              </label>
              <input
                type="url"
                value={formData.canonicalUrl}
                onChange={(e) => setFormData((p) => ({ ...p, canonicalUrl: e.target.value }))}
                placeholder="https://ahmadalamin.dev"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Primary production domain prevents duplicate content penalties.</span>
            </div>
          </div>

          {/* Default Page Title */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Default Page Title *
              </label>
              <span className={`text-[11px] font-mono ${isTitleIdeal ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                {titleCharCount} chars {isTitleIdeal ? '(Ideal 50-60)' : '(50-60 optimal)'}
              </span>
            </div>
            <input
              type="text"
              value={formData.defaultTitle}
              onChange={(e) => setFormData((p) => ({ ...p, defaultTitle: e.target.value }))}
              placeholder="e.g. Ahmad Alamin - Senior Full-Stack & Distributed Systems Engineer"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Title Template */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 block">
                Title Template (%s)
              </label>
              <input
                type="text"
                value={formData.titleTemplate}
                onChange={(e) => setFormData((p) => ({ ...p, titleTemplate: e.target.value }))}
                placeholder="%s | Ahmad Alamin"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white font-mono placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">Dynamic pattern for subpages (e.g. "Projects | Ahmad Alamin").</span>
            </div>

            {/* Robots Directives */}
            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 block">
                Robots Directives
              </label>
              <select
                value={formData.robotsDirectives}
                onChange={(e) => setFormData((p) => ({ ...p, robotsDirectives: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="index, follow">index, follow (Default - Fully indexed & crawled)</option>
                <option value="noindex, follow">noindex, follow (Hide from search, follow links)</option>
                <option value="index, nofollow">index, nofollow (Index page, do not pass link juice)</option>
                <option value="noindex, nofollow">noindex, nofollow (Private - Do not index or follow)</option>
              </select>
            </div>
          </div>

          {/* Meta Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Meta Description *
              </label>
              <div className="flex items-center gap-2">
                {isDescIdeal && (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                    <Check className="w-3.5 h-3.5" />
                    <span>Ideal Length</span>
                  </span>
                )}
                <span className={`text-[11px] font-mono ${isDescIdeal ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
                  {descCharCount} / 160 chars
                </span>
              </div>
            </div>
            <textarea
              rows={3}
              value={formData.metaDescription}
              onChange={(e) => setFormData((p) => ({ ...p, metaDescription: e.target.value }))}
              placeholder="Senior Software Engineer specializing in distributed architectures..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed"
            />
          </div>

          {/* Comma-separated Keywords */}
          <div>
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 block">
              SEO Keywords (Comma-Separated)
            </label>
            <input
              type="text"
              value={formData.keywords}
              onChange={(e) => setFormData((p) => ({ ...p, keywords: e.target.value }))}
              placeholder="Software Engineer, Full-Stack, TypeScript, React, Node.js..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: OPENGRAPH & SOCIAL                                      */}
      {/* ============================================================== */}
      {activeTab === 'social' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">OpenGraph & Social Media Meta Cards</h3>
            <p className="text-xs text-slate-400 mt-1">Automatic Open Graph (og:) and Twitter Card (twitter:) generation for LinkedIn, Twitter, and WhatsApp shares.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Generated OpenGraph Tags</span>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-emerald-400 space-y-1.5 overflow-x-auto">
              <p>&lt;meta property="og:type" content="website" /&gt;</p>
              <p>&lt;meta property="og:site_name" content="{formData.siteName}" /&gt;</p>
              <p>&lt;meta property="og:title" content="{formData.defaultTitle}" /&gt;</p>
              <p>&lt;meta property="og:description" content="{formData.metaDescription}" /&gt;</p>
              <p>&lt;meta property="og:url" content="{formData.canonicalUrl}" /&gt;</p>
              <p>&lt;meta name="twitter:card" content="summary_large_image" /&gt;</p>
              <p>&lt;meta name="twitter:title" content="{formData.defaultTitle}" /&gt;</p>
              <p>&lt;meta name="twitter:description" content="{formData.metaDescription}" /&gt;</p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: STRUCTURED DATA (JSON-LD)                              */}
      {/* ============================================================== */}
      {activeTab === 'schema' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">Structured Data (Schema.org / JSON-LD)</h3>
            <p className="text-xs text-slate-400 mt-1">Enhance Google rich results with structured Person and ProfessionalService entities.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-blue-300 space-y-1 overflow-x-auto">
            <pre>
{JSON.stringify(
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Ahmad Alamin',
    jobTitle: 'Senior Software Engineer',
    url: formData.canonicalUrl || 'https://ahmadalamin.dev',
    description: formData.metaDescription,
    knowsAbout: ['TypeScript', 'React', 'Node.js', 'Distributed Systems', 'Cloud Architecture'],
  },
  null,
  2
)}
            </pre>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: LIVE PREVIEWS                                           */}
      {/* ============================================================== */}
      {activeTab === 'preview' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-8">
          {/* Google Search Snippet Preview */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Google Search Result Snippet Preview
              </h3>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 max-w-2xl space-y-1.5 shadow-md">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px]">G</span>
                <span className="truncate">{formData.canonicalUrl || 'https://ahmadalamin.dev'}</span>
              </div>
              <h4 className="text-base font-semibold text-blue-400 hover:underline cursor-pointer truncate">
                {formData.defaultTitle || 'Ahmad Alamin - Full-Stack Engineer'}
              </h4>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {formData.metaDescription || 'Senior Software Engineer specializing in distributed architectures and high-impact digital experiences.'}
              </p>
            </div>
          </div>

          {/* Social Share Card Preview */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Share2 className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Social Media Card Preview (LinkedIn / Twitter)
              </h3>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 max-w-xl space-y-3 shadow-md">
              <div className="w-full h-44 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center gap-2 text-slate-500">
                <Globe className="w-10 h-10 text-slate-600" />
                <span className="text-xs font-mono">{formData.siteName}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[11px] uppercase font-mono text-slate-500">ahmadalamin.dev</span>
                <h5 className="font-bold text-sm text-white">{formData.defaultTitle}</h5>
                <p className="text-xs text-slate-400 line-clamp-2">{formData.metaDescription}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSeo;
