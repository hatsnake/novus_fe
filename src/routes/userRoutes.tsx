import { lazy } from 'react';

const UserPage = lazy(() => import('@/pages/user/UserPage'));

export const userRoutes = [
  { path: '/user', element: UserPage, protected: true },
];
