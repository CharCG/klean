import { createFileRoute } from '@tanstack/react-router';
import AdminProfile from '@/features/admin/pages/Profile';

export const Route = createFileRoute('/_adminNav/admin/profile')({ component: AdminProfile });
