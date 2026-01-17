import { authRoutes } from './authRoutes';
import { mainRoutes } from './mainRoutes';
import { userRoutes } from './userRoutes';

/*
 * Route example
 * { path: '/', element: MainPage, index: true },
 * path : route path
 * element : component to render
 * index : whether it's an index route
 * protected : whether the route is protected (requires authentication)
 * public : whether the route is public (accessible without authentication)
 */
export const routes = [
  ...mainRoutes,
  ...authRoutes,
  ...userRoutes,
];
