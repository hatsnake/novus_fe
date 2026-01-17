import { useLoadingStore } from '@/stores/useLoadingStore';
import { BACKEND_API_BASE_URL } from '@/config/backend';

export const apiFetch = async (url: string, options: RequestInit = {}, { showLoading = true } = {}) => {
  const isAbsolute = /^https?:\/\//i.test(url);
  const fullUrl = isAbsolute ? url : `${BACKEND_API_BASE_URL}${url}`;

  const { setLoading } = useLoadingStore.getState();
  if (showLoading) setLoading(true);

  try {
    const headers = new Headers(options.headers || {});

    if (options.body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const finalOptions: RequestInit = {
      credentials: 'include',
      ...options,
      headers,
    };

    return await fetch(fullUrl, finalOptions);
  } finally {
    if (showLoading) setLoading(false);  // 옵션에 따라 로딩 끄기
  }
};

// Refresh access token using refresh token stored in localStorage
export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) throw new Error('RefreshToken이 없습니다.');

  const res = await apiFetch('/jwt/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  }, { showLoading: false });

  if (!res.ok) throw new Error('AccessToken 갱신 실패');

  const data = await res.json();
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  return data.accessToken;
};

export const fetchWithAccess = async (pathOrUrl: string, options: RequestInit = {}) => {
  let accessToken = localStorage.getItem('accessToken');

  const headers = new Headers(options.headers || {});
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const finalOptions: RequestInit = { credentials: 'include', ...options, headers };

  let response = await apiFetch(pathOrUrl, finalOptions, { showLoading: true });  // 로딩 적용

  if (response.status === 401) {
    try {
      accessToken = await refreshAccessToken();
      headers.set('Authorization', `Bearer ${accessToken}`);
      response = await apiFetch(pathOrUrl, { ...finalOptions, headers }, { showLoading: true });  // 로딩 적용
    } catch (err) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      try { window.location.href = '/login'; } catch {}
      throw err;
    }
  }

  if (!response.ok) {
    const text = await response.text().catch(() => null);
    throw new Error(text ? `HTTP 오류 ${response.status}: ${text}` : `HTTP 오류 ${response.status}`);
  }

  return response;
};