import { createBrowserRouter, RouteObject } from 'react-router-dom';
// import ProtectedRoute from './ProtectedRoute';
import AppLayout from '@/components/layout/AppLayout';
import AuthLayout from '@/components/layout/AuthLayout';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import ExamsPage from '@/pages/ExamsPage';
import SubmissionsPage from '@/pages/SubmissionsPage';
import GradingPage from '@/pages/GradingPage';
import ViolationsPage from '@/pages/ViolationsPage';
import NotFoundPage from '@/pages/NotFoundPage';
import UnauthorizedPage from '@/pages/UnauthorizedPage';

const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      // <ProtectedRoute>
        <AppLayout />
      // </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'exams',
        element: <ExamsPage />,
      },
      {
        path: 'submissions',
        element: (
          // <ProtectedRoute requiredRoles={[0, 1]}>
            <SubmissionsPage />
          // </ProtectedRoute>
        ),
      },
      {
        path: 'grading',
        element: (
          // <ProtectedRoute requiredRoles={[1]}>
            <GradingPage />
          // </ProtectedRoute>
        ),
      },
      {
        path: 'violations',
        element: (
          // <ProtectedRoute requiredRoles={[0]}>
            <ViolationsPage />
          // </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/unauthorized',
    element: <UnauthorizedPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

export const router = createBrowserRouter(routes);

export default router;
