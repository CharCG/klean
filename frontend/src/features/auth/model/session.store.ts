import { create } from 'zustand';
import { roleSchema, type Role } from '@/features/user/model/user.schemas';

interface SessionState {
  token: string | null;
  mode: Role | null;
  setSession: (token: string, mode: Role) => void;
  setMode: (mode: Role) => void;
  clearSession: () => void;
}

function readMode(): Role | null {
  const result = roleSchema.safeParse(localStorage.getItem('app_mode'));
  return result.success ? result.data : null;
}

export const useSessionStore = create<SessionState>((set) => ({
  token: localStorage.getItem('access_token'),
  mode: readMode(),
  setSession: (token, mode) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('app_mode', mode);
    set({ token, mode });
  },
  setMode: (mode) => {
    localStorage.setItem('app_mode', mode);
    set({ mode });
  },
  clearSession: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('app_mode');
    set({ token: null, mode: null });
  },
}));
