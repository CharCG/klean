import { createFileRoute } from '@tanstack/react-router';
import AdminReportDetail from '@/features/admin/pages/ReportDetail';
import { requireRole } from '@/features/auth/model/auth.guard';

export const Route = createFileRoute('/admin/reports/$id')({
  beforeLoad: ({ context }) => requireRole(context.queryClient, ['ADMIN']),
  component: AdminReportDetail,
});
