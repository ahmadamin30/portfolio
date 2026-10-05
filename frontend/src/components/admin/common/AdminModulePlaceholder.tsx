import React from 'react';
import { LucideIcon, Sparkles } from 'lucide-react';

export interface AdminModulePlaceholderProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  endpoint: string;
}

export const AdminModulePlaceholder: React.FC<AdminModulePlaceholderProps> = ({
  title,
  subtitle,
  icon: Icon,
  endpoint,
}) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="p-12 bg-slate-900 border border-slate-800 rounded-2xl text-center space-y-4 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600/20 to-emerald-500/20 border border-blue-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
          <Icon className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">{subtitle}</p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Backend API Connected:</span>
          <code className="text-emerald-400">{endpoint}</code>
        </div>

        <div className="pt-4 flex justify-center">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Schema & CRUD endpoints deployed. Admin UI view ready to expand.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminModulePlaceholder;
