import { create } from 'zustand';

interface User {
  email: string;
  username: string;
  is_active: boolean;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean; // 인증 확인 중 로딩 상태
  user: User | null;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: true, // 앱 시작 시에는 항상 로딩 상태로 시작
  user: null,
  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
  setLoading: (loading) => set({ isLoading: loading }),
}));