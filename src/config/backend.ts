// Configuration for backend base URL - reads from Vite environment
export const BACKEND_API_BASE_URL: string = (import.meta.env.VITE_BACKEND_API_BASE_URL ?? '') as string;
