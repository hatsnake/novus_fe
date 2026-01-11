import { BACKEND_API_BASE_URL } from '../config/backend';

// Generic fetch wrapper that prefixes the backend base URL and applies sensible defaults.
export const apiFetch = async (pathOrUrl: string, options: RequestInit = {}) => {
  const isAbsolute = /^https?:\/\//i.test(pathOrUrl);
  const url = isAbsolute ? pathOrUrl : `${BACKEND_API_BASE_URL}${pathOrUrl}`;

  // Ensure headers object exists
  const headers = new Headers(options.headers || {});

  // If a body is present and Content-Type isn't set, default to JSON
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const finalOptions: RequestInit = {
    credentials: 'include', // include cookies by default (social login flows rely on this)
    ...options,
    headers,
  };

  return fetch(url, finalOptions);
};

// Refresh access token using refresh token stored in localStorage
export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) throw new Error('RefreshToken이 없습니다.');

  const res = await apiFetch('/jwt/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) throw new Error('AccessToken 갱신 실패');

  const data = await res.json();
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  return data.accessToken;
};

// Fetch with Authorization header set from stored access token.
// On 401, try to refresh and retry once. On refresh failure, clear tokens and redirect to login.
export const fetchWithAccess = async (pathOrUrl: string, options: RequestInit = {}) => {
  let accessToken = localStorage.getItem('accessToken');

  // Ensure headers object exists and is mutable
  const headers = new Headers(options.headers || {});
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);

  // If a body is present and Content-Type isn't set, default to JSON
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const finalOptions: RequestInit = { credentials: 'include', ...options, headers };

  let response = await apiFetch(pathOrUrl, finalOptions);

  if (response.status === 401) {
    try {
      accessToken = await refreshAccessToken();
      // update header and retry
      headers.set('Authorization', `Bearer ${accessToken}`);
      response = await apiFetch(pathOrUrl, { ...finalOptions, headers });
    } catch (err) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      try { window.location.href = '/login'; } catch {}
      throw err;
    }
  }

  if (!response.ok) {
    // attempt to include response body in error
    const text = await response.text().catch(() => null);
    throw new Error(text ? `HTTP 오류 ${response.status}: ${text}` : `HTTP 오류 ${response.status}`);
  }

  return response;
};