import { RootState } from '@/store/store';
// UserRole is a type, use string literals instead
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// Lazy load pages for better performance
const LoginPage = React.lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = React.lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = React.lazy(
  () => import('@/pages/auth/ForgotPasswordPage')
);

// SuperAdmin pages
const SuperAdminDashboard = React.lazy(
  () => import('@/pages/superadmin/Dashboard')
);
const TenantsPage = React.lazy(() => import('@/pages/superadmin/TenantsPage'));

// TenantAdmin pages
const TenantAdminDashboard = React.lazy(
  () => import('@/pages/tenantadmin/Dashboard')
);
const LandingPageBuilder = React.lazy(
  () => import('@/pages/tenantadmin/LandingPageBuilder')
);
const BookingsManagement = React.lazy(
  () => import('@/pages/tenantadmin/BookingsManagement')
);
const PaymentKeysPage = React.lazy(
  () => import('@/pages/tenantadmin/PaymentKeysPage')
);
const MarketingPage = React.lazy(
  () => import('@/pages/tenantadmin/Marketing/MarketingPage')
);
const StaffManagementPage = React.lazy(
  () => import('@/pages/tenantadmin/Staff/StaffManagementPage')
);

// Public pages
const LandingPage = React.lazy(() => import('@/pages/LandingPage'));

// User pages
const HomePage = React.lazy(() => import('@/pages/user/HomePage'));
const HotelsPage = React.lazy(() => import('@/pages/user/HotelsPage'));
const FlightsPage = React.lazy(() => import('@/pages/user/FlightsPage'));
const TourPackagesPage = React.lazy(
  () => import('@/pages/user/TourPackagesPage')
);
const BookingHistoryPage = React.lazy(
  () => import('@/pages/user/BookingHistoryPage')
);
const ProfilePage = React.lazy(() => import('@/pages/user/ProfilePage'));

// Shared pages
const NotFoundPage = React.lazy(() => import('@/pages/NotFoundPage'));
const UnauthorizedPage = React.lazy(() => import('@/pages/UnauthorizedPage'));
const ServerErrorPage = React.lazy(() => import('@/pages/ServerErrorPage'));

export const AppRouter: React.FC = () => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  return (
    <React.Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-primary-600" />
        </div>
      }
    >
      <Routes>
        {/* Auth routes */}
        <Route
          path="/auth/login"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
          }
        />
        <Route path="/login" element={<Navigate to="/auth/login" replace />} />
        <Route
          path="/auth/register"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />
          }
        />
        <Route
          path="/register"
          element={<Navigate to="/auth/register" replace />}
        />
        <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/forgot-password"
          element={<Navigate to="/auth/forgot-password" replace />}
        />

        {/* SuperAdmin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['SuperAdmin']}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/tenants"
          element={
            <ProtectedRoute allowedRoles={['SuperAdmin']}>
              <TenantsPage />
            </ProtectedRoute>
          }
        />

        {/* TenantAdmin routes */}
        <Route
          path="/tenant/dashboard"
          element={
            <ProtectedRoute allowedRoles={['TenantAdmin']}>
              <TenantAdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tenant/landing-page"
          element={
            <ProtectedRoute allowedRoles={['TenantAdmin']}>
              <LandingPageBuilder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tenant/bookings"
          element={
            <ProtectedRoute allowedRoles={['TenantAdmin']}>
              <BookingsManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tenant/payment-keys"
          element={
            <ProtectedRoute allowedRoles={['TenantAdmin']}>
              <PaymentKeysPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tenant/marketing"
          element={
            <ProtectedRoute allowedRoles={['TenantAdmin']}>
              <MarketingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tenant/staff"
          element={
            <ProtectedRoute allowedRoles={['TenantAdmin']}>
              <StaffManagementPage />
            </ProtectedRoute>
          }
        />

        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* User routes */}
        <Route path="/home" element={<HomePage />} />
        <Route path="/hotels" element={<HotelsPage />} />
        <Route path="/flights" element={<FlightsPage />} />
        <Route path="/tour-packages" element={<TourPackagesPage />} />
        <Route
          path="/bookings"
          element={
            <ProtectedRoute allowedRoles={['User']}>
              <BookingHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={['User', 'TenantAdmin']}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Redirect based on role */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              user?.role === 'SuperAdmin' ? (
                <Navigate to="/admin" replace />
              ) : user?.role === 'TenantAdmin' ? (
                <Navigate to="/tenant/dashboard" replace />
              ) : (
                <Navigate to="/" replace />
              )
            ) : (
              <Navigate to="/auth/login" replace />
            )
          }
        />

        {/* Error Pages */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/server-error" element={<ServerErrorPage />} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </React.Suspense>
  );
};
