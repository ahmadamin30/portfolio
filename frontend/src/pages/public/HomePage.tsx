import React from 'react';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4">
      <div className="max-w-2xl text-center space-y-6">
        <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-950/60 border border-indigo-800/50 rounded-full">
          Portfolio & Showcase
        </span>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
          Developer Portfolio
        </h1>
        <p className="text-slate-400 text-lg">
          Welcome to the portfolio landing page. Explore featured projects, skill sets, and get in touch.
        </p>
        <div className="pt-4 flex justify-center gap-4">
          <Link
            to="/admin/login"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors shadow-lg shadow-indigo-600/20"
          >
            Admin Portal
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
