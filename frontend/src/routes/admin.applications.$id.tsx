import { createFileRoute } from '@tanstack/react-router';
import AdminApplicationDetail from '@/features/admin/pages/ApplicationDetail';
import { requireRole } from '@/features/auth/model/auth.guard';

export const Route = createFileRoute('/admin/applications/$id')({
  beforeLoad: ({ context }) => requireRole(context.queryClient, ['ADMIN']),
  component: AdminApplicationDetail,
});
