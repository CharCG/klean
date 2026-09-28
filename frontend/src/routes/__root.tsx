import { createRootRouteWithContext, Navigate } from '@tanstack/react-router';
import type { RouterContext } from '@/app/router-context';
import { RootLayout } from '@/app/RootLayout';
import PageSkeleton from '@/shared/components/PageSkeleton';

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  pendingComponent: PageSkeleton,
  notFoundComponent: () => <Navigate to="/login" replace />,
});
