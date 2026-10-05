import React, { useState, useEffect, useMemo } from 'react';
import {
  Languages,
  Save,
  Upload,
  Download,
  Plus,
  Trash2,
  Search,
  Code,
  List,
  RotateCw,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileJson,
  X,
} from 'lucide-react';
import api from '../../services/api';

export interface TranslationItem {
  id: number;
  key: string;
  valueEn: string;
  valueAr?: string | null;
  valueTr?: string | null;
  category?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export const AdminTranslations: React.FC = () => {
  const [translations, setTranslations] = useState<TranslationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [activeLangTab, setActiveLangTab] = useState<'en' | 'ar' | 'tr'>('en');
  const [viewMode, setViewMode] = useState<'visual' | 'raw'>('visual');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [rawJsonText, setRawJsonText] = useState<string>('{}');
  const [jsonError, setJsonError] = useState<string | null>(null);

  // Notification State
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // New Key Modal State
  const [isAddKeyModalOpen, setIsAddKeyModalOpen] = useState<boolean>(false);
  const [newKeyForm, setNewKeyForm] = useState({
    key: '',
    valueEn: '',
    valueAr: '',
    valueTr: '',
    category: 'General',
  });

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 4000);
  };

  const fetchTranslations = async () => {
    try {
      setLoading(true);
      const res = await api.get('/translations');
      if (Array.isArray(res.data?.data)) {
        const items: TranslationItem[] = res.data.data;
        setTranslations(items);
        syncRawJson(items, activeLangTab);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch translations';
      showNotification('error', msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTranslations();
  }, []);

  const syncRawJson = (items: TranslationItem[], lang: 'en' | 'ar' | 'tr') => {
    const dict: Record<string, string> = {};
    items.forEach((item) => {
      dict[item.key] =
        lang === 'ar'
          ? item.valueAr || ''
          : lang === 'tr'
          ? item.valueTr || ''
          : item.valueEn || '';
    });
    setRawJsonText(JSON.stringify(dict, null, 2));
    setJsonError(null);
  };

  const handleLangTabChange = (lang: 'en' | 'ar' | 'tr') => {
    setActiveLangTab(lang);
    syncRawJson(translations, lang);
  };

  const handleValueChange = (id: number, lang: 'en' | 'ar' | 'tr', value: string) => {
    setTranslations((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            [lang === 'en' ? 'valueEn' : lang === 'ar' ? 'valueAr' : 'valueTr']: value,
          };
        }
        return item;
      })
    );
  };

  const handleSaveChanges = async () => {
    try {
      setSaving(true);

      if (viewMode === 'raw') {
        try {
          const parsed = JSON.parse(rawJsonText);
          const bulkItems = Object.entries(parsed).map(([key, val]) => ({
            key,
            [activeLangTab === 'en'
              ? 'valueEn'
              : activeLangTab === 'ar'
              ? 'valueAr'
              : 'valueTr']: String(val),
          }));

          await api.post('/translations/bulk-import', { items: bulkItems });
          showNotification('success', `Raw JSON imported for ${activeLangTab.toUpperCase()}`);
          await fetchTranslations();
          return;
        } catch (parseErr: unknown) {
          const msg = parseErr instanceof Error ? parseErr.message : 'Invalid JSON format';
          setJsonError(msg);
          showNotification('error', `JSON Syntax Error: ${msg}`);
          return;
        }
      }

      // Visual mode save: save all modified keys via bulk-import
      const bulkPayload = translations.map((t) => ({
        key: t.key,
        valueEn: t.valueEn,
        valueAr: t.valueAr || '',
        valueTr: t.valueTr || '',
        category: t.category || 'General',
      }));

      await api.post('/translations/bulk-import', { items: bulkPayload });
      showNotification('success', 'All translations updated and persisted');
      syncRawJson(translations, activeLangTab);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save translations';
      showNotification('error', msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteKey = async (id: number, keyName: string) => {
    if (!window.confirm(`Are you sure you want to delete translation key "${keyName}"?`)) {
      return;
    }

    try {
      await api.delete(`/translations/${id}`);
      const remaining = translations.filter((t) => t.id !== id);
      setTranslations(remaining);
      syncRawJson(remaining, activeLangTab);
      showNotification('success', `Key "${keyName}" deleted`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete key';
      showNotification('error', msg);
    }
  };

  const handleCreateNewKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyForm.key.trim()) {
      showNotification('error', 'Translation key name is required');
      return;
    }

    try {
      const res = await api.post('/translations', {
        key: newKeyForm.key.trim(),
        valueEn: newKeyForm.valueEn.trim() || newKeyForm.key.trim(),
        valueAr: newKeyForm.valueAr.trim(),
        valueTr: newKeyForm.valueTr.trim(),
        category: newKeyForm.category.trim() || 'General',
      });

      const created = res.data?.data;
      if (created) {
        const nextList = [...translations, created];
        setTranslations(nextList);
        syncRawJson(nextList, activeLangTab);
        showNotification('success', `Translation key "${created.key}" added`);
      }
      setIsAddKeyModalOpen(false);
      setNewKeyForm({ key: '', valueEn: '', valueAr: '', valueTr: '', category: 'General' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to add translation key';
      showNotification('error', msg);
    }
  };

  const handleDownloadJson = () => {
    const dict: Record<string, string> = {};
    translations.forEach((item) => {
      dict[item.key] =
        activeLangTab === 'ar'
          ? item.valueAr || ''
          : activeLangTab === 'tr'
          ? item.valueTr || ''
          : item.valueEn || '';
    });

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dict, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `translations_${activeLangTab}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification('success', `Downloaded translations_${activeLangTab}.json`);
  };

  const handleUploadJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (typeof parsed !== 'object' || parsed === null) {
          throw new Error('JSON file must contain an object of key-value pairs');
        }

        const bulkItems = Object.entries(parsed).map(([key, val]) => ({
          key,
          [activeLangTab === 'en'
            ? 'valueEn'
            : activeLangTab === 'ar'
            ? 'valueAr'
            : 'valueTr']: String(val),
        }));

        await api.post('/translations/bulk-import', { items: bulkItems });
        showNotification('success', `Imported ${bulkItems.length} keys from ${file.name}`);
        await fetchTranslations();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'JSON file parse error';
        showNotification('error', msg);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const filteredTranslations = useMemo(() => {
    if (!searchQuery.trim()) return translations;
    const q = searchQuery.toLowerCase();
    return translations.filter(
      (t) =>
        t.key.toLowerCase().includes(q) ||
        (t.valueEn || '').toLowerCase().includes(q) ||
        (t.valueAr || '').toLowerCase().includes(q) ||
        (t.valueTr || '').toLowerCase().includes(q)
    );
  }, [translations, searchQuery]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-slate-400 text-sm font-medium">Loading Translations Dictionary...</p>
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
              <Languages className="w-5 h-5" />
            </span>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Translations & Localization Hub (قاموس الترجمة والتعريب)
            </h1>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Manage multilingual static strings, bulk JSON import/export, and side-by-side key dictionary for English, Arabic, and Turkish.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <label className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 cursor-pointer border border-slate-700/80 transition-all">
            <Upload className="w-3.5 h-3.5" />
            <span>Upload JSON</span>
            <input type="file" accept=".json" onChange={handleUploadJson} className="hidden" />
          </label>

          <button
            type="button"
            onClick={handleDownloadJson}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700/80 transition-all"
            title="Export JSON dictionary"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download JSON</span>
          </button>

          <button
            type="button"
            onClick={fetchTranslations}
            className="p-2 rounded-xl text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700/80 transition-all"
            title="Reload"
          >
            <RotateCw className="w-4 h-4 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={handleSaveChanges}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl font-semibold text-xs sm:text-sm text-slate-950 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
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

      {/* Control Bar: Tabs & View Mode */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 shadow-lg">
        {/* Language Tabs */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleLangTabChange('en')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeLangTab === 'en'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            English (EN)
          </button>
          <button
            type="button"
            onClick={() => handleLangTabChange('ar')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeLangTab === 'ar'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            العربية (AR)
          </button>
          <button
            type="button"
            onClick={() => handleLangTabChange('tr')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeLangTab === 'tr'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            Türkçe (TR)
          </button>
        </div>

        {/* View Switcher & Action */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setViewMode('visual')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'visual'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Visual Editor</span>
            </button>
            <button
              type="button"
              onClick={() => {
                syncRawJson(translations, activeLangTab);
                setViewMode('raw');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'raw'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Raw JSON</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsAddKeyModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Key</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'visual' ? (
        <div className="space-y-4">
          {/* Search bar & Key count */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/40 p-4 rounded-xl border border-slate-800">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search keys or translations..."
                className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="text-xs text-slate-400">
              Showing <span className="text-white font-medium">{filteredTranslations.length}</span> of{' '}
              <span className="text-white font-medium">{translations.length}</span> keys
            </div>
          </div>

          {/* Key-Value Editor List */}
          <div className="space-y-3">
            {filteredTranslations.length === 0 ? (
              <div className="text-center py-12 bg-slate-900/40 rounded-2xl border border-slate-800">
                <FileJson className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-300">No translations match your search</p>
                <p className="text-xs text-slate-500 mt-1">Try another search term or click "Add Key" to create a new key.</p>
              </div>
            ) : (
              filteredTranslations.map((item) => {
                const currentVal =
                  activeLangTab === 'ar'
                    ? item.valueAr || ''
                    : activeLangTab === 'tr'
                    ? item.valueTr || ''
                    : item.valueEn || '';

                return (
                  <div
                    key={item.id}
                    className="p-4 bg-slate-900/60 rounded-xl border border-slate-800/80 hover:border-slate-700/80 transition-all flex flex-col md:flex-row md:items-center gap-3.5"
                  >
                    {/* Key Info */}
                    <div className="md:w-1/3 min-w-[220px] space-y-1">
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 break-all">
                          {item.key}
                        </code>
                        {item.category && (
                          <span className="text-[10px] font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                            {item.category}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate" title={item.valueEn}>
                        EN: {item.valueEn || '—'}
                      </p>
                    </div>

                    {/* Value Input */}
                    <div className="flex-1">
                      <input
                        type="text"
                        value={currentVal}
                        dir={activeLangTab === 'ar' ? 'rtl' : 'ltr'}
                        onChange={(e) => handleValueChange(item.id, activeLangTab, e.target.value)}
                        placeholder={`Translation in ${activeLangTab.toUpperCase()}...`}
                        className={`w-full px-3.5 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 ${
                          activeLangTab === 'ar' ? 'text-right font-arabic' : ''
                        }`}
                      />
                    </div>

                    {/* Delete action */}
                    <button
                      type="button"
                      onClick={() => handleDeleteKey(item.id, item.key)}
                      className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors self-end md:self-center"
                      title="Delete Key"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* Raw JSON Editor Mode */
        <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-white">
                Raw JSON Dictionary ({activeLangTab.toUpperCase()})
              </h2>
              <p className="text-xs text-slate-400">
                Directly edit key-value JSON dictionary for the current language. Click "Save Changes" to validate and apply.
              </p>
            </div>
            {jsonError && (
              <span className="text-xs text-rose-400 bg-rose-500/10 px-3 py-1 rounded-lg border border-rose-500/20">
                {jsonError}
              </span>
            )}
          </div>

          <textarea
            rows={18}
            value={rawJsonText}
            onChange={(e) => {
              setRawJsonText(e.target.value);
              try {
                JSON.parse(e.target.value);
                setJsonError(null);
              } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : 'Invalid JSON';
                setJsonError(msg);
              }
            }}
            spellCheck={false}
            className="w-full p-4 bg-slate-950 font-mono text-xs text-emerald-400 border border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 resize-y leading-relaxed"
          />
        </div>
      )}

      {/* Add New Key Modal */}
      {isAddKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                Add New Translation Key
              </h3>
              <button
                type="button"
                onClick={() => setIsAddKeyModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewKey} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Key Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. common.learn_more"
                  value={newKeyForm.key}
                  onChange={(e) => setNewKeyForm({ ...newKeyForm, key: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
                <input
                  type="text"
                  placeholder="e.g. Navbar, Footer, General"
                  value={newKeyForm.category}
                  onChange={(e) => setNewKeyForm({ ...newKeyForm, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  English Value (EN)
                </label>
                <input
                  type="text"
                  placeholder="English text..."
                  value={newKeyForm.valueEn}
                  onChange={(e) => setNewKeyForm({ ...newKeyForm, valueEn: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Arabic Value (AR)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  placeholder="النص بالعربية..."
                  value={newKeyForm.valueAr}
                  onChange={(e) => setNewKeyForm({ ...newKeyForm, valueAr: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 text-right"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Turkish Value (TR)
                </label>
                <input
                  type="text"
                  placeholder="Türkçe metin..."
                  value={newKeyForm.valueTr}
                  onChange={(e) => setNewKeyForm({ ...newKeyForm, valueTr: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddKeyModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300"
                >
                  Create Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTranslations;
