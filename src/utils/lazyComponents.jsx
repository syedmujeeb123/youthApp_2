import { lazy } from 'react';

// Lazy load components for better performance
export const LazyAbout = lazy(() => import('../Components/pages/About'));
export const LazyContact = lazy(() => import('../Components/pages/Contact'));
export const LazyHome = lazy(() => import('../Components/Home'));
export const LazyApplicationForm = lazy(() => import('../Components/forms/ApplicationForm'));
export const LazyLoginForm = lazy(() => import('../Components/forms/LoginForm'));
export const LazySignUpForm = lazy(() => import('../Components/forms/SignUpForm'));
export const LazyForgotPassword = lazy(() => import('../Components/forms/ForgotPassword'));
export const LazyLogout = lazy(() => import('../Components/forms/Logout'));
export const LazyAdmindash = lazy(() => import('../../admin/Admindash'));
export const LazyPendingUsersAdmin = lazy(() => import('../../admin/pending_users/PendingUsersAdmin'));
export const LazyStudentSummaryIndividual = lazy(() => import('../Components/students/StudentSummaryIndividual'));

// Loading wrapper component
export const LazyWrapper = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
};
