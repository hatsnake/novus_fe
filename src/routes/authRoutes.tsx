import { lazy } from 'react';

const LoginPage = lazy(() => import('../pages/LoginPage'));
const JoinPage = lazy(() => import('../pages/JoinPage'));

export const authRoutes = [
  { path: '/login', element: LoginPage, public: true },
  { path: '/join', element: JoinPage, public: true },
];
