import { create } from 'zustand';
import { getInitialLoggedIn, saveTokens, clearTokens, subscribeStorageChanges } from './authPersistence';
import { apiFetch } from '../util/fetchUtil';

export type AuthState = {
  isLoggedIn: boolean;
  setLoggedIn: (v: boolean) => void;
  login: (accessToken: string, refreshToken?: string) => void;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => {
  // 초기값은 persistence에서 가져옴
  const initial = getInitialLoggedIn();

  // 탭간 동기화
  subscribeStorageChanges((loggedIn) => set({ isLoggedIn: loggedIn }));

  return {
    isLoggedIn: Boolean(initial),
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
  };
});

export default useAuthStore;
