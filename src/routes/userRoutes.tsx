import { lazy } from 'react';

const UserPage = lazy(() => import('../pages/UserPage'));

export const userRoutes = [
  { path: '/user', element: UserPage, protected: true },
];
