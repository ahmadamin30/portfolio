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
import AdminHeroSettings from '../pages/admin/AdminHeroSettings';
import AdminAbout from '../pages/admin/AdminAbout';
import AdminWorkflow from '../pages/admin/AdminWorkflow';
import AdminProjects from '../pages/admin/AdminProjects';
import AdminSkills from '../pages/admin/AdminSkills';
import AdminExperience from '../pages/admin/AdminExperience';
import AdminCertificates from '../pages/admin/AdminCertificates';
import AdminServices from '../pages/admin/AdminServices';
import AdminFaqs from '../pages/admin/AdminFaqs';
import AdminSeo from '../pages/admin/AdminSeo';
import AdminTranslations from '../pages/admin/AdminTranslations';
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
        <Route path="hero-settings" element={<AdminHeroSettings />} />

        {/* Portfolio Content Routes */}
        <Route path="about" element={<AdminAbout />} />
        <Route path="workflow" element={<AdminWorkflow />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="skills" element={<AdminSkills />} />
        <Route path="experience" element={<AdminExperience />} />
        <Route path="certificates" element={<AdminCertificates />} />
        <Route path="services" element={<AdminServices />} />
        <Route path="faqs" element={<AdminFaqs />} />

        {/* Growth & Settings Routes */}
        <Route path="messages" element={<MessagesInboxPage />} />
        <Route path="seo" element={<AdminSeo />} />
        <Route path="translations" element={<AdminTranslations />} />
      </Route>

      {/* 404 Fallback / Redirect for undefined routes */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
