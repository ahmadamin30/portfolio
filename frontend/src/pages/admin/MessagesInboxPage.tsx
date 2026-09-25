import React from 'react';
import { Mail } from 'lucide-react';

export const MessagesInboxPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="p-8 bg-slate-900/60 border border-slate-800 rounded-2xl text-center space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mx-auto">
          <Mail className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-white">Messages Inbox</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Review visitor contact inquiries, mark as read, or remove entries.
        </p>
      </div>
    </div>
  );
};

export default MessagesInboxPage;
