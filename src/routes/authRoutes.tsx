import { lazy } from 'react';

const LoginPage = lazy(() => import('@/pages/user/LoginPage'));
const JoinPage = lazy(() => import('@/pages/user/JoinPage'));

export const authRoutes = [
  { path: '/login', element: LoginPage, public: true },
  { path: '/join', element: JoinPage, public: true },
];
