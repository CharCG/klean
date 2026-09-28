import { createFileRoute, Outlet } from '@tanstack/react-router';
import { redirectAuthenticatedUser } from '@/features/auth/model/auth.guard';

export const Route = createFileRoute('/_public')({
  beforeLoad: ({ context }) => redirectAuthenticatedUser(context.queryClient),
  component: Outlet,
});
