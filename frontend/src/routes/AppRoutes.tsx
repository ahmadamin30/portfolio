import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';
import AdminLayout from '../components/admin/layout/AdminLayout';

// Public pages
import HomePage from '../pages/public/HomePage';
import NotFoundPage from '../pages/public/NotFoundPage';
import AdminLogin from '../pages/admin/AdminLogin';

// Protected admin pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageProjectsPage from '../pages/admin/ManageProjectsPage';
import ManageSkillsPage from '../pages/admin/ManageSkillsPage';
import MessagesInboxPage from '../pages/admin/MessagesInboxPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin Dashboard Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="projects" element={<ManageProjectsPage />} />
        <Route path="skills" element={<ManageSkillsPage />} />
        <Route path="messages" element={<MessagesInboxPage />} />
      </Route>

      {/* 404 Fallback / Redirect for undefined routes */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
