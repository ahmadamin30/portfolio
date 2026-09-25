import React from 'react';
import { Briefcase, Code2, Mail, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface StatCardProps {
  title: string;
  value: string | number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  iconBg: string;
  to: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  label,
  icon: Icon,
  iconColor,
  iconBg,
  to,
}) => {
  return (
    <Link
      to={to}
      className="group bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-200 flex flex-col justify-between"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className={`p-2.5 rounded-lg ${iconBg} ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-3xl font-extrabold text-white tracking-tight">
          {value}
        </div>
        <p className="text-xs text-slate-400">{label}</p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 group-hover:text-blue-400 transition-colors">
        <span>View details</span>
        <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </Link>
  );
};

export const AdminDashboard: React.FC = () => {
  const { admin } = useAuth();

  const stats = [
    {
      title: 'Total Projects',
      value: '—',
      label: 'Portfolio showcase items',
      icon: Briefcase,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/10 border border-blue-500/20',
      to: '/admin/projects',
    },
    {
      title: 'Total Skills',
      value: '—',
      label: 'Technical competencies listed',
      icon: Code2,
      iconColor: 'text-indigo-400',
      iconBg: 'bg-indigo-500/10 border border-indigo-500/20',
      to: '/admin/skills',
    },
    {
      title: 'Unread Messages',
      value: '—',
      label: 'Incoming inquiries from contact form',
      icon: Mail,
      iconColor: 'text-violet-400',
      iconBg: 'bg-violet-500/10 border border-violet-500/20',
      to: '/admin/messages',
    },
  ];

  const adminDisplayName =
    admin?.name || admin?.username || admin?.email || 'Administrator';
  const adminEmail = admin?.email || 'admin@example.com';

  return (
    <div className="space-y-6">
      {/* Welcoming Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Welcome back, <span className="text-white font-medium">{adminDisplayName}</span> ({adminEmail})
        </p>
      </div>

      {/* 3 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
