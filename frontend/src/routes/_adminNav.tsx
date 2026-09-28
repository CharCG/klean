import { createFileRoute, Outlet } from '@tanstack/react-router';
import { requireRole } from '@/features/auth/model/auth.guard';

export const Route = createFileRoute('/_adminNav')({
  beforeLoad: ({ context }) => requireRole(context.queryClient, ['ADMIN']),
  component: Outlet,
});
