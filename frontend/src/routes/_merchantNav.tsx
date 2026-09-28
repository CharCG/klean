import { createFileRoute, Outlet } from '@tanstack/react-router';
import { requireRole } from '@/features/auth/model/auth.guard';

export const Route = createFileRoute('/_merchantNav')({
  beforeLoad: ({ context }) => requireRole(context.queryClient, ['MERCHANT']),
  component: Outlet,
});
