import { createFileRoute } from '@tanstack/react-router';
import { CustomerNavigationLayout } from '@/app/layouts';
import { requireRole } from '@/features/auth/model/auth.guard';

export const Route = createFileRoute('/_customerNav')({
  beforeLoad: ({ context }) => requireRole(context.queryClient, ['CUSTOMER']),
  component: CustomerNavigationLayout,
});
