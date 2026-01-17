import { lazy } from 'react';

const MainPage = lazy(() => import('../pages/MainPage'));
const CookiePage = lazy(() => import('../pages/CookiePage'));

export const mainRoutes = [
  { path: '/', element: MainPage, index: true },
  { path: '/cookie', element: CookiePage },
];
