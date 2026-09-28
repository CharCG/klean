import { create } from 'zustand';
import { z } from 'zod';

const themeSchema = z.enum(['light', 'dark']);
type Theme = z.infer<typeof themeSchema>;

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
}

function getInitialTheme(): Theme {
  const stored = themeSchema.safeParse(localStorage.getItem('klean_theme'));
  if (stored.success) return stored.data;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('klean_theme', theme);
}

const initialTheme = getInitialTheme();
applyTheme(initialTheme);

export const useTheme = create<ThemeState>((set) => ({
  theme: initialTheme,
  toggleTheme: () => set((state) => {
    const theme = state.theme === 'light' ? 'dark' : 'light';
    applyTheme(theme);
    return { theme };
  }),
}));
