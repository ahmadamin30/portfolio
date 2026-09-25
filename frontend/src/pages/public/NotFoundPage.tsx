import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4">
      <div className="text-center space-y-4">
        <h1 className="text-7xl font-extrabold text-indigo-500">404</h1>
        <h2 className="text-2xl font-bold">Page Not Found</h2>
        <p className="text-slate-400 max-w-md">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="pt-4">
          <Link
            to="/"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
