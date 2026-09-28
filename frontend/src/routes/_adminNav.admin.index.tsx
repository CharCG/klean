import { createFileRoute } from '@tanstack/react-router';
import AdminApplications from '@/features/admin/pages/Applications';

export const Route = createFileRoute('/_adminNav/admin/')({ component: AdminApplications });
