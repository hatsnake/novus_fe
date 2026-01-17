import { create } from 'zustand';
import { getInitialLoggedIn, saveTokens, clearTokens, subscribeStorageChanges } from './authPersistence';
import { apiFetch, fetchWithAccess } from '../util/fetchUtil';

export type UserInfo = {
  username: string;
  nickname: string;
  email: string;
  role?: string;
};

export type AuthState = {
  isLoggedIn: boolean;
  user: UserInfo | null;
  setLoggedIn: (v: boolean) => void;
  login: (accessToken: string, refreshToken?: string) => void;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => {
  // 초기값은 persistence에서 가져옴
  const initial = getInitialLoggedIn();

  // 탭간 동기화
  subscribeStorageChanges((loggedIn) => set({ isLoggedIn: loggedIn }));

  return {
    isLoggedIn: Boolean(initial),
    user: null,
    setUser: (user: UserInfo | null) => set({ user }),
    setLoggedIn: (v: boolean) => set({ isLoggedIn: v }),
    login: (accessToken: string, refreshToken?: string) => {
      saveTokens(accessToken, refreshToken);
      set({ isLoggedIn: true });
    },
    logout: async () => {
      try {
        await apiFetch('/user/logout', { method: 'POST' });
      } catch {}
      clearTokens();
      set({ isLoggedIn: false });
    },
    fetchUser: async () => {
      if (!get().isLoggedIn) return;

      try {
        const res = await fetchWithAccess(`/user`, {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) throw new Error("유저 정보 불러오기 실패");

        if (res.ok) {
          const userData = await res.json();
          set({ 
            user: {
              username: userData.username,
              nickname: userData.nickname,
              email: userData.email,
              role: userData.role
            } 
          });
        }
      } catch (error) {
        console.error("Failed to fetch user info", error);
      }
    }
  };
});

export default useAuthStore;
