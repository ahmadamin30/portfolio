import React from 'react';
import { Briefcase } from 'lucide-react';

export const ManageProjectsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="p-8 bg-slate-900/60 border border-slate-800 rounded-2xl text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
          <Briefcase className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-white">Projects Management</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Manage, create, and organize your showcase projects with thumbnail uploads.
        </p>
      </div>
    </div>
  );
};

export default ManageProjectsPage;
