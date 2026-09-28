import { Outlet } from '@tanstack/react-router';
import Toast from '@/shared/components/Toast';
import '@/shared/stores/theme-store';

export function RootLayout() {
  return (
    <div className="min-h-dvh w-full bg-bg antialiased">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:z-50 focus:rounded focus:bg-card focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <div className="isolate relative flex h-dvh w-full flex-col overflow-hidden bg-card">
        <Toast />
        <main id="main-content" className="flex-1 overflow-hidden relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
