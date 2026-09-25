import React from 'react';
import { Code2 } from 'lucide-react';

export const ManageSkillsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="p-8 bg-slate-900/60 border border-slate-800 rounded-2xl text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
          <Code2 className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-white">Skills Management</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Organize technical competencies by category (Frontend, Backend, Database, Tools).
        </p>
      </div>
    </div>
  );
};

export default ManageSkillsPage;
