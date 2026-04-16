import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/admin/ProtectedRoute';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import Login from './pages/admin/Login';
import ForgotPassword from './pages/admin/ForgotPassword';
import ResetPassword from './pages/admin/ResetPassword';
import Albums from './pages/admin/Albums';
import AlbumDetail from './pages/admin/AlbumDetail';
import Testimonials from './pages/admin/Testimonials';
import Contacts from './pages/admin/Contacts';

const AdminApp = () => {
  return (
    <Routes>
      {/* ── Auth Routes (Unprotected) ────────── */}
      <Route path="login" element={<Login />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="reset-password/:token" element={<ResetPassword />} />

      {/* ── Dashboard & Management (Protected) ── */}
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Routes>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="albums" element={<Albums />} />
                <Route path="albums/:id" element={<AlbumDetail />} />
                <Route path="testimonials" element={<Testimonials />} />
                <Route path="contacts" element={<Contacts />} />
                
                {/* Fallback to dashboard */}
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AdminApp;
