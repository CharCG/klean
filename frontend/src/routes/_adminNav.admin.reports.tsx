import { createFileRoute } from '@tanstack/react-router';
import AdminReports from '@/features/admin/pages/Reports';

export const Route = createFileRoute('/_adminNav/admin/reports')({ component: AdminReports });
