import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X, ExternalLink, Shield } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export interface AdminHeaderProps {
  isMobileOpen: boolean;
  onToggleMobile: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  isMobileOpen,
  onToggleMobile,
}) => {
  const { admin } = useAuth();
  const location = useLocation();

  // Dynamic Page Title & Breadcrumb calculation
  const getPageInfo = (pathname: string): { title: string; breadcrumb: string } => {
    if (pathname.includes('/projects')) {
      return { title: 'Projects Management', breadcrumb: 'Projects' };
    }
    if (pathname.includes('/skills')) {
      return { title: 'Skills Management', breadcrumb: 'Skills' };
    }
    if (pathname.includes('/messages')) {
      return { title: 'Messages Inbox', breadcrumb: 'Messages' };
    }
    return { title: 'Dashboard Overview', breadcrumb: 'Dashboard' };
  };

  const { title, breadcrumb } = getPageInfo(location.pathname);

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900/80 backdrop-blur border-b border-slate-800 px-4 md:px-6 flex items-center justify-between">
      {/* Left Area: Mobile Menu Toggle & Dynamic Titles */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobile}
          className="p-2 -ml-1 text-slate-400 hover:text-white md:hidden rounded-lg hover:bg-slate-800 transition-colors"
          aria-label={isMobileOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Admin</span>
            <span>/</span>
            <span className="text-blue-400 font-medium">{breadcrumb}</span>
          </div>
          <h1 className="text-base font-bold text-white leading-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Right Area: Public Link & User Status */}
      <div className="flex items-center gap-3">
        {/* Direct Link to View Public Portfolio */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700/60 shadow-sm"
          title="Open public portfolio in a new tab"
        >
          <span>Live Site</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </a>

        {/* Quick Profile / Session Status */}
        <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-800">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 text-xs font-semibold">
              <Shield className="w-4 h-4 text-blue-400" />
            </div>
            {/* Live session active dot */}
            <span
              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900"
              title="Session Active"
            />
          </div>
          <div className="text-left hidden lg:block">
            <span className="block text-xs font-medium text-white leading-none">
              {admin?.name || admin?.username || 'Admin'}
            </span>
            <span className="text-[10px] text-emerald-400 font-medium leading-none">
              Online
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
