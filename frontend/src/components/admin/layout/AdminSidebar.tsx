import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  SlidersHorizontal,
  User,
  Workflow,
  Briefcase,
  Code2,
  GraduationCap,
  Award,
  Layers,
  HelpCircle,
  Mail,
  Globe,
  Languages,
  LogOut,
  Shield,
  X,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export interface AdminSidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  label: string;
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

const portfolioContentItems: NavItem[] = [
  { label: 'Overview', to: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Hero & Settings', to: '/admin/hero-settings', icon: SlidersHorizontal },
  { label: 'About Section', to: '/admin/about', icon: User },
  { label: 'Workflow Steps', to: '/admin/workflow', icon: Workflow },
  { label: 'Projects', to: '/admin/projects', icon: Briefcase },
  { label: 'Skills', to: '/admin/skills', icon: Code2 },
  { label: 'Experience', to: '/admin/experience', icon: GraduationCap },
  { label: 'Certificates', to: '/admin/certificates', icon: Award },
  { label: 'Services', to: '/admin/services', icon: Layers },
  { label: 'FAQs', to: '/admin/faqs', icon: HelpCircle },
];

const growthSettingsItems: NavItem[] = [
  { label: 'Messages', to: '/admin/messages', icon: Mail, badge: 'Inbox' },
  { label: 'SEO Hub', to: '/admin/seo', icon: Globe },
  { label: 'Translations', to: '/admin/translations', icon: Languages },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  isMobileOpen,
  onCloseMobile,
}) => {
  const { admin, logout } = useAuth();

  const renderNavList = (items: NavItem[]) => (
    <ul className="space-y-1">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <li key={item.to}>
            <NavLink
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 group ${
                  isActive
                    ? 'bg-white text-slate-950 font-semibold shadow-md shadow-white/5'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-transform group-hover:scale-105 ${
                        isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${
                        isActive
                          ? 'bg-slate-900 text-white border-slate-700'
                          : 'bg-slate-800 text-slate-300 border-slate-700/60'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden transition-opacity duration-200"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header Section */}
        <div className="flex flex-col flex-1 min-h-0">
          <div className="h-16 px-5 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
            <Link
              to="/admin/dashboard"
              onClick={onCloseMobile}
              className="flex items-center gap-3 group"
            >
              <div className="p-2 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-white tracking-tight">
                    Admin Center
                  </span>
                  <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    CMS
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  Workspace Core
                </span>
              </div>
            </Link>

            {/* Close button on mobile */}
            <button
              onClick={onCloseMobile}
              className="p-1.5 text-slate-400 hover:text-white md:hidden rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Navigation Groups */}
          <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-800">
            {/* Group 1: PORTFOLIO CONTENT */}
            <div className="space-y-1.5">
              <div className="px-3 text-[10px] font-bold text-slate-400 tracking-wider uppercase flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-blue-400" />
                <span>Portfolio Content</span>
              </div>
              {renderNavList(portfolioContentItems)}
            </div>

            {/* Group 2: GROWTH & SETTINGS */}
            <div className="space-y-1.5">
              <div className="px-3 text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                Growth & Settings
              </div>
              {renderNavList(growthSettingsItems)}
            </div>
          </nav>
        </div>

        {/* Bottom Section: Admin User Card & Logout Action */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/50 space-y-3 flex-shrink-0">
          {/* Admin Identity Card */}
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-950/40 border border-slate-800/60">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20 flex-shrink-0">
              {(admin?.name || admin?.username || admin?.email || 'A')
                .charAt(0)
                .toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">
                {admin?.name || admin?.username || 'Administrator'}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {admin?.email || 'admin@example.com'}
              </p>
            </div>
          </div>

          {/* Logout Action */}
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/30 rounded-xl transition-all duration-150"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
